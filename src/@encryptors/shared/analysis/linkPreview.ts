// Link preview for the alphabet rebuild: before the user links, how
// would each candidate partner change the ring, and how well does it
// agree with the letter counts? Feedback only — the user still decides.
//
// Agreement rests on one fact: inside a slice the secret alphabet and
// the key letter are fixed, so a slice is a single letter swap and keeps
// letter counts. Two cipher letters standing for the same plaintext
// letter (in two slices, or via the ring in any slice) therefore have
// about the same share of their slices. A candidate link fixes, through
// the ring, many such pairings at once — the new letters it places, in
// every slice whose offset is known — and each pairing whose shares
// differ by more than sampling noise is evidence against it.
import {
  RING_SIZE,
  RingAction,
  RingState,
  columnLetters,
  solveFrom,
  solveRing,
} from './alphabetRecovery';

const mod = (value: number): number => ((value % RING_SIZE) + RING_SIZE) % RING_SIZE;

// Shares (count / slice length) of every letter, per slice.
export const sliceShares = (letters: string, keyLength: number): Array<Record<string, number>> => (
  Array.from({ length: keyLength }, (_, column) => {
    const slice = columnLetters(letters, keyLength, column);
    const shares: Record<string, number> = {};
    for (const letter of slice) {
      shares[letter] = (shares[letter] || 0) + 1 / slice.length;
    }
    return shares;
  })
);

// How many sampling-noise units apart two shares are. Rare letters get
// a floor of one occurrence so a 0-vs-1 count is not a huge gap.
export const shareGap = (a: number, na: number, b: number, nb: number): number => {
  const pa = Math.max(a, 1 / na);
  const pb = Math.max(b, 1 / nb);
  const sigma = Math.sqrt((pa * (1 - pa)) / na + (pb * (1 - pb)) / nb);
  return Math.abs(a - b) / sigma;
};

// Plaintext slot → cipher letter, per slice with a known offset.
const observations = (state: RingState, keyLength: number): Map<string, string> => {
  const seen = new Map<string, string>();
  Object.entries(state.offsets).forEach(([columnKey, offset]) => {
    const column = Number(columnKey);
    if (column >= keyLength) {
      return;
    }
    Object.entries(state.positions).forEach(([letter, position]) => {
      seen.set(`${column}:${mod(position - offset)}`, letter);
    });
  });
  return seen;
};

export type Confidence = 0 | 1 | 2 | 3;

export interface CandidatePreview {
  letter: string;
  // The link contradicts the ring.
  clash: boolean;
  // The link only waits: none of its letters or slices are on the ring.
  waits: boolean;
  // Letters newly placed on the ring by this link (cascades included).
  gained: number;
  // Pairings checked and their mean gap in noise units.
  comparisons: number;
  meanGap: number;
  confidence: Confidence;
}

export interface LinkPreview {
  candidates: Record<string, CandidatePreview>;
  // Several candidates match the selected letter's share within noise:
  // its frequency alone cannot decide, link clearer letters first.
  closeCall: boolean;
}

// A candidate checked against at least this many pairings is judged
// on them; fewer means only its own two letters' shares speak.
export const MIN_COMPARISONS = 4;

// Ranking among the candidates:
// 3 — checked against the ring, best of all, clearly ahead;
// 2 — checked against the ring and best of those, but not clearly;
// 1 — plausible: shares not far apart (all a lone first link can say);
// 0 — unlikely, or a clash.
// A lone share match is weak at ~150 letters a slice (even a true E–E
// pair can sit two noise units apart), so it never rates above 1.
const rate = (candidates: CandidatePreview[]): void => {
  const viable = candidates
    .filter((candidate) => !candidate.clash)
    .sort((a, b) => a.meanGap - b.meanGap);
  const checked = viable.filter((candidate) => candidate.comparisons >= MIN_COMPARISONS);
  candidates.forEach((candidate) => {
    if (candidate.clash) {
      candidate.confidence = 0;
      return;
    }
    const clearBest = viable[0] === candidate
      && candidate.comparisons >= MIN_COMPARISONS
      && candidate.meanGap < 1.2
      && (viable.length === 1 || viable[1].meanGap - candidate.meanGap >= 0.25);
    if (clearBest) {
      candidate.confidence = 3;
    } else if (checked[0] === candidate && candidate.meanGap < 1.2) {
      candidate.confidence = 2;
    } else {
      // A lone pair gets more slack: its noise is large.
      const plausible = candidate.comparisons >= MIN_COMPARISONS ? 1.5 : 2;
      candidate.confidence = candidate.meanGap < plausible ? 1 : 0;
    }
  });
};

export const previewLink = (params: {
  letters: string;
  keyLength: number;
  actions: RingAction[];
  state: RingState;
  fromColumn: number;
  toColumn: number;
  selected: string;
  shares?: Array<Record<string, number>>;
}): LinkPreview => {
  const { letters, keyLength, actions, state, fromColumn, toColumn, selected } = params;
  const shares = params.shares ?? sliceShares(letters, keyLength);
  const lengths = Array.from({ length: keyLength }, (_, column) => columnLetters(letters, keyLength, column).length);
  const placedBefore = Object.keys(state.positions).length;
  const before = observations(state, keyLength);
  const ownShare = shares[fromColumn][selected] ?? 0;

  const candidates: Record<string, CandidatePreview> = {};
  let nearMatches = 0;

  // Partners already linked on this pair: a letter has one partner per
  // slice, so a second one clashes even before the ring places them.
  const partnerOf = new Map<string, string>();
  const partnerTo = new Map<string, string>();
  actions.forEach((action) => {
    if (action.kind !== 'link') {
      return;
    }
    if (action.fromColumn === fromColumn && action.toColumn === toColumn) {
      partnerOf.set(action.from, action.to);
      partnerTo.set(action.to, action.from);
    } else if (action.fromColumn === toColumn && action.toColumn === fromColumn) {
      partnerOf.set(action.to, action.from);
      partnerTo.set(action.from, action.to);
    }
  });

  Object.keys(shares[toColumn]).forEach((letter) => {
    const link: RingAction = { kind: 'link', fromColumn, from: selected, toColumn, to: letter };
    // Judged on the current ring: the solver may otherwise pick another
    // anchor and hide the clash (and the ring would jump).
    const next = state.anchor
      ? solveFrom([...actions, link], state.anchor.index, state.anchor.distance)
      : solveRing([link]);
    const status = next.statuses[actions.length];
    const conflictsBefore = state.statuses.filter((value) => value === 'conflict').length;
    const conflictsAfter = next.statuses.filter((value) => value === 'conflict').length;
    const doubled = (partnerOf.has(selected) && partnerOf.get(selected) !== letter)
      || (partnerTo.has(letter) && partnerTo.get(letter) !== selected);
    const clash = doubled || status === 'conflict' || conflictsAfter > conflictsBefore;

    // The pairing the user names, plus every new slot→letter reading
    // the ring derives from it, compared with the same slot elsewhere.
    const after = observations(next, keyLength);
    const bySlot = new Map<number, Array<[number, string]>>();
    after.forEach((cipher, key) => {
      const [column, slot] = key.split(':').map(Number);
      if (!bySlot.has(slot)) {
        bySlot.set(slot, []);
      }
      bySlot.get(slot)!.push([column, cipher]);
    });

    const gaps: number[] = [shareGap(ownShare, lengths[fromColumn], shares[toColumn][letter], lengths[toColumn])];
    if (!clash) {
      after.forEach((cipher, key) => {
        if (before.has(key)) {
          return;
        }
        const [column, slot] = key.split(':').map(Number);
        (bySlot.get(slot) ?? []).forEach(([other, otherCipher]) => {
          // Each pair once: new against old, or new against new from the
          // lower column's side.
          const otherIsNew = !before.has(`${other}:${slot}`);
          if (other === column || (otherIsNew && other < column)) {
            return;
          }
          // The named pairing is already counted.
          const named = (column === fromColumn && other === toColumn && cipher === selected && otherCipher === letter)
            || (column === toColumn && other === fromColumn && cipher === letter && otherCipher === selected);
          if (named) {
            return;
          }
          gaps.push(shareGap(
            shares[column][cipher] ?? 0,
            lengths[column],
            shares[other][otherCipher] ?? 0,
            lengths[other],
          ));
        });
      });
    }

    const meanGap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
    if (gaps[0] < 1) {
      nearMatches += 1;
    }
    candidates[letter] = {
      letter,
      clash,
      waits: !clash && status === 'pending',
      gained: clash ? 0 : Object.keys(next.positions).length - placedBefore,
      comparisons: gaps.length,
      meanGap,
      confidence: 0,
    };
  });

  rate(Object.values(candidates));
  return { candidates, closeCall: nearMatches >= 3 };
};

// The link of `actions` whose own two letters disagree most in share:
// the likeliest wrong one when the ring reports a conflict.
export const weakestLink = (
  letters: string,
  keyLength: number,
  actions: RingAction[],
  shares: Array<Record<string, number>> = sliceShares(letters, keyLength),
): { index: number; gap: number } | null => {
  const lengths = Array.from({ length: keyLength }, (_, column) => columnLetters(letters, keyLength, column).length);
  let worst: { index: number; gap: number } | null = null;
  actions.forEach((action, index) => {
    if (action.kind !== 'link' || action.fromColumn >= keyLength || action.toColumn >= keyLength) {
      return;
    }
    const gap = shareGap(
      shares[action.fromColumn][action.from] ?? 0,
      lengths[action.fromColumn],
      shares[action.toColumn][action.to] ?? 0,
      lengths[action.toColumn],
    );
    if (!worst || gap > worst.gap) {
      worst = { index, gap };
    }
  });
  return worst;
};
