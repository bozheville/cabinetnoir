// VIC engine tests. The key schedule's golden vector is the Wikipedia
// worked example (personal number 6, 13 September 1959, "Twas the
// night before Christmas", keygroup 72401) — every line A–S was
// independently recomputed by hand before landing here. The checkerboard
// stage reproduces the page's published 99-digit "final code"; the
// transposition stages have no published ciphertext for the example,
// so they are covered by the shared transposition tests and by
// full-pipeline round trips.
import { describe, expect, it } from 'vitest';

import {
  chainAdd,
  digitEncode,
  deriveVicKeys,
  noCarryAdd,
  noCarrySub,
  parseVicHandoff,
  sequenceDigits,
  sequenceRanks,
  vicEncrypt,
  vicEncryptDetailed,
  vicDecrypt,
  vicKeyHandoff,
  VicError,
  vicDateDigits,
} from './vic-crypt';
import { checkerboardEncode } from '@encryptors/shared/checkerboard';

const WIKI_SECRETS = {
  phrase: 'Twas the night before Christmas',
  date: '13/9/1959',
  personalNumber: 6,
  keygroup: '72401',
};

describe('mod-10 primitives', () => {
  it('adds and subtracts without carry or borrow', () => {
    expect(noCarryAdd('1234', '6789')).toBe('7913');
    expect(noCarrySub('1234', '6789')).toBe('5555');
  });

  it('chain-adds like Kahn’s example', () => {
    expect(chainAdd('90210', 5)).toBe('92319');
    expect(chainAdd('3964', 10)).toBe('2506756321');
  });

  it('sequences digits with 0 last and ties left-first', () => {
    expect(sequenceDigits('90210')).toBe('34215');
    expect(sequenceDigits('3288628787')).toBe('3178429506');
    expect(sequenceDigits('5051328370')).toBe('5961328470');
  });

  it('sequences letters alphabetically, rank 10 written as 0', () => {
    expect(sequenceDigits('TWASTHENIG')).toBe('8017942653');
    expect(sequenceDigits('HTBEFORECH')).toBe('6013589427');
    expect(sequenceRanks('90210')).toEqual([3, 4, 2, 1, 5]);
  });

  it('encodes digits under a key line', () => {
    expect(digitEncode('90210', '6013589427')).toBe('27067');
    expect(digitEncode('4966196060', '6013589427')).toBe('3288628787');
  });
});

describe('deriveVicKeys', () => {
  it('reproduces the Wikipedia worked example line by line', () => {
    const keys = deriveVicKeys(WIKI_SECRETS);
    expect(keys.A).toBe('72401');
    expect(keys.B).toBe('13919');
    expect(keys.C).toBe('69592');
    expect(keys.D).toBe('TWASTHENIGHTBEFORECH');
    expect(keys.E1).toBe('8017942653');
    expect(keys.E2).toBe('6013589427');
    expect(keys.F1).toBe('6959254417');
    expect(keys.F2).toBe('1234567890');
    expect(keys.G).toBe('4966196060');
    expect(keys.H).toBe('3288628787');
    expect(keys.J).toBe('3178429506');
    expect(keys.K).toBe('5064805552');
    expect(keys.L).toBe('5602850077');
    expect(keys.M).toBe('1620350748');
    expect(keys.N).toBe('7823857125');
    expect(keys.P).toBe('5051328370');
    // Widths: the last two dissimilar digits of P (7 and 0) plus 6.
    expect(keys.a).toBe(13);
    expect(keys.b).toBe(6);
    // The block read via J: first 13 digits, then 6 more (cutting
    // mid-column under J's label 3).
    expect(keys.Q).toBe('0668005552551');
    expect(keys.R).toBe('758838');
    expect(keys.S).toBe('5961328470');
    // The keygroup rides 5 groups from the end (date's 6th digit).
    expect(keys.insertAt).toBe(5);
  });

  it('builds the checkerboard from Line S', () => {
    const { board } = deriveVicKeys(WIKI_SECRETS);
    expect(board.rowLabels).toEqual(['6', '8']);
    expect(board.codes.get('M')).toBe('60');
    expect(board.codes.get('Y')).toBe('88');
  });

  it('uses the nickel message’s V-J Day date digits', () => {
    // 3 September 1945 (V-J Day): Line B = 39194, the unused sixth
    // digit 5 puts the keygroup five groups from the end — exactly the
    // nickel message's arrangement per Kahn.
    const keys = deriveVicKeys({
      ...WIKI_SECRETS,
      personalNumber: 13,
      keygroup: '20818',
      date: '3/9/1945',
    });
    expect(keys.B).toBe('39194');
    expect(keys.insertAt).toBe(5);
  });

  it('rejects broken secrets with typed error codes', () => {
    const bad: Array<[Parameters<typeof deriveVicKeys>[0], string]> = [
      [{ ...WIKI_SECRETS, phrase: 'too short' }, 'phrase'],
      [{ ...WIKI_SECRETS, date: '13/9/59' }, 'date'],
      [{ ...WIKI_SECRETS, keygroup: '7240' }, 'keygroup'],
      [{ ...WIKI_SECRETS, keygroup: '72O01' }, 'keygroup'],
      [{ ...WIKI_SECRETS, personalNumber: 0 }, 'personalNumber'],
      [{ ...WIKI_SECRETS, personalNumber: 99 }, 'personalNumber'],
    ];
    for (const [secrets, code] of bad) {
      expect(() => deriveVicKeys(secrets)).toThrow(VicError);
      try {
        deriveVicKeys(secrets);
      } catch (error) {
        expect((error as VicError).code).toBe(code);
      }
    }
  });
});

describe('vicEncrypt / vicDecrypt', () => {
  const MESSAGE =
    'Attack at dawn. By dawn I mean 0500. Not 0915 like you did last time.';

  it('reproduces the Wikipedia final code at the checkerboard stage', () => {
    // The Wikipedia example encodes the bisected message and prints
    // the digits truncated ("8337-"). The engine pads BEFORE rotating,
    // so the filler X's ride mid-stream, between the rotated halves —
    // the published digits appear as two contiguous runs around them.
    const result = vicEncryptDetailed(MESSAGE, WIKI_SECRETS, { bisectAt: 20 });
    const firstHalf = 'MEAN0500.NOT0915LIKEYOUDIDLASTTIME.';
    const splitAt = checkerboardEncode(result.keys.board, firstHalf).length;
    const fillerCode = result.keys.board.codes.get('X') ?? '';
    const wikiFinalCode =
      '602538000055500000080873198000099911155580'
      + '6776428818666766675499760287'
      + '59956964596658338765886658337';
    expect(result.checkerboardDigits).toBe(
      wikiFinalCode.slice(0, splitAt)
      + fillerCode.repeat(result.keys.padLength)
      + wikiFinalCode.slice(splitAt),
    );
  });

  it('pads the encoded stream to five-digit groups', () => {
    const result = vicEncryptDetailed(MESSAGE, WIKI_SECRETS, { bisectAt: 20 });
    expect(result.checkerboardDigits.length % 5).toBe(0);
    // 99 raw digits + filler X's: the page's 99 are not a multiple of 5.
    expect(result.keys.padLength).toBeGreaterThan(0);
    expect(result.ciphertext.split(' ').every((group) => /^\d{5}$/.test(group))).toBe(true);
    // The keygroup itself sits inside the output.
    expect(result.ciphertext.split(' ')).toContain('72401');
  });

  it('round-trips without bisection', () => {
    const ciphertext = vicEncrypt(MESSAGE, WIKI_SECRETS);
    const plaintext = vicDecrypt(ciphertext, WIKI_SECRETS);
    // Filler X's may trail; everything before them is the message.
    expect(plaintext.replace(/X+$/, ''))
      .toBe('ATTACKATDAWN.BYDAWNIMEAN0500.NOT0915LIKEYOUDIDLASTTIME.');
  });

  it('round-trips with the bisection toggle on', () => {
    const ciphertext = vicEncrypt(MESSAGE, WIKI_SECRETS, { bisectAt: 20 });
    const plaintext = vicDecrypt(ciphertext, WIKI_SECRETS, { bisectAt: 20 });
    expect(plaintext.replace(/X+$/, ''))
      .toBe('ATTACKATDAWN.BYDAWNIMEAN0500.NOT0915LIKEYOUDIDLASTTIME.');
  });

  it('round-trips in Cyrillic, spaces and commas included', () => {
    const message = 'Мы поздравляем вас с благополучным прибытием. Всё в порядке.';
    const secrets = {
      phrase: 'Одинокий баян в ночи звучит долго',
      date: '3/9/1945',
      personalNumber: 13,
      keygroup: '20818',
    };
    const ciphertext = vicEncrypt(message, secrets, { alphabet: 'cyrillic' });
    expect(ciphertext.split(' ').every((group) => /^\d{5}$/.test(group))).toBe(true);
    const plaintext = vicDecrypt(ciphertext, secrets, { alphabet: 'cyrillic' });
    expect(plaintext.replace(/Ъ+$/, ''))
      .toBe('МЫ ПОЗДРАВЛЯЕМ ВАС С БЛАГОПОЛУЧНЫМ ПРИБЫТИЕМ. ВСЕ В ПОРЯДКЕ.');
  });

  it('extracts the keygroup from its hidden position', () => {
    const ciphertext = vicEncrypt(MESSAGE, WIKI_SECRETS);
    // insertAt = 5 groups from the end.
    const groups = ciphertext.split(' ');
    expect(groups[groups.length - 6]).toBe('72401');
    // Decrypt works from the same string, keygroup auto-extracted.
    expect(vicDecrypt(ciphertext, WIKI_SECRETS)).toContain('ATTACKATDAWN');
  });

  it('survives whitespace and separator noise in the ciphertext', () => {
    const ciphertext = vicEncrypt(MESSAGE, WIKI_SECRETS, { bisectAt: 20 });
    const noisy = ciphertext.replace(/ /g, '\n');
    const plaintext = vicDecrypt(noisy, WIKI_SECRETS, { bisectAt: 20 });
    expect(plaintext.replace(/X+$/, ''))
      .toBe('ATTACKATDAWN.BYDAWNIMEAN0500.NOT0915LIKEYOUDIDLASTTIME.');
  });

  it('throws typed errors on broken input', () => {
    expect(() => vicDecrypt('123', WIKI_SECRETS)).toThrow(VicError);
    // Cut three digits off the last group: the length is no longer a
    // multiple of five.
    const truncated = vicEncrypt(MESSAGE, WIKI_SECRETS).slice(0, -3);
    expect(() => vicDecrypt(truncated, WIKI_SECRETS)).toThrow(VicError);
  });
});

describe('hand-off helpers', () => {
  it('packs and unpacks the four secrets through one string', () => {
    const handoff = vicKeyHandoff(WIKI_SECRETS);
    expect(handoff).toBe('Twas the night before Christmas||13/9/1959||6||72401');
    expect(parseVicHandoff(handoff)).toEqual({
      phrase: 'Twas the night before Christmas',
      date: '13/9/1959',
      personalNumber: 6,
      keygroup: '72401',
    });
  });
});

describe('date digits', () => {
  it('accepts separators or bare digits, keeping the first six', () => {
    expect(vicDateDigits('13/9/1959')).toBe('139195');
    expect(vicDateDigits('1391959')).toBe('139195');
    expect(vicDateDigits('3-9-1945')).toBe('391945');
  });
});
