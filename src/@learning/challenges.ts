// Practice challenges, rendered as challenge cards on the Practice tab.
// Plaintexts come from public-domain sources; the ciphertexts are
// generated from the cipher implementations so they always match the tool.
import { vigenereEncrypt } from '@encryptors/Vigenere/vigenere-encryption';

export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';

export interface Challenge {
  id: string;
  cipher: string;
  titleKey: string;
  ciphertext: string;
  difficulty: ChallengeDifficulty;
  keyLength: number;
  // i18n keys of hints, revealed one by one.
  hints: string[];
  // The expected plaintext; "check my answer" compares letters only.
  answer: string;
}

const DICKENS_PLAINTEXT =
  'ITWASTHEBESTOFTIMESITWASTHEWORSTOFTIMESITWASTHEAGEOFWISDOMITWASTHEAGEOFFOOLISHNESS';

const buildChallenge = (
  id: string,
  cipher: string,
  key: string,
  plaintext: string,
  difficulty: ChallengeDifficulty,
  hints: string[],
): Challenge => ({
  id,
  cipher,
  titleKey: `learning.challenges.${id}.title`,
  ciphertext: vigenereEncrypt(plaintext, key),
  difficulty,
  keyLength: key.length,
  hints,
  answer: plaintext,
});

export const CHALLENGES: Record<string, Challenge> = {
  'vigenere-easy-1': buildChallenge(
    'vigenere-easy-1',
    'vigenere',
    'CAT',
    DICKENS_PLAINTEXT,
    'easy',
    [
      'learning.challenges.vigenere-easy-1.hint1',
      'learning.challenges.vigenere-easy-1.hint2',
    ],
  ),
};

export const getChallenges = (cipher: string): Challenge[] =>
  Object.values(CHALLENGES).filter((challenge) => challenge.cipher === cipher);

export const getChallenge = (id: string): Challenge | null => CHALLENGES[id] || null;
