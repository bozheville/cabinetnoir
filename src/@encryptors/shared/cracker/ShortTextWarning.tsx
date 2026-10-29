import { useTranslation } from 'next-i18next';
import React from 'react';
import styled from 'styled-components';

import { LampIcon } from '@ornaments';
import { Minion } from '@typography';
import { paper } from '@theme/mixins';

const MIN_RELIABLE_LETTERS = 100;

export { MIN_RELIABLE_LETTERS };

// A small parchment note pinned into the worksheet, with an oxblood
// left edge and the lamp ornament.
const Banner = styled.div`
  ${paper('parchment')}
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 8px;
  padding: 8px 12px;
  border-left: 4px solid ${({ theme }) => theme.leather.oxblood.base};
  border-radius: ${({ theme }) => theme.radius.paper};
  color: ${({ theme }) => theme.ink.secondary};
`;

const NoteText = styled(Minion)`
  color: ${({ theme }) => theme.ink.secondary};
`;

const NoteIcon = styled(LampIcon)`
  flex: none;
  color: ${({ theme }) => theme.ink.secondary};
  margin-top: 1px;
`;

interface ShortTextWarningProps {
  letters: string;
  // i18n key of the warning sentence; each cipher's cracker block owns it.
  warningKey?: string;
  // Reliability threshold; ciphers with weaker signals raise it.
  minLetters?: number;
}

const ShortTextWarning: React.FC<ShortTextWarningProps> = ({ letters, warningKey, minLetters = MIN_RELIABLE_LETTERS }) => {
  const { t } = useTranslation('common');
  if (letters.length === 0 || letters.length >= minLetters) {
    return null;
  }

  return (
    <Banner>
      <NoteIcon size={14} />
      <NoteText>{t(warningKey || 'processing.cracker.wizard.warnings.shortText')}</NoteText>
    </Banner>
  );
};

export default ShortTextWarning;
