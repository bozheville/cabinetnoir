import React from 'react';
import { Checkbox, Heading, Pane, SegmentedControl } from 'evergreen-ui';
import {
  HINT_KEYS,
  PRESET_KEYS,
  HintConfig,
  Preset,
  applyPreset,
  toggleHint,
} from './hintSettings';
import strings from '../strings';

interface CrackerSettingsProps {
  config: HintConfig;
  onChange: (config: HintConfig) => void;
}

const PRESET_OPTIONS = PRESET_KEYS.map((value) => ({
  label: strings.hints.presets[value],
  value,
}));

const CrackerSettings: React.FC<CrackerSettingsProps> = ({ config, onChange }) => (
  <Pane width="100%">
    <Heading size={100} marginBottom="8px">{strings.hints.title}</Heading>
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
          label={strings.hints.toggles[key]}
          checked={config.hints[key]}
          onChange={(event) => onChange(toggleHint(config, key, event.target.checked))}
        />
      ))}
    </Pane>
  </Pane>
);

CrackerSettings.displayName = 'CrackerSettings';

export default CrackerSettings;
