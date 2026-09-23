import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ExternalLink, FlaskConical, Plus, Search } from 'lucide-react';
import { CATEGORIES, CATEGORY_BY_ID, PHOTOGRAPHY_TERMS, TERM_BY_ID } from '../photographyData';
import { CategoryId, PhotoTerm } from '../types';
import Simulator from './Simulators';
import { Button, Chip, CopyButton, cx, Eyebrow, inputClass, LevelBadge, Panel, PromptBox, Segmented, selectableClass } from './ui';

interface Props {
  onAddTerm: (term: PhotoTerm) => void;
  onTryInLab: (term: PhotoTerm) => void;
  focusTermId: string | null;
  onFocusHandled: () => void;
}

const exampleLinks = (q: string) => [
  { label: 'Wikimedia Commons', href: `https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(q)}&title=Special:MediaSearch&type=image` },
  { label: 'Unsplash', href: `https://unsplash.com/s/photos/${encodeURIComponent(q.replace(/\s+/g, '-'))}` },
  { label: 'Google Images', href: `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(q)}` },
];

function TermDetail({ term, onAddTerm, onTryInLab }: { term: PhotoTerm; onAddTerm: Props['onAddTerm']; onTryInLab: Props['onTryInLab'] }) {
  const [view, setView] = useState<'diagram' | 'examples'>('diagram');
  const category = CATEGORY_BY_ID[term.category];
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Eyebrow>{category.title}</Eyebrow>
          <LevelBadge level={term.level} />
        </div>
        <h2 className="text-2xl font-bold text-ink">{term.name}</h2>
        <p className="text-muted">{term.definition}</p>
      </div>

      <div className="rounded-md bg-raised border border-line p-3.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-subtle mb-1">What you'll see</p>
        <p className="text-ink">{term.lookFor}</p>
      </div>

      <div className="space-y-3">
        <Segmented<'diagram' | 'examples'>
          label="How to view this term"
          value={view}
          onChange={setView}
          options={[
            { id: 'diagram', label: 'Interactive diagram' },
            { id: 'examples', label: 'Real examples' },
          ]}
        />
        {view === 'diagram' ? (
          <div className="space-y-2">
            <Simulator term={term} />
            <p className="text-xs text-subtle">A simplified diagram of the effect, not a photograph.</p>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <p className="text-muted">The best way to train your eye is to look at real photographs. These searches open in a new tab:</p>
            <ul className="space-y-2">
              {exampleLinks(term.exampleQuery).map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent-text hover:underline">
                    {l.label}: "{term.exampleQuery}" <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            {term.category !== 'movements' && (
              <>
                <p className="text-muted">To see what an AI model does with this term, compare it against a version without it in the A/B Lab.</p>
                <Button size="sm" onClick={() => onTryInLab(term)}>
                  <FlaskConical className="w-4 h-4" aria-hidden="true" /> Compare in the A/B Lab
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-subtle">How to say it in a prompt</p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-muted">Gemini (descriptive sentence)</span>
            <CopyButton text={term.phrase} />
          </div>
          <PromptBox>{term.phrase}</PromptBox>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-muted">Midjourney (short phrase)</span>
            <CopyButton text={term.keywords} />
          </div>
          <PromptBox>{term.keywords}</PromptBox>
        </div>
        {term.videoPhrase && term.category === 'movements' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted">Veo (video)</span>
              <CopyButton text={term.videoPhrase} />
            </div>
            <PromptBox>{term.videoPhrase}</PromptBox>
          </div>
        )}
        <div className="flex flex-wrap gap-2 pt-1">
          <Button variant="primary" size="sm" onClick={() => onAddTerm(term)}>
            <Plus className="w-4 h-4" aria-hidden="true" /> Add to Formula Lab
          </Button>
          {term.category !== 'movements' && (
            <Button size="sm" onClick={() => onTryInLab(term)}>
              <FlaskConical className="w-4 h-4" aria-hidden="true" /> Compare in A/B Lab
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3 border-t border-line pt-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-subtle mb-1">When to use it</p>
          <p className="text-muted">{term.tip}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-subtle mb-1">Why it works</p>
          <p className="text-muted">{term.insight}</p>
        </div>
      </div>
    </div>
  );
}

export default function InteractiveGlossary({ onAddTerm, onTryInLab, focusTermId, onFocusHandled }: Props) {
  const [category, setCategory] = useState<CategoryId | 'all'>('all');
  const [query, setQuery] = useState('');
  const [basicsOnly, setBasicsOnly] = useState(false);
  const [selected, setSelected] = useState<PhotoTerm>(PHOTOGRAPHY_TERMS[0]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);

  const isNarrow = () => window.matchMedia('(max-width: 1023px)').matches;

  const open = (term: PhotoTerm) => {
    setSelected(term);
    if (isNarrow()) setSheetOpen(true);
    else detailRef.current?.scrollTo({ top: 0 });
  };

  // Other tabs can ask the glossary to show a specific term.
  useEffect(() => {
    if (focusTermId && TERM_BY_ID[focusTermId]) {
      setCategory('all');
      setQuery('');
      setBasicsOnly(false);
      open(TERM_BY_ID[focusTermId]);
      onFocusHandled();
    }
  }, [focusTermId]);

  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSheetOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [sheetOpen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PHOTOGRAPHY_TERMS.filter(
      (t) =>
        (category === 'all' || t.category === category) &&
        (!basicsOnly || t.level === 'fundamental') &&
        (!q || [t.name, t.definition, t.lookFor, t.keywords].some((s) => s.toLowerCase().includes(q)))
    );
  }, [category, query, basicsOnly]);

  const groups = CATEGORIES.map((c) => ({ category: c, terms: filtered.filter((t) => t.category === c.id) })).filter((g) => g.terms.length);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-7 space-y-5">
        <Panel className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle" aria-hidden="true" />
            <label htmlFor="glossary-search" className="sr-only">Search terms</label>
            <input id="glossary-search" type="search" placeholder="Search terms, e.g. bokeh, shadow, wide" value={query} onChange={(e) => setQuery(e.target.value)} className={cx(inputClass, 'pl-9')} />
          </div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by topic">
            <Chip selected={category === 'all'} onClick={() => setCategory('all')}>All topics</Chip>
            {CATEGORIES.map((c) => (
              <Chip key={c.id} selected={category === c.id} onClick={() => setCategory(c.id)}>{c.label}</Chip>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm text-muted cursor-pointer w-fit">
            <input type="checkbox" checked={basicsOnly} onChange={(e) => setBasicsOnly(e.target.checked)} className="accent-[#F27D26] w-4 h-4" />
            Show only "Start here" basics
          </label>
        </Panel>

        {groups.length === 0 ? (
          <Panel className="text-center space-y-3">
            <p className="text-muted">No terms match "{query}".</p>
            <Button size="sm" onClick={() => { setQuery(''); setCategory('all'); setBasicsOnly(false); }}>Clear filters</Button>
          </Panel>
        ) : (
          groups.map(({ category: c, terms }) => (
            <section key={c.id} className="space-y-3" aria-labelledby={`cat-${c.id}`}>
              <div>
                <h3 id={`cat-${c.id}`} className="text-lg font-bold text-ink">{c.title}</h3>
                <p className="text-sm text-muted max-w-prose">{c.description}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {terms.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => open(t)}
                    aria-pressed={selected.id === t.id}
                    className={cx(selectableClass(selected.id === t.id), 'p-4 flex flex-col gap-2')}
                  >
                    <span className="flex items-start justify-between gap-2">
                      <span className="font-display font-bold text-ink text-base leading-snug">{t.name}</span>
                      <LevelBadge level={t.level} />
                    </span>
                    <span className="text-sm text-muted leading-relaxed">{t.definition}</span>
                  </button>
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      {/* Desktop: sticky panel sized to the viewport. Phones: full-screen sheet. */}
      <div className="hidden lg:block lg:col-span-5 sticky" style={{ top: 'calc(var(--chrome-h) + 16px)' }}>
        <Panel as="aside" aria-label="Term details" className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - var(--chrome-h) - 32px)' }}>
          <div ref={detailRef}>
            <TermDetail key={selected.id} term={selected} onAddTerm={onAddTerm} onTryInLab={onTryInLab} />
          </div>
        </Panel>
      </div>

      {sheetOpen && (
        <div role="dialog" aria-modal="true" aria-label={selected.name} className="lg:hidden fixed inset-0 z-50 bg-bg overflow-y-auto">
          <div className="sticky top-0 z-10 bg-bg/95 backdrop-blur border-b border-line px-4 py-3">
            <Button variant="ghost" size="sm" onClick={() => setSheetOpen(false)} autoFocus>
              <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to terms
            </Button>
          </div>
          <div className="px-4 py-5">
            <TermDetail key={selected.id} term={selected} onAddTerm={(t) => { onAddTerm(t); setSheetOpen(false); }} onTryInLab={(t) => { onTryInLab(t); setSheetOpen(false); }} />
          </div>
        </div>
      )}
    </div>
  );
}
