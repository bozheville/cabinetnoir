import { describe, expect, it } from 'vitest';

import {
  railFenceEncrypt,
  railFenceDecrypt,
  railFenceTransform,
} from './railFence';

describe('railFenceEncrypt', () => {
  it('rides the classic zigzag and reads the rails row by row', () => {
    // Rails 3: rows are (A E), (B D F), (C) — the textbook example.
    expect(railFenceEncrypt('ABCDEF', 3)).toBe('AEBDFC');
  });

  it('two rails alternate', () => {
    expect(railFenceEncrypt('ABCD', 2)).toBe('ACBD');
  });

  it('offset shifts the starting rail', () => {
    // Starting on rail 1 heading down: pattern 1,2,1,0,1,2.
    expect(railFenceEncrypt('ABCDEF', 3, { offset: 1 })).toBe('DACEBF');
  });

  it('degenerate rails return the text', () => {
    expect(railFenceEncrypt('ABC', 1)).toBe('ABC');
    expect(railFenceEncrypt('', 3)).toBe('');
  });
});

describe('railFenceDecrypt', () => {
  it('inverts the encryption, offset included', () => {
    const samples = [
      'ATTACKATDAWN',
      'THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG',
      'A',
      'SHORT',
    ];
    for (const text of samples) {
      for (let rails = 2; rails <= 10; rails += 1) {
        for (let offset = 0; offset < rails; offset += 1) {
          expect(railFenceDecrypt(railFenceEncrypt(text, rails, { offset }), rails, { offset }))
            .toBe(text);
        }
      }
    }
  });

  it('matches the classic rail fence convention', () => {
    // WEAREDISCOVEREDFLEEATONCE on 3 rails is the canonical example:
    // rails read top to bottom give WECRLTE / ERDSOEEFEAOC / AIVDEN.
    expect(railFenceEncrypt('WEAREDISCOVEREDFLEEATONCE', 3))
      .toBe('WECRLTEERDSOEEFEAOCAIVDEN');
  });
});

describe('railFenceTransform', () => {
  it('dispatches by mode', () => {
    expect(railFenceTransform('ABCDEF', 3, false)).toBe('AEBDFC');
    expect(railFenceTransform('AEBDFC', 3, true)).toBe('ABCDEF');
  });
});
