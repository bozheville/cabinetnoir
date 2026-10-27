// The slice arithmetic of the Vigenère family, in one place.
//
// Every periodic polyalphabetic cracker on this site walks the same
// wizard; the only thing that differs between the ciphers is how a key
// letter maps (cipher letter, plaintext letter):
//
//   Vigenère:          C = P + K  →  P = C − K,  K = C − P
//   Beaufort:          C = K − P  →  P = K − C,  K = C + P
//   Variant Beaufort:  C = P − K  →  P = C + K,  K = P − C
//
// The three views of that relation:
// - `mapIndex` (FrequencyChart): which observed cipher letter a display
//   position shows under the current key letter.
// - `decryptIndex` (preview): plaintext index from cipher and key.
// - `keyIndex` (cribs): key index from cipher and plaintext.

export type SliceCipher = 'vigenere' | 'beaufort' | 'variantBeaufort';

export interface SliceTransform {
  cipher: SliceCipher;
  mapIndex: (displayIndex: number, shift: number) => number;
  decryptIndex: (cipher: number, key: number) => number;
  keyIndex: (cipher: number, plain: number) => number;
}

const LENGTH = 26;
const mod = (value: number): number => ((value % LENGTH) + LENGTH) % LENGTH;

export const VIGENERE_TRANSFORM: SliceTransform = {
  cipher: 'vigenere',
  mapIndex: (displayIndex, shift) => mod(displayIndex + shift),
  decryptIndex: (cipher, key) => mod(cipher - key),
  keyIndex: (cipher, plain) => mod(cipher - plain),
};

export const BEAUFORT_TRANSFORM: SliceTransform = {
  cipher: 'beaufort',
  mapIndex: (displayIndex, shift) => mod(shift - displayIndex),
  decryptIndex: (cipher, key) => mod(key - cipher),
  keyIndex: (cipher, plain) => mod(cipher + plain),
};

export const VARIANT_BEAUFORT_TRANSFORM: SliceTransform = {
  cipher: 'variantBeaufort',
  mapIndex: (displayIndex, shift) => mod(displayIndex - shift),
  decryptIndex: (cipher, key) => mod(cipher + key),
  keyIndex: (cipher, plain) => mod(plain - cipher),
};

export const sliceTransform = (cipher: SliceCipher): SliceTransform =>
  cipher === 'beaufort'
    ? BEAUFORT_TRANSFORM
    : cipher === 'variantBeaufort'
      ? VARIANT_BEAUFORT_TRANSFORM
      : VIGENERE_TRANSFORM;
