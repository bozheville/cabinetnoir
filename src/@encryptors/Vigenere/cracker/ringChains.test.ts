import { describe, expect, it } from 'vitest';

import { ActionStatus, RingAction } from '@encryptors/shared/analysis';
import { ringChains } from './ringChains';

const link = (from: string, to: string, fromColumn = 0, toColumn = 1): RingAction => ({
  kind: 'link', fromColumn, from, toColumn, to,
});

const applied = (actions: RingAction[]): ActionStatus[] => actions.map(() => 'applied');

describe('ringChains', () => {
  it('lines up links of one pair into a strip', () => {
    const actions = [link('M', 'E'), link('Q', 'M')];
    expect(ringChains(actions, applied(actions))).toEqual([
      { from: 0, to: 1, strips: [{ letters: ['Q', 'M', 'E'], closed: false }] },
    ]);
  });

  it('keeps separate strips until a link joins them', () => {
    const actions = [link('A', 'B'), link('C', 'D')];
    expect(ringChains(actions, applied(actions))[0].strips).toHaveLength(2);
    const joined = [...actions, link('B', 'C')];
    expect(ringChains(joined, applied(joined))[0].strips).toEqual([
      { letters: ['A', 'B', 'C', 'D'], closed: false },
    ]);
  });

  it('orients links entered from the second slice', () => {
    const actions = [link('B', 'A', 1, 0)];
    expect(ringChains(actions, applied(actions))[0]).toEqual({
      from: 0, to: 1, strips: [{ letters: ['A', 'B'], closed: false }],
    });
  });

  it('marks a strip that returns to its start as closed', () => {
    const actions = [link('A', 'B'), link('B', 'C'), link('C', 'A')];
    expect(ringChains(actions, applied(actions))[0].strips).toEqual([
      { letters: ['A', 'B', 'C'], closed: true },
    ]);
  });

  it('groups by pair and skips conflicts', () => {
    const actions = [link('A', 'B'), link('C', 'D', 0, 2), link('A', 'Z')];
    const chains = ringChains(actions, ['applied', 'pending', 'conflict']);
    expect(chains.map(({ from, to }) => [from, to])).toEqual([[0, 1], [0, 2]]);
    expect(chains[0].strips).toEqual([{ letters: ['A', 'B'], closed: false }]);
  });
});
