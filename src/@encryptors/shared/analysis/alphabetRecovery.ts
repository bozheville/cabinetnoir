// Mixed-alphabet recovery for the Vigenère family, all pure.
//
// The tool's periodic ciphers use one alphabet A for plaintext, key and
// ciphertext. With the key length known, the text splits into columns;
// in column j every letter is moved by the same key value k_j:
//
//   Vigenère:          pos(C) = pos(P) + k_j
//   Beaufort:          pos(C) = k_j − pos(P)
//   Variant Beaufort:  pos(C) = pos(P) − k_j
//
// (pos = index in A). Take the same plaintext letter in two columns i
// and j: in every variant the two cipher letters X (column i) and Y
// (column j) sit a fixed distance apart in A,
//
//   pos(Y) − pos(X) = m_j − m_i,
//
// where m is the column's offset (±k). So "these two cipher letters
// stand for the same plaintext letter" is a link that places letters
// on a ring relative to each other — chaining links rebuilds A.
//
// The ring is only ever known up to rotation and decimation
// (pos → d·pos + r, d coprime to 26): every such ring decrypts the text
// just as well, with a different key. So one link may fix the origin
// and its columns' distance — but only up to its class: every distance
// is u·g with u a unit and g ∈ {1, 2, 13}, and decimation can turn it
// into g, never into another class. The solver therefore tries every
// link as the anchor with each class and keeps the reading with the
// fewest contradictions (then the most letters placed), so a pair whose
// true distance is even never forces the user to start over.
//
// Nothing here decides a link: the user makes every one, the solver
// only does the bookkeeping and flags contradictions.
import { chiSquaredAt, STANDARD_ALPHABET } from './frequency';
import { indexOfCoincidence } from './keyLength';
import { keywordFromAlphabet } from '../../Keyword/keyword-crypt';

export const RING_SIZE = 26;

const mod = (value: number): number => ((value % RING_SIZE) + RING_SIZE) % RING_SIZE;

// --- The user's decisions ---

// "Cipher letter `from` in column `fromColumn` and `to` in `toColumn`
// stand for the same plaintext letter."
export interface RingLink {
  kind: 'link';
  fromColumn: number;
  from: string;
  toColumn: number;
  to: string;
}

// "Letter `letter` sits in ring slot `slot`" — for letters the links
// cannot reach (rare letters missing from a column).
export interface RingPlacement {
  kind: 'place';
  letter: string;
  slot: number;
}

export type RingAction = RingLink | RingPlacement;

export type ActionStatus = 'applied' | 'pending' | 'conflict';

export interface RingState {
  // letter → ring slot (0–25).
  positions: Record<string, number>;
  // column → offset on the ring, relative to the first linked column.
  offsets: Record<number, number>;
  // One status per action, same order.
  statuses: ActionStatus[];
  // ring slot → letter (null when empty).
  slots: Array<string | null>;
  complete: boolean;
  // The link that fixed the origin and the distance class it was given;
  // null while no link can anchor the ring.
  anchor: { index: number; distance: number } | null;
}

// The distance classes a link's distance can be decimated into.
export const DISTANCE_CLASSES = [1, 2, 13];

// --- Columns ---

export const columnLetters = (letters: string, keyLength: number, column: number): string => {
  let result = '';
  for (let index = column; index < letters.length; index += keyLength) {
    result += letters[index];
  }
  return result;
};

export interface LetterCount {
  letter: string;
  count: number;
}

// The column's cipher letters, most frequent first (ties A→Z).
export const columnFrequencies = (column: string): LetterCount[] => {
  const counts = new Map<string, number>();
  for (const letter of column) {
    counts.set(letter, (counts.get(letter) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([letter, count]) => ({ letter, count }))
    .sort((a, b) => b.count - a.count || a.letter.localeCompare(b.letter));
};

// --- The solver ---

const valid = (action: RingAction): boolean => (action.kind === 'link'
  ? action.fromColumn !== action.toColumn && /^[A-Z]$/.test(action.from) && /^[A-Z]$/.test(action.to)
  : /^[A-Z]$/.test(action.letter) && action.slot >= 0 && action.slot < RING_SIZE);

// Replays the actions to a fixpoint from one anchor: link `anchorIndex`
// fixes the origin (its `from` letter in slot 0, its columns `distance`
// apart). Every other action applies as soon as the letters and column
// offsets it touches are anchored; until then it is pending. An action
// that contradicts the ring (a letter already in another slot, a slot
// already taken, an offset already different) is a conflict and
// changes nothing.
const solveFrom = (
  actions: RingAction[],
  anchorIndex: number | null,
  distance: number,
): RingState => {
  const positions: Record<string, number> = {};
  const offsets: Record<number, number> = {};
  const occupant: Record<number, string> = {};
  const statuses: ActionStatus[] = actions.map((action) => (valid(action) ? 'pending' : 'conflict'));

  // Places a letter; false when it contradicts the ring.
  const place = (letter: string, slot: number): boolean => {
    const at = mod(slot);
    if (letter in positions) {
      return positions[letter] === at;
    }
    if (occupant[at] !== undefined) {
      return false;
    }
    positions[letter] = at;
    occupant[at] = letter;
    return true;
  };

  if (anchorIndex !== null) {
    const anchor = actions[anchorIndex] as RingLink;
    offsets[anchor.fromColumn] = 0;
    offsets[anchor.toColumn] = distance;
    place(anchor.from, 0);
    place(anchor.to, distance);
    statuses[anchorIndex] = 'applied';
  }

  const anchored = (): boolean => Object.keys(positions).length > 0;

  // Try one action. Returns its status; 'applied' may change the state.
  const attempt = (action: RingAction): ActionStatus => {
    if (action.kind === 'place') {
      if (!anchored()) {
        return 'pending';
      }
      return place(action.letter, action.slot) ? 'applied' : 'conflict';
    }

    const { fromColumn, from, toColumn, to } = action;
    const hasFrom = from in positions;
    const hasTo = to in positions;
    const hasFromOffset = fromColumn in offsets;
    const hasToOffset = toColumn in offsets;

    if (hasFromOffset && hasToOffset) {
      const gap = offsets[toColumn] - offsets[fromColumn];
      if (hasFrom && hasTo) {
        return mod(positions[to] - positions[from]) === mod(gap) ? 'applied' : 'conflict';
      }
      if (hasFrom || hasTo) {
        const ok = hasFrom
          ? place(to, positions[from] + gap)
          : place(from, positions[to] - gap);
        return ok ? 'applied' : 'conflict';
      }
      return 'pending';
    }
    if (from === to) {
      // Same letter in two columns: their offsets are equal.
      if (hasFromOffset || hasToOffset) {
        if (hasFromOffset) {
          offsets[toColumn] = offsets[fromColumn];
        } else {
          offsets[fromColumn] = offsets[toColumn];
        }
        return 'applied';
      }
      return 'pending';
    }
    if (hasFrom && hasTo) {
      const gap = mod(positions[to] - positions[from]);
      if (hasFromOffset) {
        offsets[toColumn] = mod(offsets[fromColumn] + gap);
        return 'applied';
      }
      if (hasToOffset) {
        offsets[fromColumn] = mod(offsets[toColumn] - gap);
        return 'applied';
      }
    }
    return 'pending';
  };

  let changed = true;
  while (changed) {
    changed = false;
    actions.forEach((action, index) => {
      if (statuses[index] !== 'pending') {
        return;
      }
      const status = attempt(action);
      if (status !== 'pending') {
        statuses[index] = status;
        changed = true;
      }
    });
  }

  const slots: Array<string | null> = Array.from({ length: RING_SIZE }, (_, slot) => occupant[slot] ?? null);
  return {
    positions,
    offsets,
    statuses,
    slots,
    complete: slots.every(Boolean),
    anchor: anchorIndex === null ? null : { index: anchorIndex, distance },
  };
};

const countStatus = (state: RingState, status: ActionStatus): number =>
  state.statuses.filter((value) => value === status).length;

// Solves the ring from every possible anchor (each link of two
// different letters, under each distance class) and keeps the reading
// with the fewest conflicts, then the most letters placed. Ties keep the
// earliest link and the class order 1, 2, 13, so the ring stays stable
// while the user keeps adding consistent links.
export const solveRing = (actions: RingAction[]): RingState => {
  let best: RingState | null = null;
  actions.forEach((action, index) => {
    if (action.kind !== 'link' || action.from === action.to || !valid(action)) {
      return;
    }
    DISTANCE_CLASSES.forEach((distance) => {
      const state = solveFrom(actions, index, distance);
      if (!best) {
        best = state;
        return;
      }
      const conflicts = countStatus(state, 'conflict') - countStatus(best, 'conflict');
      const placed = Object.keys(state.positions).length - Object.keys(best.positions).length;
      if (conflicts < 0 || (conflicts === 0 && placed > 0)) {
        best = state;
      }
    });
  });
  return best ?? solveFrom(actions, null, 1);
};

// The ring read as an alphabet, slot 0 first; null until complete.
export const ringAlphabet = (state: RingState): string | null =>
  (state.complete ? state.slots.join('') : null);

// --- Feedback the user reads, never acts on by itself ---

// Columns re-aligned onto the ring: every letter of a column with a
// known offset whose letter is placed lands in its "plaintext slot"
// pos(C) − m. If the ring is right, all columns pile onto the same
// distribution and the merged IC climbs toward English (~0.066); a
// wrong ring smears it toward random (~0.038). Null without data.
export const mergedIC = (
  letters: string,
  keyLength: number,
  state: RingState,
): { ic: number; letters: number } | null => {
  const slots: string[] = [];
  for (let index = 0; index < letters.length; index += 1) {
    const column = index % keyLength;
    const position = state.positions[letters[index]];
    const offset = state.offsets[column];
    if (position === undefined || offset === undefined) {
      continue;
    }
    slots.push(STANDARD_ALPHABET[mod(position - offset)]);
  }
  const columns = Object.keys(state.offsets).length;
  if (slots.length < 20 || columns < 2) {
    return null;
  }
  return { ic: indexOfCoincidence(slots.join('')), letters: slots.length };
};

// Candidate partners for `letter` of column `fromColumn` in column
// `toColumn`, closest relative frequency first. A rank-match hint only:
// frequent letters tend to pair with frequent letters.
export const suggestPartners = (
  fromColumn: string,
  toColumn: string,
  letter: string,
  limit = 3,
): string[] => {
  const share = (column: string, target: string): number =>
    column.length === 0 ? 0 : column.split('').filter((c) => c === target).length / column.length;
  const own = share(fromColumn, letter);
  if (own === 0) {
    return [];
  }
  return columnFrequencies(toColumn)
    .map(({ letter: candidate }) => ({
      candidate,
      distance: Math.abs(share(toColumn, candidate) - own),
    }))
    .sort((a, b) => a.distance - b.distance || a.candidate.localeCompare(b.candidate))
    .slice(0, limit)
    .map(({ candidate }) => candidate);
};

// --- Does the entered alphabet already fit? ---

// Every column is tried against the entered alphabet under its best
// shift; the per-letter chi-squared of that best fit is averaged over
// the columns. Correct alphabets measure well below 1 per letter, mixed
// ones well above. `mapIndex` is the cipher's slice transform.
export const alphabetFit = (
  letters: string,
  keyLength: number,
  alphabet: string,
  mapIndex: (displayIndex: number, shift: number) => number,
): number | null => {
  let sum = 0;
  let counted = 0;
  for (let column = 0; column < keyLength; column += 1) {
    const slice = columnLetters(letters, keyLength, column);
    if (slice.length < 8) {
      continue;
    }
    const counts = new Array<number>(RING_SIZE).fill(0);
    for (const letter of slice) {
      const index = alphabet.indexOf(letter);
      if (index >= 0) {
        counts[index] += 1;
      }
    }
    let best = Infinity;
    for (let shift = 0; shift < RING_SIZE; shift += 1) {
      best = Math.min(best, chiSquaredAt(counts, shift, alphabet, mapIndex));
    }
    sum += best / slice.length;
    counted += 1;
  }
  return counted === 0 ? null : sum / counted;
};

// Below this average per-letter chi-squared the entered alphabet is
// taken to fit; measured on the test corpus (correct ≈ 0.3–0.9, mixed
// alphabets ≈ 2+).
export const ALPHABET_FIT_THRESHOLD = 1.4;

// --- Straightening a finished ring ---

const UNITS = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];

// Every rotation/decimation of a complete ring decrypts the text
// equally well. If one of them is the plain A–Z alphabet or a keyword
// alphabet, that is almost certainly the one the sender used: return
// it (and the keyword). Rotations of a keyword alphabet can look
// keyword-shaped too (a longer "keyword" swallowing the tail), so the
// shortest keyword wins. Null when no such reading exists.
export const straightenRing = (
  ring: string,
): { alphabet: string; keyword: string | null } | null => {
  if (ring.length !== RING_SIZE || new Set(ring).size !== RING_SIZE) {
    return null;
  }
  let keywordMatch: { alphabet: string; keyword: string } | null = null;
  for (const unit of UNITS) {
    for (let rotation = 0; rotation < RING_SIZE; rotation += 1) {
      let candidate = '';
      for (let index = 0; index < RING_SIZE; index += 1) {
        candidate += ring[mod(unit * index + rotation)];
      }
      if (candidate === STANDARD_ALPHABET) {
        return { alphabet: candidate, keyword: null };
      }
      const keyword = keywordFromAlphabet(candidate);
      if (keyword && (!keywordMatch || keyword.length < keywordMatch.keyword.length)) {
        keywordMatch = { alphabet: candidate, keyword };
      }
    }
  }
  return keywordMatch;
};
