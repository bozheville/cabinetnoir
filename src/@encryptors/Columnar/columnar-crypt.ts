// Columnar transposition cipher: the classic pen-and-paper route cipher
// with a keyword key. A thin wrapper over the shared transposition core —
// the engine adds only the keyword→column-order step on top of it.
//
// Two variants, matching the manual's two shapes:
// - padded (complete rectangle): the text is padded up to rows × width
//   and read off column by column. This is the shape ADFGVX uses.
// - irregular (incomplete last row): no padding — the classic hand
//   cipher, and the shape the guided cracker attacks (m1-08+).
//
// Pure string in / string out, shared by the tool, the worked examples
// and the challenges, so all of them stay consistent.

import {
  columnOrder,
  columnarEncrypt,
  columnarDecrypt,
  doubleColumnarEncrypt,
  doubleColumnarDecrypt,
  normalizeTranspositionKey,
  ColumnarOptions,
} from '../shared/transposition';

export { normalizeTranspositionKey };

const orderOf = (keyword: string): number[] =>
  columnOrder(normalizeTranspositionKey(keyword));

export const columnarEncryptText = (
  text: string,
  keyword: string,
  options: ColumnarOptions = {},
): string => columnarEncrypt(text, orderOf(keyword), options);

export const columnarDecryptText = (
  ciphertext: string,
  keyword: string,
  options: ColumnarOptions = {},
): string => columnarDecrypt(ciphertext, orderOf(keyword), options);

export const doubleColumnarEncryptText = (
  text: string,
  keyword1: string,
  keyword2: string,
  options: ColumnarOptions = {},
): string => doubleColumnarEncrypt(text, orderOf(keyword1), orderOf(keyword2), options);

export const doubleColumnarDecryptText = (
  ciphertext: string,
  keyword1: string,
  keyword2: string,
  options: ColumnarOptions = {},
): string => doubleColumnarDecrypt(ciphertext, orderOf(keyword1), orderOf(keyword2), options);
