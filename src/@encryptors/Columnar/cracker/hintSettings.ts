// Columnar cracker hint keys + presets; the generic mechanics live in
// the shared cracker shell. Hints change how much is highlighted — never
// whether the tool reorders anything.
import { defineHints } from '@encryptors/shared/cracker/hintSettings';
import type { HintConfig, PresetName } from '@encryptors/shared/cracker/hintSettings';

export type HintKey =
  | 'badges'       // pair-score badges between neighbouring columns
  | 'bestPartner'  // easy: outline the best partner of the selected column
  | 'livePreview'; // live plaintext rows

export type { HintConfig, PresetName, Preset } from '@encryptors/shared/cracker/hintSettings';
export { applyPreset, toggleHint } from '@encryptors/shared/cracker/hintSettings';

const defined = defineHints({
  keys: ['badges', 'bestPartner', 'livePreview'],
  mediumWithout: ['bestPartner'],
  hardWith: ['livePreview'],
});

export const HINT_KEYS = defined.HINT_KEYS;
export const PRESETS = defined.PRESETS;
export const DEFAULT_HINT_CONFIG = defined.DEFAULT_HINT_CONFIG;
