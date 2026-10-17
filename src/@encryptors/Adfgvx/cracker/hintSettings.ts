// ADFGVX hint keys + presets; the generic mechanics live in the shared
// cracker shell so every wizard behaves the same way.
import { defineHints } from '@encryptors/shared/cracker/hintSettings';

export type HintKey =
  | 'confidenceBars'
  | 'autoSuggest'
  | 'englishReference'
  | 'livePreview'
  | 'cribs';

export type HintSettings = Record<string, boolean>;

export type { HintConfig, Preset, PresetName } from '@encryptors/shared/cracker/hintSettings';
export { applyPreset, toggleHint } from '@encryptors/shared/cracker/hintSettings';

const defined = defineHints({
  keys: [
    'confidenceBars',
    'autoSuggest',
    'englishReference',
    'livePreview',
    'cribs',
  ],
  mediumWithout: ['autoSuggest'],
  hardWith: ['englishReference', 'livePreview'],
});

export const HINT_KEYS = defined.HINT_KEYS;
export const PRESETS = defined.PRESETS;
export const DEFAULT_HINT_CONFIG = defined.DEFAULT_HINT_CONFIG;
