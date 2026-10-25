// Polybius cracker hint keys + presets; the generic mechanics live in
// the shared cracker shell. Easy shows everything (contextual letter
// suggestions + the crib panel); medium drops the cribs; hard keeps
// only the plain frequency ranking — and never whether the tool solves
// it.
import { defineHints } from '@encryptors/shared/cracker/hintSettings';
import type { HintConfig, PresetName } from '@encryptors/shared/cracker/hintSettings';

export type HintKey = 'suggestions' | 'cribs';

export type { HintConfig, PresetName, Preset } from '@encryptors/shared/cracker/hintSettings';
export { applyPreset, toggleHint } from '@encryptors/shared/cracker/hintSettings';

const defined = defineHints({
  keys: ['suggestions', 'cribs'],
  mediumWithout: ['cribs'],
  hardWith: [],
});

export const HINT_KEYS = defined.HINT_KEYS;
export const PRESETS = defined.PRESETS;
export const DEFAULT_HINT_CONFIG = defined.DEFAULT_HINT_CONFIG;
