import React, { useEffect, useState } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { modelLabel, postJson } from '../api';
import { TERM_BY_ID } from '../photographyData';
import { Health, OptimizationResult, PromptTarget } from '../types';
import { usePersistentState } from '../usePersistentState';
import { Button, Callout, Chip, CopyButton, cx, Eyebrow, Highlighted, inputClass, Panel, PromptBox, Segmented } from './ui';

const IDEAS = [
  { label: 'Neon detective', prompt: 'A detective smoking under pouring rain in a narrow neon-lit alley.' },
  { label: 'Coastal road', prompt: 'A vintage 1965 convertible driving along a cliffside coast road at sunset.' },
  { label: 'Watch movement', prompt: 'The tiny brass gears inside a mechanical wristwatch.' },
  { label: 'Desert nomad', prompt: 'A nomad and a camel standing on top of a sand dune.' },
];

const LOADING = ['Choosing the light…', 'Picking a lens…', 'Framing the shot…', 'Checking the choices fit together…'];

interface SuperchargerState {
  input: string;
  target: Exclude<PromptTarget, 'veo'>;
  result: OptimizationResult | null;
}

export default function PromptOptimizer({ health, incoming, formulaPrompt, onOpenTerm }: {
  health: Health | null;
  incoming: { text: string; nonce: number } | null;
  formulaPrompt: string;
  onOpenTerm: (id: string) => void;
}) {
  const [state, setState] = usePersistentState<SuperchargerState>('cp-supercharger', { input: '', target: 'gemini', result: null });
  const [loading, setLoading] = useState(false);
  const [loadingIdx, setLoadingIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (incoming) setState((s) => ({ ...s, input: incoming.text }));
  }, [incoming?.nonce]);

  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setLoadingIdx((i) => (i + 1) % LOADING.length), 2000);
    return () => clearInterval(t);
  }, [loading]);

  const run = async () => {
    const prompt = state.input.trim();
    if (!prompt) return;
    setLoading(true);
    setLoadingIdx(0);
    setError(null);
    try {
      const result = await postJson<OptimizationResult>('/api/optimize-prompt', { prompt, target: state.target });
      setState((s) => ({ ...s, result }));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const r = state.result;
  const vocab = r?.addedVocabulary ?? [];
  const phraseToTerm = new Map(vocab.map((v) => [v.term.toLowerCase(), v]));
  const openPhrase = (phrase: string) => {
    const v = phraseToTerm.get(phrase.toLowerCase());
    if (v?.glossaryId) onOpenTerm(v.glossaryId);
  };

  return (
    <div className="space-y-6">
      <Panel className="space-y-4">
        <p className="text-muted max-w-prose">
          Paste a rough idea or a prompt. The AI adds the photographic decisions it's missing and explains each change, so you can learn what made the difference.
        </p>
        {!health?.hasKey && health && <Callout kind="warn" title="No Gemini API key">Add GEMINI_API_KEY to your .env file and restart the server to use the Supercharger. Everything else in the app works without it.</Callout>}

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <Segmented
            label="Write the improved image prompt for"
            value={state.target}
            onChange={(target) => setState((s) => ({ ...s, target }))}
            options={[{ id: 'gemini', label: 'Gemini' }, { id: 'midjourney', label: 'Midjourney' }]}
          />
          {formulaPrompt && formulaPrompt !== state.input && (
            <Button size="sm" variant="ghost" onClick={() => setState((s) => ({ ...s, input: formulaPrompt }))}>Load my Formula Lab prompt</Button>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="sc-input" className="text-sm font-semibold">Your idea or prompt</label>
          <textarea
            id="sc-input"
            rows={4}
            value={state.input}
            onChange={(e) => setState((s) => ({ ...s, input: e.target.value }))}
            placeholder="e.g. A weary detective standing in the rain under a streetlight"
            className={cx(inputClass, 'resize-y')}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-subtle">Try an idea:</span>
          {IDEAS.map((idea) => (
            <Chip key={idea.label} selected={state.input === idea.prompt} onClick={() => setState((s) => ({ ...s, input: idea.prompt }))} className="text-xs px-2.5 py-1">
              {idea.label}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" onClick={run} loading={loading} disabled={!state.input.trim() || !health?.hasKey}>
            {!loading && <Sparkles className="w-4 h-4" aria-hidden="true" />} {loading ? LOADING[loadingIdx] : 'Improve prompt'}
          </Button>
          {health?.hasKey && <span className="text-sm text-subtle">Uses {modelLabel(health.textModel)}, falling back to {modelLabel(health.fallbackModel)} if it's busy.</span>}
        </div>
        {error && <Callout kind="error" action={<Button size="sm" onClick={run}>Try again</Button>}>{error}</Callout>}
      </Panel>

      {r && !loading && (
        <>
          <Panel className="space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="text-lg font-bold">Before and after</h2>
              <p className="text-sm text-subtle">Highlighted words were added. Click one to look it up.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-muted">Before</p>
                <PromptBox className="text-muted">{r.originalPrompt}</PromptBox>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-ink">After ({r.target === 'midjourney' ? 'Midjourney' : 'Gemini'})</p>
                  <CopyButton text={r.optimizedImagePrompt} />
                </div>
                <PromptBox>
                  <Highlighted text={r.optimizedImagePrompt} phrases={vocab.map((v) => v.term)} onPhraseClick={openPhrase} />
                </PromptBox>
              </div>
            </div>
            {r.whatChanged?.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold">What changed and why</p>
                <ul className="list-disc pl-5 space-y-1 text-muted">
                  {r.whatChanged.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            )}
          </Panel>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Panel className="space-y-3">
              <Eyebrow>Terms you just learned</Eyebrow>
              <ul className="space-y-3">
                {vocab.map((v, i) => (
                  <li key={i} className="rounded-md border border-line bg-bg p-3 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-ink">{v.term}</p>
                      <span className="text-xs text-subtle shrink-0">{v.category}</span>
                    </div>
                    <p className="text-sm text-muted">{v.benefit}</p>
                    {v.glossaryId && TERM_BY_ID[v.glossaryId] && (
                      <button type="button" onClick={() => onOpenTerm(v.glossaryId!)} className="text-sm text-accent-text hover:underline inline-flex items-center gap-1 cursor-pointer">
                        <BookOpen className="w-3.5 h-3.5" aria-hidden="true" /> {TERM_BY_ID[v.glossaryId].name} in the glossary
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              {r.sceneAtmosphere && <p className="text-sm text-muted"><span className="font-semibold text-ink">Mood:</span> {r.sceneAtmosphere}</p>}
              {r.cinematicAnalogy && <p className="text-sm text-muted"><span className="font-semibold text-ink">Similar look:</span> {r.cinematicAnalogy}</p>}
            </Panel>

            <Panel className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Eyebrow>Video version (Veo)</Eyebrow>
                <CopyButton text={r.optimizedVideoPrompt} />
              </div>
              <PromptBox>{r.optimizedVideoPrompt}</PromptBox>
              {r.pacingBreakdown && <p className="text-sm text-muted"><span className="font-semibold text-ink">How the shot unfolds:</span> {r.pacingBreakdown}</p>}
            </Panel>
          </div>
        </>
      )}
    </div>
  );
}
