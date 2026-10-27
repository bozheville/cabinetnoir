import { describe, expect, it } from 'vitest';

import {
  SAKNUSSEMM_DEFAULTS,
  SAKNUSSEMM_PARCHMENT_DICTATION,
  SAKNUSSEMM_PARCHMENT_PLAIN,
  saknussemmClusterCount,
  saknussemmDecrypt,
  saknussemmEncrypt,
  saknussemmTransform,
} from './saknussemm-crypt';

const lettersOnly = (text: string): string => text.toUpperCase().replace(/[^A-Z]/g, '');

describe('saknussemmClusterCount', () => {
  it('pads the clusters to whole output lines', () => {
    // 13 letters at 3 per cluster → 5 clusters needed → 2 clusters per
    // line → padded to 6 clusters.
    expect(saknussemmClusterCount(13, { clusterWidth: 3, clustersPerLine: 2 })).toBe(6);
    // The novel: 133 letters at 7 per cluster → 19 clusters → 3 per
    // line → padded to 21 clusters.
    expect(saknussemmClusterCount(133, SAKNUSSEMM_DEFAULTS)).toBe(21);
  });

  it('never shrinks below what the text needs', () => {
    for (let length = 1; length <= 200; length += 7) {
      const count = saknussemmClusterCount(length, { clusterWidth: 5, clustersPerLine: 3 });
      expect(count * 5).toBeGreaterThanOrEqual(length);
      expect(count % 3).toBe(0);
    }
  });
});

describe('saknussemmEncrypt', () => {
  it('produces the hand-computed 5-by-3 vector', () => {
    // 13 letters, clusterWidth 3, clustersPerLine 2. Reversed stream
    // MLKJIHGFEDCBA fills a 3×6 grid row-major; the columns read down
    // are MGA LF KE JD IC HB, printed 2 per line.
    expect(saknussemmEncrypt('ABCDEFGHIJKLM', { clusterWidth: 3, clustersPerLine: 2 }))
      .toBe('MGA LF\nKE JD\nIC HB');
  });

  it('strips everything but letters and uppercases', () => {
    const stripped = saknussemmEncrypt('a-b-c!', { clusterWidth: 2, clustersPerLine: 2 });
    // Reversed stream CBA in a 2×2 grid: columns read down are CA, B.
    expect(stripped.replace(/[^A-Z]/g, '')).toBe('CAB');
  });

  it('returns empty for letterless input', () => {
    expect(saknussemmEncrypt('123 — 456', SAKNUSSEMM_DEFAULTS)).toBe('');
  });

  it('reproduces the parchment shape: 21 clusters, 7 lines, 3 per line, at most 7 letters each', () => {
    const output = saknussemmEncrypt(SAKNUSSEMM_PARCHMENT_PLAIN, SAKNUSSEMM_DEFAULTS);
    const lines = output.split('\n');
    expect(lines).toHaveLength(7);
    const clusters = lines.flatMap((line) => line.split(' '));
    expect(clusters).toHaveLength(21);
    for (const line of lines) {
      expect(line.split(' ')).toHaveLength(3);
    }
    for (const cluster of clusters) {
      expect(cluster.length).toBeLessThanOrEqual(7);
    }
  });

  it('is a pure transposition: the clusters share the plaintext letters', () => {
    const output = saknussemmEncrypt(SAKNUSSEMM_PARCHMENT_PLAIN, SAKNUSSEMM_DEFAULTS);
    expect(lettersOnly(output).split('').sort().join(''))
      .toBe(lettersOnly(SAKNUSSEMM_PARCHMENT_PLAIN).split('').sort().join(''));
  });

  it('lays cluster k along the reversed message: cluster k = S[k::21]', () => {
    // The novel's verified relation: each dictated line is the reversed
    // message read with stride 21 (the cluster count), cluster k taking
    // S[k], S[k+21], S[k+42], …
    const reversed = lettersOnly(SAKNUSSEMM_PARCHMENT_PLAIN).split('').reverse().join('');
    const clusters = saknussemmEncrypt(SAKNUSSEMM_PARCHMENT_PLAIN, SAKNUSSEMM_DEFAULTS)
      .split('\n').flatMap((line) => line.split(' '));
    clusters.forEach((cluster, index) => {
      let expected = '';
      for (let i = index; i < reversed.length; i += clusters.length) {
        expected += reversed[i];
      }
      expect(cluster).toBe(expected);
    });
  });
});

describe('saknussemmDecrypt', () => {
  it('inverts the hand vector', () => {
    expect(saknussemmDecrypt('MGA LF\nKE JD\nIC HB', { clusterWidth: 3, clustersPerLine: 2 }))
      .toBe('ABCDEFGHIJKLM');
  });

  it('splits a whitespace-free blob by the ragged cluster lengths', () => {
    expect(saknussemmDecrypt('MGALFKEJDICHB', { clusterWidth: 3, clustersPerLine: 2 }))
      .toBe('ABCDEFGHIJKLM');
  });

  it('round-trips every shape', () => {
    const texts = [
      'HELLO',
      'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG',
      SAKNUSSEMM_PARCHMENT_PLAIN,
    ];
    const shapes = [
      { clusterWidth: 2, clustersPerLine: 2 },
      { clusterWidth: 3, clustersPerLine: 2 },
      SAKNUSSEMM_DEFAULTS,
      { clusterWidth: 12, clustersPerLine: 6 },
    ];
    for (const text of texts) {
      for (const shape of shapes) {
        const letters = lettersOnly(text);
        const encrypted = saknussemmEncrypt(text, shape);
        expect(saknussemmDecrypt(encrypted, shape)).toBe(letters);
        expect(saknussemmDecrypt(encrypted.replace(/\s/g, ''), shape)).toBe(letters);
      }
    }
  });

  it('decodes the novel dictation up to its documented transcription drift', () => {
    // The Gutenberg dictation carries the parchment's punctuation as
    // grid cells and skips one corroded rune (an E) — 132 letters to
    // the message's 133. Decoding it with the parchment shape still
    // recovers the Latin message letter-for-letter on most positions.
    const decoded = saknussemmDecrypt(SAKNUSSEMM_PARCHMENT_DICTATION, SAKNUSSEMM_DEFAULTS);
    const plain = lettersOnly(SAKNUSSEMM_PARCHMENT_PLAIN);
    expect(decoded).toHaveLength(plain.length - 1);
    // The letters it does carry are exactly the message's letters
    // minus the corroded E — the transposition-only proof.
    expect(decoded.split('').sort().join(''))
      .toBe(plain.split('').sort().join('').replace('E', ''));
  });

  it('returns empty for letterless input', () => {
    expect(saknussemmDecrypt('   ', SAKNUSSEMM_DEFAULTS)).toBe('');
  });
});

describe('saknussemmTransform', () => {
  it('dispatches to encrypt and decrypt', () => {
    expect(saknussemmTransform('ABC', false, { clusterWidth: 2, clustersPerLine: 2 }))
      .toBe(saknussemmEncrypt('ABC', { clusterWidth: 2, clustersPerLine: 2 }));
    expect(saknussemmTransform('CBA', true, { clusterWidth: 2, clustersPerLine: 2 }))
      .toBe(saknussemmDecrypt('CBA', { clusterWidth: 2, clustersPerLine: 2 }));
  });

  it('defaults to the parchment shape', () => {
    expect(saknussemmTransform('ABC', false))
      .toBe(saknussemmEncrypt('ABC', SAKNUSSEMM_DEFAULTS));
  });
});
