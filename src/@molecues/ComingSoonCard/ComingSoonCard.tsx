import React from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { Badge, Patch } from '@atoms';
import { Caption, GreatPrimer, Minion } from '@typography';
import { getCategory, getPrimaryCategory } from '@learning/categories';

// A cipher on the roadmap, shown only as an unclickable card: no links, no
// hover lift, no pointer cursor and no tab stop. Dimmed leather + patina
// badge say "not in the cabinet yet" at a glance (task 04, approved mock-up).
const Card = styled(Patch)`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 16px 16px;
  position: relative;
  color: ${({ theme }) => theme.ink.cream};

  /* Desaturate and darken the leather so the card reads as inert. */
  > *:not(.dim-overlay) {
    filter: saturate(0.35) brightness(0.72);
  }
`;

const DimOverlay = styled.div`
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: ${({ theme }) => theme.leather.espresso.base};
  opacity: 0.45;
`;

const FamilyLabel = styled(Caption)`
  color: ${({ theme }) => theme.ink.creamMuted};
  margin-bottom: 4px;
`;

const CardTitle = styled(GreatPrimer)`
  color: inherit;
  margin: 0;
`;

const Note = styled(Minion)`
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const BadgeRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ComingSoonCard: React.FC<{ cipher: string }> = ({ cipher }) => {
  const { t } = useTranslation('common');
  const primary = getPrimaryCategory(cipher);
  const leather = (primary && getCategory(primary)?.leather) || 'tan';

  return (
    <Card shape="card" leather={leather} data-leather={leather} aria-disabled="true">
      <DimOverlay className="dim-overlay" />
      <FamilyLabel>{primary ? t(`categories.${primary}.shortName`) : ''}</FamilyLabel>
      <BadgeRow>
        <Badge tone="patina">{t('categories.labels.comingSoon')}</Badge>
      </BadgeRow>
      <CardTitle>{t(`categories.comingSoon.${cipher}.name`)}</CardTitle>
      <Note>{t(`categories.comingSoon.${cipher}.oneLiner`)}</Note>
    </Card>
  );
};

ComingSoonCard.displayName = 'ComingSoonCard';

export default ComingSoonCard;
