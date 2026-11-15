import React from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import styled from 'styled-components';

import { BodyCopy, GreatPrimer, Minion } from '@typography';
import { CIPHER_LADDER } from '@learning/config';
import CipherCard from '@molecues/CipherCard';

const Grid = styled.div`
  margin-top: 24px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  ${({ theme }) => theme.breakpoints.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }
  ${({ theme }) => theme.breakpoints.desktop} {
    grid-template-columns: repeat(3, 1fr);
  }
  ${({ theme }) => theme.breakpoints.wide} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

// The ladder band is gone: cards lie on the desk patchwork, so the
// heading and notes use cream inks (spec 06 §1, band 3).
const UtilitiesNote = styled(BodyCopy)`
  margin-top: 20px;
  text-align: center;
  color: ${({ theme }) => theme.ink.creamMuted};

  a {
    color: ${({ theme }) => theme.metal.brass.light};
  }
`;

const LadderHead = styled.div`
  text-align: center;

  ${GreatPrimer} {
    color: ${({ theme }) => theme.ink.cream};
  }

  ${Minion} {
    color: ${({ theme }) => theme.ink.creamMuted};
  }
`;

// The cipher ladder (#74): every cipher in one difficulty-ordered list —
// climb from the trivial to Enigma. The card itself is the shared
// CipherCard molecule (spec: cipher-categories, task 04); home passes no
// categoryId, so cards opened from home keep their primary trail.
const CipherLadder: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <LadderHead>
        <GreatPrimer as="h2">{t('home.ladder.title')}</GreatPrimer>
        <Minion>{t('home.ladder.subtitle')}</Minion>
      </LadderHead>
      <Grid>
        {CIPHER_LADDER.map((cipher) => (
          <CipherCard key={cipher} cipher={cipher} labelAsLink />
        ))}
      </Grid>
      <UtilitiesNote>
        <Link href="/encoder/base64/direct">{t('home.ladder.utilitiesNote')}</Link>
        {' · '}
        <Link href="/encoder/saknussemm/history">{t('home.ladder.easterEggNote')}</Link>
      </UtilitiesNote>
    </>
  );
};

CipherLadder.displayName = 'CipherLadder';

export default CipherLadder;
