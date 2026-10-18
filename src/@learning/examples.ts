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
import { morseEncoding } from '@encryptors/Morse/morse-encoding';
import { playfairEncrypt } from '@encryptors/Playfair/playfair-encryption';
import { adfgvxEncrypt } from '@encryptors/Adfgvx/adfgvx-encryption';
import { createEnigmaMachine, enigmaPass } from '@learning/enigma-machine';

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
  // Glyph ciphers (pigpen): render the listed columns' cells as SVG
  // glyphs of this variant instead of plain text.
  glyphVariant?: string;
  glyphColumns?: string[];
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

// Atbash: the mirror mapping x ↔ 25 − x; the index column makes the
// complement visible.
const buildAtbashExample = (id: string, input: string): WorkedExample => {
  const alphabet = LATIN_ALPHABET;
  const rows = input.split('').map((plain) => {
    const x = alphabet.indexOf(plain);
    return [plain, `${x} ↔ ${alphabet.length - 1 - x}`, alphabet[alphabet.length - 1 - x]];
  });

  return {
    id,
    cipher: 'atbash',
    input,
    key: '',
    alphabet,
    mode: 'encrypt',
    columns: [
      { key: 'plain', labelKey: EXAMPLE_COLUMN_LABELS.plain },
      { key: 'index', labelKey: 'learning.example.columns.index' },
      { key: 'result', labelKey: EXAMPLE_COLUMN_LABELS.result },
    ],
    rows,
  };
};

// Morse: an encoding, not a cipher — each letter has its own symbol
// pattern, so the "worked example" is a lookup table in miniature.
const buildMorseExample = (id: string, input: string): WorkedExample => ({
  id,
  cipher: 'morse',
  input,
  key: '',
  alphabet: '',
  mode: 'encrypt',
  columns: [
    { key: 'plain', labelKey: EXAMPLE_COLUMN_LABELS.plain },
    { key: 'symbol', labelKey: 'learning.example.columns.symbol' },
  ],
  rows: input.split('').map((plain) => {
    const encoded = morseEncoding(plain, { dotSymbol: '•', dashSymbol: '-' });
    return [plain, encoded];
  }),
});

// Pigpen: the ciphertext is graphics — the result column renders as SVG
// glyphs (see WorkedExample's glyph columns).
const buildPigpenExample = (id: string, input: string): WorkedExample => ({
  id,
  cipher: 'pigpen',
  input,
  key: '',
  alphabet: '',
  mode: 'encrypt',
  glyphVariant: 'masonic',
  glyphColumns: ['glyph'],
  columns: [
    { key: 'plain', labelKey: EXAMPLE_COLUMN_LABELS.plain },
    { key: 'glyph', labelKey: 'learning.example.columns.glyph' },
  ],
  rows: input.split('').map((plain) => [plain, plain]),
});

// Base64: three bytes become four characters, so the example walks
// the input in 3-byte chunks — the last one usually padded.
const buildBase64Example = (id: string, input: string): WorkedExample => {
  const chunks = input.match(/.{1,3}/g) ?? [];
  return {
    id,
    cipher: 'base64',
    input,
    key: '',
    alphabet: '',
    mode: 'encrypt',
    columns: [
      { key: 'chunk', labelKey: 'learning.example.columns.chunk' },
      { key: 'result', labelKey: EXAMPLE_COLUMN_LABELS.result },
    ],
    rows: chunks.map((chunk) => [chunk, btoa(chunk)]),
  };
};

// ROT13: a fixed half-turn of the alphabet; the shift column repeats
// 13 to make the self-inverse symmetry visible.
const buildRot13Example = (id: string, input: string): WorkedExample => {
  const alphabet = LATIN_ALPHABET;
  const targetAlphabet = rotate(alphabet, 13);
  return {
    id,
    cipher: 'rot13',
    input,
    key: '13',
    alphabet,
    mode: 'encrypt',
    columns: [
      { key: 'plain', labelKey: EXAMPLE_COLUMN_LABELS.plain },
      { key: 'shift', labelKey: EXAMPLE_COLUMN_LABELS.shift },
      { key: 'result', labelKey: EXAMPLE_COLUMN_LABELS.result },
    ],
    rows: input.split('').map((plain) => [
      plain,
      '13',
      targetAlphabet[alphabet.indexOf(plain)],
    ]),
  };
};

// Playfair: letters travel in digraphs, so each row is a plaintext
// pair and its resulting pair.
const buildPlayfairExample = (
  id: string,
  input: string,
  key: string,
): WorkedExample => {
  const results = playfairEncrypt(input, key).split(' ');
  const pairs = input.toUpperCase().replace(/J/g, 'I').match(/.{1,2}/g) ?? [];
  return {
    id,
    cipher: 'playfair',
    input,
    key,
    alphabet: '',
    mode: 'encrypt',
    columns: [
      { key: 'pair', labelKey: 'learning.example.columns.pair' },
      { key: 'result', labelKey: EXAMPLE_COLUMN_LABELS.result },
    ],
    rows: pairs.map((pair, index) => [pair, results[index]]),
  };
};

// Enigma: the machine steps before each letter is enciphered, so every
// row shows the rotor window as the operator would see it at that
// keypress — the rolling right rotor is the whole idea.
const buildEnigmaExample = (
  id: string,
  input: string,
  key: string,
): WorkedExample => {
  const machine = createEnigmaMachine();
  machine.setPositions(key);
  const rows = input.split('').map((plain) => {
    machine.rotate();
    return [plain, machine.getPositions(), enigmaPass(machine, plain)];
  });

  return {
    id,
    cipher: 'enigma',
    input,
    key,
    alphabet: '',
    mode: 'encrypt',
    columns: [
      { key: 'plain', labelKey: EXAMPLE_COLUMN_LABELS.plain },
      { key: 'positions', labelKey: 'learning.example.columns.positions' },
      { key: 'result', labelKey: EXAMPLE_COLUMN_LABELS.result },
    ],
    rows,
  };
};

// ADFGVX: every letter fractionates into two square coordinates, and the
// running fractionated text shows how the columnar transposition will
// later shuffle it. The key carries both keys ("SQUARE TRANSPOSITION").
const buildAdfgvxExample = (
  id: string,
  input: string,
  key: string,
): WorkedExample => {
  const [squareKey, transpositionKey] = key.split(' ');
  const plain = input.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z0-9]/g, '');
  const square = squareKey;
  let fractionated = '';
  const rows = plain.split('').map((letter) => {
    const pair = adfgvxEncrypt(letter, square, 'A', 'adfgvx').slice(0, 2);
    fractionated += pair;
    return [letter, pair, fractionated];
  });

  return {
    id,
    cipher: 'adfgvx',
    input,
    key,
    alphabet: '',
    mode: 'encrypt',
    columns: [
      { key: 'plain', labelKey: EXAMPLE_COLUMN_LABELS.plain },
      { key: 'coords', labelKey: 'learning.example.columns.coords' },
      { key: 'fractionated', labelKey: 'learning.example.columns.fractionated' },
    ],
    rows,
  };
};

export const EXAMPLES: Record<string, WorkedExample> = {
  'vigenere-basic': buildVigenereExample('vigenere-basic', 'ATTACKATDAWN', 'LEMON'),
  'caesar-basic': buildCaesarExample('caesar-basic', 'MEETATNOON', 3),
  'alberti-basic': buildAlbertiExample('alberti-basic', 'SECRETNOTE', 3, 2),
  'affine-basic': buildAffineExample('affine-basic', 'SECRETMESSAGE', 3, 7),
  'atbash-basic': buildAtbashExample('atbash-basic', 'REVERSEME'),
  'morse-basic': buildMorseExample('morse-basic', 'SOS'),
  'pigpen-basic': buildPigpenExample('pigpen-basic', 'SOS'),
  'base64-basic': buildBase64Example('base64-basic', 'MEETATNOON'),
  'rot13-basic': buildRot13Example('rot13-basic', 'HELLOWORLD'),
  'playfair-basic': buildPlayfairExample('playfair-basic', 'HIDETHEGOLD', 'PLAYFAIREXAMPLE'),
  'adfgvx-basic': buildAdfgvxExample('adfgvx-basic', 'ATTACKATDAWN', 'NIGHT GERMAN'),
  'enigma-basic': buildEnigmaExample('enigma-basic', 'AAAAA', 'AAA'),
};

export const getExample = (id: string): WorkedExample | null => EXAMPLES[id] || null;
