// In-memory hand-off of a cracker result to the Tool tab.
//
// "Use this key" on the Cryptoanalysis tab navigates to the decrypt tool
// with the recovered key applied. Privacy rules (standard §7) forbid user
// text in URLs, so the key and the input travel in this module-scoped
// slot instead: memory only, gone on reload, never persisted. The URL
// carries just the existing `usedKey=1` flag.
export interface KeyHandoff {
  cipher: string;
  input: string;
  // Cipher-defined key payload; the consuming tool component knows the
  // shape (Vigenère: [key]; ADFGVX: [squareKey, transpositionKey];
  // Affine: ['multiplier/shift']; Playfair: [squareKey];
  // Alberti: [period, iterationStep]).
  keys: string[];
}

let handoff: KeyHandoff | null = null;

export const setKeyHandoff = (value: KeyHandoff): void => {
  handoff = value;
};

export const getKeyHandoff = (): KeyHandoff | null => handoff;

export const clearKeyHandoff = (): void => {
  handoff = null;
};
