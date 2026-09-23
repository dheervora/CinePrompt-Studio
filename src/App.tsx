import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, Camera, Download, FlaskConical, Sliders, Sparkles, Trophy, X } from 'lucide-react';
import InteractiveGlossary from './components/InteractiveGlossary';
import PromptBuilder from './components/PromptBuilder';
import ABLab from './components/ABLab';
import PromptOptimizer from './components/PromptOptimizer';
import PracticeArena from './components/PracticeArena';
import AgentExporter from './components/AgentExporter';
import { cx } from './components/ui';
import { modelLabel, useHealth } from './api';
import { CATEGORIES, PHOTOGRAPHY_TERMS } from './photographyData';
import { EMPTY_FORMULA, FORMULA_FIELD_BY_CATEGORY, promptText } from './prompting';
import { PhotoTerm, PromptFormula, PromptTarget } from './types';
import { usePersistentState } from './usePersistentState';

type Tab = 'glossary' | 'builder' | 'lab' | 'supercharger' | 'practice' | 'export';

const TABS: Array<{ id: Tab; label: string; icon: React.ElementType; title: string; intro: string }> = [
  { id: 'glossary', label: 'Glossary', icon: BookOpen, title: 'Photography glossary', intro: `${PHOTOGRAPHY_TERMS.length} terms in ${CATEGORIES.length} topics, ordered as a learning path. Start with the "Start here" basics, use the diagrams to see each effect, and add terms to your prompt.` },
  { id: 'builder', label: 'Formula Lab', icon: Sliders, title: 'Formula Lab', intro: 'Build a prompt one decision at a time. Each color in the preview shows which choice wrote which words.' },
  { id: 'lab', label: 'A/B Lab', icon: FlaskConical, title: 'A/B Lab', intro: 'Change one setting and compare the two pictures. Seeing the difference is how the vocabulary sticks.' },
  { id: 'supercharger', label: 'Supercharger', icon: Sparkles, title: 'AI Supercharger', intro: 'Turn a rough idea into a precise prompt, and see exactly what was added and why.' },
  { id: 'practice', label: 'Practice', icon: Trophy, title: 'Practice Arena', intro: 'Read a brief, write the prompt, and get scored feedback on light, lens, framing, and color.' },
  { id: 'export', label: 'Export', icon: Download, title: 'Export', intro: 'Save the glossary as a cheat sheet, as AI assistant instructions, or as data.' },
];

export default function App() {
  const [tab, setTab] = usePersistentState<Tab>('cp-tab', 'glossary');
  const [formula, setFormula] = usePersistentState<PromptFormula>('cp-formula', EMPTY_FORMULA);
  const [target, setTarget] = usePersistentState<PromptTarget>('cp-target', 'gemini');
  const [health, refreshHealth] = useHealth();
  const [toast, setToast] = useState<{ message: string; tab: Tab } | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const [focusTermId, setFocusTermId] = useState<string | null>(null);
  const [labSeed, setLabSeed] = useState<string | null>(null);
  const [incoming, setIncoming] = useState<{ text: string; nonce: number } | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const current = TABS.find((t) => t.id === tab) ?? TABS[0];

  const go = (next: Tab) => {
    setTab(next);
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    tabRefs.current[tab]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [tab]);

  const showToast = (message: string, target: Tab) => {
    window.clearTimeout(toastTimer.current);
    setToast({ message, tab: target });
    toastTimer.current = window.setTimeout(() => setToast(null), 4000);
  };

  const addTerm = (term: PhotoTerm) => {
    setFormula((prev) => ({ ...prev, [FORMULA_FIELD_BY_CATEGORY[term.category]]: term.id }));
    if (term.category === 'movements') setTarget('veo');
    showToast(`Added "${term.name}" to the Formula Lab.`, 'builder');
  };

  const openTerm = (id: string) => {
    setFocusTermId(id);
    go('glossary');
  };

  const tryInLab = (term: PhotoTerm) => {
    setLabSeed(term.id);
    go('lab');
  };

  const sendToSupercharger = (text: string) => {
    setIncoming({ text, nonce: Date.now() });
    go('supercharger');
  };

  const aiStatus = !health
    ? { dot: 'bg-subtle', text: 'Checking AI…', short: 'AI…' }
    : health.hasKey
      ? { dot: 'bg-good', text: `AI: ${modelLabel(health.textModel)}`, short: 'AI on' }
      : { dot: 'bg-warn', text: 'AI off: no API key', short: 'AI off' };

  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 bg-accent text-black px-3 py-2 rounded-md">Skip to content</a>

      <header className="border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-accent text-black rounded-md flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-lg leading-tight">CinePrompt Studio</p>
              <p className="text-xs text-muted truncate">Learn photography terms, then prompt with them</p>
            </div>
          </div>
          <p className="flex items-center gap-2 text-xs text-muted whitespace-nowrap" title={health ? `Fallback: ${modelLabel(health.fallbackModel)}` : undefined}>
            <span className={cx('w-2 h-2 rounded-full', aiStatus.dot)} aria-hidden="true" />
            <span className="sm:hidden">{aiStatus.short}</span>
            <span className="hidden sm:inline">{aiStatus.text}</span>
          </p>
        </div>
      </header>

      <nav className="sticky top-0 z-30 bg-bg/95 backdrop-blur border-b border-line" style={{ height: 'var(--chrome-h)' }} aria-label="Sections">
        <div className="relative max-w-7xl mx-auto h-full">
          <div className="flex h-full overflow-x-auto scrollbar-none px-2 sm:px-4" role="tablist">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = t.id === tab;
              return (
                <button
                  key={t.id}
                  ref={(el) => { tabRefs.current[t.id] = el; }}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => go(t.id)}
                  className={cx(
                    'flex items-center gap-2 px-3 sm:px-4 h-full text-sm font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer',
                    active ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink'
                  )}
                >
                  <Icon className={cx('w-4 h-4', active ? 'text-accent' : 'text-subtle')} aria-hidden="true" />
                  {t.label}
                </button>
              );
            })}
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-bg to-transparent sm:hidden" aria-hidden="true" />
        </div>
      </nav>

      <main id="main" className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <div className="max-w-3xl space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-bold">{current.title}</h1>
          <p className="text-muted">{current.intro}</p>
        </div>

        {/* Every tab stays mounted so work in progress survives switching tabs. */}
        <div hidden={tab !== 'glossary'}>
          <InteractiveGlossary onAddTerm={addTerm} onTryInLab={tryInLab} focusTermId={focusTermId} onFocusHandled={() => setFocusTermId(null)} />
        </div>
        <div hidden={tab !== 'builder'}>
          <PromptBuilder formula={formula} setFormula={setFormula} target={target} setTarget={setTarget} onSendToSupercharger={sendToSupercharger} onOpenTerm={openTerm} />
        </div>
        <div hidden={tab !== 'lab'}>
          <ABLab health={health} onHealthChange={refreshHealth} seedTermId={labSeed} onSeedHandled={() => setLabSeed(null)} onOpenTerm={openTerm} />
        </div>
        <div hidden={tab !== 'supercharger'}>
          <PromptOptimizer health={health} incoming={incoming} formulaPrompt={formula.subject.trim() ? promptText(formula, target === 'veo' ? 'gemini' : target) : ''} onOpenTerm={openTerm} />
        </div>
        <div hidden={tab !== 'practice'}>
          <PracticeArena health={health} onHealthChange={refreshHealth} onOpenTerm={openTerm} />
        </div>
        <div hidden={tab !== 'export'}>
          <AgentExporter />
        </div>
      </main>

      <footer className="border-t border-line mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row gap-3 justify-between text-sm text-muted">
          <p>
            {health?.hasKey
              ? `Text features use ${modelLabel(health.textModel)} (falling back to ${modelLabel(health.fallbackModel)}), both on Gemini's free tier. Generating images needs billing.`
              : 'Add a Gemini API key to .env to turn on the AI features. The glossary, diagrams, Formula Lab and export work without it.'}
          </p>
          <a href="https://aistudio.google.com/rate-limit" target="_blank" rel="noopener noreferrer" className="text-accent-text hover:underline whitespace-nowrap">Check your Gemini usage</a>
        </div>
      </footer>

      {toast && (
        <div role="status" className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 sm:max-w-sm bg-raised border border-line-strong rounded-lg shadow-2xl p-3.5 flex items-center gap-3 text-sm">
          <p className="flex-1 text-ink">{toast.message}</p>
          <button type="button" onClick={() => { go(toast.tab); setToast(null); }} className="text-accent-text font-semibold hover:underline cursor-pointer whitespace-nowrap">Open</button>
          <button type="button" onClick={() => setToast(null)} className="text-subtle hover:text-ink cursor-pointer" aria-label="Dismiss">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
