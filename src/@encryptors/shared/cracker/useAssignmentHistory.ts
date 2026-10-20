import { useCallback, useState } from 'react';

import type { SymbolMapping } from '../analysis/substitution';

interface HistoryState {
  present: SymbolMapping;
  past: SymbolMapping[];
  future: SymbolMapping[];
}

const EMPTY: HistoryState = { present: {}, past: [], future: [] };

// Undo/redo stack for the assignment board's mapping. Every user
// decision (assign or clear) pushes the previous mapping onto the past
// stack; undo and redo move whole steps, never half-ones. Kept next to
// the board so every assignment-based cracker shares one implementation.
export const useAssignmentHistory = () => {
  const [history, setHistory] = useState<HistoryState>(EMPTY);

  const assign = useCallback((symbol: string, letter: string | null) => {
    setHistory(({ present, past, future }) => {
      const next: SymbolMapping = { ...present };
      if (letter === null) {
        delete next[symbol];
      } else {
        next[symbol] = letter;
      }
      return { present: next, past: [...past, present], future: [] };
    });
  }, []);

  const replaceAll = useCallback((mapping: SymbolMapping) => {
    setHistory(({ present, past }) => ({
      present: mapping,
      past: [...past, present],
      future: [],
    }));
  }, []);

  const undo = useCallback(() => {
    setHistory(({ present, past, future }) => {
      if (past.length === 0) {
        return { present, past, future };
      }
      return {
        present: past[past.length - 1],
        past: past.slice(0, -1),
        future: [present, ...future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory(({ present, past, future }) => {
      if (future.length === 0) {
        return { present, past, future };
      }
      return {
        present: future[0],
        past: [...past, present],
        future: future.slice(1),
      };
    });
  }, []);

  const clear = useCallback(() => {
    setHistory(({ present, past }) => ({
      present: {},
      past: [...past, present],
      future: [],
    }));
  }, []);

  const reset = useCallback(() => {
    setHistory(EMPTY);
  }, []);

  return {
    mapping: history.present,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    assign,
    replaceAll,
    undo,
    redo,
    clear,
    reset,
  };
};
