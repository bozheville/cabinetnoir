import { useTranslation } from 'next-i18next';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { Button } from '@atoms';
import Tooltip from '@atoms/Tooltip';
import { GreatPrimer, Minion } from '@typography';
import { paper } from '@theme/mixins';
import {
  RING_SIZE,
  RingAction,
  columnFrequencies,
  columnLetters,
  mergedIC,
  suggestPartners,
} from '@encryptors/shared/analysis';
import { HIGHLIGHT_COLORS, useCrackerKey } from '@encryptors/shared/cracker';
import { useCracker } from './useCracker';

// Random letters ~0.038, English ~0.066: the merged-IC meter's scale.
const IC_RANDOM = 0.038;
const IC_ENGLISH = 0.066;

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

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
`;

const RowLabel = styled(Minion)`
  color: ${({ theme }) => theme.ink.cream};
  min-width: 80px;
`;

const ColumnTab = styled.button<{ $selected: boolean; $color: string }>`
  cursor: pointer;
  min-width: 30px;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: ${({ theme }) => theme.type.mono};
  color: ${({ theme }) => theme.ink.cream};
  background: ${({ $color, $selected }) => ($selected ? `${$color}33` : 'transparent')};
  border: ${({ $selected }) => ($selected ? '2px' : '1px')} solid
    ${({ $color, $selected }) => ($selected ? $color : `${$color}66`)};
`;

// The two columns side by side on parchment: letters most frequent
// first, each a clickable bar.
const Board = styled.div`
  ${paper('parchment')}
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.paper};
  color: ${({ theme }) => theme.ink.primary};
`;

const ColumnHead = styled(Minion)`
  display: block;
  margin-bottom: 4px;
  font-weight: 700;
`;

const LetterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 260px;
  overflow-y: auto;
`;

const LetterBar = styled.button<{ $selected: boolean; $hinted: boolean; $linked: boolean; $color: string }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  height: 20px;
  padding: 0 6px;
  border-radius: 2px;
  cursor: pointer;
  font-family: ${({ theme }) => theme.type.mono};
  font-size: 12px;
  text-align: left;
  color: ${({ theme }) => theme.ink.primary};
  background: transparent;
  border: 1px solid ${({ $selected, $hinted, theme }) => ($selected
    ? theme.metal.copper.dark
    : $hinted ? theme.metal.brass.dark : 'transparent')};
  opacity: ${({ $linked }) => ($linked ? 0.45 : 1)};
  box-shadow: ${({ $hinted, theme }) => ($hinted ? `0 0 6px 1px ${theme.metal.copper.base}55` : 'none')};
`;

const BarFill = styled.span<{ $color: string }>`
  position: absolute;
  left: 0;
  top: 2px;
  bottom: 2px;
  border-radius: 2px;
  background: ${({ $color }) => `${$color}55`};
  pointer-events: none;
`;

const BarText = styled.span`
  position: relative;
`;

// The ring: 26 slots in a row, filled as the links chain up.
const RingRow = styled.div`
  display: grid;
  grid-template-columns: repeat(26, minmax(18px, 1fr));
  gap: 2px;
`;

const Slot = styled.button<{ $filled: boolean; $target: boolean }>`
  height: 28px;
  padding: 0;
  border-radius: 3px;
  font-family: ${({ theme }) => theme.type.mono};
  font-weight: 700;
  font-size: 13px;
  color: ${({ theme }) => theme.ink.primary};
  background: ${({ $filled, theme }) => ($filled ? theme.paper.ivory : theme.paper.parchment)};
  border: 1px solid ${({ $target, theme }) => ($target ? theme.metal.copper.dark : theme.paper.rule)};
  cursor: ${({ $target }) => ($target ? 'pointer' : 'default')};
`;

const SlotIndex = styled.span`
  display: block;
  text-align: center;
  font-size: 8px;
  font-family: ${({ theme }) => theme.type.mono};
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const LooseLetter = styled.button<{ $selected: boolean }>`
  width: 24px;
  height: 24px;
  padding: 0;
  border-radius: 3px;
  cursor: pointer;
  font-family: ${({ theme }) => theme.type.mono};
  font-weight: 700;
  color: ${({ theme }) => theme.ink.primary};
  background: ${({ theme }) => theme.paper.ivory};
  border: ${({ $selected }) => ($selected ? '2px' : '1px')} solid
    ${({ $selected, theme }) => ($selected ? theme.metal.copper.dark : theme.paper.rule)};
`;

const ActionList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const ActionChip = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: ${({ theme }) => theme.type.mono};
  font-size: 11px;
  color: ${({ $status, theme }) => ($status === 'conflict'
    ? theme.ink.red
    : $status === 'pending' ? theme.ink.creamMuted : theme.metal.brass.light)};
  border: 1px solid ${({ $status, theme }) => ($status === 'conflict' ? theme.ink.red : theme.paper.rule)};
`;

const RemoveButton = styled.button`
  padding: 0 2px;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
`;

const Meter = styled.div`
  position: relative;
  width: 200px;
  height: 8px;
  border-radius: 4px;
  background: ${({ theme }) => theme.paper.parchment};
`;

const MeterFill = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  border-radius: 4px;
  background: linear-gradient(90deg, ${({ theme }) => theme.metal.brass.dark}, ${({ theme }) => theme.metal.brass.light});
`;

const Note = styled(Minion)`
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const ConflictNote = styled(Minion)`
  color: ${({ theme }) => theme.ink.red};
`;

const Result = styled(Minion)`
  color: ${({ theme }) => theme.metal.brass.light};
  font-family: ${({ theme }) => theme.type.mono};
  font-size: 14px;
  font-weight: 700;
`;

const colorOf = (column: number): string => HIGHLIGHT_COLORS[column % HIGHLIGHT_COLORS.length];

const describe = (action: RingAction): string => (action.kind === 'link'
  ? `${action.from}${action.fromColumn + 1} = ${action.to}${action.toColumn + 1}`
  : `${action.letter} → ${action.slot}`);

interface StepAlphabetRecoveryProps {
  cracker: ReturnType<typeof useCracker>;
}

// The alphabet-recovery board. Pick two columns; whenever a cipher
// letter of the first column and one of the second stand for the same
// plaintext letter, link them. Every link fixes two letters' distance
// on the alphabet ring; the solver chains the links, the user decides
// every one of them.
const StepAlphabetRecovery: React.FC<StepAlphabetRecoveryProps> = ({ cracker }) => {
  const {
    analysis,
    keyLength,
    ringActions,
    ringState,
    straightened,
    recoveredAlphabet,
    addRingAction,
    removeRingAction,
    undoRing,
    redoRing,
    clearRing,
    canUndoRing,
    canRedoRing,
    hintConfig,
  } = cracker;
  const { t } = useTranslation('common');
  const base = useCrackerKey('wizard.recovery.');
  const tooltip = useCrackerKey('tooltips.');
  const { hints } = hintConfig;

  const [fromColumn, setFromColumn] = useState(0);
  const [toColumn, setToColumn] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [loose, setLoose] = useState<string | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [fromColumn, toColumn]);

  const letters = analysis?.normalized.letters ?? '';
  const length = keyLength ?? 0;

  const fromLetters = useMemo(() => columnLetters(letters, length, fromColumn), [letters, length, fromColumn]);
  const toLetters = useMemo(() => columnLetters(letters, length, toColumn), [letters, length, toColumn]);
  const fromCounts = useMemo(() => columnFrequencies(fromLetters), [fromLetters]);
  const toCounts = useMemo(() => columnFrequencies(toLetters), [toLetters]);
  const maxCount = Math.max(1, ...fromCounts.map(({ count }) => count), ...toCounts.map(({ count }) => count));

  // Letters already linked between this pair, per side.
  const linkedFrom = new Set<string>();
  const linkedTo = new Set<string>();
  ringActions.forEach((action) => {
    if (action.kind !== 'link') {
      return;
    }
    if (action.fromColumn === fromColumn && action.toColumn === toColumn) {
      linkedFrom.add(action.from);
      linkedTo.add(action.to);
    }
    if (action.fromColumn === toColumn && action.toColumn === fromColumn) {
      linkedFrom.add(action.to);
      linkedTo.add(action.from);
    }
  });

  // Partner hints: the frequency rank match, plus the ring's own
  // prediction once both columns and the letter are on it.
  const hinted = useMemo(() => {
    const result = new Set<string>();
    if (!selected || !hints.partnerHints) {
      return result;
    }
    suggestPartners(fromLetters, toLetters, selected).forEach((letter) => result.add(letter));
    return result;
  }, [selected, hints.partnerHints, fromLetters, toLetters]);

  const predicted = useMemo(() => {
    if (!selected || !hints.partnerHints) {
      return null;
    }
    const position = ringState.positions[selected];
    const offsetFrom = ringState.offsets[fromColumn];
    const offsetTo = ringState.offsets[toColumn];
    if (position === undefined || offsetFrom === undefined || offsetTo === undefined) {
      return null;
    }
    const slot = (((position + offsetTo - offsetFrom) % RING_SIZE) + RING_SIZE) % RING_SIZE;
    return ringState.slots[slot];
  }, [selected, hints.partnerHints, ringState, fromColumn, toColumn]);

  const meter = useMemo(
    () => (hints.mergedIC ? mergedIC(letters, length, ringState) : null),
    [hints.mergedIC, letters, length, ringState],
  );

  if (!analysis || keyLength === null) {
    return null;
  }

  const link = (to: string) => {
    if (!selected) {
      return;
    }
    addRingAction({ kind: 'link', fromColumn, from: selected, toColumn, to });
    setSelected(null);
  };

  const anchored = Object.keys(ringState.positions).length > 0;
  const looseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter((letter) => !(letter in ringState.positions));
  const conflicts = ringState.statuses.filter((status) => status === 'conflict').length;
  const placed = RING_SIZE - looseLetters.length;

  const columnTabs = (value: number, onChange: (column: number) => void, other: number) => (
    Array.from({ length: keyLength }, (_, column) => (
      <ColumnTab
        key={column}
        type="button"
        $selected={column === value}
        $color={colorOf(column)}
        disabled={column === other}
        onClick={() => onChange(column)}
      >
        {column + 1}
      </ColumnTab>
    ))
  );

  return (
    <StepRoot>
      <StepTitle>{t(`${base}title`)}</StepTitle>
      <StepHint>{t(`${base}hint`)}</StepHint>

      <Tooltip content={t(`${tooltip}columnPair`)}>
        <div data-guide="column-pair">
          <Row>
            <RowLabel>{t(`${base}firstColumn`)}</RowLabel>
            {columnTabs(fromColumn, setFromColumn, toColumn)}
          </Row>
          <Row style={{ marginTop: 4 }}>
            <RowLabel>{t(`${base}secondColumn`)}</RowLabel>
            {columnTabs(toColumn, setToColumn, fromColumn)}
          </Row>
        </div>
      </Tooltip>

      <Tooltip content={t(`${tooltip}linkBoard`)}>
        <Board data-guide="link-board">
          <div>
            <ColumnHead>{t(`${base}columnHead`, { index: fromColumn + 1 })}</ColumnHead>
            <LetterList>
              {fromCounts.map(({ letter, count }) => (
                <LetterBar
                  key={letter}
                  type="button"
                  $selected={selected === letter}
                  $hinted={false}
                  $linked={linkedFrom.has(letter)}
                  $color={colorOf(fromColumn)}
                  onClick={() => setSelected(selected === letter ? null : letter)}
                >
                  <BarFill $color={colorOf(fromColumn)} style={{ width: `${(count / maxCount) * 100}%` }} />
                  <BarText>{`${letter}  ${count}`}</BarText>
                </LetterBar>
              ))}
            </LetterList>
          </div>
          <div>
            <ColumnHead>{t(`${base}columnHead`, { index: toColumn + 1 })}</ColumnHead>
            <LetterList>
              {toCounts.map(({ letter, count }) => (
                <LetterBar
                  key={letter}
                  type="button"
                  disabled={!selected}
                  $selected={predicted === letter}
                  $hinted={hinted.has(letter)}
                  $linked={linkedTo.has(letter)}
                  $color={colorOf(toColumn)}
                  onClick={() => link(letter)}
                >
                  <BarFill $color={colorOf(toColumn)} style={{ width: `${(count / maxCount) * 100}%` }} />
                  <BarText>{`${letter}  ${count}`}</BarText>
                </LetterBar>
              ))}
            </LetterList>
          </div>
        </Board>
      </Tooltip>
      <Note>
        {selected
          ? predicted
            ? t(`${base}predicted`, { letter: selected, partner: predicted })
            : t(`${base}pickPartner`, { letter: selected })
          : t(`${base}pickLetter`)}
      </Note>

      <Tooltip content={t(`${tooltip}ring`)}>
        <div data-guide="alphabet-ring">
          <Minion>{t(`${base}ringLabel`, { placed })}</Minion>
          <RingRow>
            {ringState.slots.map((letter, slot) => (
              <div key={slot}>
                <Slot
                  type="button"
                  $filled={!!letter}
                  $target={!letter && !!loose && anchored}
                  disabled={!!letter || !loose || !anchored}
                  onClick={() => {
                    if (loose) {
                      addRingAction({ kind: 'place', letter: loose, slot });
                      setLoose(null);
                    }
                  }}
                >
                  {letter ?? '·'}
                </Slot>
                <SlotIndex>{slot}</SlotIndex>
              </div>
            ))}
          </RingRow>
        </div>
      </Tooltip>

      {anchored && looseLetters.length > 0 && (
        <Tooltip content={t(`${tooltip}placeLetter`)}>
          <Row data-guide="loose-letters">
            <RowLabel>{t(`${base}looseLabel`)}</RowLabel>
            {looseLetters.map((letter) => (
              <LooseLetter
                key={letter}
                type="button"
                $selected={loose === letter}
                onClick={() => setLoose(loose === letter ? null : letter)}
              >
                {letter}
              </LooseLetter>
            ))}
          </Row>
        </Tooltip>
      )}

      {meter && (
        <Tooltip content={t(`${tooltip}mergedIC`)}>
          <Row data-guide="merged-ic">
            <RowLabel>{t(`${base}meterLabel`)}</RowLabel>
            <Meter>
              <MeterFill
                style={{
                  width: `${Math.max(0, Math.min(1, (meter.ic - IC_RANDOM) / (IC_ENGLISH - IC_RANDOM))) * 100}%`,
                }}
              />
            </Meter>
            <Note>{meter.ic.toFixed(3)}</Note>
          </Row>
        </Tooltip>
      )}

      {ringActions.length > 0 && (
        <ActionList data-guide="ring-actions">
          {ringActions.map((action, index) => (
            <ActionChip key={index} $status={ringState.statuses[index]}>
              {describe(action)}
              <RemoveButton
                type="button"
                aria-label={t(`${base}remove`)}
                onClick={() => removeRingAction(index)}
              >
                ×
              </RemoveButton>
            </ActionChip>
          ))}
        </ActionList>
      )}
      {conflicts > 0 && (
        <ConflictNote>{t(`${base}conflicts`, { count: conflicts })}</ConflictNote>
      )}

      <Row>
        <Tooltip content={t('processing.cracker.tooltips.undo')}>
          <Button size="sm" variant="secondary" disabled={!canUndoRing} onClick={undoRing}>
            {t('processing.cracker.assignment.undo')}
          </Button>
        </Tooltip>
        <Tooltip content={t('processing.cracker.tooltips.redo')}>
          <Button size="sm" variant="secondary" disabled={!canRedoRing} onClick={redoRing}>
            {t('processing.cracker.assignment.redo')}
          </Button>
        </Tooltip>
        <Button size="sm" variant="quiet" disabled={ringActions.length === 0} onClick={clearRing}>
          {t('processing.cracker.assignment.clearAll')}
        </Button>
      </Row>

      {recoveredAlphabet && (
        <div data-guide="recovered-alphabet">
          <Note>{t(`${base}recovered`)}</Note>
          <Result>{recoveredAlphabet}</Result>
          <Note>
            {straightened?.keyword
              ? t(`${base}keyword`, { keyword: straightened.keyword })
              : straightened
                ? t(`${base}standard`)
                : t(`${base}unstraightened`)}
          </Note>
        </div>
      )}
    </StepRoot>
  );
};

StepAlphabetRecovery.displayName = 'StepAlphabetRecovery';

export default StepAlphabetRecovery;
