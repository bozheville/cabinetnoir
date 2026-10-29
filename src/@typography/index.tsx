import React from 'react';
import styled, { css } from 'styled-components';

// Shared scale helpers, specs/leather-deco-redesign/02-typography.md.
// Mobile-first: base = mobile, then tablet/desktop steps.

const step = (base: [string, string], tablet: [string, string], desktop: [string, string]) => css`
  font-size: ${base[0]};
  line-height: ${base[1]};
  ${({ theme }) => theme.breakpoints.tablet} {
    font-size: ${tablet[0]};
    line-height: ${tablet[1]};
  }
  ${({ theme }) => theme.breakpoints.desktop} {
    font-size: ${desktop[0]};
    line-height: ${desktop[1]};
  }
`;

const Canon = styled.h1`
  font-family: ${({ theme }) => theme.type.display};
  font-weight: 700;
  color: ${({ theme }) => theme.ink.primary};
  ${step(['36px', '40px'], ['48px', '52px'], ['60px', '64px'])};
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin: 0;

  a { text-decoration: underline; }
`;

Canon.displayName = 'Canon';

const Trafalgar = styled.h1`
  font-family: ${({ theme }) => theme.type.display};
  font-weight: 700;
  color: ${({ theme }) => theme.ink.primary};
  ${step(['28px', '32px'], ['32px', '36px'], ['40px', '44px'])};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin: 0;

  a { text-decoration: underline; }
`;

Trafalgar.displayName = 'Trafalgar';

const DoublePica = styled.h2`
  font-family: ${({ theme }) => theme.type.engraved};
  font-weight: 500;
  color: ${({ theme }) => theme.ink.primary};
  ${step(['20px', '24px'], ['22px', '28px'], ['24px', '32px'])};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin: 0;

  a { text-decoration: underline; }
`;

DoublePica.displayName = 'DoublePica';

const GreatPrimer = styled.h3`
  font-family: ${({ theme }) => theme.type.body};
  font-weight: 700;
  color: ${({ theme }) => theme.ink.primary};
  ${step(['18px', '24px'], ['19px', '24px'], ['20px', '28px'])};
  margin: 0;

  a { text-decoration: underline; }
`;

GreatPrimer.displayName = 'GreatPrimer';

const BodyCopy = styled.p`
  font-family: ${({ theme }) => theme.type.body};
  font-weight: 400;
  color: ${({ theme }) => theme.ink.primary};
  ${step(['16px', '24px'], ['17px', '26px'], ['18px', '28px'])};
  max-width: 34em;
  margin: 0;

  & + & { margin-top: 12px; }

  a { text-decoration: underline; }
`;

BodyCopy.displayName = 'BodyCopy';

const Minion = styled.p`
  font-family: ${({ theme }) => theme.type.body};
  font-weight: 400;
  color: ${({ theme }) => theme.ink.secondary};
  ${step(['13px', '20px'], ['13px', '20px'], ['14px', '20px'])};
  margin: 0;

  & + & { margin-top: 8px; }

  a { text-decoration: underline; }
`;

Minion.displayName = 'Minion';

/** Engraved plate label: buttons, tabs, control labels. */
const PlateLabel = styled.span`
  font-family: ${({ theme }) => theme.type.engraved};
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: inherit;
`;

/** Engraved caption: fact labels, step names, family names. */
const Caption = styled.span`
  font-family: ${({ theme }) => theme.type.engraved};
  font-weight: 500;
  font-size: 11px;
  line-height: 16px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: inherit;
`;

/** Typewriter: cipher text, keys, grids. */
const CipherText = styled.span`
  font-family: ${({ theme }) => theme.type.mono};
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0.05em;
  font-variant-numeric: tabular-nums;
  color: inherit;
`;

export {
  Canon,
  Trafalgar,
  DoublePica,
  GreatPrimer,
  BodyCopy,
  Minion,
  PlateLabel,
  Caption,
  CipherText,
};
