// Regression vectors for the ADFGVX engine, pinned when its transposition
// stage moved onto the shared transposition core (m1-07). The outputs must
// not change — the challenges and worked examples are computed from this
// engine, and the cracker's column analysis depends on the padded shape.
import { describe, expect, it } from 'vitest';

import { adfgvxEncrypt, adfgvxDecrypt } from './adfgvx-encryption';

describe('adfgvx engine (pinned regression vectors)', () => {
  it('encrypts ADFGVX', () => {
    expect(adfgvxEncrypt('ATTACKATDAWN', 'NIGHT', 'GERMAN', 'adfgvx'))
      .toBe('AFDAXXXXAAAAVDVVVAFAADAG');
  });

  it('encrypts ADFGX', () => {
    expect(adfgvxEncrypt('ATTACKATDAWN', 'NIGHT', 'GERMAN', 'adfgx'))
      .toBe('AFDAAAAADDDDXFXDXDGAADAX');
  });

  it('encrypts a longer text with an uneven transposition key', () => {
    expect(adfgvxEncrypt('WEAREDISCOVEREDFLEEATONCE', 'Kriegs', 'Marine', 'adfgvx'))
      .toBe('VDFVDVGVGAGFGGGDFXGGXGGDAGXGAAFADAFADDDADAGDXAAAGAFDFX');
  });

  it('round-trips through the remainder-aware decode', () => {
    // GERMANO (7 columns) over 24 fractionated letters → short last row.
    expect(adfgvxDecrypt(
      adfgvxEncrypt('ATTACKATDAWN', 'NIGHT', 'GERMANO', 'adfgvx'),
      'NIGHT',
      'GERMANO',
      'adfgvx',
    )).toBe('ATTACKATDAWN99');
  });
});
