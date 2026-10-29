import React from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import Tooltip from '@atoms/Tooltip';
import { Paper } from '@atoms';
import { Caption, Minion } from '@typography';
import type { TextProfile } from '@encryptors/shared/identification/profile';

import { FamilyBlock, FamilyBody } from './elements';

const Grid = styled(FamilyBody)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
`;

// Gauge tile: parchment paper with an engraved caption and
// tabular typewriter digits.
const Metric = styled(Paper).attrs({ tone: 'parchment', elevated: false })`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 10px;
`;

const MetricLabel = styled.span`
  display: inline-flex;
  align-items: center;
`;

const MetricLabelText = styled(Caption)`
  color: ${({ theme }) => theme.ink.secondary};
`;

const MetricValue = styled(Minion)`
  margin: 0;
  color: ${({ theme }) => theme.ink.primary};
  font-family: ${({ theme }) => theme.type.mono};
  font-variant-numeric: tabular-nums;
`;

interface MetricEntry {
  label: string;
  value: string;
  hint: string;
}

// The measurements behind the verdict: every number the rules looked
// at, with a plain-language tooltip. Diagnostic, not decorative — the
// tooltips explain what each metric means for cipher identification.
const MetricsPanel: React.FC<{ profile: TextProfile }> = ({ profile }) => {
  const { t } = useTranslation('common');

  const metrics: MetricEntry[] = [
    {
      label: t('identify.metrics.letters.label'),
      value: `${profile.letterCount}`,
      hint: t('identify.metrics.letters.hint'),
    },
    {
      label: t('identify.metrics.ic.label'),
      value: profile.ic.toFixed(3),
      hint: t('identify.metrics.ic.hint'),
    },
    {
      label: t('identify.metrics.directChi.label'),
      value: `${profile.directChiScore}`,
      hint: t('identify.metrics.directChi.hint'),
    },
    {
      label: t('identify.metrics.sortedChi.label'),
      value: `${profile.sortedChiScore}`,
      hint: t('identify.metrics.sortedChi.hint'),
    },
    {
      label: t('identify.metrics.caesar.label'),
      value: `${profile.caesarBestShift} (${profile.caesarBestScore})`,
      hint: t('identify.metrics.caesar.hint'),
    },
    {
      label: t('identify.metrics.period.label'),
      value: profile.bestPeriod !== null
        ? `${profile.bestPeriod} (${profile.bestPeriodAverageIC.toFixed(3)})`
        : '—',
      hint: t('identify.metrics.period.hint'),
    },
    {
      label: t('identify.metrics.distinct.label'),
      value: `${profile.distinctLetters.length}`,
      hint: t('identify.metrics.distinct.hint'),
    },
  ];

  if (profile.digitPairs > 0) {
    metrics.push({
      label: t('identify.metrics.digitPairs.label'),
      value: `${profile.digitPairs} (${profile.distinctDigitPairs})`,
      hint: t('identify.metrics.digitPairs.hint'),
    });
  }

  if (profile.distinctSymbols > profile.distinctLetters.length) {
    metrics.push({
      label: t('identify.metrics.symbols.label'),
      value: `${profile.distinctSymbols}`,
      hint: t('identify.metrics.symbols.hint'),
    });
  }

  return (
    <FamilyBlock>
      <Grid>
        {metrics.map((metric) => (
          <Metric key={metric.label}>
            <MetricLabel>
              <Tooltip content={metric.hint} trigger="children">
                <MetricLabelText>{metric.label}</MetricLabelText>
              </Tooltip>
            </MetricLabel>
            <MetricValue>{metric.value}</MetricValue>
          </Metric>
        ))}
      </Grid>
    </FamilyBlock>
  );
};

export default MetricsPanel;
