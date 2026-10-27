// The Beaufort family: two Vigenère relatives that subtract the other
// way round, sharing Vigenère's periodic key. Both engines here follow
// the Vigenère engine's conventions (letters-only, uppercased output,
// per-letter key cycling over the clean key letters).
//
// - Classic Beaufort: C = K − P. Reciprocal — the same operation
//   encrypts and decrypts (swapping plaintext and ciphertext does the
//   inverse by itself), which the tests assert explicitly.
// - Variant Beaufort: C = P − K. Decrypts with P = C + K — the same
//   arithmetic as Vigenère with a negated key, so statistically it is
//   indistinguishable from Vigenère (the cracker cracks classic
//   Beaufort via reflected shifts, the variant via plain ones).

export const DEFAULT_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export type BeaufortVariant = 'beaufort' | 'variantBeaufort';

export interface BeaufortOptions {
  // Classic Beaufort by default; the variant subtracts the other way.
  variant?: BeaufortVariant;
  // Keep spaces in the output, riding between the enciphered letters
  // exactly where they sat in the input (rail-fence convention). The
  // key advances on letters only.
  keepSpaces?: boolean;
}

export const isBeaufortVariant = (value: string): value is BeaufortVariant =>
  value === 'beaufort' || value === 'variantBeaufort';

const mod = (value: number, length: number): number => ((value % length) + length) % length;

// Cipher index from (plain, key) — classic Beaufort C = K − P, variant
// C = P − K. Decryption inverts by swapping the operands (classic) or
// adding (variant):
//   classic: C = K − P  →  P = K − C  (the same formula, operands swapped)
//   variant: C = P − K  →  P = C + K
const cipherIndex = (plain: number, key: number, variant: BeaufortVariant, length: number): number =>
  variant === 'beaufort' ? mod(key - plain, length) : mod(plain - key, length);

const plainIndex = (cipher: number, key: number, variant: BeaufortVariant, length: number): number =>
  variant === 'beaufort' ? mod(key - cipher, length) : mod(cipher + key, length);

const transform = (
  input: string,
  key: string,
  alphabet: string,
  variant: BeaufortVariant,
  decrypt: boolean,
  keepSpaces: boolean,
): string => {
  const keyArray = key
    .toUpperCase()
    .split('')
    .filter((letter) => alphabet.includes(letter))
    .join('');
  if (!input || !keyArray) {
    return '';
  }

  const length = alphabet.length;
  const toIndex = decrypt ? plainIndex : cipherIndex;
  let keyIndex = 0;
  let output = '';
  for (const char of input.toUpperCase()) {
    if (char === ' ' && keepSpaces) {
      output += ' ';
      continue;
    }
    if (!alphabet.includes(char)) {
      continue;
    }
    const a = alphabet.indexOf(char);
    const b = alphabet.indexOf(keyArray[keyIndex++ % keyArray.length]);
    output += alphabet[toIndex(a, b, variant, length)];
  }
  return output;
};

export const beaufortEncrypt = (
  input: string,
  key: string,
  alphabet: string = DEFAULT_ALPHABET,
  options: BeaufortOptions = {},
): string =>
  transform(
    input,
    key,
    alphabet,
    options.variant ?? 'beaufort',
    false,
    options.keepSpaces ?? false,
  );

export const beaufortDecrypt = (
  input: string,
  key: string,
  alphabet: string = DEFAULT_ALPHABET,
  options: BeaufortOptions = {},
): string =>
  transform(
    input,
    key,
    alphabet,
    options.variant ?? 'beaufort',
    true,
    options.keepSpaces ?? false,
  );
