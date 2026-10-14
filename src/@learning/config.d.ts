// Types for the CommonJS learning config (config.js).

export type LearningTabName = 'learn' | 'history' | 'practice';

// Standard sections in fixed order; a tab lists a subset of these.
export type LearningSectionName =
  | 'how-it-works'
  | 'guides'
  | 'breaking-it'
  | 'glossary'
  | 'history'
  | 'challenges';

export interface LearningFurtherReading {
  url: string;
  // i18n key for the link label, e.g. learning.furtherReading.wikipedia
  labelKey: string;
}

export interface LearningAtGlance {
  // i18n keys; type and difficulty are shared across ciphers,
  // era and origin are cipher-specific.
  type: string;
  difficulty: string;
  era: string;
  origin: string;
  modes: Array<'encrypt' | 'decrypt' | 'cryptoanalysis'>;
}

export interface LearningConfigEntry {
  tabs: LearningTabName[];
  sections: Record<LearningTabName, LearningSectionName[]>;
  atGlance: LearningAtGlance;
  // Glossary term ids shared across ciphers (see the glossary locale keys).
  glossary: string[];
  furtherReading: LearningFurtherReading[];
}

export declare const learningConfig: Record<string, LearningConfigEntry>;

export declare function getLearningConfig(cipher: string): LearningConfigEntry | null;

export declare function hasTab(cipher: string, tab: LearningTabName): boolean;
