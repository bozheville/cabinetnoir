import { getAlphabet } from '../constants';
import {
  monoalphabeticEncrypt,
  monoalphabeticDecrypt
} from '../Monoalphabetic/monoalphabetic-crypt';

interface CaesarEncryptProps {
  input: string
  shift: number;
  keepSpaces?: boolean;
  keepCase?: boolean;
  alphabetKey?: string;
}

const rotate = (string, n) => string.slice(string.length - n) + string.slice(0, string.length - n);
const getRotatedAlphabet = (key, n) => rotate(getAlphabet({ key }).value, n);

export const caesarEncrypt = ({
  input,
  shift,
  keepSpaces = false,
  keepCase = false,
  alphabetKey = 'latin',
}: CaesarEncryptProps): string => monoalphabeticEncrypt({
  input,
  keepSpaces,
  keepCase,
  alphabet: getAlphabet({ key: alphabetKey}).value,
  targetAlphabet: getRotatedAlphabet(alphabetKey, shift),
});

export const caesarDecrypt = ({
  input,
  shift,
  alphabetKey = 'latin',
}: CaesarEncryptProps): string => monoalphabeticDecrypt({
  input,
  alphabet: getAlphabet({ key: alphabetKey}).value,
  targetAlphabet: getRotatedAlphabet(alphabetKey, shift),
});
