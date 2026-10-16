// Worked examples for the Learn tab, embeddable in markdown via
// {{example:<id>}}. Data-driven: the columns come from the entry, so other
// ciphers can define their own step tables. Row values are computed from
// the cipher implementations at module load, so examples can never drift
// from the tool's behaviour.
import { DEFAULT_ALPHABET, vigenereEncrypt } from '@encryptors/Vigenere/vigenere-encryption';
import { rotate, mod, getAffineAlphabet } from '@encryptors/utils';
import { monoalphabeticEncrypt } from '@encryptors/Monoalphabetic/monoalphabetic-crypt';
import {
  albertiEncrypt,
  rotateDisc,
  ALBERTI_STATIC_DISC,
  ALBERTI_DYNAMIC_DISC,
} from '@encryptors/Alberti/alberti-crypt';

export interface WorkedExampleColumn {
  // Stable key of the column.
  key: string;
  // i18n key of the column heading.
  labelKey: string;
}

export interface WorkedExample {
  id: string;
  cipher: string;
  // Clean letters only (the worked example shows the letter stream).
  input: string;
  key: string;
  alphabet: string;
  mode: 'encrypt' | 'decrypt';
  columns: WorkedExampleColumn[];
  // One row per input letter; cells are plain strings.
  rows: string[][];
}

// i18n keys for generic column headings.
export const EXAMPLE_COLUMN_LABELS = {
  plain: 'learning.example.columns.plain',
  key: 'learning.example.columns.key',
  shift: 'learning.example.columns.shift',
  result: 'learning.example.columns.result',
};

const vigenereRows = (input: string, key: string, alphabet: string): string[][] => {
  const shiftOf = (plain: string, keyLetter: string) =>
    (alphabet.indexOf(keyLetter) - alphabet.indexOf(plain) + alphabet.length) % alphabet.length;

  return input.split('').map((plain, index) => {
    const keyLetter = key[index % key.length];
    return [
      plain,
      keyLetter,
      String(shiftOf(plain, keyLetter)),
      vigenereEncrypt(plain, keyLetter, alphabet),
    ];
  });
};

// Caesar: one fixed shift for the whole message. Mirrors the tool: the
// target alphabet is the source alphabet rotated by the shift amount.
const LATIN_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const caesarRows = (input: string, rotation: number, alphabet: string): string[][] => {
  const targetAlphabet = rotate(alphabet, rotation);
  return input.split('').map((plain) => [
    plain,
    String(rotation),
    monoalphabeticEncrypt({
      alphabet,
      targetAlphabet,
      input: plain,
    }),
  ]);
};

const buildCaesarExample = (
  id: string,
  input: string,
  rotation: number,
  alphabet: string = LATIN_ALPHABET,
): WorkedExample => ({
  id,
  cipher: 'caesar',
  input,
  key: String(rotation),
  alphabet,
  mode: 'encrypt',
  columns: [
    { key: 'plain', labelKey: EXAMPLE_COLUMN_LABELS.plain },
    { key: 'shift', labelKey: EXAMPLE_COLUMN_LABELS.shift },
    { key: 'result', labelKey: EXAMPLE_COLUMN_LABELS.result },
  ],
  rows: caesarRows(input, rotation, alphabet),
});

// Alberti: the movable disc turns after every chunk, so the disc column
// shows the alignment (outer A over inner letter) that was in force.
// Each chunk is encrypted exactly like the tool does — one period long.
const buildAlbertiExample = (
  id: string,
  input: string,
  iterationStep: number,
  period: number,
): WorkedExample => {
  const rows: string[][] = [];
  let roundAlphabet = ALBERTI_DYNAMIC_DISC;
  for (let index = 0; index < input.length; index += period) {
    const chunk = input.slice(index, index + period);
    const cipher = albertiEncrypt({
      input: chunk,
      isDecryptMode: false,
      staticDisc: ALBERTI_STATIC_DISC,
      dynamicDisc: roundAlphabet,
      iterationStep,
      period: chunk.length,
    });
    chunk.split('').forEach((plain, position) => {
      rows.push([plain, `A→${roundAlphabet[0]}`, cipher[position]]);
    });
    roundAlphabet = rotateDisc(roundAlphabet, iterationStep);
  }

  return {
    id,
    cipher: 'alberti',
    input,
    key: `${iterationStep}/${period}`,
    alphabet: ALBERTI_STATIC_DISC,
    mode: 'encrypt',
    columns: [
      { key: 'plain', labelKey: EXAMPLE_COLUMN_LABELS.plain },
      { key: 'disc', labelKey: 'learning.example.columns.disc' },
      { key: 'result', labelKey: EXAMPLE_COLUMN_LABELS.result },
    ],
    rows,
  };
};

const buildVigenereExample = (
  id: string,
  input: string,
  key: string,
  alphabet: string = DEFAULT_ALPHABET,
): WorkedExample => ({
  id,
  cipher: 'vigenere',
  input,
  key,
  alphabet,
  mode: 'encrypt',
  columns: [
    { key: 'plain', labelKey: EXAMPLE_COLUMN_LABELS.plain },
    { key: 'key', labelKey: EXAMPLE_COLUMN_LABELS.key },
    { key: 'shift', labelKey: EXAMPLE_COLUMN_LABELS.shift },
    { key: 'result', labelKey: EXAMPLE_COLUMN_LABELS.result },
  ],
  rows: vigenereRows(input, key, alphabet),
});

// Affine: every letter x is mapped to (a·x + b) mod 26; the middle
// column shows that number so the linear rule stays visible.
const buildAffineExample = (
  id: string,
  input: string,
  multiplier: number,
  shift: number,
): WorkedExample => {
  const alphabet = LATIN_ALPHABET;
  const targetAlphabet = getAffineAlphabet({ alphabet, multiplier, shift });
  const rows = input.split('').map((plain) => {
    const x = alphabet.indexOf(plain);
    return [
      plain,
      String(mod(multiplier * x + shift, alphabet.length)),
      targetAlphabet[x],
    ];
  });

  return {
    id,
    cipher: 'affine',
    input,
    key: `${multiplier}/${shift}`,
    alphabet,
    mode: 'encrypt',
    columns: [
      { key: 'plain', labelKey: EXAMPLE_COLUMN_LABELS.plain },
      { key: 'formula', labelKey: 'learning.example.columns.formula' },
      { key: 'result', labelKey: EXAMPLE_COLUMN_LABELS.result },
    ],
    rows,
  };
};

export const EXAMPLES: Record<string, WorkedExample> = {
  'vigenere-basic': buildVigenereExample('vigenere-basic', 'ATTACKATDAWN', 'LEMON'),
  'caesar-basic': buildCaesarExample('caesar-basic', 'MEETATNOON', 3),
  'alberti-basic': buildAlbertiExample('alberti-basic', 'SECRETNOTE', 3, 2),
  'affine-basic': buildAffineExample('affine-basic', 'SECRETMESSAGE', 3, 7),
};

export const getExample = (id: string): WorkedExample | null => EXAMPLES[id] || null;
