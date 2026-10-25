// Polybius square cipher: every plaintext letter becomes its square
// coordinates — a two-digit number whose digits are the row and column.
//
// A substitution in disguise: the coordinates just rename the letters
// (I/J share a cell), which is why the cipher has no cracker of its own
// — a keyed square is a keyword substitution read through a grid, and
// the keyword cracker breaks it.
//
// Pure string in / string out, shared by the tool, the worked examples
// and the challenges, so all of them stay consistent.

import {
  buildSquare,
  fromCoordinates,
  toCoordinates,
} from '@encryptors/shared/polybius';

export interface PolybiusCryptProps {
  input: string;
  // Keyed square keyword; empty → the plain square.
  keyword?: string;
  // A full 25-letter square from the cracker's hand-off; wins over the
  // keyword when set.
  square?: string;
  // Space-separated digit pairs ("23 41 11") or a continuous stream.
  spaced?: boolean;
}

// Plaintext cleaning: uppercase, J folded into I, letters only.
const cleanPlaintext = (text: string): string =>
  text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');

export const resolveSquare = ({
  keyword,
  square,
}: Pick<PolybiusCryptProps, 'keyword' | 'square'>): string =>
  square && square.length === 25
    ? square.toUpperCase()
    : buildSquare(keyword ?? '', { size: 5 });

export const polybiusEncrypt = ({
  input,
  keyword,
  square,
  spaced = true,
}: PolybiusCryptProps): string => {
  const squareString = resolveSquare({ keyword, square });
  const plaintext = cleanPlaintext(input);
  const pairs = plaintext.split('').map((letter) => toCoordinates(letter, squareString));
  return pairs.filter(Boolean).join(spaced ? ' ' : '');
};

// Ciphertext tolerance: the digits are read as consecutive pairs; any
// other character (spaces, punctuation) is ignored, so both the spaced
// and the continuous format decode.
export const polybiusDecrypt = ({
  input,
  keyword,
  square,
}: PolybiusCryptProps): string => {
  const squareString = resolveSquare({ keyword, square });
  const digits = input.replace(/\D/g, '');
  let plaintext = '';
  for (let index = 0; index + 1 < digits.length; index += 2) {
    plaintext += fromCoordinates(digits.slice(index, index + 2), squareString);
  }
  return plaintext;
};

// Ciphertext tolerance mirrors polybiusDecrypt: the digits are read as
// consecutive pairs; any other character (spaces, punctuation) is
// ignored, so both the spaced and the continuous format parse.
export const parsePolybiusPairs = (input: string): string[] => {
  const digits = input.replace(/\D/g, '');
  const pairs: string[] = [];
  for (let index = 0; index + 1 < digits.length; index += 2) {
    pairs.push(digits.slice(index, index + 2));
  }
  return pairs;
};

// The letter currently under the tool's highlight: the last encodable
// plaintext letter (encrypt) or the letter of the last complete digit
// pair (decrypt) — so the square's highlight follows the output.
export const polybiusHighlightLetter = (
  input: string,
  isDecryptMode: boolean,
  props: Omit<PolybiusCryptProps, 'input'> = {},
): string => {
  const squareString = resolveSquare(props);
  if (isDecryptMode) {
    const digits = input.replace(/\D/g, '');
    const pairs = Math.floor(digits.length / 2);
    if (pairs === 0) {
      return '';
    }
    return fromCoordinates(digits.slice((pairs - 1) * 2, pairs * 2), squareString);
  }
  const plaintext = cleanPlaintext(input);
  return plaintext.slice(-1);
};

export const POLYBIUS_PLAIN_SQUARE = buildSquare('', { size: 5 });
