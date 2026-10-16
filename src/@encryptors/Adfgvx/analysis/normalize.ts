// Strip anything that is not a fractionation letter from pasted
// ciphertext, so stray characters never break the analysis.
export const normalizeAdfgvxCipherText = (text: string, fractionChars: string): string =>
  text.toUpperCase().replace(new RegExp(`[^${fractionChars}]`, 'g'), '');
