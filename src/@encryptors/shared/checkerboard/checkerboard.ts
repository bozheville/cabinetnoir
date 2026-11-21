// Shared straddling checkerboard: the substitution heart of the VIC
// cipher (and later the standalone straddling-checkerboard cipher).
//
// The board: 10 columns labelled by a mixed digit sequence (VIC's Line
// S), a top row of frequent letters with a few blank cells, and one
// lower row per blank. Top-row letters take the single digit above
// them; every other cell takes its row label followed by its column
// label — the "straddle". Numbers travel inside a pair of shift signs,
// each digit written three times.
//
// Pure data + string math only — no React, no i18n. The renderer lives
// next to this file (Checkerboard.tsx).

// A fully built board. `rows[0]` holds the top row (null = blank cell);
// `rows[1..]` hold the lower rows. Everything is precomputed so the
// renderer and the engine can never disagree.
export interface Checkerboard {
  // Column labels, left to right (10 distinct digits).
  columns: string[];
  // Top row: 10 entries, null where the mnemonic has a blank.
  topRow: (string | null)[];
  // The digits above the blank cells, in order — one per lower row.
  rowLabels: string[];
  // Lower rows: rowLabels.length rows of 10 cells (letters + symbols).
  lowerRows: string[][];
  // char → code ('7' or '83'). Letters and symbols only.
  codes: Map<string, string>;
  // code → char, for decoding.
  chars: Map<string, string>;
  // The cell code of the number-shift symbol, e.g. '80' for '/'.
  shiftCode: string;
}

export interface CheckerboardSpec {
  // 10 distinct digits: the column labels in order (VIC Line S).
  header: string;
  // 10 characters: letters and blanks (spaces or underscores).
  // The digits above the blanks label the lower rows.
  topRow: string;
  // The full letter alphabet; top-row letters must come from it.
  alphabet: string;
  // Extra cells after the remaining letters: '.', '/', 'НТ', ...
  // Must include the number-shift symbol '/'.
  symbols: string[];
}

const isDigit = (char: string): boolean => char >= '0' && char <= '9';

// A value that never ties with a letter but keeps digits comparable.
const sortValue = (char: string): number =>
  isDigit(char) ? (char === '0' ? 10 : Number(char)) : 100 + char.charCodeAt(0);

// Distinctness check on the header: the column labels must be exactly
// the ten digits, each once (Line S always is — a permutation of 0–9).
const checkHeader = (header: string): void => {
  if (header.length !== 10 || new Set(header.split('')).size !== 10
    || !header.split('').every(isDigit)) {
    throw new Error('checkerboard header must be the ten digits, each once');
  }
};

export const buildCheckerboard = (spec: CheckerboardSpec): Checkerboard => {
  checkHeader(spec.header);

  const columns = spec.header.split('');
  const topRaw = spec.topRow.replace(/_/g, ' ').toUpperCase();
  if (topRaw.length !== 10) {
    throw new Error('checkerboard top row must be exactly 10 cells');
  }
  if (!spec.symbols.includes('/')) {
    throw new Error("checkerboard symbols must include the '/' number shift");
  }

  const topRow: (string | null)[] = topRaw.split('').map((char) =>
    char === ' ' ? null : char);

  const topLetters = topRow.filter((cell): cell is string => cell !== null);
  if (new Set(topLetters).size !== topLetters.length) {
    throw new Error('checkerboard top row has a repeated letter');
  }
  const alphabet = spec.alphabet.toUpperCase();
  for (const letter of topLetters) {
    if (!alphabet.includes(letter)) {
      throw new Error(`checkerboard top row letter ${letter} is outside the alphabet`);
    }
  }

  const rowLabels = topRow
    .map((cell, index) => (cell === null ? columns[index] : null))
    .filter((label): label is string => label !== null);

  // Lower rows: remaining letters in order, then the symbols.
  const remaining = alphabet
    .split('')
    .filter((letter) => !topLetters.includes(letter));
  const cells = [...remaining, ...spec.symbols];
  if (cells.length !== rowLabels.length * 10) {
    throw new Error(
      `checkerboard has ${cells.length} lower cells but ${rowLabels.length} rows of 10 — adjust the blanks or the symbols`,
    );
  }

  const lowerRows: string[][] = [];
  for (let row = 0; row < rowLabels.length; row += 1) {
    lowerRows.push(cells.slice(row * 10, (row + 1) * 10));
  }

  const codes = new Map<string, string>();
  const chars = new Map<string, string>();
  topRow.forEach((letter, index) => {
    if (letter !== null) {
      codes.set(letter, columns[index]);
      chars.set(columns[index], letter);
    }
  });
  lowerRows.forEach((row, rowIndex) => {
    row.forEach((char, columnIndex) => {
      const code = rowLabels[rowIndex] + columns[columnIndex];
      codes.set(char, code);
      chars.set(code, char);
    });
  });

  return {
    columns,
    topRow,
    rowLabels,
    lowerRows,
    codes,
    chars,
    shiftCode: codes.get('/') as string,
  };
};

// Text → digit stream. Consecutive digits share one shift pair and are
// written three times each, exactly as Häyhänen's manual prescribed.
// Spaces and every character outside the board's cells are dropped,
// matching the classic hand practice (the cipher carries letters,
// digits and periods only).
export const checkerboardEncode = (board: Checkerboard, text: string): string => {
  const upper = text.toUpperCase();
  let out = '';
  let index = 0;
  while (index < upper.length) {
    const char = upper[index];
    if (isDigit(char)) {
      // One shift pair around the whole digit run.
      let run = '';
      while (index < upper.length && isDigit(upper[index])) {
        run += upper[index].repeat(3);
        index += 1;
      }
      out += board.shiftCode + run + board.shiftCode;
      continue;
    }
    index += 1;
    if (board.codes.has(char) && char !== '/') {
      // '/' is the number-shift control sign: it only ever enters the
      // stream around digit runs, never as literal data.
      out += board.codes.get(char);
    }
  }
  return out;
};

// Digit stream → text. Greedy two-digit reads on row labels, number
// shifts consumed as triples between two shift codes. Unparseable
// tails (truncated shift, dangling row label) are skipped rather than
// crashing — decrypt stays usable on pasted, hand-copied groups.
export const checkerboardDecode = (board: Checkerboard, digits: string): string => {
  const clean = digits.replace(/[^0-9]/g, '');
  const rowLabels = new Set(board.rowLabels);
  let out = '';
  let index = 0;
  while (index < clean.length) {
    const char = clean[index];
    if (rowLabels.has(char) && index + 1 < clean.length) {
      const code = char + clean[index + 1];
      if (code === board.shiftCode) {
        // Number shift: triples of the same digit until the closing
        // shift. An unterminated shift keeps what parsed and drops the
        // tail — a truncated paste still decodes its message body.
        let cursor = index + 2;
        while (cursor < clean.length) {
          if (clean.slice(cursor, cursor + 2) === board.shiftCode) {
            cursor += 2;
            break;
          }
          out += clean[cursor];
          cursor += 3;
        }
        index = cursor;
        continue;
      }
      if (board.chars.has(code)) {
        out += board.chars.get(code);
        index += 2;
        continue;
      }
      // Row label with no valid cell after it: skip the pair.
      index += 2;
      continue;
    }
    if (board.chars.has(char)) {
      out += board.chars.get(char);
    }
    index += 1;
  }
  return out;
};

// Column order for a transposition keyed by a sequenced digit line:
// rank 1's column reads first. Shared by the VIC tableaus.
export const orderFromSequence = (sequence: number[]): number[] =>
  sequence
    .map((rank, column) => ({ rank, column }))
    .sort((a, b) => a.rank - b.rank)
    .map((item) => item.column);

// Re-exported for callers that build boards from a keyword-style line.
export { sortValue as checkerboardSortValue };
