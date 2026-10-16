export type HintKey =
  | 'confidenceBars'
  | 'autoSuggest'
  | 'englishReference'
  | 'livePreview'
  | 'cribs';

export type HintSettings = Record<HintKey, boolean>;

export type PresetName = 'easy' | 'medium' | 'hard';
export type Preset = PresetName | 'custom';

export interface HintConfig {
  preset: Preset;
  hints: HintSettings;
}

// Display order of the toggles.
export const HINT_KEYS: HintKey[] = [
  'confidenceBars',
  'autoSuggest',
  'englishReference',
  'livePreview',
  'cribs',
];

// Display order of the presets.
export const PRESET_KEYS: Preset[] = ['easy', 'medium', 'hard', 'custom'];

const only = (enabled: HintKey[]): HintSettings =>
  HINT_KEYS.reduce(
    (settings, key) => ({ ...settings, [key]: enabled.includes(key) }),
    {} as HintSettings,
  );

export const PRESETS: Record<PresetName, HintSettings> = {
  easy: only(HINT_KEYS),
  medium: only(HINT_KEYS.filter((key) => key !== 'autoSuggest')),
  hard: only(['englishReference', 'livePreview']),
};

export const DEFAULT_HINT_CONFIG: HintConfig = {
  preset: 'easy',
  hints: PRESETS.easy,
};

// Picking a preset overwrites all toggles. Custom keeps current toggles.
export const applyPreset = (config: HintConfig, preset: Preset): HintConfig => (
  preset === 'custom'
    ? { ...config, preset }
    : { preset, hints: PRESETS[preset] }
);

// Any manual toggle switches to Custom.
export const toggleHint = (config: HintConfig, key: HintKey, value: boolean): HintConfig => ({
  preset: 'custom',
  hints: { ...config.hints, [key]: value },
});
