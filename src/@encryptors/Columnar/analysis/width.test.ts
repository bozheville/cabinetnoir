import { describe, expect, it } from 'vitest';

import {
  splitIntoColumns,
  digraphPairScore,
  pairScoreMatrix,
  bestChainScore,
  rankWidths,
} from './width';
import { columnarEncryptText } from '../columnar-crypt';

// Fixture texts (200+ letters each), encrypted with known widths — the
// Done-when of this task: the correct width ranks in the top 3.
const DICKENS =
  'ITWASTHEBESTOFTIMESITWASTHEWORSTOFTIMESITWASTHEAGEOFWISDOMITWASTHEAGE'
  + 'OFFOOLISHNESSITWASTHEEPOCHOFBELIEFITWASTHEEPOCHOFINCREDULITYITWASTHE'
  + 'SEASONOFLIGHTITWASTHESEASONOFDARKNESSITWASTHESPRINGOFHOPEITWASTHEWIN'
  + 'TEROFDESPAIR';
const AUSTEN =
  'ITISATRUTHUNIVERSALLYACKNOWLEDGEDTHATASINGLEMANINPOSSESSIONOFAGOODFOR'
  + 'TUNEMUSTBEINWANTOFAWIFEHOWEVERLITTLEKNOWNTHEFEELINGSORVIEWSOFSUCHAMA'
  + 'NMAYBEONHISFIRSTENTERINGANEIGHBOURHOODTHISIDEAISSOFIXEDINTHEMINDS';
const GETTYSBURG =
  'FOURSCOREANDSEVENYEARSAGOOURFATHERSBROUGHTFORTHONTHISCONTINENTANEWNA'
  + 'TIONCONCEIVEDINLIBERTYANDDEDICATEDTOTHEPROPOSITIONTHATALLMENARECREAT'
  + 'EDEQUALNOWWEAREENGAGEDINGREATCIVILWARTESTINGWHETHERTHATNATIONORANYNA'
  + 'TIONSOCONCEIVEDANDSODEDICATEDCANLONGENDURE';
const PANGRAMS =
  'THEQUICKBROWNFOXJUMPSOVERTHELAZYDOGPACKMYBOXWITHFIVEDOZENLIQUORJUGSH'
  + 'OWVEXINGLYDAFTDEFICTIONSVEXJACKDAWSPHINXOFBLACKQUARTZJUDGEMYVOWTHEFI'
  + 'VEBOXINGWIZARDSJUMPQUICKLYJUXTOSEDQUARRELZINGDYNAMICSMAKEFOXVIDEOGAM'
  + 'ESMYGIRFWIXEDASPHALTBLONDQUIZ';

const FIXTURES: Array<{ text: string; key: string }> = [
  { text: DICKENS, key: 'ZEBRA' },
  { text: AUSTEN, key: 'YELLOW' },
  { text: GETTYSBURG, key: 'VICTORY' },
  { text: PANGRAMS, key: 'QUARTZ' },
  { text: PANGRAMS + DICKENS.slice(0, 60), key: 'NAVALCODE' },
];

describe('splitIntoColumns', () => {
  it('cuts a complete grid into equal columns', () => {
    // Ciphertext = column 0 ('AC') + column 1 ('BD') for the grid AB/CD.
    expect(splitIntoColumns('ACBD', 2)).toEqual(['AC', 'BD']);
    expect(splitIntoColumns('ABCD', 3)).toEqual([]);
  });
});

describe('digraphPairScore / pairScoreMatrix', () => {
  it('scores an English pair above a noise pair', () => {
    expect(digraphPairScore('THE_', 'IN__')).toBeGreaterThan(digraphPairScore('QX_', 'JZ__'));
  });

  it('zeroes the diagonal', () => {
    const matrix = pairScoreMatrix(['THE', 'INX']);
    expect(matrix[0][0]).toBe(0);
    expect(matrix[0][1]).toBeGreaterThan(0);
  });
});

describe('bestChainScore', () => {
  it('prefers the arrangement that reads like English', () => {
    // Columns of "THIS IS": correct adjacency (TH, HI, IS) outscores any
    // scrambled order of the same letters.
    const good = pairScoreMatrix(['TEHS', 'IS_I']);
    expect(bestChainScore(good)).toBeGreaterThan(0);
  });
});

describe('rankWidths', () => {
  it('ranks the correct width in the top 3 on every fixture', () => {
    for (const { text, key } of FIXTURES) {
      expect(text.length).toBeGreaterThanOrEqual(200);
      const ciphertext = columnarEncryptText(text, key);
      const ranked = rankWidths(ciphertext);
      const position = ranked.findIndex(({ width }) => width === key.length);
      expect(position).toBeGreaterThanOrEqual(0);
      expect(position).toBeLessThan(3);
    }
  });

  it('only proposes divisors of the ciphertext length', () => {
    const ciphertext = columnarEncryptText(FIXTURES[0].text, 'ZEBRA');
    for (const { width } of rankWidths(ciphertext)) {
      expect(ciphertext.length % width).toBe(0);
    }
  });
});
