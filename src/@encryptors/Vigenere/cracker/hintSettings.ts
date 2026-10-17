// Vigenère hint keys + presets; the generic mechanics live in the shared
// cracker shell so every wizard behaves the same way.
import { defineHints } from '@encryptors/shared/cracker/hintSettings';
import type { HintConfig, PresetName } from '@encryptors/shared/cracker/hintSettings';

export type HintKey =
  | 'highlightRepeats'
  | 'showGaps'
  | 'confidenceBars'
  | 'englishReference'
  | 'matchScore'
  | 'mostLikelyGlow'
  | 'livePreview'
  | 'cribs';

// Typed alias kept for readability; the shared HintConfig carries the
// actual hint flags.
export type HintSettings = Record<string, boolean>;

export type { HintConfig, PresetName };
export type { Preset } from '@encryptors/shared/cracker/hintSettings';
export { applyPreset, toggleHint } from '@encryptors/shared/cracker/hintSettings';

const defined = defineHints({
  keys: [
    'highlightRepeats',
    'showGaps',
    'confidenceBars',
    'englishReference',
    'matchScore',
    'mostLikelyGlow',
    'livePreview',
    'cribs',
  ],
  mediumWithout: ['mostLikelyGlow', 'confidenceBars'],
  hardWith: ['englishReference', 'livePreview'],
});

export const HINT_KEYS = defined.HINT_KEYS;
export const PRESETS = defined.PRESETS;
export const DEFAULT_HINT_CONFIG = defined.DEFAULT_HINT_CONFIG;
