// Rail fence cracker hint keys + presets; the generic mechanics live in
// the shared cracker shell. The meter and the live re-draw are the core
// UX here (the slider is the whole attack), so the only *hint* is the
// easy preset's best-scoring marker on the track.
import { defineHints } from '@encryptors/shared/cracker/hintSettings';
import type { HintConfig, PresetName } from '@encryptors/shared/cracker/hintSettings';

export type HintKey = 'bestMark';

export type { HintConfig, PresetName, Preset } from '@encryptors/shared/cracker/hintSettings';
export { applyPreset, toggleHint } from '@encryptors/shared/cracker/hintSettings';

const defined = defineHints({
  keys: ['bestMark'],
  mediumWithout: ['bestMark'],
  hardWith: [],
});

export const HINT_KEYS = defined.HINT_KEYS;
export const PRESETS = defined.PRESETS;
export const DEFAULT_HINT_CONFIG = defined.DEFAULT_HINT_CONFIG;
