import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { Button, Heading, Pane, Select, Text, TextInput } from 'evergreen-ui';
import styled from 'styled-components';

import Tooltip from '@atoms/Tooltip';
import { useCracker } from './useCracker';
import { ENGLISH_FREQUENCY_ORDER } from '../analysis/frequency';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');

const ChartArea = styled(Pane)`
  margin-top: 12px;
  padding: 12px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colorScheme.gray[100]};
`;

const BarsRow = styled(Pane)`
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 80px;
  flex-wrap: wrap;
`;

const BarSlot = styled(Pane)<{ $selected: boolean }>`
  width: 34px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
  border-radius: 2px;
  border: ${({ $selected, theme }) => ($selected ? `2px solid ${theme.colorScheme.blue[500]}` : 'none')};
`;

const Bar = styled.div<{ $fill: string }>`
  width: 100%;
  background: ${({ $fill }) => $fill};
  border-radius: 2px 2px 0 0;
`;

const SymbolRow = styled(Pane)`
  display: flex;
  gap: 3px;
  margin-top: 2px;
  flex-wrap: wrap;
`;

const SymbolCell = styled(Text)`
  width: 34px;
  text-align: center;
  font-size: 9px;
  font-family: monospace;
`;

const PreviewBox = styled(Pane)`
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colorScheme.gray[100]};
  font-family: monospace;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 140px;
  overflow-y: auto;
`;

const SquareGrid = styled(Pane)`
  display: inline-grid;
  gap: 2px;
  margin-top: 8px;
  font-family: monospace;
  font-size: 12px;
`;

const SquareCell = styled(Pane)`
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colorScheme.gray[300]};
  border-radius: 2px;
  background: ${({ theme }) => theme.colors.background};
`;

interface StepSquareProps {
  cracker: ReturnType<typeof useCracker>;
}

// Step 3: restore the square. The symbols are the "letters" of a plain
// substitution; assign letters by frequency, confirm with cribs, watch the
// preview become readable.
const StepSquare: React.FC<StepSquareProps> = ({ cracker }) => {
  const { t } = useTranslation('common');
  const {
    frequencies,
    mapping,
    setSymbolLetter,
    crib,
    setCrib,
    cribMatches,
    applyCribMatch,
    preview,
    assembledSquare,
    assembledTranspositionKey,
    hintConfig,
    variant,
  } = cracker;
  const hints = hintConfig.hints;
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  const maxCount = Math.max(1, ...frequencies.map((f) => f.count));

  // English frequency suggestion: rank order for unmapped symbols,
  // computed once so both chart rows agree.
  const usedLetters = new Set(Object.values(mapping));
  let suggestionRank = 0;
  const suggestionBySymbol: Record<string, string> = {};
  for (const { symbol } of frequencies) {
    if (mapping[symbol]) {
      suggestionBySymbol[symbol] = mapping[symbol];
      continue;
    }
    while (usedLetters.has(ENGLISH_FREQUENCY_ORDER[suggestionRank % ENGLISH_FREQUENCY_ORDER.length])) {
      suggestionRank += 1;
    }
    suggestionBySymbol[symbol] = ENGLISH_FREQUENCY_ORDER[suggestionRank % ENGLISH_FREQUENCY_ORDER.length];
    suggestionRank += 1;
  }

  const size = variant === 'adfgx' ? 5 : 6;

  return (
    <Pane width="100%">
      <Tooltip content={t('processing.adfgvx.cracker.tooltips.symbolChart')}>
        <ChartArea data-guide="symbol-chart">
          <BarsRow>
            {frequencies.map(({ symbol, count }) => {
              const suggestion = suggestionBySymbol[symbol];
              const mapped = Boolean(mapping[symbol]);
              return (
                <BarSlot
                  key={symbol}
                  $selected={selectedSymbol === symbol}
                  onClick={() => setSelectedSymbol(symbol)}
                >
                  <Bar
                    $fill={mapped ? '#30a46c' : '#a9a9a9cc'}
                    style={{ height: `${(count / maxCount) * 100}%` }}
                  />
                </BarSlot>
              );
            })}
          </BarsRow>
          <SymbolRow>
            {frequencies.map(({ symbol, count }) => {
              const suggestion = suggestionBySymbol[symbol];
              return (
                <SymbolCell key={symbol}>
                  {symbol}
                  {hints.englishReference ? <span style={{ color: '#0091ff' }}>{suggestion}</span> : ''}
                  <span style={{ opacity: 0.6 }}>{count}</span>
                </SymbolCell>
              );
            })}
          </SymbolRow>
        </ChartArea>
      </Tooltip>

      {selectedSymbol && (
        <Pane display="flex" alignItems="center" gap="8px" marginTop="8px">
          <Text size={300}>
            {t('processing.adfgvx.cracker.wizard.square.assign', { symbol: selectedSymbol })}
          </Text>
          <Tooltip content={t('processing.adfgvx.cracker.tooltips.assignLetter')}>
            <Select
              width="90px"
              value={mapping[selectedSymbol] ?? ''}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                setSymbolLetter(selectedSymbol, event.target.value)
              }
            >
              <option value="">—</option>
              {LETTERS.map((letter) => (
                <option key={letter} value={letter}>{letter}</option>
              ))}
            </Select>
          </Tooltip>
          <Tooltip content={t('processing.adfgvx.cracker.tooltips.assignLetter')}>
            <Button size="small" onClick={() => setSymbolLetter(selectedSymbol, '')}>
              {t('processing.adfgvx.cracker.wizard.square.clear')}
            </Button>
          </Tooltip>
        </Pane>
      )}

      {hints.cribs && (
        <Pane marginTop="12px" display="flex" flexDirection="column" gap="6px">
          <Pane display="flex" alignItems="center" gap="8px">
            <Text size={300}>{t('processing.adfgvx.cracker.wizard.square.cribLabel')}</Text>
            <Tooltip content={t('processing.adfgvx.cracker.tooltips.cribInput')}>
              <TextInput
                data-guide="crib-input"
                width="180px"
                value={crib}
                placeholder={t('processing.adfgvx.cracker.wizard.square.cribPlaceholder')}
                onChange={(event) => setCrib(event.target.value)}
              />
            </Tooltip>
          </Pane>
          {cribMatches.slice(0, 8).map((match) => (
            <Pane key={match.start} display="flex" alignItems="center" gap="8px">
              <Text size={300} fontFamily="monospace">
                {t('processing.adfgvx.cracker.wizard.square.cribAt', { position: match.start })}
              </Text>
              <Button size="small" onClick={() => applyCribMatch(match.start)}>
                {t('processing.adfgvx.cracker.wizard.square.cribApply')}
              </Button>
            </Pane>
          ))}
        </Pane>
      )}

      <Heading size={300} marginTop="12px">
        {t('processing.cracker.wizard.previewTitle')}
      </Heading>
      <PreviewBox>{preview || '·'}</PreviewBox>

      <Heading size={300} marginTop="12px">
        {t('processing.adfgvx.cracker.wizard.square.yourKeys')}
      </Heading>
      <Pane display="flex" gap="16px" marginTop="8px" alignItems="flex-start" flexWrap="wrap">
        <Pane>
          <Text size={300} display="block">{t('processing.adfgvx.cracker.wizard.square.squareKey')}</Text>
          <SquareGrid gridTemplateColumns={`repeat(${size}, 26px)`}>
            {assembledSquare.split('').map((cell, index) => (
              <SquareCell key={index}>{cell}</SquareCell>
            ))}
          </SquareGrid>
        </Pane>
        <Pane>
          <Text size={300} display="block">{t('processing.adfgvx.cracker.wizard.square.transpositionKey')}</Text>
          <Text size={400} fontFamily="monospace">{assembledTranspositionKey}</Text>
        </Pane>
      </Pane>
    </Pane>
  );
};

StepSquare.displayName = 'StepSquare';

export default StepSquare;
