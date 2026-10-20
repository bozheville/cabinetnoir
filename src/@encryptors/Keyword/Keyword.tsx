import React, { useEffect, useRef } from 'react';
import { Checkbox, Heading, Pane, TextInput, Text } from 'evergreen-ui';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { CrypterProps } from '../types';
import Tooltip from '@atoms/Tooltip';
import { usePendingExample } from '@learning/pendingExample';
import { getKeyHandoff } from '@learning/keyHandoff';
import { useKeyword } from './useKeyword';

const StripRow = styled(Pane)`
  display: flex;
  justify-content: center;
  font-family: monospace;
  font-size: 14px;
  line-height: 20px;
`;

const StripCell = styled(Pane)`
  width: 20px;
  text-align: center;
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
    <Pane
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="100%"
      paddingX="16px"
      paddingBottom="16px"
      {...paneProps}
    >
      <Pane
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        {!freeAlphabetMode && (
          <Tooltip content={t('learning.tooltips.keyword.keyword')}>
            <TextInput
              data-guide="keyword-input"
              width="180px"
              marginRight="8px"
              placeholder={t('processing.keyword.settings.keyword_placeholder')}
              value={keyword}
              onChange={handleKeywordChange}
            />
          </Tooltip>
        )}
        {freeAlphabetMode && (
          <Tooltip content={t('learning.tooltips.keyword.freeAlphabet')}>
            <TextInput
              data-guide="free-alphabet-input"
              width="380px"
              marginRight="8px"
              maxLength={30}
              placeholder={t('processing.keyword.settings.freeAlphabet_placeholder')}
              value={freeAlphabet}
              onChange={handleFreeAlphabetChange}
            />
          </Tooltip>
        )}
        <Checkbox
          data-guide="free-alphabet-toggle"
          marginLeft="6px"
          label={t('processing.keyword.settings.free_alphabet')}
          checked={freeAlphabetMode}
          onChange={handleFreeAlphabetModeChange}
        />
        {!freeAlphabetMode && (
          <Tooltip content={t('learning.tooltips.keyword.continueFromLast')}>
            <Checkbox
              data-guide="continuation-toggle"
              marginLeft="6px"
              label={t('processing.keyword.settings.continue_from_last')}
              checked={continueFromLast}
              onChange={handleContinueFromLastChange}
            />
          </Tooltip>
        )}
        {!isDecryptMode && (
          <>
            <Tooltip content={t('learning.tooltips.keyword.keepSpaces')}>
              <Checkbox
                data-guide="keep-spaces"
                marginLeft="6px"
                label={t('processing.keyword.settings.keep_spaces')}
                checked={keepSpaces}
                onChange={handleKeepSpacesChange}
              />
            </Tooltip>
            <Tooltip content={t('learning.tooltips.keyword.keepCase')}>
              <Checkbox
                data-guide="keep-case"
                marginLeft="6px"
                label={t('processing.keyword.settings.keep_case')}
                checked={keepCase}
                onChange={handleKeepCaseChange}
              />
            </Tooltip>
          </>
        )}
      </Pane>
      {freeAlphabetMode && freeAlphabetError && (
        <Text size={300} color="red500" data-guide="free-alphabet-error">
          {t(`processing.keyword.settings.freeAlphabetError.${freeAlphabetError}`)}
        </Text>
      )}
      <Pane
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginTop="8px"
        data-guide="alphabet-strip"
      >
        <StripRow>{stripCells(plainAlphabet)}</StripRow>
        <StripRow background="tint2" borderRadius={4}>{stripCells(targetAlphabet)}</StripRow>
      </Pane>
      <Heading size={100} marginTop={8} opacity={0.7}>
        {t('processing.keyword.settings.alphabetHint')}
      </Heading>
    </Pane>
  );
};

Keyword.displayName = 'Keyword';

export default Keyword;
