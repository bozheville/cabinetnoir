import React from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useTheme } from 'styled-components';
import styled from 'styled-components';

import { Button, Patch } from '@atoms';
import { focusRing } from '@theme/mixins';
import { Caption, GreatPrimer, Minion } from '@typography';
import { getLearningConfig } from '@learning/config';
import { getCategory, getCipherCategories, getPrimaryCategory } from '@learning/categories';

// The cipher card shared by the home ladder and the category pages. Leather
// comes from the cipher's primary category (spec: cipher-categories, task 04);
// machine ciphers keep their copper thread via disks-and-rotors membership.
export interface CipherCardProps {
  /** Cipher id, e.g. 'caesar'. */
  cipher: string;
  /** Category page the card sits on; task 05 uses it for the history trail. */
  categoryId?: string | null;
  /** When this page is not the cipher's primary tree, show the primary link. */
  secondaryOf?: boolean;
  /** Family caption as a link to the primary category (task 06, home ladder). */
  labelAsLink?: boolean;
}

const Card = styled(Patch)`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 16px 16px;
  transition: transform 120ms ease-out;
  cursor: default;

  /* Text colours follow the leather: cream on dark hides, ink on tan. */
  color: ${({ theme }) => theme.ink.cream};

  &[data-leather='tan'] {
    color: ${({ theme }) => theme.ink.primary};
  }

  /* Hover: lift only — the stitch never changes on hover. */
  &:hover {
    transform: translateY(-2px);
  }
`;

const FamilyLabel = styled(Caption)`
  color: ${({ theme }) => theme.metal.brass.light};
  margin-bottom: 4px;

  a {
    color: inherit;
    text-decoration: underline;
    text-decoration-color: ${({ theme }) => theme.metal.brass.dark};
    text-underline-offset: 3px;

    &:hover,
    &:focus-visible {
      color: ${({ theme }) => theme.ink.cream};
      ${focusRing}
    }

    [data-leather='tan'] & {
      color: ${({ theme }) => theme.ink.secondary};
    }
  }

  [data-leather='tan'] & {
    color: ${({ theme }) => theme.ink.secondary};
  }
`;

const CardTitle = styled(GreatPrimer)`
  color: inherit;
  margin: 0;
`;

const GlanceLine = styled(Minion)`
  color: ${({ theme }) => theme.ink.creamMuted};

  a {
    color: ${({ theme }) => theme.metal.brass.light};

    [data-leather='tan'] & {
      color: ${({ theme }) => theme.ink.secondary};
    }
  }

  [data-leather='tan'] & {
    color: ${({ theme }) => theme.ink.secondary};
  }
`;

const CardLinks = styled.div`
  display: flex;
  gap: 8px;
  margin-top: auto;
  padding-top: 12px;

  /* Touch: extend the 32px buttons to a 44px tap target without changing
     their visual size (44px rule, specs/leather-deco-redesign/04-atoms). */
  ${({ theme }) => theme.breakpoints.small} {
    & > a {
      position: relative;

      &::after {
        content: '';
        position: absolute;
        inset: -6px 0;
      }
    }
  }
`;

const CipherCard: React.FC<CipherCardProps> = ({
  cipher,
  categoryId = null,
  secondaryOf = false,
  labelAsLink = false,
}) => {
  const { t } = useTranslation('common');
  const theme = useTheme();
  const { atGlance } = getLearningConfig(cipher);
  const primary = getPrimaryCategory(cipher);
  const primaryCat = primary ? getCategory(primary) : null;
  const leather = primaryCat?.leather || 'tan';
  const isMachine =
    !!primary && getCipherCategories(cipher)?.includes('disks-and-rotors');
  const base = `/encoder/${cipher}`;

  return (
    <Card
      shape="card"
      leather={leather}
      data-leather={leather}
      thread={isMachine ? theme.metal.copper.base : undefined}
    >
      <FamilyLabel>
        {primary && labelAsLink ? (
          <Link href={`/category/${primary}`}>{t(`categories.${primary}.shortName`)}</Link>
        ) : (
          t(atGlance.type)
        )}
      </FamilyLabel>
      <CardTitle>{t(`processing.${cipher}.title`)}</CardTitle>
      <GlanceLine>
        {secondaryOf && primary ? (
          <Link href={`/category/${primary}`}>
            {t('categories.labels.primaryFamily', {
              family: t(`categories.${primary}.shortName`),
            })}
          </Link>
        ) : (
          `${t(atGlance.type)} · ${t(atGlance.difficulty)}`
        )}
      </GlanceLine>
      <CardLinks>
        <Button href={`${base}/direct`} variant="primary" size="sm">
          {t('home.ladder.tool')}
        </Button>
        <Button href={`${base}/learn`} variant="secondary" size="sm">
          {t('home.ladder.learn')}
        </Button>
      </CardLinks>
    </Card>
  );
};

CipherCard.displayName = 'CipherCard';

export default CipherCard;
