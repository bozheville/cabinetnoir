// Shared cryptanalysis library.
//
// Pure math only — no React, no i18n. Consumed by every cipher's cracker
// (Vigenère, ADFGVX, Affine, Playfair, Alberti) so the analysis code
// exists exactly once site-wide. Cipher-specific math stays next to the
// cipher; only cipher-agnostic primitives live here.
export * from './frequency';
export * from './normalize';
export * from './kasiski';
export * from './keyLength';
export * from './cribs';
export * from './digraphs';
export * from './columnar';
export * from './substitution';
