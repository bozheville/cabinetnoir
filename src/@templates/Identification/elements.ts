import React from 'react';
import styled from 'styled-components';
import { Button } from '@atoms';
import { leather as leatherMixin, paper as paperMixin, metal } from '@theme/mixins';

import Section from '@atoms/Section/Section';
import ToolCase from '@organisms/ToolCase';

// Shared styled elements of the identification template. The navy zone
// holds the results; candidate ciphers sit on paper index cards inside
// leather family drawers.
export const IdentificationSection = styled(Section)`
  flex: 1 0 auto;
`;

// The tool frame: same DecoFrame the encryptor and cracker use.
export const Wrapper = ToolCase;

export const Inner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// --- Results tree ---

// Family drawer: a navy leather front with the family nameplate.
export const FamilyBlock = styled.div`
  ${leatherMixin('navy', 0.1)}
  border-radius: ${({ theme }) => theme.radius.leather};
  overflow: hidden;
  color: ${({ theme }) => theme.leather.navy.text};
`;

export const FamilyHeader = styled.button<{ $dimmed: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  border: 0;
  background: ${({ theme, $dimmed }) => ($dimmed ? 'transparent' : theme.leather.navy.seam)};
  cursor: ${({ $dimmed }) => ($dimmed ? 'default' : 'pointer')};
  text-align: left;
  color: inherit;
  font: inherit;

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

// Candidate card: a paper index card inside the drawer.
export const CipherCard = styled.div<{ $dimmed: boolean }>`
  ${paperMixin('vellum', true)}
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;

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
  color: inherit;
`;

// Confidence badge: very likely = copper, possible = brass, unlikely = patina.
export const Badge = styled.span<{ $confidence: string }>`
  flex-shrink: 0;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.metal.brass.shadow};
  font-family: ${({ theme }) => theme.type.engraved};
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme, $confidence }) => ($confidence === 'veryLikely'
    ? theme.ink.primary
    : theme.ink.primary)};
  background: ${({ theme, $confidence }) => ($confidence === 'veryLikely'
    ? theme.metal.copper.base
    : $confidence === 'possible'
      ? theme.metal.brass.base
      : theme.metal.brass.patina)};
`;

export const RoadmapBadge = styled.span`
  flex-shrink: 0;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.paper.rule};
  font-family: ${({ theme }) => theme.type.engraved};
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.ink.primary};
  background: ${({ theme }) => theme.paper.parchment};
`;

// Confidence bar: brass rail with a copper fill.
export const ScoreBar = styled.div`
  height: 4px;
  border-radius: 2px;
  background: ${({ theme }) => theme.metal.brass.base};

  & > div {
    height: 100%;
    border-radius: 2px;
    background: ${({ theme }) => theme.metal.copper.base};
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

// "Break it" action: primary brass plate.
export const BreakButton = styled(Button).attrs({ variant: 'primary', size: 'sm' })`
  align-self: flex-start;
`;
