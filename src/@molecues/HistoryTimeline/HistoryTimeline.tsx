import React from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { Minion } from '@typography';

import { getTimeline } from '@learning/timelines';

// Vertical brass rail with copper lozenge markers.
const List = styled.div`
  margin: 12px 0;
  border-left: 2px solid ${({ theme }) => theme.metal.brass.base};
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EventRow = styled.div`
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: -22px;
    top: 5px;
    width: 8px;
    height: 8px;
    transform: rotate(45deg);
    border-radius: 1px;
    background: ${({ theme }) => theme.metal.copper.base};
  }
`;

const Year = styled.span`
  display: block;
  font-family: ${({ theme }) => theme.type.display};
  font-weight: 700;
  font-variant: small-caps;
  font-size: 14px;
  color: ${({ theme }) => theme.ink.primary};
`;

const EventText = styled(Minion)`
  display: block;
  color: ${({ theme }) => theme.ink.primary};

  a {
    color: ${({ theme }) => theme.metal.copper.dark};
  }
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
          <EventText>
            {t(event.textKey)}
            {' '}
            <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer">
              {t('learning.timeline.source')}
            </a>
          </EventText>
        </EventRow>
      ))}
    </List>
  );
};

HistoryTimeline.displayName = 'HistoryTimeline';

export default HistoryTimeline;
