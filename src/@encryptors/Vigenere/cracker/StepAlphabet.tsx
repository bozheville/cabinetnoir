import { useTranslation } from 'next-i18next';
import React from 'react';
import styled from 'styled-components';

import { Segmented, TextInput } from '@atoms';
import Tooltip from '@atoms/Tooltip';
import { GreatPrimer, Minion } from '@typography';
import { useCrackerKey } from '@encryptors/shared/cracker';
import { cleanAlphabet } from '../vigenere-encryption';
import { AlphabetMode, useCracker } from './useCracker';

const StepRoot = styled.div`
  width: 100%;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StepTitle = styled(GreatPrimer)`
  color: ${({ theme }) => theme.ink.cream};
`;

const StepHint = styled(Minion)`
  display: block;
  color: ${({ theme }) => theme.ink.creamMuted};
`;

// The verdict line: brass when the entered alphabet explains the
// columns, red when it does not.
const Verdict = styled(Minion)<{ $ok: boolean }>`
  display: block;
  color: ${({ $ok, theme }) => ($ok ? theme.metal.brass.light : theme.ink.red)};
`;

interface StepAlphabetProps {
  cracker: ReturnType<typeof useCracker>;
}

// Step 2: is the entered alphabet the one the sender used? Every
// column is fitted against English under its best shift; a mixed
// alphabet leaves the columns un-English whatever the shift, and the
// wizard proposes rebuilding the alphabet from the ciphertext instead.
const StepAlphabet: React.FC<StepAlphabetProps> = ({ cracker }) => {
  const {
    knownAlphabet,
    knownIsEnglish,
    onAlphabetChange,
    fit,
    fits,
    alphabetMode,
    chooseAlphabetMode,
  } = cracker;
  const { t } = useTranslation('common');
  const base = useCrackerKey('wizard.alphabet.');
  const tooltip = useCrackerKey('tooltips.');

  const verdict = !knownIsEnglish
    ? t(`${base}unsupported`)
    : fit === null
      ? t(`${base}noVerdict`)
      : fits
        ? t(`${base}fits`)
        : t(`${base}mixed`);

  return (
    <StepRoot>
      <StepTitle>{t(`${base}title`)}</StepTitle>
      <StepHint>{t(`${base}hint`)}</StepHint>

      {onAlphabetChange && (
        <Tooltip content={t(`${tooltip}alphabet`)}>
          <TextInput
            data-guide="alphabet"
            label={t(`${base}knownLabel`)}
            mono
            width="280px"
            value={knownAlphabet}
            onChange={(event) => onAlphabetChange(cleanAlphabet(event.target.value))}
          />
        </Tooltip>
      )}

      <Verdict data-guide="alphabet-verdict" $ok={knownIsEnglish && fits}>
        {verdict}
        {fit !== null && ` (${t(`${base}fitScore`, { score: fit.toFixed(2) })})`}
      </Verdict>

      <Tooltip content={t(`${tooltip}alphabetMode`)}>
        <div data-guide="alphabet-mode">
          <Segmented<AlphabetMode>
            size="sm"
            options={[
              { value: 'known', label: t(`${base}useKnown`), disabled: !knownIsEnglish },
              { value: 'recover', label: t(`${base}recover`) },
            ]}
            value={alphabetMode}
            onChange={chooseAlphabetMode}
          />
        </div>
      </Tooltip>
    </StepRoot>
  );
};

StepAlphabet.displayName = 'StepAlphabet';

export default StepAlphabet;
