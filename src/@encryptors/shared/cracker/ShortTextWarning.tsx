import { useTranslation } from 'next-i18next';
import React from 'react';
import { Pane, Text } from 'evergreen-ui';
import styled from 'styled-components';

const MIN_RELIABLE_LETTERS = 100;

export { MIN_RELIABLE_LETTERS };

const Banner = styled(Pane)`
  margin-top: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colorScheme.yellow[100]};
`;

interface ShortTextWarningProps {
  letters: string;
  // i18n key of the warning sentence; each cipher's cracker block owns it.
  warningKey?: string;
}

const ShortTextWarning: React.FC<ShortTextWarningProps> = ({ letters, warningKey }) => {
  const { t } = useTranslation('common');
  if (letters.length === 0 || letters.length >= MIN_RELIABLE_LETTERS) {
    return null;
  }

  return (
    <Banner>
      <Text size={300}>{t(warningKey || 'processing.cracker.wizard.warnings.shortText')}</Text>
    </Banner>
  );
};

export default ShortTextWarning;
