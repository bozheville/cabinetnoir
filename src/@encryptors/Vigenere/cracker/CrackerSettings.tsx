import { useTranslation } from 'next-i18next';
import React from 'react';
import { Checkbox, Heading, Pane } from 'evergreen-ui';
import styled from 'styled-components';

import {
  HINT_KEYS,
  PRESET_KEYS,
  HintConfig,
  Preset,
  applyPreset,
  toggleHint,
} from './hintSettings';

interface CrackerSettingsProps {
  config: HintConfig;
  onChange: (config: HintConfig) => void;
}

const PresetPicker = styled(Pane)`
  display: inline-flex;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colorScheme.gray[300]};
  overflow: hidden;
`;

const PresetOption = styled.button<{ $active: boolean }>`
  padding: 4px 12px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  background: ${({ theme, $active }) => ($active ? theme.colorScheme.blue[500] : theme.colors.background)};
  color: ${({ theme, $active }) => ($active ? theme.colorScheme.white : theme.colors.text)};

  &:not(:last-child) {
    border-right: 1px solid ${({ theme }) => theme.colorScheme.gray[300]};
  }

  &:hover {
    background: ${({ theme, $active }) => ($active ? theme.colorScheme.blue[500] : theme.colorScheme.gray[100])};
  }
`;

const CrackerSettings: React.FC<CrackerSettingsProps> = ({ config, onChange }) => {
  const { t } = useTranslation('common');

  return (
  <Pane width="100%">
    <Heading size={100} marginBottom="8px">{t('processing.vigenere.cracker.hints.title')}</Heading>
    <PresetPicker data-guide="hint-presets">
      {PRESET_KEYS.map((preset) => (
        <PresetOption
          key={preset}
          $active={config.preset === preset}
          onClick={() => onChange(applyPreset(config, preset))}
        >
          {t(`processing.vigenere.cracker.hints.presets.${preset}`)}
        </PresetOption>
      ))}
    </PresetPicker>
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
          label={t(`processing.vigenere.cracker.hints.toggles.${key}`)}
          checked={config.hints[key]}
          onChange={(event) => onChange(toggleHint(config, key, event.target.checked))}
        />
      ))}
    </Pane>
  </Pane>
  );
};

CrackerSettings.displayName = 'CrackerSettings';

export default CrackerSettings;
