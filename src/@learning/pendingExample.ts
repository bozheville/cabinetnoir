import React, { createContext, useContext } from 'react';

export interface PendingExampleLoad {
  cipher: string;
  input: string;
  key?: string;
  alphabet?: string;
  // Open with the cracker ("Unknown key") active.
  cracker?: boolean;
}

// Carries a learning example into the Tool tab after a "try it in the
// tool" click. The provider is only non-null when the current cipher
// matches the example, so cipher components that do not consume it are
// unaffected. Only our own content IDs travel through the URL - never
// user text.
export const PendingExampleContext = createContext<PendingExampleLoad | null>(null);

export const usePendingExample = (): PendingExampleLoad | null => useContext(PendingExampleContext);
