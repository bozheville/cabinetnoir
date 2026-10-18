import { describe, expect, it } from 'vitest';

import { FAMILY_RULES, evaluateRules } from './rules';
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
  const fires = evaluateRules(profileText(input), FAMILY_RULES);
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
