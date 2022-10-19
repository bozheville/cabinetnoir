import React, { useRef, useState} from 'react';
import styled, { css } from 'styled-components';
import Section from '@atoms/Section/Section';

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

const colors = css<{type: string; isHighlighted: boolean}>`
  color: ${({ type, isHighlighted, theme }) => isHighlighted && type.match('group') ? 'white'
  : type === 'message' ? 'green'
  : type === 'message' ? theme.colorScheme.green[400]
  : type === 'standalone' ? theme.colorScheme.orange[500]
  : type === 'double' ? 'blue'
  : type === 'cryptogram' ? 'black'
  : type === 'group0' ? theme.colorScheme.yellow_orange[500]
  : type === 'group1' ? theme.colorScheme.yellow_orange[700]
  : type === 'group2' ? theme.colorScheme.yellow_orange[600]
  : type === 'group3' ? theme.colorScheme.red_violet[700]
  : type === 'group4' ? theme.colorScheme.red_violet[600]
  : type === 'group5' ? theme.colorScheme.red_orange[800]
  : type === 'group6' ? theme.colorScheme.red_orange[700]
  : type === 'group7' ? theme.colorScheme.red_orange[600]
  : type === 'group8' ? theme.colorScheme.red_orange[500]
  : type === 'group9' ? theme.colorScheme.red_orange[400]
  : 'black'
  };
`;

const backgrounds = css<{type: string; isHighlighted: boolean}>`
  background-color: ${({ type, isHighlighted, theme }) => !isHighlighted ? 'transpatent'
  : type === 'group0' ? theme.colorScheme.yellow_orange[500]
  : type === 'group1' ? theme.colorScheme.yellow_orange[700]
  : type === 'group2' ? theme.colorScheme.yellow_orange[600]
  : type === 'group3' ? theme.colorScheme.red_violet[700]
  : type === 'group4' ? theme.colorScheme.red_violet[600]
  : type === 'group5' ? theme.colorScheme.red_orange[800]
  : type === 'group6' ? theme.colorScheme.red_orange[700]
  : type === 'group7' ? theme.colorScheme.red_orange[600]
  : type === 'group8' ? theme.colorScheme.red_orange[500]
  : type === 'group9' ? theme.colorScheme.red_orange[400]
  : 'transpatent'
  };
`;

export const Text = styled.span<React.HTMLAttributes<HTMLSpanElement> & {type: string; isHighlighted: boolean}>`
  ${() => colors};
  ${() => backgrounds};
  font-weight: ${({ type }) => weights[type]};
`;

export const StatisticalCryptanalysisSection = styled(Section)`
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
