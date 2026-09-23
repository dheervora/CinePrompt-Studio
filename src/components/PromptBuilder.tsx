import React from 'react';
import { BookOpen, RotateCcw, Sparkles } from 'lucide-react';
import { ASPECT_RATIOS, CAMERA_PRESETS, CATEGORY_BY_ID, TERM_BY_ID, termsInCategory } from '../photographyData';
import { buildPrompt, coherenceWarnings, EMPTY_FORMULA, SEGMENT_COLORS, SEGMENT_LABELS, segmentsToText, TARGETS } from '../prompting';
import { CategoryId, PromptFormula, PromptTarget } from '../types';
import { Button, Callout, CopyButton, cx, Eyebrow, inputClass, Panel, Segmented } from './ui';

interface Props {
  formula: PromptFormula;
  setFormula: React.Dispatch<React.SetStateAction<PromptFormula>>;
  target: PromptTarget;
  setTarget: (t: PromptTarget) => void;
  onSendToSupercharger: (prompt: string) => void;
  onOpenTerm: (termId: string) => void;
}

// Each preset is a coherent set of choices a photographer might actually make together.
const PRESETS: Array<{ id: string; label: string; formula: PromptFormula }> = [
  {
    id: 'cyber',
    label: 'Neon safehouse',
    formula: {
      ...EMPTY_FORMULA,
      subject: 'A lone hacker hunched over a wall of glowing green monitors in a cramped underground safehouse',
      framingId: 'framing-medium-shot',
      angleId: 'angle-over-the-shoulder',
      compositionId: 'comp-foreground-layers',
      lensId: 'lens-anamorphic',
      lightingId: 'lighting-lowkey',
      exposureId: 'exp-iso',
      colorId: 'color-cinestill-800t',
      movementId: 'movement-steadicam-tracking',
      cameraId: 'film-35mm',
      aspectRatio: '2.39:1',
      notes: 'rain streaking down a small window behind the monitors, cables hanging from the ceiling',
    },
  },
  {
    id: 'noir',
    label: 'Noir detective',
    formula: {
      ...EMPTY_FORMULA,
      subject: 'A weary detective lighting a cigarette in a rain-soaked alley',
      framingId: 'framing-closeup',
      angleId: 'angle-low-hero',
      compositionId: 'comp-frame-within-frame',
      lensId: 'lens-standard-50mm',
      lightingId: 'light-hard',
      colorId: 'color-film-noir-blackwhite',
      movementId: 'move-static',
      cameraId: 'film-35mm',
      aspectRatio: '16:9',
      notes: 'smoke curling through a single streetlight beam, wet cobblestones glistening',
    },
  },
  {
    id: 'nature',
    label: 'Eagle at sunrise',
    formula: {
      ...EMPTY_FORMULA,
      subject: 'A golden eagle taking off from a jagged rocky ledge',
      framingId: 'framing-full-shot',
      angleId: 'angle-eye-level',
      compositionId: 'comp-rule-of-thirds',
      lensId: 'lens-telephoto-200mm',
      lightingId: 'light-golden-hour',
      exposureId: 'exp-shutter',
      colorId: 'color-temperature',
      movementId: 'move-pan-tilt',
      cameraId: 'medium-format',
      aspectRatio: '3:2',
      notes: 'morning mist filling the valley far below, every feather sharp',
    },
  },
];

const FIELDS: Array<{ category: CategoryId; field: keyof PromptFormula; empty: string; videoOnly?: boolean }> = [
  { category: 'framing', field: 'framingId', empty: 'Not specified' },
  { category: 'angles', field: 'angleId', empty: 'Not specified (usually eye level)' },
  { category: 'composition', field: 'compositionId', empty: 'Not specified' },
  { category: 'lenses', field: 'lensId', empty: 'Not specified' },
  { category: 'exposure', field: 'exposureId', empty: 'Not specified' },
  { category: 'lighting', field: 'lightingId', empty: 'Not specified' },
  { category: 'color-film', field: 'colorId', empty: 'Natural color' },
  { category: 'movements', field: 'movementId', empty: 'None', videoOnly: true },
];

export default function PromptBuilder({ formula, setFormula, target, setTarget, onSendToSupercharger, onOpenTerm }: Props) {
  const update = (field: keyof PromptFormula, value: string) => setFormula((prev) => ({ ...prev, [field]: value }));
  const segments = buildPrompt(formula, target);
  const text = segmentsToText(segments);
  const notes = coherenceWarnings(formula, target);
  const usedKinds = [...new Set(segments.map((s) => s.kind).filter((k) => k !== 'glue'))] as Array<keyof typeof SEGMENT_LABELS>;
  const targetInfo = TARGETS.find((t) => t.id === target)!;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <Panel className="lg:col-span-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Your choices</h2>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <Button key={p.id} size="sm" onClick={() => setFormula(p.formula)}>{p.label}</Button>
            ))}
            <Button size="sm" variant="ghost" onClick={() => setFormula(EMPTY_FORMULA)}>
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" /> Clear
            </Button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="f-subject" className="text-sm font-semibold text-ink">Subject and action</label>
          <textarea
            id="f-subject"
            rows={3}
            placeholder="Who or what is in the picture, and what are they doing? e.g. A vintage Porsche speeding along a dusty desert road"
            value={formula.subject}
            onChange={(e) => update('subject', e.target.value)}
            className={cx(inputClass, 'resize-y')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FIELDS.map(({ category, field, empty, videoOnly }) => {
            const selected = TERM_BY_ID[formula[field]];
            const id = `f-${field}`;
            return (
              <div key={field} className="space-y-1.5">
                <label htmlFor={id} className="text-sm font-semibold text-ink">
                  {CATEGORY_BY_ID[category].label}
                  {videoOnly && <span className="font-normal text-subtle"> (video only)</span>}
                </label>
                <select id={id} value={formula[field]} onChange={(e) => update(field, e.target.value)} className={inputClass}>
                  <option value="">{empty}</option>
                  {termsInCategory(category).map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                {selected ? (
                  <p className="text-xs text-muted leading-relaxed">
                    {selected.lookFor}{' '}
                    <button type="button" onClick={() => onOpenTerm(selected.id)} className="text-accent-text hover:underline cursor-pointer">Learn more</button>
                  </p>
                ) : (
                  <p className="text-xs text-subtle">{CATEGORY_BY_ID[category].description.split('. ')[0]}.</p>
                )}
              </div>
            );
          })}

          <div className="space-y-1.5">
            <label htmlFor="f-camera" className="text-sm font-semibold text-ink">Camera</label>
            <select id="f-camera" value={formula.cameraId} onChange={(e) => update('cameraId', e.target.value)} className={inputClass}>
              <option value="">Not specified</option>
              {CAMERA_PRESETS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <p className="text-xs text-subtle">Camera names nudge the overall look a little; light and lens choices matter far more.</p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="f-aspect" className="text-sm font-semibold text-ink">Aspect ratio</label>
            <select id="f-aspect" value={formula.aspectRatio} onChange={(e) => update('aspectRatio', e.target.value)} className={inputClass}>
              {ASPECT_RATIOS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
            <p className="text-xs text-subtle">The frame's shape. In Gemini it's a setting; in Midjourney it's --ar.</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="f-notes" className="text-sm font-semibold text-ink">Extra details</label>
          <textarea
            id="f-notes"
            rows={2}
            placeholder="Atmosphere and small details, e.g. mist rising off the road, dust floating in the light"
            value={formula.notes}
            onChange={(e) => update('notes', e.target.value)}
            className={cx(inputClass, 'resize-y')}
          />
        </div>
      </Panel>

      <div className="lg:col-span-5 lg:sticky space-y-4 lg:overflow-y-auto lg:pr-1" style={{ top: 'calc(var(--chrome-h) + 16px)', maxHeight: 'calc(100vh - var(--chrome-h) - 32px)' }}>
        <Panel className="space-y-4">
          <div className="space-y-2">
            <Eyebrow>Your prompt</Eyebrow>
            <Segmented label="Prompt target" value={target} onChange={setTarget} options={TARGETS.map((t) => ({ id: t.id, label: t.label }))} />
            <p className="text-sm text-muted">{targetInfo.blurb}</p>
          </div>

          <div className="bg-bg border border-line rounded-md p-4 font-mono text-[13px] leading-7 break-words" aria-label="Prompt, colour-coded by part">
            {segments.map((s, i) =>
              s.kind === 'glue' ? (
                <React.Fragment key={i}>{s.text}</React.Fragment>
              ) : (
                <span key={i} style={{ color: SEGMENT_COLORS[s.kind], borderBottom: `2px solid ${SEGMENT_COLORS[s.kind]}55` }} title={SEGMENT_LABELS[s.kind]}>
                  {s.text}
                </span>
              )
            )}
          </div>

          <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted" aria-label="Color key">
            {usedKinds.map((k) => (
              <li key={k} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: SEGMENT_COLORS[k] }} aria-hidden="true" />
                {SEGMENT_LABELS[k]}
              </li>
            ))}
          </ul>

          {notes.map((n, i) => <Callout key={i} kind={n.kind === 'warn' ? 'warn' : 'info'}>{n.text}</Callout>)}

          <div className="flex flex-wrap gap-2">
            <CopyButton text={text} label="Copy prompt" />
            <Button variant="primary" size="sm" onClick={() => onSendToSupercharger(target === 'veo' ? segmentsToText(buildPrompt(formula, 'gemini')) : text)} disabled={!formula.subject.trim()}>
              <Sparkles className="w-4 h-4" aria-hidden="true" /> Improve with AI Supercharger
            </Button>
          </div>
        </Panel>

        <Panel className="space-y-2">
          <p className="text-sm font-semibold text-ink flex items-center gap-2"><BookOpen className="w-4 h-4 text-accent-text" aria-hidden="true" /> Why this order?</p>
          <p className="text-sm text-muted">
            Models pay most attention to what comes first, so the subject leads. Then comes how it's framed, then lens and light, then color. For video the camera movement comes first, because it defines the whole shot.
          </p>
        </Panel>
      </div>
    </div>
  );
}
