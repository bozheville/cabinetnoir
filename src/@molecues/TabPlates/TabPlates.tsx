import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { metal, focusRing } from '@theme/mixins';

import { getLearningConfig, hasCryptoanalysis, LearningTabName, CRYPTOANALYSIS_TAB } from '@learning/config';

const Bar = styled.nav`
  display: flex;
  justify-content: center;
  gap: 2px;
  flex-wrap: nowrap;
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
  ${({ theme }) => theme.breakpoints.small} {
    justify-content: flex-start;
  }
`;

const Tab = styled.span<{ $active: boolean }>`
  position: relative;
  top: 2px;

  a {
    display: block;
    padding: 0 18px;
    height: 36px;
    line-height: 36px;
    text-decoration: none;
    white-space: nowrap;
    font-family: ${({ theme }) => theme.type.engraved};
    font-weight: 500;
    font-size: 12px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    clip-path: polygon(9px 0, calc(100% - 9px) 0, 100% 100%, 0 100%);
    ${({ $active }) => metal($active ? 'copper' : 'brass')}
    ${({ $active }) => ($active ? 'transform: translateY(1px);' : 'opacity: 0.92;')}
    ${focusRing}
    &:hover { filter: brightness(1.06); }
  }
`;

interface TabPlatesProps {
  algorithm: string;
  activeTab: 'tool' | typeof CRYPTOANALYSIS_TAB | LearningTabName;
}

/**
 * TabPlates: brass index tabs attached to the top edge of the DecoFrame,
 * like tabs on a ledger. Real links (crawlable, one URL per tab).
 */
const TabPlates: React.FC<TabPlatesProps> = ({ algorithm, activeTab }) => {
  const { t } = useTranslation('common');
  const config = getLearningConfig(algorithm);

  if (!config) {
    return null;
  }

  const tabs: Array<{ name: 'tool' | typeof CRYPTOANALYSIS_TAB | LearningTabName; href: string }> = [
    { name: 'tool', href: `/encoder/${algorithm}/direct` },
    ...(hasCryptoanalysis(algorithm)
      ? [{ name: CRYPTOANALYSIS_TAB, href: `/encoder/${algorithm}/${CRYPTOANALYSIS_TAB}` }]
      : []),
    ...config.tabs.map((tab) => ({ name: tab, href: `/encoder/${algorithm}/${tab}` })),
  ];

  return (
    <Bar aria-label={t('learning.tabs.tabsLabel')}>
      {tabs.map(({ name, href }) => (
        <Tab key={name} $active={activeTab === name}>
          <Link href={href} aria-current={activeTab === name ? 'page' : undefined}>
            {t(`learning.tabs.${name === 'tool' ? 'tool' : name}`)}
          </Link>
        </Tab>
      ))}
    </Bar>
  );
};

TabPlates.displayName = 'TabPlates';

export default TabPlates;
