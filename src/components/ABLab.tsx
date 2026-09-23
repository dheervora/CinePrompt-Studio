import React, { useEffect, useState } from 'react';
import { ExternalLink, FlaskConical, Wand2 } from 'lucide-react';
import { ApiError, modelLabel, postJson, UploadedImage } from '../api';
import { CATEGORIES, CATEGORY_BY_ID, TERM_BY_ID, termsInCategory } from '../photographyData';
import { buildPrompt, EMPTY_FORMULA, FORMULA_FIELD_BY_CATEGORY, PromptSegment } from '../prompting';
import { CategoryId, CompareResult, Health, PromptFormula } from '../types';
import { usePersistentState } from '../usePersistentState';
import { Button, Callout, CopyButton, cx, Eyebrow, ImageDrop, inputClass, Panel } from './ui';

const SUBJECT_IDEAS: Record<Exclude<CategoryId, 'movements'>, string> = {
  lighting: 'A portrait of an elderly fisherman mending a net',
  composition: 'A lone cyclist riding along a country road',
  framing: 'A street musician playing the violin in a subway station',
  angles: 'A firefighter standing in front of a fire truck',
  lenses: 'A woman standing on a busy city street at dusk',
  exposure: 'A child jumping off a wooden dock into a lake',
  'color-film': 'A couple sharing a milkshake in a roadside diner',
};

const IMAGE_CATEGORIES = CATEGORIES.filter((c) => c.id !== 'movements');

interface LabState {
  subject: string;
  category: Exclude<CategoryId, 'movements'>;
  termA: string;
  termB: string;
}

interface Generated {
  id: string;
  url: string;
}

function SidePrompt({ label, segments, changedTermId }: { label: string; segments: PromptSegment[]; changedTermId: string }) {
  const text = segments.map((s) => s.text).join('');
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-ink">{label}</p>
        <CopyButton text={text} />
      </div>
      <div className="bg-bg border border-line rounded-md p-3.5 font-mono text-[13px] leading-relaxed break-words">
        {segments.map((s, i) => {
          const changed = s.termId && s.termId === changedTermId;
          return (
            <span key={i} className={cx(changed && 'bg-accent-soft text-accent-text rounded px-0.5')}>
              {s.text}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function ABLab({ health, onHealthChange, seedTermId, onSeedHandled, onOpenTerm }: {
  health: Health | null;
  onHealthChange: () => void;
  seedTermId: string | null;
  onSeedHandled: () => void;
  onOpenTerm: (id: string) => void;
}) {
  const [lab, setLab] = usePersistentState<LabState>('cp-ab-lab', { subject: SUBJECT_IDEAS.lighting, category: 'lighting', termA: 'light-hard', termB: 'light-soft' });
  const [images, setImages] = useState<{ a: Generated | null; b: Generated | null }>({ a: null, b: null });
  const [uploads, setUploads] = useState<{ a: UploadedImage | null; b: UploadedImage | null }>({ a: null, b: null });
  const [generating, setGenerating] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comparison, setComparison] = useState<CompareResult | null>(null);

  const resetOutputs = () => {
    setImages({ a: null, b: null });
    setUploads({ a: null, b: null });
    setComparison(null);
    setError(null);
  };

  useEffect(() => {
    const term = seedTermId ? TERM_BY_ID[seedTermId] : null;
    if (term && term.category !== 'movements') {
      const category = term.category as LabState['category'];
      setLab((prev) => ({ subject: prev.category === category ? prev.subject : SUBJECT_IDEAS[category], category, termA: '', termB: term.id }));
      resetOutputs();
    }
    if (seedTermId) onSeedHandled();
  }, [seedTermId]);

  const field = FORMULA_FIELD_BY_CATEGORY[lab.category];
  const formulaFor = (termId: string): PromptFormula => ({ ...EMPTY_FORMULA, subject: lab.subject, aspectRatio: '3:2', [field]: termId });
  const segA = buildPrompt(formulaFor(lab.termA), 'gemini');
  const segB = buildPrompt(formulaFor(lab.termB), 'gemini');
  const promptA = segA.map((s) => s.text).join('');
  const promptB = segB.map((s) => s.text).join('');
  const termA = TERM_BY_ID[lab.termA];
  const termB = TERM_BY_ID[lab.termB];
  const nameOf = (id: string) => TERM_BY_ID[id]?.name ?? `No ${CATEGORY_BY_ID[lab.category].label.toLowerCase()} term`;

  const canGenerate = health?.hasKey && health.imageStatus !== 'needs_billing' && health.imageStatus !== 'disabled';
  const imageA = images.a ?? uploads.a;
  const imageB = images.b ?? uploads.b;

  const generate = async () => {
    setGenerating(true);
    setError(null);
    setComparison(null);
    try {
      const a = await postJson<Generated>('/api/generate-image', { prompt: promptA, aspectRatio: '3:2' });
      setImages((p) => ({ ...p, a }));
      const b = await postJson<Generated>('/api/generate-image', { prompt: promptB, aspectRatio: '3:2' });
      setImages({ a, b });
    } catch (e: any) {
      if (e instanceof ApiError && e.code === 'needs_billing') onHealthChange();
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  };

  const compare = async () => {
    setComparing(true);
    setError(null);
    try {
      const toPayload = (g: Generated | null, u: UploadedImage | null) => (g ? { generatedId: g.id } : u ? { mimeType: u.mimeType, data: u.data } : null);
      setComparison(
        await postJson<CompareResult>('/api/compare-images', {
          imageA: toPayload(images.a, uploads.a),
          imageB: toPayload(images.b, uploads.b),
          promptA,
          promptB,
          termA: lab.termA,
          termB: lab.termB,
        })
      );
    } catch (e: any) {
      setError(e.message);
    } finally {
      setComparing(false);
    }
  };

  const setLabField = (patch: Partial<LabState>) => {
    setLab((p) => ({ ...p, ...patch }));
    resetOutputs();
  };

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <p className="text-muted max-w-prose">
          The fastest way to learn a term is to change only that one thing and look at the difference. Pick a setting, choose two options, and compare the pictures they produce.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="ab-subject" className="text-sm font-semibold">Subject (stays the same in both)</label>
            <input id="ab-subject" value={lab.subject} onChange={(e) => setLabField({ subject: e.target.value })} className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="ab-category" className="text-sm font-semibold">Setting to change</label>
            <select
              id="ab-category"
              value={lab.category}
              onChange={(e) => {
                const category = e.target.value as LabState['category'];
                const terms = termsInCategory(category);
                setLabField({ category, subject: SUBJECT_IDEAS[category], termA: terms[0]?.id ?? '', termB: terms[1]?.id ?? '' });
              }}
              className={inputClass}
            >
              {IMAGE_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <p className="text-xs text-subtle">Camera movement needs video, so it isn't in this image lab.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(['termA', 'termB'] as const).map((key, i) => (
              <div key={key} className="space-y-1.5">
                <label htmlFor={`ab-${key}`} className="text-sm font-semibold">Option {i === 0 ? 'A' : 'B'}</label>
                <select id={`ab-${key}`} value={lab[key]} onChange={(e) => setLabField({ [key]: e.target.value })} className={inputClass}>
                  <option value="">None (leave it out)</option>
                  {termsInCategory(lab.category).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
        {lab.termA === lab.termB && <Callout kind="warn">Options A and B are the same, so the pictures should only differ by chance. Pick two different options.</Callout>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SidePrompt label={`A: ${nameOf(lab.termA)}`} segments={segA} changedTermId={lab.termA} />
          <SidePrompt label={`B: ${nameOf(lab.termB)}`} segments={segB} changedTermId={lab.termB} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {[termA, termB].map((t, i) => (
            <div key={i} className="rounded-md bg-raised border border-line p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-subtle mb-1">Look for in {i === 0 ? 'A' : 'B'}</p>
              {t ? (
                <p className="text-muted">{t.lookFor} <button type="button" onClick={() => onOpenTerm(t.id)} className="text-accent-text hover:underline cursor-pointer">Learn more</button></p>
              ) : (
                <p className="text-muted">No instruction for this setting, so the model chooses for you. This is your baseline.</p>
              )}
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <Eyebrow>Step 2</Eyebrow>
            <h2 className="text-lg font-bold">Get the two pictures</h2>
          </div>
          {canGenerate && (
            <Button variant="primary" onClick={generate} loading={generating} disabled={!lab.subject.trim()}>
              <Wand2 className="w-4 h-4" aria-hidden="true" /> Generate both with {modelLabel(health?.imageModel ?? '')}
            </Button>
          )}
        </div>

        {!canGenerate && (
          <Callout kind="info" title="Free option: make the images in the Gemini app">
            <p>
              {health?.hasKey
                ? `Gemini's image models have no free API tier, so ${modelLabel(health.imageModel)} needs billing on your Google AI Studio project.`
                : 'No Gemini API key is set, so this app cannot generate images.'}{' '}
              You can still do this for free: copy prompt A into the{' '}
              <a href="https://gemini.google.com/app" target="_blank" rel="noopener noreferrer" className="text-accent-text hover:underline inline-flex items-center gap-1">Gemini app <ExternalLink className="w-3 h-3" aria-hidden="true" /></a>, save the image, do the same for prompt B, then drop both images below.
            </p>
          </Callout>
        )}
        {canGenerate && health?.imageStatus === 'unknown' && (
          <p className="text-sm text-subtle">Image generation is a paid feature (about $0.03 per image with Flash Lite Image). If your project has no billing, you'll get a message and can use the free Gemini-app route instead.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(['a', 'b'] as const).map((k) => {
            const generated = images[k];
            const label = `Image ${k.toUpperCase()}: ${nameOf(k === 'a' ? lab.termA : lab.termB)}`;
            return generated ? (
              <figure key={k} className="space-y-1.5">
                <img src={generated.url} alt={label} className="w-full rounded-md border border-line" />
                <figcaption className="text-sm text-muted">{label}</figcaption>
              </figure>
            ) : (
              <div key={k} className="space-y-1.5">
                <ImageDrop label={label} image={uploads[k]} onChange={(img) => { setUploads((p) => ({ ...p, [k]: img })); setComparison(null); }} />
                {generating && <p className="text-sm text-muted">Generating…</p>}
              </div>
            );
          })}
        </div>

        {error && <Callout kind="error">{error}</Callout>}

        <div className="flex flex-wrap items-center gap-3">
          <Button variant={imageA && imageB ? 'primary' : 'secondary'} onClick={compare} loading={comparing} disabled={!imageA || !imageB || !health?.hasKey}>
            <FlaskConical className="w-4 h-4" aria-hidden="true" /> Compare the two with AI
          </Button>
          {!health?.hasKey && <span className="text-sm text-subtle">Needs a Gemini API key.</span>}
          {health?.hasKey && <span className="text-sm text-subtle">Uses {modelLabel(health.textModel)}, which is free.</span>}
        </div>

        {comparison && (
          <div className="space-y-3 border-t border-line pt-4">
            <p className="text-ink">{comparison.summary}</p>
            <ul className="list-disc pl-5 space-y-1 text-muted">
              {comparison.differences.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
            <Callout kind="info" title="Did the term do its job?">{comparison.didTheTermWork}</Callout>
          </div>
        )}
      </Panel>
    </div>
  );
}
