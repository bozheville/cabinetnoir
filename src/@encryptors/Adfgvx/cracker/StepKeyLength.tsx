import { useTranslation } from 'next-i18next';
import React from 'react';
import styled from 'styled-components';

import { TextInput } from '@atoms';
import Tooltip from '@atoms/Tooltip';
import { GreatPrimer, Minion } from '@typography';
import { paper } from '@theme/mixins';
import { useCracker } from './useCracker';
import { HintSettings } from './hintSettings';

const MAX_CARDS = 6;

const StepRoot = styled.div`
  width: 100%;
`;

// Parchment reading box for the ciphertext.
const CipherBox = styled.div`
  ${paper('parchment')}
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.paper};
  font-family: ${({ theme }) => theme.type.mono};
  color: ${({ theme }) => theme.ink.primary};
  font-size: 13px;
  line-height: 1.6;
  word-break: break-all;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
  margin-top: 12px;
`;

// A vellum index card; the selected one gets a copper frame.
const Card = styled.div<{ $selected: boolean }>`
  ${paper('vellum')}
  cursor: pointer;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.paper};
  border: 1px solid ${({ theme, $selected }) => ($selected ? theme.metal.copper.dark : theme.paper.rule)};
  border-width: ${({ $selected }) => ($selected ? '2px' : '1px')};
  color: ${({ theme }) => theme.ink.primary};
`;

const CardTitle = styled(GreatPrimer)``;

const CardText = styled(Minion)`
  display: block;
  color: ${({ theme }) => theme.ink.secondary};
`;

// Confidence: a brass rail with a copper fill.
const ConfidenceBar = styled.div`
  height: 4px;
  border-radius: 2px;
  background: ${({ theme }) => theme.metal.brass.base};
  margin-top: 8px;
  overflow: hidden;
`;

const ConfidenceFill = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.metal.copper.base};
`;

const OtherRow = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const OtherLabel = styled(Minion)`
  color: ${({ theme }) => theme.ink.cream};
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
    <StepRoot>
      <CipherBox>{input}</CipherBox>

      <Tooltip content={t('processing.adfgvx.cracker.tooltips.keyLengthCards')}>
        <CardsGrid data-guide="key-length-cards">
          {candidates.map((candidate) => (
            <Card
              key={candidate.keyLength}
              $selected={keyLength === candidate.keyLength}
              onClick={() => chooseKeyLength(candidate.keyLength)}
            >
              <CardTitle>{candidate.keyLength}</CardTitle>
              {hints.confidenceBars && (
                <>
                  <ConfidenceBar>
                    <ConfidenceFill style={{ width: `${normalizeQuality(candidate.score)}%` }} />
                  </ConfidenceBar>
                  <CardText>
                    {candidate.score.toFixed(1)}
                  </CardText>
                </>
              )}
            </Card>
          ))}
        </CardsGrid>
      </Tooltip>

      <OtherRow>
        <OtherLabel>{t('processing.adfgvx.cracker.wizard.keyLength.otherLabel')}</OtherLabel>
        <Tooltip content={t('processing.adfgvx.cracker.tooltips.otherLength')}>
          <TextInput
            mono
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
      </OtherRow>
    </StepRoot>
  );
};

StepKeyLength.displayName = 'StepKeyLength';

export default StepKeyLength;
