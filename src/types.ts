export type CategoryId =
  | 'lighting'
  | 'composition'
  | 'framing'
  | 'angles'
  | 'lenses'
  | 'exposure'
  | 'color-film'
  | 'movements';

export type Level = 'fundamental' | 'intermediate' | 'advanced';

export interface Category {
  id: CategoryId;
  label: string; // short label for chips and dropdowns
  title: string;
  description: string;
}

export interface PhotoTerm {
  id: string;
  name: string;
  category: CategoryId;
  level: Level;
  definition: string; // what it is
  lookFor: string; // what you will actually see in the picture
  phrase: string; // natural-language phrase for descriptive prompts (Gemini, Veo)
  keywords: string; // short comma-style keywords (Midjourney)
  videoPhrase?: string; // how to say it in a video prompt
  tip: string; // when to use it
  insight: string; // why it works / background
  exampleQuery: string; // search words for finding real example photos
}

export type PromptTarget = 'gemini' | 'midjourney' | 'veo';

export interface PromptFormula {
  subject: string;
  framingId: string;
  angleId: string;
  compositionId: string;
  lensId: string;
  lightingId: string;
  exposureId: string;
  colorId: string;
  movementId: string;
  cameraId: string;
  aspectRatio: string; // "16:9", "2.39:1", ...
  notes: string;
}

export interface Challenge {
  id: string;
  title: string;
  level: Level;
  kind: 'image' | 'video';
  focus: string; // what skill it practises, e.g. "Lighting"
  brief: string; // the look, described in plain words (no term names)
  answerTermIds: string[]; // glossary terms the brief is describing, revealed after grading
  sampleSolution: string;
}

export interface RubricScore {
  name: string;
  score: number;
  max: number;
  comment: string;
}

export interface GradeResult {
  score: number;
  criteria: RubricScore[];
  strengths: string[];
  missing: string[];
  critique: string;
  suggestedPrompt: string;
  imageFeedback?: string;
}

export interface OptimizationResult {
  originalPrompt: string;
  target: PromptTarget;
  optimizedImagePrompt: string;
  optimizedVideoPrompt: string;
  pacingBreakdown: string;
  whatChanged: string[];
  addedVocabulary: Array<{ term: string; benefit: string; category: string; glossaryId?: string }>;
  sceneAtmosphere: string;
  cinematicAnalogy: string;
}

export interface CompareResult {
  summary: string;
  differences: string[];
  didTheTermWork: string;
}

export type ImageStatus = 'unknown' | 'available' | 'needs_billing' | 'disabled';

export interface Health {
  hasKey: boolean;
  textModel: string;
  fallbackModel: string;
  imageModel: string;
  imageStatus: ImageStatus;
}
