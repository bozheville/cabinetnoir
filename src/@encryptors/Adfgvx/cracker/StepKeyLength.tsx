import { useTranslation } from 'next-i18next';
import React from 'react';
import { Heading, Pane, Text, TextInput } from 'evergreen-ui';
import styled from 'styled-components';

import Tooltip from '@atoms/Tooltip';
import { useCracker } from './useCracker';
import { HintSettings } from './hintSettings';

const MAX_CARDS = 6;

const CipherBox = styled(Pane)`
  font-family: monospace;
  font-size: 13px;
  line-height: 1.6;
  word-break: break-all;
  padding: 10px 12px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colorScheme.gray[100]};
`;

const CardsGrid = styled(Pane)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
  margin-top: 12px;
`;

const Card = styled(Pane)<{ $selected: boolean }>`
  cursor: pointer;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme, $selected }) => ($selected ? theme.colorScheme.blue[500] : 'muted')};
  border-width: ${({ $selected }) => ($selected ? '2px' : '1px')};
  background: ${({ theme, $selected }) => ($selected ? theme.colorScheme.blue[50] : 'transparent')};
`;

const ConfidenceBar = styled(Pane)`
  height: 4px;
  border-radius: 2px;
  background: ${({ theme }) => theme.colorScheme.gray[300]};
  margin-top: 8px;
  overflow: hidden;
`;

const ConfidenceFill = styled(Pane)`
  height: 100%;
  background: ${({ theme }) => theme.colorScheme.blue[500]};
`;

interface StepKeyLengthProps {
  cracker: ReturnType<typeof useCracker>;
}

const StepKeyLength: React.FC<StepKeyLengthProps> = ({ cracker }) => {
  const { t } = useTranslation('common');
  const {
    input,
    analysis,
    hintConfig,
    keyLength,
    chooseKeyLength,
    normalizeQuality,
  } = cracker;
  const hints: HintSettings = hintConfig.hints;

  const candidates = (analysis?.rankedLengths ?? []).slice(0, MAX_CARDS);

  return (
    <Pane width="100%">
      <CipherBox>{input}</CipherBox>

      <Tooltip content={t('processing.adfgvx.cracker.tooltips.keyLengthCards')}>
        <CardsGrid data-guide="key-length-cards">
          {candidates.map((candidate) => (
            <Card
              key={candidate.keyLength}
              $selected={keyLength === candidate.keyLength}
              onClick={() => chooseKeyLength(candidate.keyLength)}
            >
              <Heading size={400}>{candidate.keyLength}</Heading>
              {hints.confidenceBars && (
                <>
                  <ConfidenceBar>
                    <ConfidenceFill style={{ width: `${normalizeQuality(candidate.score)}%` }} />
                  </ConfidenceBar>
                  <Text size={300} display="block">
                    {candidate.score.toFixed(1)}
                  </Text>
                </>
              )}
            </Card>
          ))}
        </CardsGrid>
      </Tooltip>

      <Pane marginTop="12px" display="flex" alignItems="center" gap="8px">
        <Text size={300}>{t('processing.adfgvx.cracker.wizard.keyLength.otherLabel')}</Text>
        <Tooltip content={t('processing.adfgvx.cracker.tooltips.otherLength')}>
          <TextInput
            width="80px"
            type="number"
            min={4}
            max={12}
            value={keyLength ?? ''}
            placeholder={t('processing.adfgvx.cracker.wizard.keyLength.otherPlaceholder')}
            onChange={(event) => {
              const value = parseInt((event.target as HTMLInputElement).value, 10);
              if (!Number.isNaN(value) && value >= 4 && value <= 12) {
                chooseKeyLength(value);
              }
            }}
          />
        </Tooltip>
      </Pane>
    </Pane>
  );
};

StepKeyLength.displayName = 'StepKeyLength';

export default StepKeyLength;
