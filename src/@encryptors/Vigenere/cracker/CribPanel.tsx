import { useTranslation } from 'next-i18next';
import Tooltip from '@atoms/Tooltip';
import React, { useMemo, useState } from 'react';
import { Button, Heading, Pane, Text, TextInput } from 'evergreen-ui';
import styled from 'styled-components';

import { findCribMatches } from '@encryptors/shared/analysis';
import { useCrackerKey } from '@encryptors/shared/cracker';
import { useCracker } from './useCracker';

const MAX_SHOWN_MATCHES = 8;

const MatchRow = styled(Pane)`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: monospace;
  font-size: 12px;
`;

const ConflictText = styled(Text)`
  color: ${({ theme }) => theme.colorScheme.red[500]};
  font-size: 11px;
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
    <Pane width="100%" marginTop="12px" padding="12px" border="muted" borderRadius="4px">
      <Heading size={300}>{t(`${base}title`)}</Heading>
      <Pane display="flex" alignItems="center" gap="8px" marginTop="8px" data-guide="crib-input">
        <Tooltip content={t(`${tooltip}cribInput`)}>
        <Text size={300}>{t(`${base}inputLabel`)}</Text>
        <TextInput
          width="160px"
          value={crib}
          placeholder={t(`${base}inputPlaceholder`)}
            onChange={(event) => setCrib(event.target.value)}
          />
        </Tooltip>
      </Pane>

      {crib.trim() && matches.length === 0 && (
        <Text size={300} display="block" marginTop="8px">
          {t(`${base}noMatches`)}
        </Text>
      )}

      {matches.slice(0, MAX_SHOWN_MATCHES).map((match) => (
        <MatchRow key={match.position} marginTop="6px">
          <Text size={300} fontFamily="monospace">{`at ${match.position}: ${match.fragment}`}</Text>
          {match.conflicts.length > 0 && (
            <ConflictText>
              {`${match.conflicts.length} ${t(`${base}conflictsNote`)}`}
            </ConflictText>
          )}
          {match.isStrong && <Text size={300}>strong</Text>}
          <Tooltip content={t(`${tooltip}apply`)}>
            <Button onClick={() => apply(match)}>
              {t(`${base}apply`)}
            </Button>
          </Tooltip>
        </MatchRow>
      ))}
    </Pane>
  );
};

CribPanel.displayName = 'CribPanel';

export default CribPanel;
