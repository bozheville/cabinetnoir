import React, { createContext, useContext } from 'react';

// Locale scope of the wizard using the shared Vigenère-family cracker
// machinery. The Vigenère wizard is the original; the Beaufort family
// reuses it wholesale and only swaps the locale subtree
// (processing.<scope>.cracker.*) and the slice transform. Defaults to
// 'vigenere', so the existing Vigenère pages need no changes.
const CrackerScopeContext = createContext<string>('vigenere');

export const useCrackerScope = (): string => useContext(CrackerScopeContext);

export const useCrackerKey = (suffix: string): string =>
  `processing.${useCrackerScope()}.cracker.${suffix}`;

export const CrackerScopeProvider: React.FC<{ scope: string; children: React.ReactNode }> = ({
  scope,
  children,
}) => (
  <CrackerScopeContext.Provider value={scope}>{children}</CrackerScopeContext.Provider>
);
