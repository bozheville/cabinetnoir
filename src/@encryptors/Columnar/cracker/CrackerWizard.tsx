import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import Tooltip from '@atoms/Tooltip';
import { Button } from '@atoms';
import { Minion } from '@typography';
import { paper } from '@theme/mixins';
import {
  columnarDecrypt,
} from '@encryptors/shared/transposition';
import TranspositionGrid from '@encryptors/shared/transposition/TranspositionGrid';
import {
  CandidateCards,
  CrackerWizardFrame,
  ShortTextWarning,
} from '@encryptors/shared/cracker';
import {
  bestPartnerOf,
  pairScoreMatrix,
  rankWidths,
  splitIntoColumns,
} from '../analysis/width';
import { HintConfig } from './hintSettings';

const StepText = styled(Minion)`
  display: block;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const InputChangedNote = styled(Minion)`
  display: block;
  color: ${({ theme }) => theme.ink.creamMuted};
`;

// Parchment reading box for the plaintext candidate.
const PlaintextRows = styled.div`
  ${paper('parchment')}
  font-family: ${({ theme }) => theme.type.mono};
  color: ${({ theme }) => theme.ink.primary};
  word-break: break-all;
  white-space: pre-wrap;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.paper};
  max-height: 220px;
  overflow-y: auto;
`;

// Pair-score badge between two adjacent strips: green enamel when the
// pair reads well, copper when it might, plain otherwise.
const Badge = styled.span<{ $score: number }>`
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 8px;
  background: ${({ $score, theme }) => ($score >= 55 ? theme.ink.green : $score >= 35 ? theme.metal.copper.base : 'transparent')};
  color: ${({ $score, theme }) => ($score >= 55 ? theme.ink.cream : $score >= 35 ? theme.ink.primary : theme.ink.creamMuted)};
  border: ${({ $score, theme }) => ($score >= 55 ? 'none' : `1px solid ${theme.paper.rule}`)};
`;

const StepBlock = styled.div`
  margin-top: 12px;
`;

const OrderBlock = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const OrderControls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const SelectedText = styled(Minion)`
  color: ${({ theme }) => theme.ink.cream};
`;

// The hint's best-partner note: readable brass on the leather.
const BestPartnerText = styled(Minion)`
  color: ${({ theme }) => theme.metal.brass.light};
`;

const BadgesRow = styled.div`
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-wrap: wrap;
`;

const OrderText = styled(Minion)`
  color: ${({ theme }) => theme.ink.cream};
  font-family: ${({ theme }) => theme.type.mono};
`;

interface CrackerWizardProps {
  input: string;
  hintConfig: HintConfig;
  // "Use this result": hands the recovered column order over.
  onUseKey: (order: number[]) => void;
  onSkip: () => void;
}

// Columnar cracker: three steps, one decision each. The user picks the
// width, then rebuilds the column order by dragging — the tool scores
// and highlights, it never reorders by itself.
const CrackerWizard: React.FC<CrackerWizardProps> = ({
  input,
  hintConfig,
  onUseKey,
  onSkip,
}) => {
  const { t } = useTranslation('common');
  const [step, setStep] = useState(1);
  const [width, setWidth] = useState<number | null>(null);
  const [order, setOrder] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [hasInputChanged, setHasInputChanged] = useState(false);

  const ciphertext = useMemo(
    () => input.toUpperCase().replace(/[^A-Z]/g, ''),
    [input],
  );

  const widths = useMemo(
    () => (ciphertext.length >= 8 ? rankWidths(ciphertext) : []),
    [ciphertext],
  );

  const previousInput = useRef(input);
  useEffect(() => {
    if (previousInput.current !== input) {
      previousInput.current = input;
      setWidth(null);
      setOrder([]);
      setSelected(null);
      setHasInputChanged(true);
      setStep(1);
    }
  }, [input]);

  const hints = hintConfig.hints;

  const columns = width !== null ? splitIntoColumns(ciphertext, width) : [];
  const matrix = useMemo(
    () => (columns.length > 1 ? pairScoreMatrix(columns) : []),
    [columns],
  );
  const plaintext = useMemo(
    () => (width !== null && order.length === width
      ? columnarDecrypt(ciphertext, order)
      : ''),
    [ciphertext, order, width],
  );

  const selectWidth = (candidate: { width: number }) => {
    setWidth(candidate.width);
    setOrder(Array.from({ length: candidate.width }, (_, index) => index));
    setSelected(null);
  };

  const resetOrder = () => {
    if (width !== null) {
      setOrder(Array.from({ length: width }, (_, index) => index));
    }
    setSelected(null);
  };

  // Pair-score badge between the strips at `position` and `position + 1`.
  const badgeScore = (position: number): number | null => {
    if (position + 1 >= order.length) {
      return null;
    }
    return matrix[order[position]]?.[order[position + 1]] ?? null;
  };

  // Easy hint: the source column that reads best after the selected one.
  const bestPartnerSource = (selected !== null && hints.bestPartner && order[selected] !== undefined)
    ? bestPartnerOf(matrix, order[selected])
    : null;

  const stepNames = [
    t('processing.columnar.cracker.wizard.steps.width'),
    t('processing.columnar.cracker.wizard.steps.order'),
    t('processing.columnar.cracker.wizard.steps.done'),
  ];

  // The grid shows the complete padded rectangle (pad cells visible, as
  // they will appear in the plaintext too).
  const gridLetters = useMemo(() => {
    if (width === null) {
      return '';
    }
    const padded = Array.from(
      { length: width * Math.ceil(ciphertext.length / width) },
      (_, index) => ciphertext[index] || 'X',
    ).join('');
    return padded;
  }, [ciphertext, width]);

  return (
    <CrackerWizardFrame
      steps={stepNames}
      step={step}
      onBack={() => setStep(step - 1)}
      onNext={() => setStep(step + 1)}
      canGoNext={step === 1 ? width !== null : true}
      useLabel={t('processing.cracker.wizard.useKey')}
      onUse={() => onUseKey(order)}
      useDisabled={width === null}
      onSkip={onSkip}
      message={(
        <>
          {hasInputChanged && (
            <InputChangedNote>
              {t('processing.cracker.wizard.inputChanged')}
            </InputChangedNote>
          )}
          {ciphertext.length > 0 && <ShortTextWarning letters={ciphertext} />}
        </>
      )}
    >
      {step === 1 && (
        <StepBlock>
          <StepText>
            {t('processing.columnar.cracker.wizard.width.hint')}
          </StepText>
          <CandidateCards
            items={widths.slice(0, 6).map((candidate) => ({
              id: String(candidate.width),
              label: t('processing.columnar.cracker.wizard.width.card', {
                width: candidate.width,
                rows: ciphertext.length / candidate.width,
              }),
              confidence: Math.max(0, Math.min(100, candidate.score)),
            }))}
            selectedId={width === null ? null : String(width)}
            onSelect={(id) => selectWidth(widths.find((entry) => String(entry.width) === id)!)}
            matchLabel={t('processing.cracker.candidate.matchScore')}
            dataGuide="width-cards"
          />
        </StepBlock>
      )}
      {step > 1 && width !== null && (
        <OrderBlock>
          <StepText>
            {step === 2
              ? t('processing.columnar.cracker.wizard.order.hint')
              : t('processing.columnar.cracker.wizard.done.hint')}
          </StepText>
          {step === 2 && (
            <OrderControls>
              <Button size="sm" variant="secondary" data-guide="order-reset" onClick={resetOrder}>
                {t('processing.columnar.cracker.wizard.order.reset')}
              </Button>
              {selected !== null && (
                <SelectedText>
                  {t('processing.columnar.cracker.wizard.order.selected', {
                    position: selected + 1,
                  })}
                </SelectedText>
              )}
            </OrderControls>
          )}
          <TranspositionGrid
            order={order}
            letters={gridLetters}
            padChar="X"
            highlight
            highlightSource={bestPartnerSource}
            onReorder={setOrder}
            dataGuide="transposition-grid"
          />
          {bestPartnerSource !== null && selected !== null && (
            <BestPartnerText>
              {t('processing.columnar.cracker.wizard.order.bestPartner', {
                position: order.indexOf(bestPartnerSource) + 1,
              })}
            </BestPartnerText>
          )}
          {hints.badges && (
            <BadgesRow>
              {Array.from({ length: order.length }, (_, position) => {
                const score = badgeScore(position);
                return score === null ? null : (
                  <Tooltip
                    key={position}
                    content={t('processing.columnar.cracker.wizard.order.badge', {
                      first: position + 1,
                      second: position + 2,
                    })}
                  >
                    <Badge $score={score} data-guide="pair-badge">
                      {position + 1}·{position + 2} {score}
                    </Badge>
                  </Tooltip>
                );
              })}
            </BadgesRow>
          )}
          {hints.livePreview && plaintext && (
            <PlaintextRows data-guide="plaintext-preview">{plaintext}</PlaintextRows>
          )}
          {step === 3 && (
            <OrderText>
              {t('processing.columnar.cracker.wizard.done.order', {
                order: order.map((source) => source + 1).join(' '),
              })}
            </OrderText>
          )}
        </OrderBlock>
      )}
    </CrackerWizardFrame>
  );
};

CrackerWizard.displayName = 'ColumnarCrackerWizard';

export default CrackerWizard;
