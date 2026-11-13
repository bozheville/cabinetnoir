import React from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import styled from 'styled-components';

import { BodyCopy } from '@typography';
import { getRelatedCiphers } from '@learning/config';

// Matches the h2 the markdown renderer draws, so the block reads as one
// more section of the sheet it sits in.
const Title = styled.h2`
  margin: 16px 0 8px;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.ink.primary};
`;

const List = styled.ul`
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 4px 24px;
`;

const Item = styled(BodyCopy)`
  a {
    color: ${({ theme }) => theme.metal.copper.dark};
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

interface RelatedCiphersProps {
  algorithm: string;
}

// Related-cipher links (task 08): the family map from the learning
// config, rendered with the cipher's own name as the anchor text.
// Shown on tool pages and at the end of the learning tabs.
const RelatedCiphers: React.FC<RelatedCiphersProps> = ({ algorithm }) => {
  const { t } = useTranslation('common');
  const related = getRelatedCiphers(algorithm);

  if (related.length === 0) {
    return null;
  }

  return (
    <div>
      <Title>{t('learning.related.title')}</Title>
      <List>
        {related.map((cipher) => (
          <li key={cipher}>
            <Item as="span">
              <Link href={`/encoder/${cipher}/direct`}>
                {t(`processing.${cipher}.title`)}
              </Link>
            </Item>
          </li>
        ))}
      </List>
    </div>
  );
};

RelatedCiphers.displayName = 'RelatedCiphers';

export default RelatedCiphers;
