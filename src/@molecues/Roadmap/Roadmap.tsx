import React from 'react';
import { useTranslation } from 'next-i18next';
import { Pane, Text } from 'evergreen-ui';
import styled from 'styled-components';

import { GreatPrimer, Minion } from '@typography';

const Columns = styled.div`
  margin-top: 16px;
  display: grid;
  gap: 24px;

  ${({ theme }) => theme.breakpoints.small} {
    grid-template-columns: 1fr 1fr;
  }
`;

const Item = styled(Text)`
  display: block;
  margin-bottom: 6px;
`;

const DoneItem = styled(Item)`
  color: ${({ theme }) => theme.colorScheme.gray[700]};
`;

const NextItem = styled(Item)`
  color: ${({ theme }) => theme.colorScheme.gray[600]};
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
      <GreatPrimer>{t('home.roadmap.title')}</GreatPrimer>
      <Columns>
        <Pane>
          <Minion>{`✓ ${t('home.roadmap.builtTitle')}`}</Minion>
          {built.map((key) => (
            <DoneItem key={key}>{t(key)}</DoneItem>
          ))}
        </Pane>
        <Pane>
          <Minion>{`→ ${t('home.roadmap.nextTitle')}`}</Minion>
          {next.map((key) => (
            <NextItem key={key}>{t(key)}</NextItem>
          ))}
        </Pane>
      </Columns>
    </>
  );
};

Roadmap.displayName = 'Roadmap';

export default Roadmap;
