import { useTranslation } from 'next-i18next';
import Tooltip from '@atoms/Tooltip';
import React from 'react';
import { Checkbox, Heading, Pane } from 'evergreen-ui';
import styled from 'styled-components';

import {
  HintConfig,
  applyPreset,
  toggleHint,
} from './hintSettings';

interface CrackerSettingsProps {
  config: HintConfig;
  onChange: (config: HintConfig) => void;
  // Hint keys to render, in display order.
  keys: string[];
  // i18n scope of the cipher's cracker block, e.g.
  // 'processing.vigenere.cracker' — only for cipher-specific toggles;
  // shared toggles, presets and titles resolve from
  // processing.cracker.* first and fall back to the cipher block.
  i18nScope?: string;
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

const PRESET_KEYS = ['easy', 'medium', 'hard', 'custom'];

const SHARED_SCOPE = 'processing.cracker';

const CrackerSettings: React.FC<CrackerSettingsProps> = ({ config, onChange, keys, i18nScope }) => {
  const { t } = useTranslation('common');
  // Shared strings first; cipher-specific toggles fall back to the
  // cipher's cracker block.
  const toggleLabel = (key: string) =>
    i18nScope
      ? t([`${SHARED_SCOPE}.hints.toggles.${key}`, `${i18nScope}.hints.toggles.${key}`])
      : t(`${SHARED_SCOPE}.hints.toggles.${key}`);
  const toggleTooltip = (key: string) =>
    i18nScope
      ? t([`${SHARED_SCOPE}.tooltips.toggle.${key}`, `${i18nScope}.tooltips.toggle.${key}`])
      : t(`${SHARED_SCOPE}.tooltips.toggle.${key}`);

  return (
    <Pane width="100%">
      <Heading size={100} marginBottom="8px">{t(`${SHARED_SCOPE}.hints.title`)}</Heading>
      <Tooltip content={t(`${SHARED_SCOPE}.tooltips.hintPresets`)}>
        <PresetPicker data-guide="hint-presets">
          {PRESET_KEYS.map((preset) => (
            <PresetOption
              key={preset}
              $active={config.preset === preset}
              onClick={() => onChange(applyPreset(config, preset as any))}
            >
              {t(`${SHARED_SCOPE}.hints.presets.${preset}`)}
            </PresetOption>
          ))}
        </PresetPicker>
      </Tooltip>
      <Pane
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(220px, 1fr))"
        columnGap="16px"
        marginTop="8px"
      >
        {keys.map((key) => (
          <Tooltip key={key} content={toggleTooltip(key)}>
            <Checkbox
              marginY="4px"
              label={toggleLabel(key)}
              checked={config.hints[key]}
              onChange={(event) => onChange(toggleHint(config, key, event.target.checked))}
            />
          </Tooltip>
        ))}
      </Pane>
    </Pane>
  );
};

CrackerSettings.displayName = 'CrackerSettings';

export default CrackerSettings;
