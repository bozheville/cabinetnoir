import React from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { Pane, Text } from 'evergreen-ui';
import styled from 'styled-components';

import { CIPHER_LADDER, getLearningConfig } from '@learning/config';
import { BodyCopy, GreatPrimer, Minion } from '@typography';

const Grid = styled.div`
  margin-top: 24px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  ${({ theme }) => theme.breakpoints.small} {
    grid-template-columns: 1fr 1fr;
  }
`;

const Card = styled(Pane)`
  padding: 12px 16px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colorScheme.gray[300]};
  background: ${({ theme }) => theme.colorScheme.white};
  display: flex;
  flex-direction: column;
  gap: 4px;

  &:hover {
    border-color: ${({ theme }) => theme.colorScheme.red_violet[300]};
  }
`;

const CardHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
`;

const CardLinks = styled.div`
  display: flex;
  gap: 12px;
  flex-shrink: 0;
`;

const CardLink = styled(Link)`
  font-size: 13px;
  color: ${({ theme }) => theme.colorScheme.blue[600]};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const GlanceLine = styled(Minion)`
  color: ${({ theme }) => theme.colorScheme.gray[500]};
`;

const UtilitiesNote = styled(BodyCopy)`
  margin-top: 20px;
  text-align: center;
`;

// The cipher ladder (#74): every cipher in one difficulty-ordered list —
// climb from the trivial to Enigma. Card facts come from the same
// learning config that drives the per-cipher at-a-glance block.
const CipherLadder: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <GreatPrimer>{t('home.ladder.title')}</GreatPrimer>
      <Minion>{t('home.ladder.subtitle')}</Minion>
      <Grid>
        {CIPHER_LADDER.map((cipher) => {
          const { atGlance } = getLearningConfig(cipher);
          const base = `/encoder/${cipher}`;

          return (
            <Card key={cipher}>
              <CardHead>
                <GreatPrimer>{t(`processing.${cipher}.title`)}</GreatPrimer>
                <CardLinks>
                  <CardLink href={`${base}/direct`}>{t('home.ladder.tool')}</CardLink>
                  <CardLink href={`${base}/learn`}>{t('home.ladder.learn')}</CardLink>
                </CardLinks>
              </CardHead>
              <GlanceLine>
                {`${t(atGlance.type)} · ${t(atGlance.difficulty)}`}
              </GlanceLine>
            </Card>
          );
        })}
      </Grid>
      <UtilitiesNote>
        <Link href="/encoder/base64/direct">{t('home.ladder.utilitiesNote')}</Link>
      </UtilitiesNote>
    </>
  );
};

CipherLadder.displayName = 'CipherLadder';

export default CipherLadder;
