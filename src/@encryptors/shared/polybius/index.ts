// Shared Polybius square: engine math + renderer + decipher tooling,
// used by Polybius, Nihilist, ADFGVX, tap code and later Bifid.
export {
  buildSquare,
  squareAlphabet,
  squareLabels,
  foldForSquare,
  mergeFolds,
  toCoordinates,
  fromCoordinates,
  coordinatesToIndex,
  squareCoordinates,
} from './polybius';
export { assembleSquareFromMapping, expandSquare } from './assemble';
export type { AssembleSquareOptions } from './assemble';
export { findCribMatches } from './cribs';
export type { CribMatch } from './cribs';
export type {
  PolybiusSquareOptions,
  SquareSize,
  SquareMerge,
  SquareMergeRule,
} from './polybius';
export { default as PolybiusSquare } from './PolybiusSquare';
export { default as SquareDecipherStep } from './SquareDecipherStep';
