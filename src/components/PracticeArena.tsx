import React, { useState } from 'react';
import { Award, BookOpen, Wand2 } from 'lucide-react';
import { ApiError, modelLabel, postJson, UploadedImage } from '../api';
import { CHALLENGES, TERM_BY_ID } from '../photographyData';
import { GradeResult, Health } from '../types';
import { usePersistentState } from '../usePersistentState';
import { Button, Callout, CopyButton, cx, Eyebrow, ImageDrop, inputClass, LevelBadge, Panel, PromptBox, selectableClass } from './ui';

interface ArenaState {
  selectedId: string;
  drafts: Record<string, string>;
  results: Record<string, GradeResult>;
  best: Record<string, number>;
}

const scoreTone = (score: number) => (score >= 80 ? 'text-good' : score >= 55 ? 'text-warn' : 'text-bad');
const scoreLabel = (score: number) => (score >= 80 ? 'Excellent: this would produce the look.' : score >= 55 ? 'Getting there: a few key choices are missing.' : 'Early days: the prompt misses most of the look.');

export default function PracticeArena({ health, onHealthChange, onOpenTerm }: { health: Health | null; onHealthChange: () => void; onOpenTerm: (id: string) => void }) {
  const [state, setState] = usePersistentState<ArenaState>('cp-arena', { selectedId: CHALLENGES[0].id, drafts: {}, results: {}, best: {} });
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [generated, setGenerated] = useState<{ id: string; url: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const challenge = CHALLENGES.find((c) => c.id === state.selectedId) ?? CHALLENGES[0];
  const draft = state.drafts[challenge.id] ?? '';
  const result = state.results[challenge.id];
  const canGenerate = health?.hasKey && challenge.kind === 'image' && health.imageStatus !== 'needs_billing' && health.imageStatus !== 'disabled';

  const select = (id: string) => {
    setState((s) => ({ ...s, selectedId: id }));
    setImage(null);
    setGenerated(null);
    setError(null);
  };
  const setDraft = (text: string) => setState((s) => ({ ...s, drafts: { ...s.drafts, [challenge.id]: text } }));

  const generate = async () => {
    setGenerating(true);
    setError(null);
    try {
      setGenerated(await postJson('/api/generate-image', { prompt: draft, aspectRatio: '3:2' }));
      setImage(null);
    } catch (e: any) {
      if (e instanceof ApiError && e.code === 'needs_billing') onHealthChange();
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  };

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const grade = await postJson<GradeResult>('/api/grade-prompt', {
        challengeId: challenge.id,
        userPrompt: draft,
        image: generated ? { generatedId: generated.id } : image ? { mimeType: image.mimeType, data: image.data } : undefined,
      });
      setState((s) => ({
        ...s,
        results: { ...s.results, [challenge.id]: grade },
        best: { ...s.best, [challenge.id]: Math.max(grade.score, s.best[challenge.id] ?? 0) },
      }));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-7 space-y-5">
        <Panel className="space-y-3">
          <p className="text-muted">Each brief describes a look in everyday words. Your job is to write the prompt that would produce it, using the right techniques.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" role="radiogroup" aria-label="Challenges">
            {CHALLENGES.map((c) => {
              const best = state.best[c.id];
              return (
                <button key={c.id} type="button" role="radio" aria-checked={c.id === challenge.id} onClick={() => select(c.id)} className={cx(selectableClass(c.id === challenge.id), 'p-3.5 space-y-1.5')}>
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-display font-bold text-ink">{c.title}</span>
                    {best !== undefined && <span className={cx('text-sm font-semibold tabular-nums', scoreTone(best))}>Best {best}</span>}
                  </span>
                  <span className="flex items-center gap-2 flex-wrap text-xs text-muted">
                    <LevelBadge level={c.level} /> {c.focus}{c.kind === 'video' && ' · video'}
                  </span>
                </button>
              );
            })}
          </div>
        </Panel>

        <Panel className="space-y-5">
          <div className="space-y-2">
            <Eyebrow>The brief</Eyebrow>
            <h2 className="text-xl font-bold">{challenge.title}</h2>
            <p className="text-ink leading-relaxed">{challenge.brief}</p>
            <p className="text-sm text-subtle">Think about: {challenge.kind === 'video' ? 'how the camera moves, the shot size, the lens, the light, and the color.' : 'the light (quality and direction), shot size and angle, lens and focus, composition, and color.'}</p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="arena-answer" className="text-sm font-semibold">Your {challenge.kind} prompt</label>
            <textarea id="arena-answer" rows={6} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Describe the scene, then the light, framing, lens and color…" className={cx(inputClass, 'resize-y')} />
          </div>

          {challenge.kind === 'image' && (
            <div className="space-y-2">
              <p className="text-sm font-semibold">Optional: add the picture your prompt makes</p>
              <p className="text-sm text-muted">
                {canGenerate
                  ? 'Generate it here (a paid feature), or upload one you made elsewhere. The teacher will point out what matches the brief.'
                  : 'Paste your prompt into the free Gemini app, save the picture, and add it here. The teacher will point out what matches the brief.'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                {generated ? (
                  <figure className="space-y-1">
                    <img src={generated.url} alt="Generated from your prompt" className="w-full rounded-md border border-line" />
                    <button type="button" onClick={() => setGenerated(null)} className="text-sm text-muted hover:text-ink cursor-pointer">Remove</button>
                  </figure>
                ) : (
                  <ImageDrop label="Your generated image" image={image} onChange={setImage} />
                )}
                {canGenerate && !generated && (
                  <Button onClick={generate} loading={generating} disabled={!draft.trim()}>
                    <Wand2 className="w-4 h-4" aria-hidden="true" /> Generate from my prompt
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" onClick={submit} loading={loading} disabled={!draft.trim() || !health?.hasKey}>
              {!loading && <Award className="w-4 h-4" aria-hidden="true" />} {loading ? 'Grading…' : 'Get feedback'}
            </Button>
            {draft && <Button variant="ghost" onClick={() => setDraft('')}>Clear</Button>}
            {!health?.hasKey && health && <span className="text-sm text-subtle">Grading needs a Gemini API key.</span>}
          </div>

          <details className="text-sm">
            <summary className="cursor-pointer text-muted hover:text-ink">Stuck? Show a sample answer</summary>
            <div className="mt-2 space-y-2">
              <PromptBox>{challenge.sampleSolution}</PromptBox>
              <Button size="sm" onClick={() => setDraft(challenge.sampleSolution)}>Use as my draft</Button>
            </div>
          </details>
        </Panel>
      </div>

      <div className="lg:col-span-5 lg:sticky" style={{ top: 'calc(var(--chrome-h) + 16px)' }}>
        <Panel as="aside" aria-label="Feedback" aria-live="polite" className="space-y-5 lg:overflow-y-auto" style={{ maxHeight: 'calc(100vh - var(--chrome-h) - 32px)' }}>
          <div className="flex items-center justify-between gap-2">
            <Eyebrow>Feedback</Eyebrow>
            {health?.hasKey && <span className="text-xs text-subtle">{modelLabel(health.textModel)}</span>}
          </div>

          {error && <Callout kind="error" action={<Button size="sm" onClick={submit}>Try again</Button>}>{error}</Callout>}

          {loading && <p className="text-muted py-10 text-center">Reading your prompt against the brief…</p>}

          {!loading && !result && !error && (
            <div className="py-10 text-center space-y-2">
              <BookOpen className="w-8 h-8 text-subtle mx-auto" aria-hidden="true" />
              <p className="text-muted">Write your prompt and select "Get feedback". You'll get a score in five areas, what's missing, and an improved version.</p>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <p className={cx('font-display text-5xl font-bold tabular-nums', scoreTone(result.score))}>{result.score}</p>
                <div>
                  <p className="text-sm text-subtle">out of 100</p>
                  <p className="text-ink">{scoreLabel(result.score)}</p>
                </div>
              </div>

              <ul className="space-y-3">
                {result.criteria.map((c) => (
                  <li key={c.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-ink font-medium">{c.name}</span>
                      <span className="tabular-nums text-muted">{c.score}/{c.max}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-raised overflow-hidden">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${(c.score / c.max) * 100}%` }} />
                    </div>
                    <p className="text-sm text-muted">{c.comment}</p>
                  </li>
                ))}
              </ul>

              {result.strengths?.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-good">What worked</p>
                  <ul className="list-disc pl-5 text-sm text-muted space-y-0.5">{result.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                </div>
              )}
              {result.missing?.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-warn">What to add</p>
                  <ul className="list-disc pl-5 text-sm text-muted space-y-0.5">{result.missing.map((s, i) => <li key={i}>{s}</li>)}</ul>
                </div>
              )}
              {result.imageFeedback && <Callout kind="info" title="About your image">{result.imageFeedback}</Callout>}
              <p className="text-muted">{result.critique}</p>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">Improved version</p>
                  <CopyButton text={result.suggestedPrompt} />
                </div>
                <PromptBox>{result.suggestedPrompt}</PromptBox>
              </div>

              <div className="space-y-2 border-t border-line pt-4">
                <p className="text-sm font-semibold">Techniques this brief was describing</p>
                <div className="flex flex-wrap gap-1.5">
                  {challenge.answerTermIds.map((id) => TERM_BY_ID[id] && (
                    <Button key={id} size="sm" onClick={() => onOpenTerm(id)}>{TERM_BY_ID[id].name}</Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
