import { describe, expect, it } from 'vitest';

import { CIPHER_RULES, FAMILY_RULES, evaluateRules } from './rules';
import { profileText } from './profile';

const longEnglish =
  'THEQUICKBROWNFOXJUMPSOVERTHELAZYDOGANDTHENHERANINTOTHEWOODSWHERETHEHENSROOSTALLDAYLONGUNTILTHEFARMERCAMEHOMEPASTTHEOLDMILLANDDOWNTHELANE'.repeat(2);

const shiftText = (text: string, shift: number): string =>
  text.toUpperCase().replace(/[A-Z]/g, (letter) =>
    String.fromCharCode(((letter.charCodeAt(0) - 65 + shift) % 26) + 65));

const vigenereText = (text: string, key: string): string =>
  text.toUpperCase().replace(/[A-Z]/g, (letter, index) => {
    const keyShift = key.charCodeAt(index % key.length) - 65;
    return String.fromCharCode(((letter.charCodeAt(0) - 65 + keyShift) % 26) + 65);
  });

const firedFor = (input: string) => {
  const fires = evaluateRules(profileText(input), [...FAMILY_RULES, ...CIPHER_RULES]);
  return Object.fromEntries(fires.map((fire) => [fire.rule.id, fire.params]));
};

describe('family rules', () => {
  it('reads plain English as transposition-shaped', () => {
    const fires = firedFor(longEnglish);
    expect(fires.transpositionShape).toBeTruthy();
    expect(fires.substitutionShape).toBeUndefined();
    expect(fires.polyalphabeticNotPeriodic).toBeDefined(); // exclusion fired
  });

  it('reads a Caesar text as substitution-shaped, not transposition', () => {
    const fires = firedFor(shiftText(longEnglish, 7));
    expect(fires.substitutionShape).toBeDefined();
    expect(fires.transpositionNotEnglish).toBeDefined();
    expect(fires.transpositionShape).toBeUndefined();
    expect(fires.substitutionNotShuffled).toBeUndefined();
  });

  it('reads a Vigenere text as periodic polyalphabetic', () => {
    const fires = firedFor(vigenereText(longEnglish, 'LEMON'));
    expect(fires.periodicPolyalphabetic).toMatchObject({ period: 5 });
  });

  it('does not read plain English as periodic', () => {
    const fires = firedFor(longEnglish);
    expect(fires.periodicPolyalphabetic).toBeUndefined();
  });

  it('fires the ADFGVX set rule on fractionated text', () => {
    const fires = firedFor('FGXVADVAXDGVFXADXFGVADDXGVFAXVDGVFADXGVFAXVDXFGVADVAXDGVFXADXF');
    expect(fires.adfgvxSet).toMatchObject({ letters: 'ADFGVX' });
  });

  it('is deterministic', () => {
    expect(firedFor(longEnglish)).toEqual(firedFor(longEnglish));
  });
});

describe('cipher rules', () => {
  it('names Caesar with its shift', () => {
    const fires = firedFor(shiftText(longEnglish, 7));
    expect(fires.caesarBestShift).toMatchObject({ shift: 7 });
    expect(fires.rot13Shift).toBeUndefined();
  });

  it('names ROT13 at shift 13 (the Caesar rule deliberately skips 13)', () => {
    const fires = firedFor(shiftText(longEnglish, 13));
    expect(fires.rot13Shift).toBeDefined();
    expect(fires.caesarBestShift).toBeUndefined();
  });

  it('names Atbash on mirrored text', () => {
    const atbashAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').reverse().join('');
    const atbash = (text: string): string =>
      text.toUpperCase().replace(/[A-Z]/g, (letter) => atbashAlphabet[letter.charCodeAt(0) - 65]);
    const fires = firedFor(atbash(longEnglish));
    expect(fires.atbashMirror).toBeDefined();
    expect(fires.caesarBestShift).toBeUndefined();
  });

  it('names Vigenere via plain-shift slices', () => {
    const fires = firedFor(vigenereText(longEnglish, 'LEMON'));
    expect(fires.vigenereSlices).toMatchObject({ period: 5 });
  });

  it('rules Playfair out when the letter J appears', () => {
    const fires = firedFor(longEnglish);
    expect(fires.playfairHasJ).toBeDefined();
  });

  it('keeps Nihilist for digit sums in range', () => {
    const fires = firedFor('23 45 64 72 84 95 33 43 52 63');
    expect(fires.nihilistDigits).toMatchObject({ pairs: 10 });
    expect(fires.nihilistDigitsDominant).toMatchObject({ ratio: 100 });
    expect(fires.nihilistBlockShape).toBeDefined();
  });

  it('supports a Nihilist near-miss without the strict flag', () => {
    // One number (61) cannot be a no-carry sum: the strict rule stays
    // silent, the graded rules still fire.
    const fires = firedFor('23 45 61 72 84 95 33 43 52 63');
    expect(fires.nihilistDigits).toBeUndefined();
    expect(fires.nihilistDigitsDominant).toMatchObject({ ratio: 90 });
    expect(fires.nihilistBlockShape).toBeDefined();
  });

  it('keeps a dense stream with a three-digit sum Nihilist', () => {
    const fires = firedFor('34561104728');
    expect(fires.nihilistDigits).toMatchObject({ pairs: 5 });
  });

  it('does not fire Nihilist rules on random digits', () => {
    const fires = firedFor('1812141619');
    expect(fires.nihilistDigits).toBeUndefined();
    expect(fires.nihilistDigitsDominant).toBeUndefined();
    expect(fires.nihilistBlockShape).toBeUndefined();
  });
});
