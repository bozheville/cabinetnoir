import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';

import { CrypterProps } from '../types';
import { useVic } from './useVic';
import KeyWorksheet from './KeyWorksheet';
import { CheckerboardGrid } from '@encryptors/shared/checkerboard';
import { Cluster, IconButton, Paper, Select, Stack, TextInput, Toggle } from '@atoms';
import Tooltip from '@atoms/Tooltip';
import { ControlGroup } from '@organisms/ControlPanel';
import { Minion } from '@typography';
import { engraved } from '@theme/mixins';
import { Lozenge } from '@ornaments';
import { usePendingExample } from '@learning/pendingExample';
import { getKeyHandoff } from '@learning/keyHandoff';

const PaneStack = styled(Stack)`
  width: 100%;
  padding: 0 16px 16px;
`;

// Engraved brass label on the leather control panel.
const PaneLabel = styled.span`
  ${engraved('leather')}
  font-size: 11px;
`;

const SecretError = styled(Minion)`
  color: ${({ theme }) => theme.ink.red};
  text-align: center;
`;

const WorkingsSheet = styled(Paper)`
  margin-top: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-x: auto;
`;

const WorkingsTitle = styled(Minion)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.ink.secondary};
`;

const WorkingsNote = styled(Minion)`
  color: ${({ theme }) => theme.ink.creamMuted};
`;

// The VIC tool: the four secrets, the board alphabet, the bisection
// toggle with its agreed cut — and the workings panel that unfolds the
// whole key schedule, worksheet line by worksheet line. There is no
// cracker: the cipher stays unbroken in the app exactly as it stayed
// unbroken in 1953 (see the Breaking-it tab).
const Vic: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const {
    phrase,
    setPhrase,
    date,
    setDate,
    personalNumber,
    setPersonalNumber,
    keygroup,
    setKeygroup,
    alphabet,
    setAlphabet,
    bisect,
    setBisect,
    cutIndex,
    setCutIndex,
    showWorkings,
    setShowWorkings,
    error,
    keys,
    applyHandoffKey,
    rollKeygroup,
  } = useVic({ input, onProcessingEnd, isDecryptMode });

  // "Try it in the tool": the example carries all four secrets in one
  // hand-off string, "PHRASE||DATE||PN||KEYGROUP" (the phrase may
  // contain spaces).
  const pendingExample = usePendingExample();
  const appliedExample = useRef(false);
  useEffect(() => {
    if (!pendingExample || appliedExample.current) {
      return;
    }
    appliedExample.current = true;
    if (pendingExample.key !== undefined) {
      applyHandoffKey(pendingExample.key);
    }
  }, [pendingExample]);

  // "Use this result" — VIC has no cracker, but the identification
  // tool's "try breaking it" opens the decrypt tool directly.
  useEffect(() => {
    if (router.query.usedKey !== '1') {
      return;
    }
    const handoff = getKeyHandoff();
    if (handoff?.cipher === 'vic' && handoff.keys[0]) {
      applyHandoffKey(handoff.keys[0]);
    }
  }, [router.query.usedKey]);

  return (
    <PaneStack {...paneProps}>
      <Cluster justify="center" gap={4} wrap>
        <ControlGroup>
          <Tooltip content={t('learning.tooltips.vic.phrase')}>
            <TextInput
              data-guide="phrase-input"
              label={t('processing.vic.phraseLabel')}
              width="230px"
              value={phrase}
              onChange={(event) => setPhrase(event.target.value)}
            />
          </Tooltip>
        </ControlGroup>
        <ControlGroup>
          <Tooltip content={t('learning.tooltips.vic.date')}>
            <TextInput
              data-guide="date-input"
              label={t('processing.vic.dateLabel')}
              mono
              width="100px"
              placeholder="13/9/1959"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </Tooltip>
        </ControlGroup>
        <ControlGroup>
          <Tooltip content={t('learning.tooltips.vic.personalNumber')}>
            <TextInput
              data-guide="personal-number-input"
              label={t('processing.vic.personalNumberLabel')}
              mono
              width="60px"
              placeholder="13"
              value={personalNumber}
              onChange={(event) => setPersonalNumber(event.target.value)}
            />
          </Tooltip>
        </ControlGroup>
        <ControlGroup>
          <Tooltip content={t(isDecryptMode
            ? 'learning.tooltips.vic.keygroupExtracted'
            : 'learning.tooltips.vic.keygroup')}
          >
            <TextInput
              data-guide="keygroup-input"
              label={t('processing.vic.keygroupLabel')}
              mono
              width="110px"
              placeholder="72401"
              value={isDecryptMode ? (keys?.A ?? '') : keygroup}
              disabled={isDecryptMode}
              onChange={(event) => setKeygroup(event.target.value)}
            />
          </Tooltip>
          {!isDecryptMode && (
            <Tooltip content={t('learning.tooltips.vic.keygroup')}>
              <IconButton
                data-guide="keygroup-dice"
                label={t('processing.vic.rollKeygroup')}
                size="sm"
                onClick={rollKeygroup}
              >
                <Lozenge size={10} />
              </IconButton>
            </Tooltip>
          )}
        </ControlGroup>
        <ControlGroup>
          <PaneLabel data-guide="alphabet">{t('processing.vic.alphabetLabel')}</PaneLabel>
          <Tooltip content={t('learning.tooltips.vic.alphabet')}>
            <Select
              data-guide="alphabet-selector"
              width="130px"
              value={alphabet}
              onChange={(event) => setAlphabet(event.target.value as typeof alphabet)}
              options={[
                { value: 'latin', label: t('processing.vic.alphabets.latin') },
                { value: 'cyrillic', label: t('processing.vic.alphabets.cyrillic') },
              ]}
            />
          </Tooltip>
        </ControlGroup>
        <ControlGroup>
          <Tooltip content={t('learning.tooltips.vic.bisect')}>
            <Toggle
              data-guide="bisect-toggle"
              label={t('processing.vic.settings.bisect')}
              checked={bisect}
              onChange={(event) => setBisect(event.target.checked)}
            />
          </Tooltip>
        </ControlGroup>
        {bisect && (
          <ControlGroup>
            <Tooltip content={t('learning.tooltips.vic.cutIndex')}>
              <TextInput
                data-guide="cut-index"
                label={t('processing.vic.settings.cutIndex')}
                mono
                width="60px"
                value={cutIndex}
                onChange={(event) => setCutIndex(event.target.value)}
              />
            </Tooltip>
          </ControlGroup>
        )}
        <ControlGroup>
          <Tooltip content={t('learning.tooltips.vic.workings')}>
            <Toggle
              data-guide="workings-toggle"
              label={t('processing.vic.settings.workings')}
              checked={showWorkings}
              onChange={(event) => setShowWorkings(event.target.checked)}
            />
          </Tooltip>
        </ControlGroup>
      </Cluster>
      {error && (
        <SecretError data-guide="vic-error">
          {t(`processing.vic.errors.${error}`)}
        </SecretError>
      )}
      {showWorkings && keys && (
        <WorkingsSheet data-guide="vic-workings">
          <WorkingsTitle>
            <Lozenge size={8} />
            {t('processing.vic.workings.title')}
          </WorkingsTitle>
          <KeyWorksheet worksheet={keys} />
          <CheckerboardGrid board={keys.board} cellSize={24} />
          <WorkingsNote>
            {t('processing.vic.workings.summary', {
              a: keys.a, b: keys.b, insertAt: keys.insertAt, pad: keys.padLength,
            })}
          </WorkingsNote>
        </WorkingsSheet>
      )}
    </PaneStack>
  );
};

Vic.displayName = 'Vic';

export default Vic;
