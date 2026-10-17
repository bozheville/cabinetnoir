import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { getLearningConfig, hasCryptoanalysis, LearningTabName, CRYPTOANALYSIS_TAB } from '@learning/config';

const TabBar = styled.nav`
  display: flex;
  justify-content: center;
  gap: 4px;
  padding: 8px 16px 0;
`;

const Tab = styled.span<{ $active: boolean }>`
  a {
    display: inline-block;
    padding: 6px 14px;
    border-radius: 4px 4px 0 0;
    text-decoration: none;
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme, $active }) => ($active ? theme.colorScheme.blue[100] : 'transparent')};
    font-weight: ${({ $active }) => ($active ? 700 : 400)};
    border: 1px solid ${({ theme, $active }) => ($active ? theme.colorScheme.blue[300] : 'transparent')};
    border-bottom: none;

    &:hover {
      background: ${({ theme, $active }) => ($active ? theme.colorScheme.blue[100] : theme.colorScheme.gray[100])};
    }
  }
`;

interface CipherTabsProps {
  algorithm: string;
  activeTab: 'tool' | typeof CRYPTOANALYSIS_TAB | LearningTabName;
}

// Tab bar for ciphers that have learning material. Real links (crawlable,
// one URL per tab); tabs the cipher does not have are hidden. Ciphers
// without a learning config render nothing at all. The Cryptoanalysis
// tab appears only for ciphers that ship a cracker.
const CipherTabs: React.FC<CipherTabsProps> = ({ algorithm, activeTab }) => {
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
    <TabBar aria-label={t('learning.tabs.tabsLabel')}>
      {tabs.map(({ name, href }) => (
        <Tab key={name} $active={activeTab === name}>
          <Link href={href}>{t(`learning.tabs.${name === 'tool' ? 'tool' : name}`)}</Link>
        </Tab>
      ))}
    </TabBar>
  );
};

CipherTabs.displayName = 'CipherTabs';

export default CipherTabs;
