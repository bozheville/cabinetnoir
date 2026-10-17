// Shared hint-preset mechanics for every cracker wizard.
//
// Each cipher defines its own hint keys and which keys the medium/hard
// presets keep; this module holds only the generic mechanics (types,
// preset construction, toggle handling) so the preset semantics stay
// identical across crackers.
export type PresetName = 'easy' | 'medium' | 'hard';
export type Preset = PresetName | 'custom';

export interface HintConfig {
  preset: Preset;
  hints: Record<string, boolean>;
}

export interface HintDefinition {
  // Display order of the toggles.
  keys: string[];
  // Keys the medium preset turns off (easy always shows everything).
  mediumWithout?: string[];
  // Keys the hard preset keeps (everything else is off).
  hardWith?: string[];
}

export interface DefinedHints {
  HINT_KEYS: string[];
  PRESETS: Record<PresetName, Record<string, boolean>>;
  DEFAULT_HINT_CONFIG: HintConfig;
}

const only = (keys: string[], enabled: string[]): Record<string, boolean> =>
  keys.reduce(
    (settings, key) => ({ ...settings, [key]: enabled.includes(key) }),
    {} as Record<string, boolean>,
  );

export const defineHints = (definition: HintDefinition): DefinedHints => {
  const { keys, mediumWithout = [], hardWith = [] } = definition;
  return {
    HINT_KEYS: keys,
    PRESETS: {
      easy: only(keys, keys),
      medium: only(keys, keys.filter((key) => !mediumWithout.includes(key))),
      hard: only(keys, hardWith),
    },
    DEFAULT_HINT_CONFIG: { preset: 'easy', hints: only(keys, keys) },
  };
};

// Picking a preset overwrites all toggles. Custom keeps current toggles.
export const applyPreset = (config: HintConfig, preset: Preset): HintConfig => (
  preset === 'custom'
    ? { ...config, preset }
    : { preset, hints: { ...config.hints } }
);

// Any manual toggle switches to Custom.
export const toggleHint = (
  config: HintConfig,
  key: string,
  value: boolean,
): HintConfig => ({
  preset: 'custom',
  hints: { ...config.hints, [key]: value },
});
