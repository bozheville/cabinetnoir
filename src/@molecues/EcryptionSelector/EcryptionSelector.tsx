import { Dialog, IconButton, ChevronDownIcon } from 'evergreen-ui';
import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';

import { encryptorsList } from '@encryptors';
import { RecentlyUsedContext } from '@contexts';

const SelectionButton = styled.button`
  background: none;
  border: navajowhite;
  font-size: 16px;
  text-transform: uppercase;
  font-weight: 600;
  color: ${({theme}) => theme.colorScheme.gray[400]};
  padding: 6px 3px;
  margin-right: 12px;
  cursor: pointer;

  &:hover {
    background-color: ${({theme}) => theme.colorScheme.gray[50]};
  }

  ${({ theme, ...props }) => props['data-type'] === 'selected' && `
    color: ${theme.colorScheme.blue[400]};
    box-shadow: inset 0px -4px 0px ${theme.colorScheme.blue[600]};
    pointer-events: none;
  `}
`;

const SelectorWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const AlgoListWrapperInner = styled.div`
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  overflow-x: auto;

  ${({ theme }) => theme.breakpoints.small} {
    button {
      display: none;

      &[data-type=selected] {
        display: inline-block;
      }
    }
  }
`;
const AlgoListWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const EcryptionSelector: React.FC = () => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const router = useRouter();
  const { algorithm, action } = router.query;
  const { t } = useTranslation('common');
  const { recentlyUsed } = useContext(RecentlyUsedContext);

  const handleSelect = (nextAlgorithm) => () => {
    if (nextAlgorithm === algorithm) {
      return false;
    }

    setIsDialogVisible(false);
    router.push(`/encoder/${nextAlgorithm}/${action}`, undefined, { shallow: true });
  };

  return (
    <>
      <SelectorWrapper>
        <AlgoListWrapper>
          <AlgoListWrapperInner>
          {recentlyUsed.map((item) => (
            <SelectionButton
              key={`quick-select-${item}`}
              onClick={handleSelect(item)}
              data-type={algorithm === item && 'selected'}
            >
              {t(`processing.${item}.short_title`) || t(`processing.${item}.title`)}
            </SelectionButton>
          ))}
          </AlgoListWrapperInner>
        </AlgoListWrapper>
        <IconButton
          appearance="minimal"
          onClick={() => setIsDialogVisible(true)}
          icon={ChevronDownIcon}
        />
      </SelectorWrapper>
      <Dialog
        isShown={isDialogVisible}
        title="Select algorithm"
      >
        {encryptorsList.map((item) => (
          <SelectionButton
            key={`select-${item}`}
            onClick={handleSelect(item)}
          >
            {t(`processing.${item}.title`)}
          </SelectionButton>
        ))}
      </Dialog>
  </>
  );
};

EcryptionSelector.displayName = 'EcryptionSelector';

export default EcryptionSelector;
