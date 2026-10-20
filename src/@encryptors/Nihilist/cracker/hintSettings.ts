// Nihilist cracker hint keys + presets; the generic mechanics live in
// the shared cracker shell. Easy greys out impossible key numbers up
// front; medium drops that; hard keeps only the plain red/green
// feedback after a try — and never whether the tool solves it.
import { defineHints } from '@encryptors/shared/cracker/hintSettings';
import type { HintConfig, PresetName } from '@encryptors/shared/cracker/hintSettings';

export type HintKey = 'greyImpossible' | 'suggestions';

export type { HintConfig, PresetName, Preset } from '@encryptors/shared/cracker/hintSettings';
export { applyPreset, toggleHint } from '@encryptors/shared/cracker/hintSettings';

const defined = defineHints({
  keys: ['greyImpossible', 'suggestions'],
  mediumWithout: ['greyImpossible', 'suggestions'],
  hardWith: [],
});

export const HINT_KEYS = defined.HINT_KEYS;
export const PRESETS = defined.PRESETS;
export const DEFAULT_HINT_CONFIG = defined.DEFAULT_HINT_CONFIG;
