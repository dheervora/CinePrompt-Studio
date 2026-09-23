import React, { useId, useRef, useState } from 'react';
import { AlertCircle, Check, Copy, ImagePlus, Info, Loader2, X } from 'lucide-react';
import { readImageFile, UploadedImage } from '../api';

export const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(' ');

export const inputClass =
  'w-full bg-bg border border-line-strong rounded-md px-3 py-2.5 text-sm text-ink placeholder:text-subtle focus:border-accent focus:outline-none';

export function Panel({ children, className, as: Tag = 'section', ...rest }: React.HTMLAttributes<HTMLElement> & { as?: any }) {
  return (
    <Tag className={cx('bg-surface border border-line rounded-lg p-5 sm:p-6', className)} {...rest}>
      {children}
    </Tag>
  );
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cx('text-xs font-semibold uppercase tracking-wider text-accent-text', className)}>{children}</p>;
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  loading?: boolean;
};

export function Button({ variant = 'secondary', size = 'md', loading, className, children, disabled, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' ? 'text-xs px-3 py-1.5' : 'text-sm px-4 py-2.5',
        variant === 'primary' && 'bg-accent text-black hover:bg-[#FF9447]',
        variant === 'secondary' && 'bg-raised text-ink border border-line-strong hover:border-subtle',
        variant === 'ghost' && 'text-muted hover:text-ink hover:bg-raised',
        className
      )}
      {...rest}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

// One selection style for every chip, card and segmented control in the app.
export const selectableClass = (selected: boolean) =>
  cx(
    'border rounded-md transition-colors cursor-pointer text-left',
    selected ? 'border-accent bg-accent-soft text-ink' : 'border-line bg-surface text-muted hover:border-line-strong hover:text-ink'
  );

export function Chip({ selected, className, children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { selected: boolean }) {
  return (
    <button type="button" aria-pressed={selected} className={cx(selectableClass(selected), 'px-3 py-1.5 text-sm font-medium whitespace-nowrap', className)} {...rest}>
      {children}
    </button>
  );
}

export function Segmented<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: Array<{ id: T; label: string }>; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap gap-1 p-1 bg-bg border border-line rounded-lg">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={cx(
            'px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer',
            value === o.id ? 'bg-accent-soft text-ink ring-1 ring-accent' : 'text-muted hover:text-ink'
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function CopyButton({ text, label = 'Copy', className }: { text: string; label?: string; className?: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState('copied');
    } catch {
      setState('failed');
    }
    setTimeout(() => setState('idle'), 1600);
  };
  return (
    <Button size="sm" variant="secondary" onClick={copy} className={className} aria-live="polite">
      {state === 'copied' ? <Check className="w-3.5 h-3.5 text-good" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
      {state === 'copied' ? 'Copied' : state === 'failed' ? 'Select and copy manually' : label}
    </Button>
  );
}

export function Callout({ kind = 'info', title, children, action }: { kind?: 'info' | 'warn' | 'error'; title?: string; children: React.ReactNode; action?: React.ReactNode }) {
  const Icon = kind === 'info' ? Info : AlertCircle;
  return (
    <div
      role={kind === 'error' ? 'alert' : undefined}
      className={cx(
        'rounded-md border p-3.5 flex items-start gap-3 text-sm',
        kind === 'info' && 'border-line-strong bg-raised text-muted',
        kind === 'warn' && 'border-warn/40 bg-warn/10 text-ink',
        kind === 'error' && 'border-bad/40 bg-bad/10 text-ink'
      )}
    >
      <Icon className={cx('w-4 h-4 mt-0.5 shrink-0', kind === 'warn' && 'text-warn', kind === 'error' && 'text-bad', kind === 'info' && 'text-subtle')} aria-hidden="true" />
      <div className="flex-1 space-y-1">
        {title && <p className="font-semibold text-ink">{title}</p>}
        <div>{children}</div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function PromptBox({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cx('bg-bg border border-line rounded-md p-4 font-mono text-[13px] leading-relaxed text-ink break-words whitespace-pre-wrap', className)}>{children}</div>;
}

// Highlights each phrase (case-insensitive) that appears in the text.
export function Highlighted({ text, phrases, onPhraseClick }: { text: string; phrases: string[]; onPhraseClick?: (phrase: string) => void }) {
  const list = phrases.filter((p) => p && p.length > 2).sort((a, b) => b.length - a.length);
  if (!list.length) return <>{text}</>;
  const escaped = list.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const parts = text.split(new RegExp(`(${escaped.join('|')})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => {
        const match = list.find((p) => p.toLowerCase() === part.toLowerCase());
        if (!match) return <React.Fragment key={i}>{part}</React.Fragment>;
        return onPhraseClick ? (
          <button key={i} type="button" onClick={() => onPhraseClick(match)} className="bg-accent-soft text-accent-text rounded px-0.5 underline decoration-dotted underline-offset-2 cursor-pointer">
            {part}
          </button>
        ) : (
          <mark key={i} className="bg-accent-soft text-accent-text rounded px-0.5">
            {part}
          </mark>
        );
      })}
    </>
  );
}

export function ImageDrop({ label, image, onChange }: { label: string; image: UploadedImage | null; onChange: (img: UploadedImage | null) => void }) {
  const inputId = useId();
  const ref = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const handle = async (file?: File) => {
    if (!file) return;
    setError(null);
    try {
      onChange(await readImageFile(file));
    } catch (e: any) {
      setError(e.message);
    }
  };
  return (
    <div className="space-y-1.5">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handle(e.dataTransfer.files?.[0]);
        }}
        className="relative aspect-[4/3] rounded-md border border-dashed border-line-strong bg-bg overflow-hidden"
      >
        {image ? (
          <>
            <img src={image.previewUrl} alt={label} className="w-full h-full object-cover" />
            <button type="button" onClick={() => onChange(null)} className="absolute top-2 right-2 bg-black/70 rounded-full p-1.5 text-ink hover:bg-black cursor-pointer" aria-label={`Remove ${label}`}>
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <label htmlFor={inputId} className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-muted cursor-pointer hover:text-ink p-3 text-center">
            <ImagePlus className="w-6 h-6" aria-hidden="true" />
            <span>{label}</span>
            <span className="text-xs text-subtle">Drop an image or click to choose</span>
          </label>
        )}
        <input id={inputId} ref={ref} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(e) => handle(e.target.files?.[0])} />
      </div>
      {error && <p className="text-xs text-bad">{error}</p>}
    </div>
  );
}

export function LevelBadge({ level }: { level: 'fundamental' | 'intermediate' | 'advanced' }) {
  const label = level === 'fundamental' ? 'Start here' : level === 'intermediate' ? 'Intermediate' : 'Advanced';
  return (
    <span
      className={cx(
        'inline-block text-xs font-medium px-2 py-0.5 rounded',
        level === 'fundamental' && 'bg-good/15 text-good',
        level === 'intermediate' && 'bg-raised text-muted border border-line',
        level === 'advanced' && 'bg-accent-soft text-accent-text'
      )}
    >
      {label}
    </span>
  );
}
