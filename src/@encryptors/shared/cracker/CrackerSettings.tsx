import { useTranslation } from 'next-i18next';
import Tooltip from '@atoms/Tooltip';
import React from 'react';
import styled from 'styled-components';

import { Segmented, Toggle } from '@atoms';
import { GreatPrimer } from '@typography';
import {
  HintConfig,
  applyPreset,
  toggleHint,
} from './hintSettings';
import type { Preset } from './hintSettings';

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

const Title = styled(GreatPrimer)`
  color: ${({ theme }) => theme.ink.cream};
  margin-bottom: 8px;
`;

const PresetRow = styled.div`
  margin-bottom: 8px;
`;

const TogglesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  column-gap: 16px;
  margin-top: 8px;
`;

const ToggleCell = styled.div`
  margin: 4px 0;
`;

const PRESET_KEYS: Preset[] = ['easy', 'medium', 'hard', 'custom'];

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
    <div style={{ width: '100%' }}>
      <Title>{t(`${SHARED_SCOPE}.hints.title`)}</Title>
      <Tooltip content={t(`${SHARED_SCOPE}.tooltips.hintPresets`)}>
        <PresetRow data-guide="hint-presets">
          <Segmented
            options={PRESET_KEYS.map((preset) => ({
              value: preset,
              label: t(`${SHARED_SCOPE}.hints.presets.${preset}`),
            }))}
            value={config.preset}
            onChange={(preset) => onChange(applyPreset(config, preset))}
          />
        </PresetRow>
      </Tooltip>
      <TogglesGrid>
        {keys.map((key) => (
          <ToggleCell key={key}>
            <Tooltip content={toggleTooltip(key)}>
              <Toggle
                label={toggleLabel(key)}
                checked={config.hints[key]}
                onChange={(event) => onChange(toggleHint(config, key, event.target.checked))}
              />
            </Tooltip>
          </ToggleCell>
        ))}
      </TogglesGrid>
    </div>
  );
};

CrackerSettings.displayName = 'CrackerSettings';

export default CrackerSettings;
