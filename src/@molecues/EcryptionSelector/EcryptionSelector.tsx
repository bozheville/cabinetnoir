import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';

import { Dialog, IconButton } from '@atoms';
import { Chevron } from '@ornaments';
import { GreatPrimer } from '@typography';

import { encodingsList, encryptorsList } from '@encryptors';
import { RecentlyUsedContext } from '@contexts';

// Quiet typewriter-key plate on the saddle leather; the selected
// cipher is pressed in and copper.
const SelectionButton = styled.button<{ 'data-type'?: string }>`
  background: none;
  border: none;
  padding: 6px 3px;
  margin-right: 12px;
  font-family: ${({ theme }) => theme.type.engraved};
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 500;
  color: ${({ theme }) => theme.metal.brass.light};
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.6);
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    color: ${({ theme }) => theme.metal.copper.light};
  }

  &[data-type='selected'] {
    color: ${({ theme }) => theme.metal.copper.light};
    box-shadow: inset 0px -4px 0px ${({ theme }) => theme.metal.copper.base};
    pointer-events: none;
  }
`;

// On the paper dialog sheet the plates read as ink text.
const DialogButton = styled.button`
  display: block;
  background: none;
  border: none;
  padding: 6px 2px;
  font-family: ${({ theme }) => theme.type.engraved};
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 500;
  color: ${({ theme }) => theme.ink.primary};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.metal.copper.dark};
  }
`;

const SelectorWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
`;

const AlgoListWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  white-space: nowrap;
  overflow-x: auto;
  min-width: 0;
`;

const DialogHeading = styled(GreatPrimer)`
  margin: 8px 0 4px;

  &:first-child {
    margin-top: 0;
  }
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

  const handleSelectionDialogClose = () => setIsDialogVisible(false);

  return (
    <>
      <SelectorWrapper>
        <AlgoListWrapper>
          {recentlyUsed.map((item) => (
            <SelectionButton
              key={`quick-select-${item}`}
              onClick={handleSelect(item)}
              data-type={algorithm === item ? 'selected' : undefined}
            >
              {`${t(`processing.${item}.short_title`) || t(`processing.${item}.title`)}`}
            </SelectionButton>
          ))}
        </AlgoListWrapper>
        <IconButton
          label="Select algorithm"
          onClick={() => setIsDialogVisible(true)}
        >
          <Chevron size={7} style={{ transform: 'rotate(90deg)' }} />
        </IconButton>
      </SelectorWrapper>
      <Dialog
        open={isDialogVisible}
        onClose={handleSelectionDialogClose}
        title="Select algorithm"
      >
        <DialogHeading>Encodings</DialogHeading>
        {encodingsList.map((item) => (
          <DialogButton
            key={`select-${item}`}
            onClick={handleSelect(item)}
          >
            {`${t(`processing.${item}.title`)}`}
          </DialogButton>
        ))}
        <DialogHeading>Encryptors</DialogHeading>
        {encryptorsList.map((item) => (
          <DialogButton
            key={`select-${item}`}
            onClick={handleSelect(item)}
          >
            {`${t(`processing.${item}.title`)}`}
          </DialogButton>
        ))}
      </Dialog>
  </>
  );
};

EcryptionSelector.displayName = 'EcryptionSelector';

export default EcryptionSelector;
