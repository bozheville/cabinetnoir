import React from 'react';
import styled from 'styled-components';
import DecoFrame from '@ornaments/DecoFrame';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
}

const NativeDialog = styled.dialog`
  border: none;
  padding: 0;
  background: transparent;
  max-width: min(640px, calc(100vw - 32px));
  width: 100%;

  &::backdrop {
    background: rgba(26, 16, 11, 0.6);
  }
`;

const Sheet = styled.div`
  background-color: ${({ theme }) => theme.paper.ivory};
  border-radius: ${({ theme }) => theme.radius.paper};
  padding: 24px;
  box-shadow: ${({ theme }) => theme.shadow.float};
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  font-family: ${({ theme }) => theme.type.engraved};
  font-weight: 500;
  font-size: 15px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.ink.primary};
`;

/** A paper sheet laid over the desk. Native <dialog> for focus trap and Escape. */
const Dialog: React.FC<DialogProps> = ({ open, onClose, title, children }) => {
  const ref = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  return (
    <NativeDialog ref={ref} onClose={onClose}>
      <Sheet>
        <DecoFrame padding="tight">
          {title ? <TitleRow>{title}</TitleRow> : null}
          {children}
        </DecoFrame>
      </Sheet>
    </NativeDialog>
  );
};

Dialog.displayName = 'Dialog';

export default Dialog;
