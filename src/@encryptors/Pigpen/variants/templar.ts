import { PigpenVariant } from './types';

// The "purported Templars cipher" (freemasonry.bcy.ca, the source behind
// Wikipedia's Knights-templar-letters-horizontal.svg): the alphabet
// splits into two series — A–M plain and O–Z dotted — spread over three
// cross figures, with N as the standalone St Andrew's cross in the
// middle. Each group cross has its own arm shape, which is what keeps
// the dotted letters distinguishable from each other:
//   group 1 (A–D / O–R): baseless triangles — open V arms;
//   group 2 (E–H / S–V): closed triangular arms;
//   group 3 (I–M / W–Z): lozenge-shaped arms.
// J has no glyph of its own (Latin alphabet convention: I does for
// both), so J passes through unconverted.
// Arm order follows the source: crosses 1, 3, 4, 5 read clockwise from
// the top; cross 2 reads left, right, bottom, top; the final cross
// reads bottom, top, right, left.
export const templar: PigpenVariant = {
  id: 'templar',
  nameKey: 'processing.pigpen.variants.templar',
  glyphOf: {
    // Group 1: baseless triangles, clockwise from the top.
    A: 'tri-top',
    B: 'tri-right',
    C: 'tri-bottom',
    D: 'tri-left',
    // Group 2: closed triangular arms, in left/right/bottom/top order.
    E: 'stri-left',
    F: 'stri-right',
    G: 'stri-bottom',
    H: 'stri-top',
    // Group 3: lozenges, clockwise from the top.
    I: 'loz-top',
    K: 'loz-right',
    L: 'loz-bottom',
    M: 'loz-left',
    // The chosen centre of the two series: St Andrew's cross.
    N: 'andrew',
    // Series II: the same crosses, dotted.
    O: 'tri-top-dot',
    P: 'tri-right-dot',
    Q: 'tri-bottom-dot',
    R: 'tri-left-dot',
    S: 'stri-top-dot',
    T: 'stri-right-dot',
    U: 'stri-bottom-dot',
    V: 'stri-left-dot',
    W: 'loz-bottom-dot',
    X: 'loz-top-dot',
    Y: 'loz-right-dot',
    Z: 'loz-left-dot',
  },
};
