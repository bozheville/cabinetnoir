// In-memory hand-off of an identification result to a breaking tool.
//
// "Try breaking it" on /identify navigates to the cipher's cracker or
// decrypt tool with the ciphertext (and any recovered parameters, like
// the Caesar shift) applied. Privacy rules (standard §7) forbid user
// text in URLs, so everything travels in this module-scoped slot:
// memory only, gone on reload, never persisted. The URL carries no
// user content.
export interface CipherHandoff {
  cipher: string;
  input: string;
  // Parameters the identification already recovered
  // (Caesar: { shift }; Vigenère: { period }; ADFGVX/Playfair: none).
  params: Record<string, string | number>;
  // Where to continue: the Cryptoanalysis tab or the decrypt tool.
  target: 'cracker' | 'tool';
}

let handoff: CipherHandoff | null = null;

export const setCipherHandoff = (value: CipherHandoff): void => {
  handoff = value;
};

export const getCipherHandoff = (): CipherHandoff | null => handoff;

export const clearCipherHandoff = (): void => {
  handoff = null;
};
