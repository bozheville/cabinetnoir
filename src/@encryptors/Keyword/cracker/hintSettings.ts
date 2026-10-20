// Keyword cracker hint keys + presets; the generic mechanics live in the
// shared cracker shell. Hints change how much is highlighted — never
// whether the tool solves anything.
import { defineHints } from '@encryptors/shared/cracker/hintSettings';
import type { HintConfig, PresetName } from '@encryptors/shared/cracker/hintSettings';

export type HintKey =
  | 'suggestions'   // frequency suggestion under each unassigned cell
  | 'patterns'      // pattern-word candidate panel
  | 'doubles'       // doubled letters + one-letter words
  | 'livePreview';  // live partial plaintext

export type { HintConfig, PresetName, Preset } from '@encryptors/shared/cracker/hintSettings';
export { applyPreset, toggleHint } from '@encryptors/shared/cracker/hintSettings';

const defined = defineHints({
  keys: ['suggestions', 'patterns', 'doubles', 'livePreview'],
  mediumWithout: ['suggestions'],
  hardWith: ['livePreview'],
});

export const HINT_KEYS = defined.HINT_KEYS;
export const PRESETS = defined.PRESETS;
export const DEFAULT_HINT_CONFIG = defined.DEFAULT_HINT_CONFIG;
