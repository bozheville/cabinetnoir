import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { Button, Paper } from '@atoms';
import { Caption, Minion } from '@typography';

import { getExample } from '@learning/examples';
import GlyphRenderer from '@molecues/GlyphRenderer';

// Paper table: rule lines, header row on parchment.
const Container = styled(Paper)`
  margin: 12px 0;
  padding: 12px;
  width: 100%;
  overflow-x: auto;
`;

const StepOf = styled(Minion)`
  display: block;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.ink.secondary};
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    background-color: ${({ theme }) => theme.paper.parchment};
    border: 1px solid ${({ theme }) => theme.paper.rule};
    padding: 6px 10px;
    text-align: left;
  }

  td {
    border: 1px solid ${({ theme }) => theme.paper.rule};
    padding: 6px 10px;
    color: ${({ theme }) => theme.ink.primary};
  }
`;

const HeaderLabel = styled(Caption)`
  color: ${({ theme }) => theme.ink.secondary};
`;

const CellText = styled.span`
  font-family: ${({ theme }) => theme.type.mono};
  font-size: 15px;
  color: ${({ theme }) => theme.ink.primary};
`;

const Controls = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

interface WorkedExampleProps {
  id: string;
}

// Step table for a worked example: the user can reveal one row at a time
// or show the whole table. Data comes from @learning/examples; headings
// and controls from i18n.
const WorkedExample: React.FC<WorkedExampleProps> = ({ id }) => {
  const { t } = useTranslation('common');
  const [visibleRows, setVisibleRows] = useState(1);

  const example = getExample(id);
  if (!example) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[example] unknown example id: ${id}`);
    }
    return null;
  }

  const allShown = visibleRows >= example.rows.length;
  const shownRows = example.rows.slice(0, visibleRows);

  return (
    <Container>
      <StepOf>
        {t('learning.example.stepOf', { step: visibleRows, total: example.rows.length })}
      </StepOf>
      <StyledTable>
        <thead>
          <tr>
            {example.columns.map((column) => (
              <th key={column.key}>
                <HeaderLabel>{t(column.labelKey)}</HeaderLabel>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {shownRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>
                  {example.glyphVariant &&
                  example.glyphColumns?.includes(example.columns[cellIndex]?.key) ? (
                    <GlyphRenderer text={cell} variant={example.glyphVariant} size={24} />
                  ) : (
                    <CellText>{cell}</CellText>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </StyledTable>
      <Controls>
        {!allShown && (
          <Button variant="secondary" size="sm" onClick={() => setVisibleRows(visibleRows + 1)}>
            {t('learning.example.nextStep')}
          </Button>
        )}
        {!allShown && (
          <Button variant="quiet" size="sm" onClick={() => setVisibleRows(example.rows.length)}>
            {t('learning.example.showAll')}
          </Button>
        )}
        {allShown && (
          <Button variant="quiet" size="sm" onClick={() => setVisibleRows(1)}>
            {t('learning.example.restart')}
          </Button>
        )}
      </Controls>
    </Container>
  );
};

WorkedExample.displayName = 'WorkedExample';

export default WorkedExample;
