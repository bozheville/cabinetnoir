// VIC cipher: Häyhänen's Cold War hand cipher, the pinnacle of the
// Nihilist family. Four small secrets (a phrase, a date, the agent's
// personal number and a per-message keygroup) unfold through a
// pencil-and-paper key schedule — mod-10 chain addition, sequencing,
// digit encoding — into a straddling checkerboard and two transposition
// tableaus. Every line of the schedule (A…S, Kahn's notation from
// "Number One From Moscow") is exposed, so the tool can show the whole
// worksheet.
//
// Stages: clean → filler X's → optional bisection → checkerboard →
// columnar transposition (Line Q) → disrupted transposition (Line R) →
// 5-digit groups → keygroup insertion.
//
// Pure string in / string out, shared by the tool, the worked example
// and the challenges.

import {
  buildCheckerboard,
  checkerboardDecode,
  checkerboardEncode,
  Checkerboard,
  orderFromSequence,
} from '@encryptors/shared/checkerboard';
import {
  columnarDecrypt,
  columnarEncrypt,
  disruptedColumnarDecrypt,
  disruptedColumnarEncrypt,
} from '@encryptors/shared/transposition';

// --- Alphabets and board presets ---

export type VicAlphabet = 'latin' | 'cyrillic';

// Latin, no diacritics to fold.
const LATIN_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
// Cyrillic: the modern 32-letter alphabet (33 letters, Ё folded into
// Е). Kahn's historical board went further — it also folded Й and Ъ
// and carried seven agent signs where this preset carries five.
const CYRILLIC_ALPHABET = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';

// Häyhänen's Cyrillic mnemonic: the Russian word for "snowfall"
// (снегопад). Kahn's historical board used its first seven letters,
// leaving the last three top cells blank.
const CYRILLIC_TOP = 'СНЕГОПА___';

export interface VicBoardPreset {
  alphabet: string;
  topRow: string;
  symbols: string[];
  // The filler letter for message padding: a rare letter outside the
  // top row, so it always costs a two-digit code on this board.
  filler: string;
}

export const VIC_BOARD_PRESETS: Record<VicAlphabet, VicBoardPreset> = {
  latin: {
    alphabet: LATIN_ALPHABET,
    topRow: 'AT ONE SIR',
    symbols: ['.', '/'],
    filler: 'X',
  },
  cyrillic: {
    alphabet: CYRILLIC_ALPHABET,
    topRow: CYRILLIC_TOP,
    symbols: ['.', ',', '/', 'НТ', ' '],
    filler: 'Ъ',
  },
};

// --- Errors ---

export type VicErrorCode =
  | 'phrase' | 'date' | 'personalNumber' | 'keygroup'
  | 'widths' | 'board' | 'ciphertext';

export class VicError extends Error {
  code: VicErrorCode;

  constructor(code: VicErrorCode) {
    super(`VIC: invalid ${code}`);
    this.code = code;
  }
}

// --- Mod-10 primitives ---

const isDigit = (char: string): boolean => char >= '0' && char <= '9';

// Digit-by-digit addition without carry: 1234 + 6789 = 7913.
export const noCarryAdd = (a: string, b: string): string => {
  const length = Math.max(a.length, b.length);
  const left = a.padStart(length, '0');
  const right = b.padStart(length, '0');
  let out = '';
  for (let index = 0; index < length; index += 1) {
    out += String((Number(left[index]) + Number(right[index])) % 10);
  }
  return out;
};

// Digit-by-digit subtraction without borrow: 1234 − 6789 = 5555.
export const noCarrySub = (a: string, b: string): string => {
  const length = Math.max(a.length, b.length);
  const left = a.padStart(length, '0');
  const right = b.padStart(length, '0');
  let out = '';
  for (let index = 0; index < length; index += 1) {
    out += String((Number(left[index]) - Number(right[index]) + 10) % 10);
  }
  return out;
};

// Chain addition, Kahn's rule: the first two digits produce a digit
// after the last, the second and third produce the next, and so on —
// each new digit is the sum of the two digits one seed-length back.
// 90210 → 9021092319…, 3964 → 39642506756321…
export const chainAdd = (seed: string, extra: number): string => {
  if (seed.length < 2) {
    throw new Error('VIC: chain addition needs at least two seed digits');
  }
  const lag = seed.length;
  let series = seed;
  for (let count = 0; count < extra; count += 1) {
    const index = series.length - lag;
    series += String((Number(series[index]) + Number(series[index + 1])) % 10);
  }
  return series.slice(seed.length);
};

// Sequencing: ranks 1..n in numeric/alphabetical order, ties resolved
// left-to-right, digit 0 valued last (Kahn: "numbering identical digits
// from left to right... 0 is last"). Letters order above digits; the
// inputs are always single-alphabet.
const sequenceValue = (char: string): number =>
  isDigit(char) ? (char === '0' ? 10 : Number(char)) : 100 + char.charCodeAt(0);

export const sequenceRanks = (input: string): number[] =>
  input
    .split('')
    .map((char, index) => ({ char, index, value: sequenceValue(char) }))
    .sort((a, b) => (a.value === b.value ? a.index - b.index : a.value - b.value))
    .map((item, rank) => ({ ...item, rank: rank + 1 }))
    .sort((a, b) => a.index - b.index)
    .map((item) => item.rank);

// A sequenced 10-wide line, rank 10 written as '0':
// TWASTHENIG → 8017942653, 90210 → 34215.
export const sequenceDigits = (input: string): string =>
  sequenceRanks(input)
    .map((rank) => (rank === 10 ? '0' : String(rank)))
    .join('');

// Digit encoding (Line H): every digit of the input is located in the
// standard sequence 1234567890 and replaced by the digit above it in the
// key line. 90210 under 6013589427 → 27067.
export const digitEncode = (input: string, keyLine: string): string =>
  input
    .split('')
    .map((char) => keyLine[char === '0' ? 9 : Number(char) - 1])
    .join('');

// --- Key derivation ---

export interface VicSecrets {
  // Mnemonic phrase, at least 20 letters ("Twas the night before
  // Christmas" in the Wikipedia example).
  phrase: string;
  // The date, any digits ("13/9/1959"); day+month+year, no leading
  // zeros. The first five digits feed Line B, the sixth the keygroup
  // insertion position.
  date: string;
  // The agent's personal number (Häyhänen's was 13).
  personalNumber: number;
  // Five random digits, fresh for every message.
  keygroup: string;
}

// The full key schedule, Kahn's line labels. Kept as plain strings so
// the worksheet renderer can stay dumb.
export interface VicWorksheet {
  A: string; // keygroup
  B: string; // date, first five digits
  C: string; // A − B without borrow
  D: string; // phrase, first twenty letters
  E1: string; // sequencing of D's first half
  E2: string; // sequencing of D's second half
  F1: string; // C chain-added out to ten digits
  F2: string; // the standard sequence 1234567890
  G: string; // E1 + F1 without carry
  H: string; // digitEncode(G, E2)
  J: string; // sequencing of H
  K: string; // chain block, row 1
  L: string; // chain block, row 2
  M: string; // chain block, row 3
  N: string; // chain block, row 4
  P: string; // chain block, row 5
  Q: string; // first a digits of the block read via J
  R: string; // next b digits of the block read via J
  S: string; // sequencing of P — the checkerboard header
  a: number; // first tableau width (Line Q length)
  b: number; // second tableau width (Line R length)
  // The keygroup's position: groups from the end (date's 6th digit).
  insertAt: number;
}

export interface VicKeys extends VicWorksheet {
  // First tableau: columnar, width a, read order from Line Q.
  firstOrder: number[];
  // Second tableau: disrupted, width b, read order from Line R.
  secondOrder: number[];
  // The straddling checkerboard.
  board: Checkerboard;
  // Filler letters appended to the plaintext by this message ('X's).
  padLength: number;
}

export interface VicOptions {
  alphabet?: VicAlphabet;
  // Top row override: letters and blanks ('_' or ' '). Must match the
  // alphabet and the preset's cell count.
  topRow?: string;
  // Bisection (Kahn): cut the cleaned plaintext at this character index
  // and swap the parts. The index is an agreed secret.
  bisectAt?: number;
}

// Date digits: strip everything but digits, keep the first six.
export const vicDateDigits = (date: string): string =>
  date.replace(/[^0-9]/g, '').slice(0, 6);

const cleanPhrase = (phrase: string): string =>
  phrase.toUpperCase().replace(/[^A-ZА-ЯЁ]/g, '').replace(/Ё/g, 'Е');

// The cleaned plaintext for a given board: the alphabet's letters,
// digits, and the board's own signs (comma, space, ...). The number
// shift '/' is control, not data — typing it cannot inject a literal
// shift. Everything else is dropped, exactly as the hand cipher
// carried only what the board could spell.
const cleanText = (text: string, alphabet: string, board: Checkerboard): string => {
  const upper = text.toUpperCase().replace(/Ё/g, 'Е');
  const letters = alphabet.split('');
  const signs = [...board.chars.values()].filter((char) => char !== '/');
  let out = '';
  for (const char of upper) {
    if (letters.includes(char) || isDigit(char) || signs.includes(char)) {
      out += char;
    }
  }
  return out;
};

// The last two dissimilar digits of Line P, added to the personal
// number: the two tableau widths (Kahn: "the last two dissimilar
// numbers in Line P added to the agent's personal number").
const tableauWidths = (P: string, personalNumber: number): [number, number] => {
  const digits = P.split('');
  const last = digits[digits.length - 1];
  const earlier = [...digits].reverse().find((digit) => digit !== last);
  if (earlier === undefined) {
    throw new VicError('widths');
  }
  return [Number(earlier) + personalNumber, Number(last) + personalNumber];
};

// Build the checkerboard from the derived header and the preset.
const buildBoard = (S: string, options: VicOptions): Checkerboard => {
  const preset = VIC_BOARD_PRESETS[options.alphabet ?? 'latin'];
  try {
    return buildCheckerboard({
      header: S,
      topRow: options.topRow ?? preset.topRow,
      alphabet: preset.alphabet,
      symbols: preset.symbols,
    });
  } catch {
    throw new VicError('board');
  }
};

export const deriveVicKeys = (
  secrets: VicSecrets,
  options: VicOptions = {},
): VicKeys => {
  const keygroup = secrets.keygroup;
  if (!/^\d{5}$/.test(keygroup)) {
    throw new VicError('keygroup');
  }
  const dateDigits = vicDateDigits(secrets.date);
  if (dateDigits.length < 6) {
    throw new VicError('date');
  }
  const personalNumber = Math.floor(secrets.personalNumber);
  if (personalNumber < 1 || personalNumber > 20) {
    throw new VicError('personalNumber');
  }
  const phrase = cleanPhrase(secrets.phrase);
  if (phrase.length < 20) {
    throw new VicError('phrase');
  }

  // [Line-A] the keygroup; [Line-B] the date's first five digits;
  // [Line-C] A − B, digit by digit without borrow.
  const A = keygroup;
  const B = dateDigits.slice(0, 5);
  const C = noCarrySub(A, B);

  // [Line-D] the phrase's first twenty letters, halved;
  // [Line-E] each half sequenced.
  const D = phrase.slice(0, 20);
  const E1 = sequenceDigits(D.slice(0, 10));
  const E2 = sequenceDigits(D.slice(10));

  // [Line-F.1] C chain-added out to ten digits; [Line-F.2] 1234567890.
  const F1 = C + chainAdd(C, 5);
  const F2 = '1234567890';

  // [Line-G] E1 + F1 without carry; [Line-H] each digit of G encoded
  // under the E2 key line.
  const G = noCarryAdd(E1, F1);
  const H = digitEncode(G, E2);

  // [Line-J] the sequencing of H.
  const J = sequenceDigits(H);

  // [Lines-K…P] fifty chain-added digits, five rows of ten.
  const block = chainAdd(H, 50);
  const K = block.slice(0, 10);
  const L = block.slice(10, 20);
  const M = block.slice(20, 30);
  const N = block.slice(30, 40);
  const P = block.slice(40, 50);

  // Tableau widths from the last two dissimilar digits of Line P.
  const [a, b] = tableauWidths(P, personalNumber);
  if (a + b > 50) {
    throw new VicError('widths');
  }

  // [Lines-Q, R] the block read column by column under the J labels,
  // first a digits then b more — mid-column cut included.
  const rows = [K, L, M, N, P];
  const columnOrder = orderFromSequence(sequenceRanks(J));
  let stream = '';
  for (const column of columnOrder) {
    for (const row of rows) {
      stream += row[column];
    }
  }
  const Q = stream.slice(0, a);
  const R = stream.slice(a, a + b);

  // [Line-S] the sequencing of P — the checkerboard's column labels.
  const S = sequenceDigits(P);

  const insertAt = Number(dateDigits[5]);

  return {
    A, B, C, D, E1, E2, F1, F2, G, H, J, K, L, M, N, P, Q, R, S,
    a, b, insertAt,
    firstOrder: orderFromSequence(sequenceRanks(Q)),
    secondOrder: orderFromSequence(sequenceRanks(R)),
    board: buildBoard(S, options),
    padLength: 0,
  };
};

// --- The message pipeline ---

export interface VicEncryptResult {
  // The ciphertext: 5-digit groups, keygroup included, space-separated.
  ciphertext: string;
  keys: VicKeys;
  // The digits after the checkerboard stage (pre-transposition), the
  // worksheet display's "encoding" line.
  checkerboardDigits: string;
  // The digits after the first tableau (the second tableau's input).
  firstTransposed: string;
}

// Filler letters appended until the encoded stream is a multiple of
// five: the filler travels at the very end of the plaintext, so after
// the optional bisection it always lands at the message's true end and
// the decrypt side can undo the bisection exactly.
const padForEncoding = (
  board: Checkerboard,
  text: string,
  filler: string,
): { padded: string; padLength: number } => {
  const fillerSource = filler.repeat(6);
  for (let count = 0; count <= fillerSource.length; count += 1) {
    const candidate = text + fillerSource.slice(0, count);
    if (checkerboardEncode(board, candidate).length % 5 === 0) {
      return { padded: candidate, padLength: count };
    }
  }
  // Cannot happen: each filler letter shifts the length by one or two,
  // so every residue class is reached within four steps.
  return { padded: text, padLength: 0 };
};

const cleanInput = (text: string, options: VicOptions, board: Checkerboard): string => {
  const preset = VIC_BOARD_PRESETS[options.alphabet ?? 'latin'];
  return cleanText(text, preset.alphabet, board);
};

export const vicEncryptDetailed = (
  text: string,
  secrets: VicSecrets,
  options: VicOptions = {},
): VicEncryptResult => {
  const keys = deriveVicKeys(secrets, options);
  const cleaned = cleanInput(text, options, keys.board);

  // Filler first, bisection second: the filler rides at the very end
  // of the padded plaintext, so after the rotation it still marks the
  // true message end and the decrypt side can undo the cut exactly.
  const preset = VIC_BOARD_PRESETS[options.alphabet ?? 'latin'];
  const { padded, padLength } = padForEncoding(keys.board, cleaned, preset.filler);
  let working = padded;
  if (options.bisectAt && options.bisectAt > 0 && padded.length > 1) {
    const cut = Math.min(options.bisectAt, padded.length - 1);
    working = working.slice(cut) + working.slice(0, cut);
  }

  const checkerboardDigits = checkerboardEncode(keys.board, working);

  const firstTransposed = columnarEncrypt(
    checkerboardDigits,
    keys.firstOrder,
    { irregular: true },
  );
  const secondTransposed = disruptedColumnarEncrypt(firstTransposed, keys.secondOrder);

  const groups = secondTransposed.match(/.{5}/g) ?? [];
  const insertIndex = Math.max(groups.length - keys.insertAt, 0);
  groups.splice(insertIndex, 0, secrets.keygroup);

  return {
    ciphertext: groups.join(' '),
    keys: { ...keys, padLength },
    checkerboardDigits,
    firstTransposed,
  };
};

export const vicEncrypt = (
  text: string,
  secrets: VicSecrets,
  options: VicOptions = {},
): string => vicEncryptDetailed(text, secrets, options).ciphertext;

export interface VicDecryptSecrets {
  phrase: string;
  date: string;
  personalNumber: number;
  // The keygroup is NOT a secret here: it rides inside the ciphertext
  // at the date's 6th digit's position and is extracted by the engine.
}

// The keygroup rides `insertAt` groups from the end (the date's
// unused sixth digit). Extract it and return the remaining digit
// stream — the shared core of decryption and the workings panel.
export const vicSplitKeygroup = (
  text: string,
  date: string,
): { keygroup: string; digits: string } => {
  const dateDigits = vicDateDigits(date);
  if (dateDigits.length < 6) {
    throw new VicError('date');
  }
  const digits = text.replace(/[^0-9]/g, '');
  const groups = digits.match(/.{5}/g) ?? [];
  if (groups.length < 2 || digits.length % 5 !== 0) {
    throw new VicError('ciphertext');
  }
  const insertAt = Number(dateDigits[5]);
  const keyIndex = Math.max(groups.length - 1 - insertAt, 0);
  const keygroup = groups.splice(keyIndex, 1)[0];
  return { keygroup, digits: groups.join('') };
};

export const vicDecrypt = (
  text: string,
  secrets: VicDecryptSecrets,
  options: VicOptions = {},
): string => {
  const { keygroup, digits } = vicSplitKeygroup(text, secrets.date);

  const keys = deriveVicKeys(
    { ...secrets, keygroup },
    options,
  );

  const secondTransposed = digits;
  const firstTransposed = disruptedColumnarDecrypt(secondTransposed, keys.secondOrder);
  const checkerboardDigits = columnarDecrypt(
    firstTransposed,
    keys.firstOrder,
    { irregular: true },
  );
  let decoded = checkerboardDecode(keys.board, checkerboardDigits);

  // Undo the bisection: the rotated text is part2 + part1, so the
  // original starts where part1 does — at (decoded − cut) characters
  // in (padding kept the lengths in step).
  if (options.bisectAt && options.bisectAt > 0 && decoded.length > 1) {
    const cut = options.bisectAt % decoded.length;
    decoded = decoded.slice(decoded.length - cut) + decoded.slice(0, decoded.length - cut);
  }

  return decoded;
};

// A fresh random keygroup for the tool's dice button. Five digits,
// leading zeros allowed — the classic presentation is five-figure
// groups, and the arithmetic is digit-wise anyway.
export const randomKeygroup = (): string => {
  const bytes = new Uint32Array(5);
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 10);
    }
  }
  return Array.from(bytes, (value) => String(value % 10)).join('');
};

// A key hand-off string for the example/challenge flows: the four
// secrets joined with '||' (the phrase may contain spaces).
export const vicKeyHandoff = (secrets: VicSecrets): string =>
  [secrets.phrase, secrets.date, String(secrets.personalNumber), secrets.keygroup].join('||');

export const parseVicHandoff = (key: string): VicSecrets => {
  const [phrase = '', date = '', personalNumber = '0', keygroup = ''] = key.split('||');
  return { phrase, date, personalNumber: Number(personalNumber), keygroup };
};
