import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Button, Pane, Table, Text } from 'evergreen-ui';
import styled from 'styled-components';

import { getExample } from '@learning/examples';

const Container = styled(Pane)`
  margin: 12px 0;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colorScheme.gray[300]};
  border-radius: 4px;
  width: 100%;
  overflow-x: auto;
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
      <Text size={300} display="block" marginBottom="8px">
        {t('learning.example.stepOf', { step: visibleRows, total: example.rows.length })}
      </Text>
      <Table width="100%">
        <Table.Head>
          {example.columns.map((column) => (
            <Table.TextHeaderCell key={column.key}>
              {t(column.labelKey)}
            </Table.TextHeaderCell>
          ))}
        </Table.Head>
        <Table.Body>
          {shownRows.map((row, rowIndex) => (
            <Table.Row key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <Table.TextCell key={cellIndex}>{cell}</Table.TextCell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Pane display="flex" gap="8px" marginTop="8px">
        {!allShown && (
          <Button size="small" onClick={() => setVisibleRows(visibleRows + 1)}>
            {t('learning.example.nextStep')}
          </Button>
        )}
        {!allShown && (
          <Button size="small" onClick={() => setVisibleRows(example.rows.length)}>
            {t('learning.example.showAll')}
          </Button>
        )}
        {allShown && (
          <Button size="small" onClick={() => setVisibleRows(1)}>
            {t('learning.example.restart')}
          </Button>
        )}
      </Pane>
    </Container>
  );
};

WorkedExample.displayName = 'WorkedExample';

export default WorkedExample;
