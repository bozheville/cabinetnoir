import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { CrypterProps } from '../types';
import Tooltip from '@atoms/Tooltip';
import { Cluster, Paper, Stack, TextInput, Toggle } from '@atoms';
import { ControlGroup } from '@organisms/ControlPanel';
import { CipherText, Minion } from '@typography';
import { usePendingExample } from '@learning/pendingExample';
import { getKeyHandoff } from '@learning/keyHandoff';
import { useKeyword } from './useKeyword';

const PaneStack = styled(Stack)`
  width: 100%;
  padding: 0 16px 16px;
`;

// The plain/target alphabet strips: typewritten letters on a sheet of
// paper, the target strip shaded parchment.
const StripSheet = styled(Paper)`
  margin-top: 8px;
  padding: 8px 12px;
`;

const StripRow = styled.div`
  display: flex;
  justify-content: center;
`;

const StripCell = styled(CipherText)`
  width: 20px;
  text-align: center;
`;

const TargetStrip = styled(StripRow)`
  background: ${({ theme }) => theme.paper.parchment};
  border: 1px solid ${({ theme }) => theme.paper.rule};
  border-radius: ${({ theme }) => theme.radius.paper};
  margin-top: 4px;
`;

const AlphabetError = styled(Minion)`
  color: ${({ theme }) => theme.ink.red};
`;

const AlphabetHint = styled(Minion)`
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const stripCells = (letters: string) => letters.split('').map((letter, index) => (
  <StripCell key={index}>{letter || '·'}</StripCell>
));

// The Keyword tool: encrypt/decrypt with a keyword-built (or free)
// alphabet. The cracker lives on its own Cryptoanalysis tab
// (/encoder/keyword/cryptoanalysis) and hands its recovered alphabet
// over via the in-memory key hand-off.
const Keyword: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const {
    keyword,
    continueFromLast,
    freeAlphabetMode,
    freeAlphabet,
    freeAlphabetError,
    keepCase,
    keepSpaces,
    plainAlphabet,
    targetAlphabet,
    handleKeywordChange,
    setKeywordValue,
    handleContinueFromLastChange,
    handleFreeAlphabetModeChange,
    handleFreeAlphabetChange,
    handleKeepSpacesChange,
    handleKeepCaseChange,
    applyRecoveredAlphabet,
  } = useKeyword({ input, onProcessingEnd, isDecryptMode });

  // "Try it in the tool": the example's key is the keyword. The context
  // is only non-null when the example targets this cipher; the message
  // itself is pre-filled by EncryptionInputs.
  const pendingExample = usePendingExample();
  const appliedExample = useRef(false);
  useEffect(() => {
    if (!pendingExample || appliedExample.current) {
      return;
    }
    appliedExample.current = true;
    if (pendingExample.key) {
      setKeywordValue(pendingExample.key);
    }
  }, [pendingExample]);

  // "Use this result" on the Cryptoanalysis tab: pick the recovered
  // 26-letter alphabet up from the in-memory hand-off (the URL carries
  // only the usedKey flag) and switch to free-alphabet mode — a recovered
  // alphabet need not be keyword-derivable.
  useEffect(() => {
    if (router.query.usedKey !== '1') {
      return;
    }
    const handoff = getKeyHandoff();
    if (handoff?.cipher === 'keyword' && handoff.keys[0]) {
      applyRecoveredAlphabet(handoff.keys[0]);
    }
  }, [router.query.usedKey]);

  return (
    <PaneStack {...paneProps}>
      <Cluster justify="center" gap={4} wrap>
        {!freeAlphabetMode && (
          <ControlGroup>
            <Tooltip content={t('learning.tooltips.keyword.keyword')}>
              <TextInput
                data-guide="keyword-input"
                mono
                width="180px"
                placeholder={t('processing.keyword.settings.keyword_placeholder')}
                value={keyword}
                onChange={handleKeywordChange}
              />
            </Tooltip>
          </ControlGroup>
        )}
        {freeAlphabetMode && (
          <ControlGroup>
            <Tooltip content={t('learning.tooltips.keyword.freeAlphabet')}>
              <TextInput
                data-guide="free-alphabet-input"
                mono
                width="380px"
                maxLength={30}
                placeholder={t('processing.keyword.settings.freeAlphabet_placeholder')}
                value={freeAlphabet}
                onChange={handleFreeAlphabetChange}
              />
            </Tooltip>
          </ControlGroup>
        )}
        <ControlGroup>
          <Toggle
            data-guide="free-alphabet-toggle"
            label={t('processing.keyword.settings.free_alphabet')}
            checked={freeAlphabetMode}
            onChange={handleFreeAlphabetModeChange}
          />
        </ControlGroup>
        {!freeAlphabetMode && (
          <ControlGroup>
            <Tooltip content={t('learning.tooltips.keyword.continueFromLast')}>
              <Toggle
                data-guide="continuation-toggle"
                label={t('processing.keyword.settings.continue_from_last')}
                checked={continueFromLast}
                onChange={handleContinueFromLastChange}
              />
            </Tooltip>
          </ControlGroup>
        )}
        {!isDecryptMode && (
          <>
            <ControlGroup>
              <Tooltip content={t('learning.tooltips.keyword.keepSpaces')}>
                <Toggle
                  data-guide="keep-spaces"
                  label={t('processing.keyword.settings.keep_spaces')}
                  checked={keepSpaces}
                  onChange={handleKeepSpacesChange}
                />
              </Tooltip>
            </ControlGroup>
            <ControlGroup>
              <Tooltip content={t('learning.tooltips.keyword.keepCase')}>
                <Toggle
                  data-guide="keep-case"
                  label={t('processing.keyword.settings.keep_case')}
                  checked={keepCase}
                  onChange={handleKeepCaseChange}
                />
              </Tooltip>
            </ControlGroup>
          </>
        )}
      </Cluster>
      {freeAlphabetMode && freeAlphabetError && (
        <AlphabetError data-guide="free-alphabet-error">
          {t(`processing.keyword.settings.freeAlphabetError.${freeAlphabetError}`)}
        </AlphabetError>
      )}
      <StripSheet data-guide="alphabet-strip">
        <StripRow>{stripCells(plainAlphabet)}</StripRow>
        <TargetStrip>{stripCells(targetAlphabet)}</TargetStrip>
      </StripSheet>
      <AlphabetHint>
        {t('processing.keyword.settings.alphabetHint')}
      </AlphabetHint>
    </PaneStack>
  );
};

Keyword.displayName = 'Keyword';

export default Keyword;
