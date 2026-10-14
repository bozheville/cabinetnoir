import React from 'react';
import { Checkbox, Heading, Pane, SegmentedControl } from 'evergreen-ui';
import {
  HINT_KEYS,
  HINT_LABELS,
  PRESET_LABELS,
  HintConfig,
  Preset,
  applyPreset,
  toggleHint,
} from './hintSettings';

interface CrackerSettingsProps {
  config: HintConfig;
  onChange: (config: HintConfig) => void;
}

const PRESET_OPTIONS = (Object.keys(PRESET_LABELS) as Preset[]).map((value) => ({
  label: PRESET_LABELS[value],
  value,
}));

const CrackerSettings: React.FC<CrackerSettingsProps> = ({ config, onChange }) => (
  <Pane width="100%">
    <Heading size={100} marginBottom="8px">Hints</Heading>
    <SegmentedControl
      width="100%"
      maxWidth="360px"
      options={PRESET_OPTIONS}
      value={config.preset}
      onChange={(preset) => onChange(applyPreset(config, preset as Preset))}
    />
    <Pane
      display="grid"
      gridTemplateColumns="repeat(auto-fill, minmax(220px, 1fr))"
      columnGap="16px"
      marginTop="8px"
    >
      {HINT_KEYS.map((key) => (
        <Checkbox
          key={key}
          marginY="4px"
          label={HINT_LABELS[key]}
          checked={config.hints[key]}
          onChange={(event) => onChange(toggleHint(config, key, event.target.checked))}
        />
      ))}
    </Pane>
  </Pane>
);

CrackerSettings.displayName = 'CrackerSettings';

export default CrackerSettings;
