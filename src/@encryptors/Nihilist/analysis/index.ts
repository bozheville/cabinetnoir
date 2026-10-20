// Nihilist cracker math: key length candidates and the per-column
// consistent key numbers (see ../analysis for the pure functions).
export {
  rankKeyLengths,
  columnNumbers,
  consistentKeyNumbers,
} from './keyLength';
export type { NihilistKeyLengthCandidate, KeyLengthLabel } from './keyLength';
export { parseNihilistNumbers } from '../nihilist-crypt';
