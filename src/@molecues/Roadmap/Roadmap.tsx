import React from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { Paper } from '@atoms';
import { Lozenge } from '@ornaments';
import { Minion } from '@typography';

const Columns = styled.div`
  margin-top: 16px;
  display: grid;
  gap: 24px;

  ${({ theme }) => theme.breakpoints.small} {
    grid-template-columns: 1fr 1fr;
  }
`;

const Column = styled(Paper)`
  padding: 16px;
  min-width: 0;
`;

const ColumnTitle = styled(Minion)`
  color: ${({ theme }) => theme.ink.secondary};
  margin-bottom: 8px;
`;

const Item = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 6px;
  font-family: ${({ theme }) => theme.type.body};
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.ink.primary};
`;

const Bullet = styled.span`
  display: inline-flex;
  flex: none;
  color: ${({ theme }) => theme.metal.brass.dark};
  transform: translateY(1px);
`;

const NextBullet = styled(Bullet)`
  color: ${({ theme }) => theme.metal.copper.dark};
`;

const Title = styled.h3`
  margin: 0;
  font-family: ${({ theme }) => theme.type.body};
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  color: ${({ theme }) => theme.ink.cream};
`;

// The roadmap section on the home page (#75): what is built and what is
// coming next. Static content — the ticket tracker stays on GitHub.
const Roadmap: React.FC = () => {
  const { t } = useTranslation('common');

  const built = [
    'home.roadmap.built.ciphers',
    'home.roadmap.built.cryptoanalysis',
    'home.roadmap.built.challenges',
    'home.roadmap.built.saknussemm',
  ];
  const next = [
    'home.roadmap.next.substitution',
    'home.roadmap.next.nihilist',
  ];

  return (
    <>
      <Title>{t('home.roadmap.title')}</Title>
      <Columns>
        <Column>
          <ColumnTitle>{`✓ ${t('home.roadmap.builtTitle')}`}</ColumnTitle>
          {built.map((key) => (
            <Item key={key}>
              <Bullet aria-hidden="true">
                <Lozenge size={6} />
              </Bullet>
              {t(key)}
            </Item>
          ))}
        </Column>
        <Column>
          <ColumnTitle>{`→ ${t('home.roadmap.nextTitle')}`}</ColumnTitle>
          {next.map((key) => (
            <Item key={key}>
              <NextBullet aria-hidden="true">
                <Lozenge size={6} filled={false} />
              </NextBullet>
              {t(key)}
            </Item>
          ))}
        </Column>
      </Columns>
    </>
  );
};

Roadmap.displayName = 'Roadmap';

export default Roadmap;
