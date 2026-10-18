import { PigpenVariant } from './types';

// The classic masonic key, following Wikipedia's Pigpen_cipher_key.svg:
// two tic-tac-toe grids — A–I plain, J–R dotted — then two X shapes with
// S–V plain and W–Z dotted. X arms read top, left, right, bottom.
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const gridOf = (from: number, to: number, dotted: boolean): Record<string, string> =>
  LETTERS.slice(from, to).split('').reduce((acc, letter, index) => {
    acc[letter] = `grid-${index + 1}${dotted ? '-dot' : ''}`;
    return acc;
  }, {} as Record<string, string>);

// X arms in the key image order: top, left, right, bottom.
const ARMS = ['top', 'left', 'right', 'bottom'];

const armsOf = (letters: string, dotted: boolean): Record<string, string> =>
  letters.split('').reduce((acc, letter, index) => {
    acc[letter] = `arm-${ARMS[index]}${dotted ? '-dot' : ''}`;
    return acc;
  }, {} as Record<string, string>);

export const masonic: PigpenVariant = {
  id: 'masonic',
  nameKey: 'processing.pigpen.variants.masonic',
  glyphOf: {
    ...gridOf(0, 9, false),
    ...gridOf(9, 18, true),
    ...armsOf('STUV', false),
    ...armsOf('WXYZ', true),
  },
};
