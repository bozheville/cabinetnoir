import { describe, expect, it } from 'vitest';

import { RingAction, solveRing } from '@encryptors/shared/analysis';
import { LINKS_PER_PAIR, checklist, coachTip } from './recoveryCoach';

const LETTERS = 'EAEBECEDEFTGTHTI'.repeat(4);

const tipFor = (actions: RingAction[], fromColumn = 0, toColumn = 1, keyLength = 3) =>
  coachTip({ letters: LETTERS, keyLength, fromColumn, toColumn, actions, state: solveRing(actions) });

const link = (from: string, to: string, fromColumn = 0, toColumn = 1): RingAction => ({
  kind: 'link', fromColumn, from, toColumn, to,
});

describe('coachTip', () => {
  it('suggests the two most frequent letters first', () => {
    const tip = tipFor([]);
    expect(tip.id).toBe('firstLink');
  });

  it('suggests the next unlinked pair after a link', () => {
    const first = tipFor([]);
    if (first.id !== 'firstLink') throw new Error();
    const tip = tipFor([link(first.from, first.to)]);
    expect(tip.id).toBe('nextLink');
    if (tip.id !== 'nextLink') throw new Error();
    expect(tip.from).not.toBe(first.from);
  });

  it('points at the newest conflict', () => {
    const tip = tipFor([link('A', 'B'), link('C', 'D'), link('A', 'D')]);
    expect(tip).toEqual({ id: 'conflict', link: link('A', 'D') });
  });

  it('proposes a fresh slice once the pair is worked', () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const actions = Array.from({ length: LINKS_PER_PAIR }, (_, index) => link(letters[index], letters[index + 1]));
    expect(tipFor(actions, 0, 1, 3)).toEqual({ id: 'switchPair', column: 2 });
  });

  it('says done when the ring is complete', () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const actions = Array.from({ length: 26 }, (_, index) => link(letters[index], letters[(index + 1) % 26]));
    expect(tipFor(actions).id).toBe('done');
  });
});

describe('checklist', () => {
  it('ticks items as the ring grows', () => {
    const actions = [link('A', 'B'), link('B', 'C'), link('C', 'D'), link('D', 'E'), link('E', 'F'), link('B', 'C', 1, 2)];
    const list = checklist(actions, solveRing(actions));
    expect(list).toEqual({ firstLink: true, sixPlaced: true, secondPair: true, complete: false });
    expect(checklist([], solveRing([]))).toEqual({ firstLink: false, sixPlaced: false, secondPair: false, complete: false });
  });
});
