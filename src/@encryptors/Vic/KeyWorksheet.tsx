import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';

import Tooltip from '@atoms/Tooltip';
import type { VicWorksheet } from './vic-crypt';

// The pencil-and-paper key schedule, Kahn's line labels A–S: the whole
// worksheet the agent fills in before touching the message. Each line
// names its operation in a tooltip, exactly as "Number One From
// Moscow" walks through them.

const Sheet = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: 8px;
  font-family: ${({ theme }) => theme.type.mono};
  font-size: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
`;

const Line = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: max-content;
`;

const LineLabel = styled.span`
  flex: none;
  width: 26px;
  text-align: right;
  font-weight: 700;
  color: ${({ theme }) => theme.metal.brass.light};
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.6);
`;

const LineValue = styled.span`
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.ink.primary};
  white-space: pre;
`;

// The worksheet lines, in derivation order. Widths a/b and the
// insertion position follow the digit lines.
const WORKSHEET_LINES: Array<keyof VicWorksheet> = [
  'A', 'B', 'C', 'D', 'E1', 'E2', 'F1', 'F2', 'G', 'H', 'J',
  'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S',
];

interface KeyWorksheetProps {
  worksheet: VicWorksheet;
}

const KeyWorksheet: React.FC<KeyWorksheetProps> = ({ worksheet }) => {
  const { t } = useTranslation('common');

  return (
    <Sheet data-guide="key-worksheet">
      {WORKSHEET_LINES.map((line) => (
        <Tooltip
          key={line}
          content={t(`processing.vic.worksheet.${line}`)}
        >
          <Line>
            <LineLabel>{line}</LineLabel>
            <LineValue>{String(worksheet[line])}</LineValue>
          </Line>
        </Tooltip>
      ))}
      <Tooltip content={t('processing.vic.worksheet.widths')}>
        <Line>
          <LineLabel>a·b</LineLabel>
          <LineValue>{`${worksheet.a} × ${worksheet.b}`}</LineValue>
        </Line>
      </Tooltip>
      <Tooltip content={t('processing.vic.worksheet.insertAt')}>
        <Line>
          <LineLabel>{'↓'}</LineLabel>
          <LineValue>{String(worksheet.insertAt)}</LineValue>
        </Line>
      </Tooltip>
    </Sheet>
  );
};

KeyWorksheet.displayName = 'KeyWorksheet';

export default KeyWorksheet;
