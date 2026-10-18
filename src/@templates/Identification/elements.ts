import React from 'react';
import styled from 'styled-components';

import Section from '@atoms/Section/Section';

// Shared styled elements of the identification template. The wrapper
// mirrors the Encryptor wrapper (same borders, radius and background) so
// the tool feels like part of the same family.
export const IdentificationSection = styled(Section)`
  flex: 1 0 auto;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colorScheme.blue_green[500]};

  box-shadow: 0px 0px 0px 1px ${({ theme }) => theme.colorScheme.blue_green[200]};;
  margin: 24px auto;
  background-color: ${({ theme }) => theme.colorScheme.orange[50]};
  overflow: hidden;
  border-radius: 8px;

  ${({ theme }) => theme.breakpoints.small} {
    margin: 4px;
  }

  ${({ theme }) => theme.breakpoints.desktop} {
    max-width: 1016px;
  }
`;

export const Inner = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// --- Results tree ---

export const FamilyBlock = styled.div`
  border: 1px solid ${({ theme }) => theme.colorScheme.blue_green[300]};
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.background};
  overflow: hidden;
`;

export const FamilyHeader = styled.button<{ $dimmed: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  border: 0;
  background: ${({ theme, $dimmed }) => ($dimmed ? theme.colors.background : theme.colorScheme.blue[50])};
  cursor: ${({ $dimmed }) => ($dimmed ? 'default' : 'pointer')};
  text-align: left;

  ${({ $dimmed }) => ($dimmed ? 'opacity: 0.75;' : '')}
`;

export const FamilyBody = styled.div`
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ReasonsList = styled.ul`
  margin: 0;
  padding: 0 0 0 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const CipherGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 8px;
`;

export const CipherCard = styled.div<{ $dimmed: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  border: 1px solid ${({ theme, $dimmed }) => ($dimmed ? theme.colorScheme.gray[300] : theme.colorScheme.blue[300])};
  border-radius: 4px;
  background: ${({ theme, $dimmed }) => ($dimmed ? theme.colors.background : theme.colorScheme.blue[50])};

  ${({ $dimmed }) => ($dimmed ? 'opacity: 0.7;' : '')}
`;

export const CardHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const CardName = styled.span`
  font-weight: 700;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`;

export const Badge = styled.span<{ $confidence: string }>`
  flex-shrink: 0;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: ${({ theme, $confidence }) => ($confidence === 'veryLikely'
    ? theme.colorScheme.white
    : theme.colors.text)};
  background: ${({ theme, $confidence }) => ($confidence === 'veryLikely'
    ? theme.colorScheme.blue[500]
    : $confidence === 'possible'
      ? theme.colorScheme.blue[100]
      : theme.colorScheme.gray[100])};
`;

export const RoadmapBadge = styled.span`
  flex-shrink: 0;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colorScheme.gray[200]};
`;

export const ScoreBar = styled.div`
  height: 4px;
  border-radius: 2px;
  background: ${({ theme }) => theme.colorScheme.gray[200]};

  & > div {
    height: 100%;
    border-radius: 2px;
    background: ${({ theme }) => theme.colorScheme.blue[500]};
  }
`;

export const CardReasons = styled.ul`
  margin: 0;
  padding: 0 0 0 16px;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const BreakButton = styled.button`
  align-self: flex-start;
  padding: 6px 14px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colorScheme.blue[500]};
  background: ${({ theme }) => theme.colorScheme.blue[500]};
  color: ${({ theme }) => theme.colorScheme.white};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colorScheme.blue[600]};
  }
`;
