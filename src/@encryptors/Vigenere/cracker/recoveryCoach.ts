// The recovery step's coach: one plain next-step sentence derived from
// the board state, plus the progress checklist. Pure, so the guidance
// is testable without the UI.
import {
  RING_SIZE,
  RingAction,
  RingState,
  columnFrequencies,
  columnLetters,
} from '@encryptors/shared/analysis';

// After this many links between the same two slices, new links mostly
// re-confirm placed letters: time to bring in another slice.
export const LINKS_PER_PAIR = 8;

// Rare letters are hard to pair by frequency; once this many slots are
// filled, the rest are better placed by hand (or left out).
export const LEFTOVER_FROM = 20;

export type CoachTip =
  | { id: 'firstLink'; from: string; to: string }
  | { id: 'nextLink'; from: string; to: string }
  | { id: 'conflict'; link: RingAction }
  | { id: 'switchPair'; column: number }
  | { id: 'leftovers'; count: number }
  | { id: 'done' };

export interface Checklist {
  firstLink: boolean;
  sixPlaced: boolean;
  secondPair: boolean;
  complete: boolean;
}

const pairKey = (a: number, b: number): string => (a < b ? `${a}-${b}` : `${b}-${a}`);

// Most frequent letter of `from` not yet linked on this pair, with the
// letter of `to` at the same frequency rank, skipping linked ones.
const nextPair = (
  fromLetters: string,
  toLetters: string,
  linkedFrom: Set<string>,
  linkedTo: Set<string>,
): { from: string; to: string } | null => {
  const fromRanked = columnFrequencies(fromLetters).map(({ letter }) => letter).filter((letter) => !linkedFrom.has(letter));
  const toRanked = columnFrequencies(toLetters).map(({ letter }) => letter).filter((letter) => !linkedTo.has(letter));
  if (fromRanked.length === 0 || toRanked.length === 0) {
    return null;
  }
  return { from: fromRanked[0], to: toRanked[0] };
};

export const coachTip = (params: {
  letters: string;
  keyLength: number;
  fromColumn: number;
  toColumn: number;
  actions: RingAction[];
  state: RingState;
}): CoachTip => {
  const { letters, keyLength, fromColumn, toColumn, actions, state } = params;
  const placed = Object.keys(state.positions).length;

  if (state.complete) {
    return { id: 'done' };
  }

  // The newest contradiction first: it is what the user just did.
  for (let index = actions.length - 1; index >= 0; index -= 1) {
    if (state.statuses[index] === 'conflict') {
      return { id: 'conflict', link: actions[index] };
    }
  }

  const linkedFrom = new Set<string>();
  const linkedTo = new Set<string>();
  let pairLinks = 0;
  actions.forEach((action) => {
    if (action.kind !== 'link') {
      return;
    }
    if (action.fromColumn === fromColumn && action.toColumn === toColumn) {
      linkedFrom.add(action.from);
      linkedTo.add(action.to);
      pairLinks += 1;
    } else if (action.fromColumn === toColumn && action.toColumn === fromColumn) {
      linkedFrom.add(action.to);
      linkedTo.add(action.from);
      pairLinks += 1;
    }
  });

  if (placed >= LEFTOVER_FROM) {
    return { id: 'leftovers', count: RING_SIZE - placed };
  }

  const linkedPairs = new Set(actions
    .filter((action): action is Extract<RingAction, { kind: 'link' }> => action.kind === 'link')
    .map((action) => pairKey(action.fromColumn, action.toColumn)));

  if (pairLinks >= LINKS_PER_PAIR && keyLength > 2) {
    // Bring in a slice no link has touched yet, else any other one.
    const touched = new Set<number>();
    actions.forEach((action) => {
      if (action.kind === 'link') {
        touched.add(action.fromColumn);
        touched.add(action.toColumn);
      }
    });
    const candidates = Array.from({ length: keyLength }, (_, column) => column)
      .filter((column) => column !== fromColumn && column !== toColumn);
    const fresh = candidates.find((column) => !touched.has(column))
      ?? candidates.find((column) => !linkedPairs.has(pairKey(fromColumn, column)))
      ?? candidates[0];
    return { id: 'switchPair', column: fresh };
  }

  const suggestion = nextPair(
    columnLetters(letters, keyLength, fromColumn),
    columnLetters(letters, keyLength, toColumn),
    linkedFrom,
    linkedTo,
  );
  if (!suggestion) {
    return { id: 'leftovers', count: RING_SIZE - placed };
  }
  return actions.length === 0
    ? { id: 'firstLink', ...suggestion }
    : { id: 'nextLink', ...suggestion };
};

export const checklist = (actions: RingAction[], state: RingState): Checklist => {
  const pairs = new Set(actions
    .filter((action, index) => action.kind === 'link' && state.statuses[index] === 'applied')
    .map((action) => {
      const link = action as Extract<RingAction, { kind: 'link' }>;
      return pairKey(link.fromColumn, link.toColumn);
    }));
  return {
    firstLink: state.statuses.some((status, index) => status === 'applied' && actions[index].kind === 'link'),
    sixPlaced: Object.keys(state.positions).length >= 6,
    secondPair: pairs.size >= 2,
    complete: state.complete,
  };
};
