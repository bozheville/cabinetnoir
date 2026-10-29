import React, { useRef, useState} from 'react';
import styled, { css } from 'styled-components';
import { Patch } from '@atoms';

import useStatisticalCryptanalysis from './useStatisticalCryptanalysis';
import { monoalphabeticEncrypt } from '@encryptors/Monoalphabetic/monoalphabetic-crypt';
import { alphabet } from '@encryptors/constants';
import { TextInput } from '@atoms';
import { parseText } from '@math/parser';
import { useEffect } from 'react';

import { text, stattext } from './texts';
import StatTable from './StatTable';
import { splitByGroups, generateFullStats, shuffle } from './utils';


const weights = {
  message: 400,
  standalone: 800,
  double: 800,
  cryptogram: 400,
  group0: 600,
  group1: 600,
  group2: 600,
  group3: 600,
  group4: 600,
  group5: 600,
  group6: 600,
  group7: 600,
  group8: 600,
  group9: 600,
};

// Group colours cycle the eight enamel data inks (spec 01 §6);
// highlighted groups read as cream text on the enamel fill.
const colors = css<{type: string; isHighlighted: boolean}>`
  color: ${({ type, isHighlighted, theme }) => isHighlighted && type?.match('group') ? theme.ink.cream
  : type === 'message' ? theme.ink.green
  : type === 'standalone' ? theme.data[3]
  : type === 'double' ? theme.data[1]
  : type === 'cryptogram' ? theme.ink.primary
  : type?.match(/^group(\d+)$/) ? theme.data[Number(type.slice(5)) % theme.data.length]
  : theme.ink.primary
  };
`;

const backgrounds = css<{type: string; isHighlighted: boolean}>`
  background-color: ${({ type, isHighlighted, theme }) => !isHighlighted ? 'transparent'
  : type?.match(/^group(\d+)$/) ? theme.data[Number(type.slice(5)) % theme.data.length]
  : 'transparent'
  };
`;

export const Text = styled.span<React.HTMLAttributes<HTMLSpanElement> & {type: string; isHighlighted: boolean}>`
  ${() => colors};
  ${() => backgrounds};
  font-weight: ${({ type }) => weights[type]};
`;

// Standard page anatomy for the legacy stats tool: tan band (spec 06 §7).
export const StatisticalCryptanalysisSection = styled(Patch).attrs({
  leather: 'tan',
  stitch: 'both',
})`
  flex: 1 0 auto;
  width: 100%;
`;

export const TextWrapper = styled.div`
  width: 100%;
  word-break: break-all;
`;

export const ParsedStats = styled.div`
  display: flex;
  flex-direaction: row;

  & > div {
    display: flex;
    flex-direaction: column;
    width: 50%;
    padding: 8px;
  }
`;
