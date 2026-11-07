// The recovery step's chain strips: the user's links drawn as they
// chain, before the ring can place them. Within one slice pair every
// link is the same step along the secret alphabet (slice a's letter →
// slice b's letter), so the links of a pair line up into strips
// Q → M → E → …; a strip that returns to its start is a closed loop.
import { ActionStatus, RingAction } from '@encryptors/shared/analysis';

export interface ChainStrip {
  letters: string[];
  closed: boolean;
}

export interface PairChains {
  // Lower column first; arrows point from `from` to `to`.
  from: number;
  to: number;
  strips: ChainStrip[];
}

const pairChains = (links: Array<[string, string]>): ChainStrip[] => {
  const next = new Map<string, string>();
  const previous = new Map<string, string>();
  links.forEach(([from, to]) => {
    // A second successor or predecessor contradicts the step: the ring
    // flags it, the strips leave it out.
    if (from === to || next.has(from) || previous.has(to)) {
      return;
    }
    next.set(from, to);
    previous.set(to, from);
  });

  const strips: ChainStrip[] = [];
  const seen = new Set<string>();
  const walk = (start: string): ChainStrip => {
    const letters = [start];
    seen.add(start);
    let letter = next.get(start);
    while (letter !== undefined && !seen.has(letter)) {
      letters.push(letter);
      seen.add(letter);
      letter = next.get(letter);
    }
    return { letters, closed: letter === start };
  };

  next.forEach((_, letter) => {
    if (!previous.has(letter)) {
      strips.push(walk(letter));
    }
  });
  next.forEach((_, letter) => {
    if (!seen.has(letter)) {
      strips.push(walk(letter));
    }
  });
  return strips.sort((a, b) => b.letters.length - a.letters.length);
};

// One group per slice pair that has links, in order of first use.
export const ringChains = (actions: RingAction[], statuses: ActionStatus[]): PairChains[] => {
  const groups = new Map<string, { from: number; to: number; links: Array<[string, string]> }>();
  actions.forEach((action, index) => {
    if (action.kind !== 'link' || statuses[index] === 'conflict') {
      return;
    }
    const forward = action.fromColumn < action.toColumn;
    const from = forward ? action.fromColumn : action.toColumn;
    const to = forward ? action.toColumn : action.fromColumn;
    const key = `${from}-${to}`;
    if (!groups.has(key)) {
      groups.set(key, { from, to, links: [] });
    }
    groups.get(key)!.links.push(forward ? [action.from, action.to] : [action.to, action.from]);
  });
  return Array.from(groups.values()).map(({ from, to, links }) => ({ from, to, strips: pairChains(links) }));
};
