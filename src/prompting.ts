import { ASPECT_RATIOS, CAMERA_PRESETS, TERM_BY_ID } from './photographyData';
import { CategoryId, PhotoTerm, PromptFormula, PromptTarget } from './types';

export type SegmentKind = CategoryId | 'subject' | 'camera' | 'notes' | 'aspect' | 'glue';

export interface PromptSegment {
  text: string;
  kind: SegmentKind;
  termId?: string;
}

// One color per part of a prompt; used for the colour-coded preview and its legend.
export const SEGMENT_COLORS: Record<SegmentKind, string> = {
  subject: '#F2F2F2',
  lighting: '#F5B942',
  composition: '#6FCF97',
  framing: '#56CCF2',
  angles: '#C39BFF',
  lenses: '#F27D26',
  exposure: '#FF8FC2',
  'color-film': '#4DD0C8',
  movements: '#B5E655',
  camera: '#BDBDBD',
  notes: '#BDBDBD',
  aspect: '#BDBDBD',
  glue: 'transparent',
};

export const SEGMENT_LABELS: Record<Exclude<SegmentKind, 'glue'>, string> = {
  subject: 'Subject',
  framing: 'Shot size',
  angles: 'Angle',
  composition: 'Composition',
  lenses: 'Lens',
  exposure: 'Exposure',
  lighting: 'Light',
  'color-film': 'Color',
  movements: 'Movement',
  camera: 'Camera',
  notes: 'Details',
  aspect: 'Aspect ratio',
};

export const TARGETS: Array<{ id: PromptTarget; label: string; blurb: string }> = [
  {
    id: 'gemini',
    label: 'Gemini (images)',
    blurb: 'Gemini image models follow full, descriptive sentences best. Aspect ratio is a setting (or a phrase), not a --flag.',
  },
  {
    id: 'midjourney',
    label: 'Midjourney',
    blurb: 'Midjourney handles short, comma-separated phrases well and reads parameters like --ar at the end. Ratios must be whole numbers.',
  },
  {
    id: 'veo',
    label: 'Veo (video)',
    blurb: 'Video prompts lead with the camera movement, then describe the subject, action, and look. Veo outputs 16:9 or 9:16 only.',
  },
];

const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const clean = (s: string) => s.trim().replace(/[.\s]+$/, '');

function pick(id: string): PhotoTerm | undefined {
  return id ? TERM_BY_ID[id] : undefined;
}

export function formulaTerms(f: PromptFormula) {
  return {
    framing: pick(f.framingId),
    angle: pick(f.angleId),
    composition: pick(f.compositionId),
    lens: pick(f.lensId),
    exposure: pick(f.exposureId),
    lighting: pick(f.lightingId),
    color: pick(f.colorId),
    movement: pick(f.movementId),
  };
}

export function aspectInfo(value: string) {
  return ASPECT_RATIOS.find((a) => a.value === value) ?? ASPECT_RATIOS[0];
}

export function buildPrompt(f: PromptFormula, target: PromptTarget): PromptSegment[] {
  const t = formulaTerms(f);
  const subject = clean(f.subject) || 'your subject here';
  const camera = CAMERA_PRESETS.find((c) => c.id === f.cameraId);
  const notes = clean(f.notes);
  const aspect = aspectInfo(f.aspectRatio);
  const segs: PromptSegment[] = [];
  const push = (text: string, kind: SegmentKind, termId?: string) => segs.push({ text, kind, termId });

  if (target === 'midjourney') {
    const parts: PromptSegment[] = [{ text: subject, kind: 'subject' }];
    const add = (term: PhotoTerm | undefined) => term && parts.push({ text: term.keywords, kind: term.category, termId: term.id });
    add(t.framing); add(t.angle); add(t.composition); add(t.lens); add(t.exposure); add(t.lighting); add(t.color);
    if (camera) parts.push({ text: camera.phrase.replace(/^shot on an? /, ''), kind: 'camera' });
    if (notes) parts.push({ text: notes, kind: 'notes' });
    parts.forEach((p, i) => {
      if (i > 0) push(', ', 'glue');
      segs.push(p);
    });
    push(' ', 'glue');
    push(`--ar ${aspect.mj}`, 'aspect');
    return segs;
  }

  const sentence = (text: string, kind: SegmentKind, termId?: string) => {
    if (segs.length) push(' ', 'glue');
    push(`${cap(clean(text))}.`, kind, termId);
  };

  if (target === 'veo') {
    sentence(t.movement?.videoPhrase ?? 'A static shot, the camera does not move', 'movements', t.movement?.id);
    sentence(subject, 'subject');
    for (const term of [t.framing, t.angle, t.composition, t.lens, t.exposure, t.lighting, t.color]) {
      if (term) sentence(term.videoPhrase ?? term.phrase, term.category, term.id);
    }
    if (camera) sentence(camera.phrase, 'camera');
    if (notes) sentence(notes, 'notes');
    sentence(aspect.value === '9:16' ? 'Vertical 9:16 video' : 'Widescreen 16:9 video', 'aspect');
    return segs;
  }

  // Gemini: one descriptive sentence per decision, subject first.
  sentence(subject, 'subject');
  for (const term of [t.framing, t.angle, t.composition, t.lens, t.exposure, t.lighting, t.color]) {
    if (term) sentence(term.phrase, term.category, term.id);
  }
  if (camera) sentence(camera.phrase, 'camera');
  if (notes) sentence(notes, 'notes');
  sentence(cap(aspect.words), 'aspect');
  return segs;
}

export const segmentsToText = (segs: PromptSegment[]) => segs.map((s) => s.text).join('');

export function promptText(f: PromptFormula, target: PromptTarget) {
  return segmentsToText(buildPrompt(f, target));
}

// Plain-language checks for choices that pull against each other.
export interface PromptNote {
  kind: 'warn' | 'info';
  text: string;
}

export function coherenceWarnings(f: PromptFormula, target: PromptTarget): PromptNote[] {
  const t = formulaTerms(f);
  const camera = CAMERA_PRESETS.find((c) => c.id === f.cameraId);
  const notes: PromptNote[] = [];
  const warn = (text: string) => notes.push({ kind: 'warn', text });
  const info = (text: string) => notes.push({ kind: 'info', text });

  if (camera?.medium === 'digital' && (f.colorId === 'color-kodachrome-vintage' || f.colorId === 'color-cinestill-800t')) {
    warn(`${t.color!.name} is a film stock, but you picked a digital camera. Choose a film camera, or keep it as a "look" (the prompt already says "the look of").`);
  }
  if (f.lensId === 'lens-telephoto-200mm' && f.framingId === 'framing-extreme-wide') {
    warn('A 200mm telephoto sees a narrow slice of the scene, so it fights an extreme wide shot. Use a wide or standard lens for vast views.');
  }
  if (f.lensId === 'lens-macro-100mm' && f.framingId && !['framing-closeup', 'framing-extreme-closeup'].includes(f.framingId)) {
    warn('A macro lens is for tiny subjects filling the frame. Pair it with a close-up or extreme close-up.');
  }
  if (f.lensId === 'lens-wide-14mm' && ['framing-closeup', 'framing-extreme-closeup'].includes(f.framingId)) {
    warn('An ultra-wide lens this close to a face stretches the nose and features. Use an 85mm lens for flattering close-ups.');
  }
  if (f.lensId === 'lens-anamorphic' && f.aspectRatio !== '2.39:1') {
    warn('Anamorphic lenses are made for the wide 2.39:1 frame; set the aspect ratio to match.');
  }
  if (f.lightingId === 'lighting-highkey' && f.colorId === 'color-film-noir-blackwhite') {
    warn('Film noir relies on deep shadows, which high-key lighting removes. Try low-key or hard light instead.');
  }
  if (f.lightingId === 'lighting-highkey' && f.exposureId === 'exp-iso') {
    warn('High ISO grain suggests a dim scene, but high-key lighting is bright. Pick one mood.');
  }
  if (f.movementId && target !== 'veo') {
    info('Camera movement only matters in video, so it is left out of this image prompt. Switch the target to Veo to use it.');
  }
  if (target === 'veo' && !['16:9', '9:16'].includes(f.aspectRatio)) {
    info('Veo only renders 16:9 or 9:16 video, so the prompt uses 16:9.');
  }
  if (!f.subject.trim()) {
    info('Describe the subject first: who or what is in the picture, and what they are doing.');
  }
  return notes;
}

export const EMPTY_FORMULA: PromptFormula = {
  subject: '',
  framingId: '',
  angleId: '',
  compositionId: '',
  lensId: '',
  lightingId: '',
  exposureId: '',
  colorId: '',
  movementId: '',
  cameraId: '',
  aspectRatio: '16:9',
  notes: '',
};

export const FORMULA_FIELD_BY_CATEGORY: Record<CategoryId, keyof PromptFormula> = {
  framing: 'framingId',
  angles: 'angleId',
  composition: 'compositionId',
  lenses: 'lensId',
  exposure: 'exposureId',
  lighting: 'lightingId',
  'color-film': 'colorId',
  movements: 'movementId',
};
