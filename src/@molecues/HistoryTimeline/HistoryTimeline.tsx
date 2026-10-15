import React from 'react';
import { useTranslation } from 'next-i18next';
import { Pane, Text } from 'evergreen-ui';
import styled from 'styled-components';

import { getTimeline } from '@learning/timelines';

const List = styled(Pane)`
  margin: 12px 0;
  border-left: 2px solid ${({ theme }) => theme.colorScheme.blue[300]};
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EventRow = styled(Pane)`
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: -21px;
    top: 6px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colorScheme.blue[500]};
  }
`;

const Year = styled(Text)`
  display: block;
  font-weight: 700;
  font-size: 13px;
`;

interface HistoryTimelineProps {
  cipher: string;
}

// Vertical timeline of dated events, each linking to its source. Rendered
// next to the history text via the {{timeline:<cipher>}} placeholder.
const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ cipher }) => {
  const { t } = useTranslation('common');
  const events = getTimeline(cipher);

  if (events.length === 0) {
    return null;
  }

  return (
    <List>
      {events.map((event) => (
        <EventRow key={event.year + event.textKey}>
          <Year>{event.year}</Year>
          <Text size={300} display="block">
            {t(event.textKey)}
            {' '}
            <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer">
              {t('learning.timeline.source')}
            </a>
          </Text>
        </EventRow>
      ))}
    </List>
  );
};

HistoryTimeline.displayName = 'HistoryTimeline';

export default HistoryTimeline;
