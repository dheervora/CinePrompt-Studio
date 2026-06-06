export interface PhotoTerm {
  id: string;
  name: string;
  category: 'lenses' | 'angles' | 'framing' | 'lighting' | 'movements' | 'color-film';
  definition: string;
  visualType: string; // Used to determine which custom interactive SVG diagram to render
  promptSnippets: {
    image: string;
    video?: string;
  };
  promptTemplate: string; // e.g. "shot with a [TERM] to create deep focus"
  tip: string;
  expertInsight: string;
}

export interface PromptFormula {
  subject: string;
  lensId: string;
  angleId: string;
  framingId: string;
  lightingId: string;
  movementId: string;
  colorGradeId: string;
  filmStock: string;
  aspectRatio: string;
  customNotes: string;
}

export interface QuizChallenge {
  id: string;
  title: string;
  description: string;
  category: string;
  requiredElements: string[]; // key concepts they must include
  sampleSolution: string;
}

export interface QuizGrade {
  score: number;
  grammarFeedback: string;
  technicalMatch: string[];
  omissions: string[];
  critique: string;
  suggestedPrompt: string;
}

export interface OptimizationResult {
  originalPrompt: string;
  optimizedImagePrompt: string;
  optimizedVideoPrompt: string;
  pacingBreakdown: string;
  addedVocabulary: Array<{ term: string; benefit: string; category: string }>;
  sceneAtmosphere: string;
  cinematicAnalogy: string;
}
