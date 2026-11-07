import { describe, expect, it } from 'vitest';

import { RingAction, solveRing } from './alphabetRecovery';
import { previewLink, shareGap, weakestLink } from './linkPreview';
import { keywordAlphabet } from '../../Keyword/keyword-crypt';
import { vigenereEncrypt } from '../../Vigenere/vigenere-encryption';

const PLAINTEXT = (
  'ITWASTHEBESTOFTIMESITWASTHEWORSTOFTIMESITWASTHEAGEOFWISDOMITWASTHEAGE'
  + 'OFFOOLISHNESSITWASTHEEPOCHOFBELIEFITWASTHEEPOCHOFINCREDULITYITWASTHE'
  + 'SEASONOFLIGHTITWASTHESEASONOFDARKNESSITWASTHESPRINGOFHOPEITWASTHEWINT'
  + 'EROFDESPAIRWEHADEVERYTHINGBEFOREUSWEHADNOTHINGBEFOREUSWEWEREALLGOINGD'
  + 'IRECTTOHEAVENWEWEREALLGOINGDIRECTTHEOTHERWAYINSHORTTHEPERIODWASSOFARL'
  + 'IKETHEPRESENTPERIODTHATSOMEOFITSNOISIESTAUTHORITIESINSISTEDONITSBEING'
  + 'RECEIVEDFORGOODORFOREVILINTHESUPERLATIVEDEGREEOFCOMPARISONONLY'
);
const ALPHABET = keywordAlphabet('KRYPTOS');
const KEY = 'CAT';
const LETTERS = vigenereEncrypt(PLAINTEXT, KEY, ALPHABET);

const mod = (value: number): number => ((value % 26) + 26) % 26;
const cipherOf = (plain: string, column: number): string => (
  ALPHABET[mod(ALPHABET.indexOf(plain) + ALPHABET.indexOf(KEY[column]))]
);
const trueLink = (plain: string, from: number, to: number): RingAction => ({
  kind: 'link', fromColumn: from, from: cipherOf(plain, from), toColumn: to, to: cipherOf(plain, to),
});

const preview = (actions: RingAction[], plain: string, from = 0, to = 1) => previewLink({
  letters: LETTERS,
  keyLength: 3,
  actions,
  state: solveRing(actions),
  fromColumn: from,
  toColumn: to,
  selected: cipherOf(plain, from),
});

describe('shareGap', () => {
  it('is small for equal shares and large for very different ones', () => {
    expect(shareGap(0.12, 150, 0.12, 150)).toBe(0);
    expect(shareGap(0.12, 150, 0.02, 150)).toBeGreaterThan(3);
  });
});

describe('previewLink', () => {
  it('flags a clash with the ring', () => {
    const actions = [trueLink('E', 0, 1), trueLink('T', 0, 1)];
    const result = preview(actions, 'E');
    const wrong = Object.values(result.candidates).filter((c) => c.letter !== cipherOf('E', 1));
    expect(wrong.every((candidate) => candidate.clash)).toBe(true);
    expect(result.candidates[cipherOf('E', 1)].clash).toBe(false);
  });

  it('counts the letters a link would place, cascades included', () => {
    // A strip of slice-1→2 links: s0→s1, s2→s3, s3→s4. Only s0→s1 is on
    // the ring; linking s1→s2 joins the waiting strip and places 3.
    const plainOf = (cipher: string, column: number): string => (
      ALPHABET[mod(ALPHABET.indexOf(cipher) - ALPHABET.indexOf(KEY[column]))]
    );
    const strip = [cipherOf('E', 0)];
    for (let step = 0; step < 4; step += 1) {
      strip.push(cipherOf(plainOf(strip[step], 0), 1));
    }
    const link = (from: string, to: string): RingAction => ({ kind: 'link', fromColumn: 0, from, toColumn: 1, to });
    const actions = [link(strip[0], strip[1]), link(strip[2], strip[3]), link(strip[3], strip[4])];
    const state = solveRing(actions);
    const result = previewLink({
      letters: LETTERS, keyLength: 3, actions, state, fromColumn: 0, toColumn: 1, selected: strip[1],
    });
    // The ring holds the longer strip; joining places the other two.
    expect(result.candidates[strip[2]].gained).toBe(2);
    // strip[1] is the link's own new letter; strip[0] comes along.
    expect(result.candidates[strip[2]].cascade).toBe(1);
  });

  it('rates only the true partner at full confidence once the ring is rich', () => {
    // A long strip of slice-1→3 links; then slice 1 → slice 2.
    const plainOf = (cipher: string, column: number): string => (
      ALPHABET[mod(ALPHABET.indexOf(cipher) - ALPHABET.indexOf(KEY[column]))]
    );
    const strip = [cipherOf('E', 0)];
    for (let step = 0; step < 24; step += 1) {
      strip.push(cipherOf(plainOf(strip[step], 0), 2));
    }
    const actions: RingAction[] = strip.slice(0, -1).map((from, index) => ({
      kind: 'link', fromColumn: 0, from, toColumn: 2, to: strip[index + 1],
    }));
    const state = solveRing(actions);
    let full = 0;
    'ETAOINSHRDLUCMWFGYPB'.split('').forEach((plain) => {
      const result = previewLink({
        letters: LETTERS, keyLength: 3, actions, state, fromColumn: 0, toColumn: 1, selected: cipherOf(plain, 0),
      });
      Object.values(result.candidates).forEach((candidate) => {
        if (candidate.confidence === 3) {
          expect(candidate.letter).toBe(cipherOf(plain, 1));
          full += 1;
        }
      });
    });
    expect(full).toBeGreaterThan(5);
  });

  it('never rates a lone first link above plausible', () => {
    const result = preview([], 'E');
    expect(result.origin).toBe(true);
    expect(result.rated).toBe(false);
    expect(Object.values(result.candidates).every((c) => c.cascade === 0 && (c.waits || c.gained === 2))).toBe(true);
    expect(Math.max(...Object.values(result.candidates).map((c) => c.confidence))).toBeLessThanOrEqual(1);
  });

  it('calls mid-frequency letters too close on a first link', () => {
    expect(preview([], 'N').closeCall).toBe(true);
  });
});

describe('weakestLink', () => {
  it('picks the link whose letters differ most in share', () => {
    const actions: RingAction[] = [trueLink('E', 0, 1), trueLink('T', 0, 1), {
      kind: 'link', fromColumn: 0, from: cipherOf('E', 0), toColumn: 1, to: cipherOf('Z', 1),
    }];
    expect(weakestLink(LETTERS, 3, actions)?.index).toBe(2);
  });
});
