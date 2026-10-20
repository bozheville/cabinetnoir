// Shared Polybius square: engine math + renderer, used by Polybius,
// Nihilist, ADFGVX, tap code and later Bifid.
export {
  buildSquare,
  squareAlphabet,
  squareLabels,
  foldForSquare,
  toCoordinates,
  fromCoordinates,
  coordinatesToIndex,
  squareCoordinates,
} from './polybius';
export type { PolybiusSquareOptions, SquareSize, SquareMerge } from './polybius';
export { default as PolybiusSquare } from './PolybiusSquare';
