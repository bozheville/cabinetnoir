// Tests for the shared straddling checkerboard: the Wikipedia VIC
// board (Line S = 5961328470, mnemonic "AT ONE SIR") round-trips, the
// number-shift triples behave, and the historical Cyrillic 40-cell
// board builds as Kahn describes it.
import { describe, expect, it } from 'vitest';

import {
  buildCheckerboard,
  checkerboardDecode,
  checkerboardEncode,
} from './checkerboard';

const LATIN_BOARD = buildCheckerboard({
  header: '5961328470',
  topRow: 'AT ONE SIR',
  alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  symbols: ['.', '/'],
});

const CYRILLIC_BOARD = buildCheckerboard({
  header: '5961328470',
  topRow: 'СНЕГОПА___',
  alphabet: 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ',
  symbols: ['.', ',', '/', 'НТ', ' '],
});

describe('buildCheckerboard', () => {
  it('places the mnemonic over the mixed header, blanks become row labels', () => {
    // The two spaces of "AT ONE SIR" sit in cells 3 and 7, under the
    // header digits 6 and 8 — the row labels of the Wikipedia board.
    expect(LATIN_BOARD.rowLabels).toEqual(['6', '8']);
    expect(LATIN_BOARD.codes.get('A')).toBe('5');
    expect(LATIN_BOARD.codes.get('T')).toBe('9');
    expect(LATIN_BOARD.codes.get('O')).toBe('1');
    expect(LATIN_BOARD.codes.get('E')).toBe('2');
    expect(LATIN_BOARD.codes.get('I')).toBe('7');
    // Lower rows: remaining letters in order, then '.' and '/'.
    expect(LATIN_BOARD.lowerRows[0]).toEqual(
      ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
    );
    expect(LATIN_BOARD.lowerRows[1]).toEqual(
      ['P', 'Q', 'U', 'V', 'W', 'X', 'Y', 'Z', '.', '/'],
    );
  });

  it('gives every Wikipedia-verified cell its historical code', () => {
    // Verified digit by digit against the worked example on the VIC
    // cipher Wikipedia page: M→60, C→69, W→83, Y→88, '.'→87, '/'→80.
    const expected: Record<string, string> = {
      M: '60', C: '69', D: '66', L: '67', K: '64', W: '83',
      Y: '88', U: '86', '.': '87', '/': '80', B: '65', Z: '84',
    };
    for (const [char, code] of Object.entries(expected)) {
      expect(LATIN_BOARD.codes.get(char)).toBe(code);
    }
  });

  it('builds the historical 40-cell Cyrillic board', () => {
    // Kahn: seven letters of "снегопад" on top, three blanks; the
    // remaining letters plus five signs fill three more rows (the
    // historical board folded Й/Ъ and carried seven agent signs).
    expect(CYRILLIC_BOARD.rowLabels).toEqual(['4', '7', '0']);
    expect(CYRILLIC_BOARD.topRow.slice(0, 7).join('')).toBe('СНЕГОПА');
    expect(CYRILLIC_BOARD.lowerRows).toHaveLength(3);
    // The top row takes С, Н, Е, Г, О, П, А — so Б, first of the
    // remaining letters in alphabet order, leads the straddled rows;
    // the space sign closes the board in the last cell.
    expect(CYRILLIC_BOARD.lowerRows[0][0]).toBe('Б');
    expect(CYRILLIC_BOARD.lowerRows.flat()).toHaveLength(30);
    expect(CYRILLIC_BOARD.lowerRows[2][9]).toBe(' ');
  });

  it('rejects broken specs', () => {
    // No '/' among the symbols: the number shift is missing.
    expect(() => buildCheckerboard({
      header: '5961328470',
      topRow: 'AT ONE SIR',
      alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      symbols: ['.', 'X'],
    })).toThrow(/number shift/);
    // 18 remaining letters + 3 symbols = 21 lower cells, 20 available.
    expect(() => buildCheckerboard({
      header: '5961328470',
      topRow: 'AT ONE SIR',
      alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      symbols: ['.', '/', 'Y'],
    })).toThrow(/lower cells/);
    expect(() => buildCheckerboard({
      header: '1123456789',
      topRow: 'AT ONE SIR',
      alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      symbols: ['.', '/'],
    })).toThrow(/header/);
    expect(() => buildCheckerboard({
      header: '5961328470',
      topRow: 'AT ONE SIRX',
      alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      symbols: ['.', '/'],
    })).toThrow(/10 cells/);
  });
});

describe('checkerboardEncode / Decode', () => {
  it('encodes the opening of the Wikipedia worked example', () => {
    // "MEAN 0500. NOT 0915 …" → the exact head of the Wikipedia
    // "final code": 60 2 5 3, shift 000 555 000 000 shift,
    // 87 (.) 3 (N) 1 (O) 9 (T), shift 000 999 111 555 shift.
    expect(checkerboardEncode(LATIN_BOARD, 'MEAN 0500. NOT 0915'))
      .toBe('60253' + '8000055500000080' + '87319' + '8000099911155580');
  });

  it('encodes the full bisected Wikipedia message to the published 99 digits', () => {
    // Every digit verified by hand against the worked example on the
    // VIC cipher Wikipedia page (the shown "final code" ends with the
    // truncation dash at "8337-", i.e. exactly these 99 digits).
    const rotated = 'MEAN0500.NOT0915LIKEYOUDIDLASTTIME.ATTACKATDAWN.BYDAWNI';
    expect(checkerboardEncode(LATIN_BOARD, rotated))
      .toBe(
        '602538000055500000080873198000099911155580'
        + '6776428818666766675499760287'
        + '59956964596658338765886658337',
      );
  });

  it('round-trips letters, digits and periods', () => {
    const text = 'ATTACK AT DAWN. BY DAWN I MEAN 0500. NOT 0915.';
    expect(checkerboardDecode(LATIN_BOARD, checkerboardEncode(LATIN_BOARD, text)))
      .toBe('ATTACKATDAWN.BYDAWNIMEAN0500.NOT0915.');
  });

  it('round-trips Cyrillic letters, commas and spaces with the НТ sign', () => {
    const text = 'ПРИВЕТ, НТ ТОВАРИЩ 42 ТОЧКА 7 КОНЕЦ';
    const encoded = checkerboardEncode(CYRILLIC_BOARD, text);
    expect(encoded).toMatch(/^\d+$/);
    expect(checkerboardDecode(CYRILLIC_BOARD, encoded)).toBe(text);
  });

  it('keeps consecutive digit runs inside one shift pair', () => {
    expect(checkerboardEncode(LATIN_BOARD, 'X 12 Y'))
      .toBe(`${LATIN_BOARD.codes.get('X')}8011122280${LATIN_BOARD.codes.get('Y')}`);
  });

  it('decodes through an unterminated shift without crashing', () => {
    const encoded = checkerboardEncode(LATIN_BOARD, 'A 42');
    // Cut inside the digit run: 'A' plus a partial triple set.
    expect(checkerboardDecode(LATIN_BOARD, encoded.slice(0, 6))).toBe('A4');
  });
});
