import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { CATEGORIES, PHOTOGRAPHY_TERMS, termsInCategory } from '../photographyData';
import { Button, CopyButton, cx, Eyebrow, Panel, selectableClass } from './ui';

type Format = 'markdown' | 'system' | 'json';

const FORMATS: Array<{ id: Format; title: string; description: string; file: string }> = [
  { id: 'markdown', title: 'Markdown cheat sheet', description: 'Every term with what it looks like and how to phrase it. Good for notes or as a skill file for an AI assistant.', file: 'cineprompt-cheatsheet.md' },
  { id: 'system', title: 'System instructions', description: 'Instructions for a custom GPT, Claude Project, or Gem that turns rough ideas into well-structured prompts.', file: 'cineprompt-system-instructions.md' },
  { id: 'json', title: 'JSON glossary', description: 'The full glossary as structured data, for your own scripts or apps.', file: 'cineprompt-glossary.json' },
];

const termLines = (category: (typeof CATEGORIES)[number]['id']) =>
  termsInCategory(category)
    .map((t) => `- **${t.name}**: ${t.definition} *Looks like:* ${t.lookFor}\n  - Gemini: "${t.phrase}"\n  - Midjourney: "${t.keywords}"`)
    .join('\n');

function buildExport(format: Format): string {
  if (format === 'json') {
    return JSON.stringify(
      {
        name: 'CinePrompt Studio glossary',
        categories: CATEGORIES.map((c) => ({ id: c.id, title: c.title, description: c.description })),
        terms: PHOTOGRAPHY_TERMS.map(({ id, name, category, level, definition, lookFor, phrase, keywords, videoPhrase, tip }) => ({ id, name, category, level, definition, lookFor, phrase, keywords, videoPhrase, tip })),
      },
      null,
      2
    );
  }

  const glossary = CATEGORIES.map((c) => `### ${c.title}\n${c.description}\n\n${termLines(c.id)}`).join('\n\n');

  if (format === 'system') {
    return `# Role
You help people turn rough scene ideas into precise prompts for AI image and video models, using real photography and cinematography techniques.

# How to write prompts
1. Start with the subject and what it is doing.
2. Add the shot size and camera angle.
3. Add composition if it matters (rule of thirds, leading lines, negative space...).
4. Add the lens and depth of field.
5. Describe the light: its quality (hard or soft), its direction, and the time of day.
6. Add color: temperature, grade, or film look.
7. For video, lead with the camera movement.

# Style per model
- Gemini image models: full descriptive sentences. Put the aspect ratio in words or in the API setting, never as --ar.
- Midjourney: short comma-separated phrases, most important first, then --ar W:H with whole numbers (e.g. 239:100 for 2.39:1).
- Veo (video): camera movement first, then subject and action, then light and color. 16:9 or 9:16 only.

# Rules
- Prefer concrete, physical descriptions ("soft window light from the left") over hype words ("masterpiece", "8k", "ultra realistic").
- Only combine techniques that fit together; flag contradictions (e.g. high-key lighting with film noir).
- After the prompt, list the techniques you used and what each one does, in plain words.

# Glossary
${glossary}`;
  }

  return `# CinePrompt photography cheat sheet

Order your prompt: subject → shot size and angle → composition → lens and focus → light → color. For video, start with the camera movement.

${glossary}`;
}

export default function AgentExporter() {
  const [format, setFormat] = useState<Format>('markdown');
  const current = FORMATS.find((f) => f.id === format)!;
  const text = buildExport(format);

  const download = () => {
    const blob = new Blob([text], { type: format === 'json' ? 'application/json' : 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = current.file;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <Panel className="lg:col-span-4 space-y-4">
        <p className="text-muted">Take what you've learned with you: export the glossary as a cheat sheet, as instructions for an AI assistant, or as data.</p>
        <div className="space-y-2.5" role="radiogroup" aria-label="Export format">
          {FORMATS.map((f) => (
            <button key={f.id} type="button" role="radio" aria-checked={f.id === format} onClick={() => setFormat(f.id)} className={cx(selectableClass(f.id === format), 'w-full p-4 space-y-1')}>
              <span className="block font-semibold text-ink">{f.title}</span>
              <span className="block text-sm text-muted">{f.description}</span>
            </button>
          ))}
        </div>
      </Panel>

      <Panel className="lg:col-span-8 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Eyebrow>Preview</Eyebrow>
            <p className="text-sm text-muted font-mono">{current.file} · {PHOTOGRAPHY_TERMS.length} terms</p>
          </div>
          <div className="flex gap-2">
            <CopyButton text={text} />
            <Button size="sm" variant="primary" onClick={download}>
              <Download className="w-3.5 h-3.5" aria-hidden="true" /> Download
            </Button>
          </div>
        </div>
        <pre className="bg-bg border border-line rounded-md p-4 text-[13px] leading-relaxed font-mono text-muted whitespace-pre-wrap break-words overflow-y-auto max-h-[70vh]">{text}</pre>
      </Panel>
    </div>
  );
}
