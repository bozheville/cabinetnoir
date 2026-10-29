import React from 'react';
import { CrypterProps } from '../types';
import { useAlberti } from './useAlberti';
import styled from 'styled-components';
import RotationPicker from '@encryptors/Caesar/RotationPicker';
import Tooltip from '@atoms/Tooltip';
import { Cluster, IconButton, Paper, Stack } from '@atoms';
import { ControlGroup } from '@organisms/ControlPanel';
import { CipherText } from '@typography';
import { useRouter } from 'next/router';
import { getKeyHandoff } from '@learning/keyHandoff';
import { useEffect } from 'react';


const AlbertiSettings = styled.div<{size: number}>`
  display: grid;
  grid-template-columns: repeat(${({size}) => size}, calc(100%/${({size}) => size}) [col-start]);
  row-gap: 16px;

  ${({ theme }) => theme.breakpoints.small} {
    grid-template-columns: repeat(2, 50% [col-start]);
  }
`;

const DiscSheet = styled(Paper)`
  width: 100%;
  padding: 12px 8px;
`;

const PaneStack = styled(Stack)`
  width: 100%;
`;

const RotateKnob = styled(IconButton)`
  align-self: center;
`;

const Alberti: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const {
    t,
    staticDisc,
    dynamicDisc,
    iterationStep,
    period,
    rotateLeft,
    rotateRight,
    handlePeriodChange,
    handleIncrementChange,
    applyRecoveredKey,
  } = useAlberti({
    input,
    onProcessingEnd,
    isDecryptMode
  });

  const router = useRouter();

  // "Use this key" on the Cryptoanalysis tab: pick the recovered
  // step/period (and the disc alignment) up from the in-memory hand-off;
  // the URL carries only the usedKey flag.
  useEffect(() => {
    if (router.query.usedKey !== '1') {
      return;
    }
    const handoff = getKeyHandoff();
    if (handoff?.cipher !== 'alberti' || !handoff.keys[0]) {
      return;
    }
    const [step, discPeriod] = handoff.keys[0].split('/').map((value) => parseInt(value, 10));
    applyRecoveredKey({ step, period: discPeriod, dynamicDisc: handoff.keys[1] || undefined });
  }, [router.query.usedKey]);

  return (
    <PaneStack {...paneProps}>
      <Cluster justify="center" gap={4}>
        <Tooltip content={t('learning.tooltips.alberti.disc')}>
          <DiscSheet data-guide="disc">
            <AlbertiSettings size={staticDisc.length + 2}>
              <span />
              {staticDisc.split('').map((char) => (
                <CipherText key={`static-${char}`}>{char}</CipherText>
              ))}
              <span />
            </AlbertiSettings>
            <AlbertiSettings size={staticDisc.length + 2}>
              <RotateKnob data-guide="rotate-left" label="Rotate left" onClick={rotateLeft}>
                ◀
              </RotateKnob>
              {dynamicDisc.split('').map((char) => (
                <CipherText key={`dynamic-${char}`}>{char}</CipherText>
              ))}
              <RotateKnob data-guide="rotate-right" label="Rotate right" onClick={rotateRight}>
                ▶
              </RotateKnob>
            </AlbertiSettings>
          </DiscSheet>
        </Tooltip>
      </Cluster>
      <Cluster justify="center" gap={4}>
        <ControlGroup>
          <Tooltip content={t('learning.tooltips.alberti.increment')}>
            <RotationPicker
              dataGuide="increment"
              label={t('processing.alberti.settings.increment_label')}
              value={iterationStep}
              onChange={handleIncrementChange}
            />
          </Tooltip>
        </ControlGroup>
        <ControlGroup>
          <Tooltip content={t('learning.tooltips.alberti.period')}>
            <RotationPicker
              dataGuide="period"
              label={t('processing.alberti.settings.period_label')}
              value={period}
              onChange={handlePeriodChange}
            />
          </Tooltip>
        </ControlGroup>
      </Cluster>
    </PaneStack>
  );
};

Alberti.displayName = 'Alberti';

export default Alberti;
