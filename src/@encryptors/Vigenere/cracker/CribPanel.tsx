import { useTranslation } from 'next-i18next';
import Tooltip from '@atoms/Tooltip';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';

import { Button, TextInput } from '@atoms';
import { GreatPrimer, Minion } from '@typography';
import { findCribMatches } from '@encryptors/shared/analysis';
import { useCrackerKey } from '@encryptors/shared/cracker';
import { useCracker } from './useCracker';

const MAX_SHOWN_MATCHES = 8;

const Panel = styled.div`
  width: 100%;
  margin-top: 12px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.paper.rule};
  border-radius: 4px;
`;

const PanelTitle = styled(GreatPrimer)`
  color: ${({ theme }) => theme.ink.cream};
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

const RowLabel = styled(Minion)`
  color: ${({ theme }) => theme.ink.cream};
`;

const MatchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.type.mono};
  color: ${({ theme }) => theme.ink.cream};
  font-size: 12px;
`;

const MatchText = styled(Minion)`
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const StrongNote = styled(Minion)`
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const ConflictText = styled(Minion)`
  color: ${({ theme }) => theme.ink.red};
  font-size: 11px;
`;

const NoMatchesNote = styled(Minion)`
  display: block;
  margin-top: 8px;
  color: ${({ theme }) => theme.ink.creamMuted};
`;

interface CribPanelProps {
  cracker: ReturnType<typeof useCracker>;
  alphabet: string;
}

const CribPanel: React.FC<CribPanelProps> = ({ cracker, alphabet }) => {
  const { analysis, keyLength, lockedLetters, setSliceLetter, transform } = cracker;
  const [crib, setCrib] = useState('');
  const { t } = useTranslation('common');
  const base = useCrackerKey('wizard.cribs.');
  const tooltip = useCrackerKey('tooltips.');


  const lockedSliceLetters = useMemo(
    () => Object.fromEntries(
      Object.entries(lockedLetters).map(([slice, locked]) => [slice, locked.letter]),
    ),
    [lockedLetters],
  );

  const matches = useMemo(() => {
    if (!analysis || keyLength === null || crib.trim().length === 0) {
      return [];
    }
    const found = findCribMatches(
      analysis.normalized.letters,
      crib,
      keyLength,
      lockedSliceLetters,
      alphabet,
      transform,
    );
    // Surface the most trustworthy suggestions first: no conflicts with
    // locked letters, then strong (repeating) fragments, then position.
    return [...found].sort((a, b) => (
      a.conflicts.length - b.conflicts.length
      || (b.isStrong ? 1 : 0) - (a.isStrong ? 1 : 0)
      || a.position - b.position
    ));
  }, [analysis, keyLength, crib, lockedSliceLetters, alphabet, transform]);

  const apply = (match: (typeof matches)[number]) => {
    for (const { slice, letter } of match.sliceLetters) {
      const locked = lockedLetters[slice];
      // Never overwrite a conflicting locked letter; the user decides.
      if (!locked || locked.letter === letter) {
        setSliceLetter(slice, letter, 'crib');
      }
    }
  };

  return (
    <Panel data-guide="crib-panel">
      <PanelTitle>{t(`${base}title`)}</PanelTitle>
      <InputRow data-guide="crib-input">
        <Tooltip content={t(`${tooltip}cribInput`)}>
        <RowLabel>{t(`${base}inputLabel`)}</RowLabel>
        <TextInput
          mono
          width="160px"
          value={crib}
          placeholder={t(`${base}inputPlaceholder`)}
          onChange={(event) => setCrib(event.target.value)}
        />
        </Tooltip>
      </InputRow>

      {crib.trim() && matches.length === 0 && (
        <NoMatchesNote>
          {t(`${base}noMatches`)}
        </NoMatchesNote>
      )}

      {matches.slice(0, MAX_SHOWN_MATCHES).map((match) => (
        <MatchRow key={match.position} style={{ marginTop: 6 }}>
          <MatchText>{`at ${match.position}: ${match.fragment}`}</MatchText>
          {match.conflicts.length > 0 && (
            <ConflictText>
              {`${match.conflicts.length} ${t(`${base}conflictsNote`)}`}
            </ConflictText>
          )}
          {match.isStrong && <StrongNote>strong</StrongNote>}
          <Tooltip content={t(`${tooltip}apply`)}>
            <Button size="sm" variant="secondary" onClick={() => apply(match)}>
              {t(`${base}apply`)}
            </Button>
          </Tooltip>
        </MatchRow>
      ))}
    </Panel>
  );
};

CribPanel.displayName = 'CribPanel';

export default CribPanel;
