import { describe, expect, it } from 'vitest';

import {
  ALPHABET_FIT_THRESHOLD,
  RingAction,
  RingLink,
  alphabetFit,
  columnLetters,
  mergedIC,
  ringAlphabet,
  solveRing,
  straightenRing,
  suggestPartners,
} from './alphabetRecovery';
import {
  BEAUFORT_TRANSFORM,
  SliceTransform,
  VARIANT_BEAUFORT_TRANSFORM,
  VIGENERE_TRANSFORM,
} from './sliceTransform';
import { STANDARD_ALPHABET } from './frequency';
import { keywordAlphabet } from '../../Keyword/keyword-crypt';
import { vigenereDecrypt, vigenereEncrypt } from '../../Vigenere/vigenere-encryption';
import { beaufortDecrypt, beaufortEncrypt } from '../../Beaufort/beaufort-crypt';

const PLAINTEXT = (
  'ITWASTHEBESTOFTIMESITWASTHEWORSTOFTIMESITWASTHEAGEOFWISDOMITWASTHEAGE'
  + 'OFFOOLISHNESSITWASTHEEPOCHOFBELIEFITWASTHEEPOCHOFINCREDULITYITWASTHE'
  + 'SEASONOFLIGHTITWASTHESEASONOFDARKNESSITWASTHESPRINGOFHOPEITWASTHEWINT'
  + 'EROFDESPAIRWEHADEVERYTHINGBEFOREUSWEHADNOTHINGBEFOREUSWEWEREALLGOINGD'
  + 'IRECTTOHEAVENWEWEREALLGOINGDIRECTTHEOTHERWAYINSHORTTHEPERIODWASSOFARL'
  + 'IKETHEPRESENTPERIODTHATSOMEOFITSNOISIESTAUTHORITIESINSISTEDONITSBEING'
  + 'RECEIVEDFORGOODORFOREVILINTHESUPERLATIVEDEGREEOFCOMPARISONONLY'
);

const MIXED = keywordAlphabet('KRYPTOS');

interface Variant {
  name: string;
  transform: SliceTransform;
  encrypt: (text: string, key: string, alphabet: string) => string;
  decrypt: (text: string, key: string, alphabet: string) => string;
  // Column offset m_j for key index k_j: pos(C) = ±pos(P) + m_j, the
  // sign shared by every column.
  offset: (key: number) => number;
}

const VARIANTS: Variant[] = [
  {
    name: 'Vigenère',
    transform: VIGENERE_TRANSFORM,
    encrypt: vigenereEncrypt,
    decrypt: vigenereDecrypt,
    offset: (key) => key,
  },
  {
    name: 'Beaufort',
    transform: BEAUFORT_TRANSFORM,
    encrypt: (text, key, alphabet) => beaufortEncrypt(text, key, alphabet),
    decrypt: (text, key, alphabet) => beaufortDecrypt(text, key, alphabet),
    offset: (key) => key,
  },
  {
    name: 'Variant Beaufort',
    transform: VARIANT_BEAUFORT_TRANSFORM,
    encrypt: (text, key, alphabet) => beaufortEncrypt(text, key, alphabet, { variant: 'variantBeaufort' }),
    decrypt: (text, key, alphabet) => beaufortDecrypt(text, key, alphabet, { variant: 'variantBeaufort' }),
    offset: (key) => -key,
  },
];

const mod = (value: number): number => ((value % 26) + 26) % 26;

// Is `ring` a rotation/decimation of `alphabet`?
const isReadingOf = (ring: string, alphabet: string): boolean => {
  for (const unit of [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25]) {
    for (let rotation = 0; rotation < 26; rotation += 1) {
      let candidate = '';
      for (let index = 0; index < 26; index += 1) {
        candidate += ring[mod(unit * index + rotation)];
      }
      if (candidate === alphabet) {
        return true;
      }
    }
  }
  return false;
};

// The links a perfect analyst would make: for every plaintext letter,
// its cipher letter in column `from` and in column `to`. Beaufort
// reflects the plaintext, which the ring absorbs as a decimation by −1.
const trueLinks = (
  alphabet: string,
  key: string,
  from: number,
  to: number,
  variant: Variant,
  plainLetters: string = STANDARD_ALPHABET,
): RingLink[] => {
  const sign = variant.transform.cipher === 'beaufort' ? -1 : 1;
  const m = (column: number) => variant.offset(alphabet.indexOf(key[column]));
  return plainLetters.split('').map((plain) => {
    const p = sign * alphabet.indexOf(plain);
    return {
      kind: 'link',
      fromColumn: from,
      from: alphabet[mod(p + m(from))],
      toColumn: to,
      to: alphabet[mod(p + m(to))],
    };
  });
};

describe('solveRing', () => {
  it('is empty and incomplete without actions', () => {
    const state = solveRing([]);
    expect(state.complete).toBe(false);
    expect(state.anchor).toBeNull();
    expect(state.slots.every((slot) => slot === null)).toBe(true);
  });

  it('keeps placements pending until a link anchors the ring', () => {
    const state = solveRing([{ kind: 'place', letter: 'Q', slot: 4 }]);
    expect(state.statuses).toEqual(['pending']);
  });

  it('flags invalid actions as conflicts', () => {
    const state = solveRing([
      { kind: 'link', fromColumn: 0, from: 'A', toColumn: 0, to: 'B' },
    ]);
    expect(state.statuses).toEqual(['conflict']);
  });

  it('flags a contradicting link without changing the ring', () => {
    const links = trueLinks(MIXED, `${MIXED[3]}${MIXED[4]}`, 0, 1, VARIANTS[0]);
    const bad: RingLink = { ...links[0], to: links[1].to };
    const state = solveRing([...links, bad]);
    expect(state.statuses.slice(0, -1).every((status) => status === 'applied')).toBe(true);
    expect(state.statuses[state.statuses.length - 1]).toBe('conflict');
    expect(isReadingOf(ringAlphabet(state)!, MIXED)).toBe(true);
  });

  VARIANTS.forEach((variant) => {
    it(`rebuilds a keyword alphabet from ${variant.name} links`, () => {
      // Key letters one slot apart in the mixed alphabet: distance 1.
      const key = `${MIXED[3]}${MIXED[4]}`;
      const state = solveRing(trueLinks(MIXED, key, 0, 1, variant));
      expect(state.complete).toBe(true);
      expect(state.statuses.every((status) => status === 'applied')).toBe(true);
      expect(isReadingOf(ringAlphabet(state)!, MIXED)).toBe(true);
    });
  });

  it('recovers when the first pair sits an even distance apart', () => {
    // Columns 0/1 are 2 apart (only half the ring reachable through
    // them), column 2 is 1 further: the solver must pick class 2.
    const key = `${MIXED[0]}${MIXED[2]}${MIXED[3]}`;
    const actions = [
      ...trueLinks(MIXED, key, 0, 1, VARIANTS[0]),
      ...trueLinks(MIXED, key, 1, 2, VARIANTS[0]),
    ];
    const state = solveRing(actions);
    expect(state.statuses.every((status) => status === 'applied')).toBe(true);
    expect(state.complete).toBe(true);
    expect(isReadingOf(ringAlphabet(state)!, MIXED)).toBe(true);
  });

  it('recovers when the first pair sits 13 apart', () => {
    const key = `${MIXED[0]}${MIXED[13]}${MIXED[1]}`;
    const actions = [
      ...trueLinks(MIXED, key, 0, 1, VARIANTS[0], 'ETAOIN'),
      ...trueLinks(MIXED, key, 0, 2, VARIANTS[0]),
    ];
    const state = solveRing(actions);
    expect(state.statuses.every((status) => status === 'applied')).toBe(true);
    expect(isReadingOf(ringAlphabet(state)!, MIXED)).toBe(true);
  });

  it('applies same-letter links as equal offsets', () => {
    const key = `${MIXED[5]}${MIXED[6]}${MIXED[5]}`;
    const links = trueLinks(MIXED, key, 0, 1, VARIANTS[0]);
    const same: RingAction = { kind: 'link', fromColumn: 0, from: 'E', toColumn: 2, to: 'E' };
    const state = solveRing([...links, same]);
    expect(state.statuses.every((status) => status === 'applied')).toBe(true);
    expect(state.offsets[2]).toBe(state.offsets[0]);
  });

  it('places letters the links cannot reach', () => {
    const key = `${MIXED[3]}${MIXED[4]}`;
    const links = trueLinks(MIXED, key, 0, 1, VARIANTS[0]).slice(0, 24);
    const partial = solveRing(links);
    expect(partial.complete).toBe(false);
    const empty = partial.slots.findIndex((slot) => slot === null);
    const missing = STANDARD_ALPHABET.split('').filter((letter) => !(letter in partial.positions));
    const placed = solveRing([...links, { kind: 'place', letter: missing[0], slot: empty }]);
    expect(placed.positions[missing[0]]).toBe(empty);
  });
});

describe('end to end', () => {
  VARIANTS.forEach((variant) => {
    it(`${variant.name}: links → alphabet → key → plaintext`, () => {
      const key = 'CIPHER';
      const ciphertext = variant.encrypt(PLAINTEXT, key, MIXED);
      const actions = [1, 2, 3, 4, 5].flatMap((column) => trueLinks(MIXED, key, 0, column, variant));
      const state = solveRing(actions);
      expect(state.complete).toBe(true);
      const straight = straightenRing(ringAlphabet(state)!);
      expect(straight?.alphabet).toBe(MIXED);
      expect(straight?.keyword).toBe('KRYPTOS');
      expect(variant.decrypt(ciphertext, key, straight!.alphabet)).toBe(PLAINTEXT);
    });

    it(`${variant.name}: an unstraightened ring still decrypts with some key`, () => {
      const key = 'CIPHER';
      const ciphertext = variant.encrypt(PLAINTEXT, key, MIXED);
      const ring = ringAlphabet(solveRing(
        [1, 2, 3, 4, 5].flatMap((column) => trueLinks(MIXED, key, 0, column, variant)),
      ))!;
      // Brute-force the key letter of every column under the ring.
      const recovered = Array.from({ length: 6 }, (_, column) => {
        const slice = columnLetters(ciphertext, 6, column);
        const plainSlice = columnLetters(PLAINTEXT, 6, column);
        return ring.split('').find((letter) => variant.decrypt(slice, letter, ring) === plainSlice);
      });
      expect(recovered.every(Boolean)).toBe(true);
    });
  });
});

describe('feedback', () => {
  it('merged IC is English-like for true links, random-like for wrong ones', () => {
    const key = 'CIPHER';
    const ciphertext = vigenereEncrypt(PLAINTEXT, key, MIXED);
    const good = solveRing([1, 2, 3, 4, 5].flatMap((column) => trueLinks(MIXED, key, 0, column, VARIANTS[0])));
    const goodIC = mergedIC(ciphertext, 6, good);
    expect(goodIC!.ic).toBeGreaterThan(0.06);

    const wrong = solveRing([1, 2, 3, 4, 5].flatMap((column) => trueLinks(MIXED, 'AQZMXB', 0, column, VARIANTS[0])));
    expect(mergedIC(ciphertext, 6, wrong)!.ic).toBeLessThan(goodIC!.ic - 0.015);
  });

  it('suggests partners by matching relative frequency', () => {
    expect(suggestPartners('EEEETTAB', 'QQQQWWRS', 'E', 1)).toEqual(['Q']);
    expect(suggestPartners('EEEETTAB', 'QQQQWWRS', 'T', 1)).toEqual(['W']);
    expect(suggestPartners('EEEETTAB', 'QQQQWWRS', 'Z')).toEqual([]);
  });

  VARIANTS.forEach((variant) => {
    it(`${variant.name}: alphabet fit separates right from mixed`, () => {
      const plain = variant.encrypt(PLAINTEXT, 'CIPHER', STANDARD_ALPHABET);
      const mixed = variant.encrypt(PLAINTEXT, 'CIPHER', MIXED);
      const mapIndex = variant.transform.mapIndex;
      expect(alphabetFit(plain, 6, STANDARD_ALPHABET, mapIndex)!).toBeLessThan(ALPHABET_FIT_THRESHOLD);
      expect(alphabetFit(mixed, 6, STANDARD_ALPHABET, mapIndex)!).toBeGreaterThan(ALPHABET_FIT_THRESHOLD);
      expect(alphabetFit(mixed, 6, MIXED, mapIndex)!).toBeLessThan(ALPHABET_FIT_THRESHOLD);
    });
  });
});

describe('straightenRing', () => {
  it('turns any reading of A–Z back into A–Z', () => {
    let ring = '';
    for (let index = 0; index < 26; index += 1) {
      ring += STANDARD_ALPHABET[mod(7 * index + 3)];
    }
    expect(straightenRing(ring)).toEqual({ alphabet: STANDARD_ALPHABET, keyword: null });
  });

  it('rejects malformed rings', () => {
    expect(straightenRing('ABC')).toBeNull();
    expect(straightenRing('A'.repeat(26))).toBeNull();
  });
});
