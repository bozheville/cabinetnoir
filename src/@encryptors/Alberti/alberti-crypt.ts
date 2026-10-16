// Pure Alberti encryption, shared by the tool (useAlberti) and the
// learning material (worked examples, challenges) so both can never
// drift apart.
//
// The message is encrypted in chunks of `period` letters with a fixed
// disc alignment; after every chunk the movable disc turns by
// `iterationStep` positions.
import { monoalphabeticEncrypt } from '@encryptors/Monoalphabetic/monoalphabetic-crypt';

export interface AlbertiParams {
  // Outer (Stabilis) disc: uppercase plaintext alphabet.
  staticDisc: string;
  // Inner (Mobilis) disc: lowercase mixed ciphertext alphabet.
  dynamicDisc: string;
  // How far the movable disc turns after every chunk.
  iterationStep: number;
  // How many letters are encrypted before the disc turns.
  period: number;
}

// Alberti's 24-cell rings: 20 Latin letters + the numbers 1–4 on the
// outer disc, a mixed lowercase alphabet with the ampersand inside.
// The tool ships these fixed; the movable disc starts at "m".
export const ALBERTI_STATIC_DISC = 'ABCDEFGILMNOPQRSTVXZ1234';
export const ALBERTI_DYNAMIC_DISC = 'mqihfdbacegklnprtuz&xyso';

interface AlbertiCryptProps extends AlbertiParams {
  input: string;
  isDecryptMode: boolean;
}

export const albertiEncrypt = ({
  input,
  isDecryptMode,
  staticDisc,
  dynamicDisc,
  iterationStep,
  period,
}: AlbertiCryptProps): string => {
  let roundAlphabet = dynamicDisc;
  let rest = input;
  let output = '';

  while (rest) {
    output += monoalphabeticEncrypt({
      input: rest.slice(0, period),
      alphabet: isDecryptMode ? roundAlphabet.toUpperCase() : staticDisc,
      targetAlphabet: isDecryptMode ? staticDisc : roundAlphabet,
      keepSpaces: isDecryptMode,
      keepCase: isDecryptMode,
    });

    rest = rest.slice(period);
    roundAlphabet = rotateDisc(roundAlphabet, iterationStep);
  }

  return output;
};

// The disc turn is the same rotation the tool's arrows apply.
export const rotateDisc = (disc: string, step: number): string =>
  `${disc.slice(step)}${disc.slice(0, step)}`;
