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
  // Demos support the "Breaking it" section (opened with the cracker on)
  // but are not listed on the Practice tab.
  listOnPractice?: boolean;
}

const DICKENS_PLAINTEXT =
  'ITWASTHEBESTOFTIMESITWASTHEWORSTOFTIMESITWASTHEAGEOFWISDOMITWASTHEAGEOFFOOLISHNESS';
const DICKENS_PLAINTEXT_LONG =
  DICKENS_PLAINTEXT +
  'ITWASTHEEPOCHOFBELIEFITWASTHEEPOCHOFINCREDULITYITWASTHESEASONOFLIGHTITWASTHESEASONOFDARKNESS';
const AUSTEN_PLAINTEXT =
  'ITISATRUTHUNIVERSALLYACKNOWLEDGEDTHATASINGLEMANINPOSSESSIONOFAGOODFORTUNEMUSTBEINWANTOFAWIFE';
const HAMLET_PLAINTEXT =
  'TOBEORNOTTOBETHATISTHEQUESTIONWHETHERTISNOBLERINTHEMINDTOSUFFERTHESLINGANDARROWSOFOUTRAGEOUS';
const POE_PLAINTEXT =
  'ONCEUPONAMIDNIGHTDREARYWHILEIPONDEREDWEAKANDWEARYOVERRAREANDRADIANTMAIDENWHOMTHEANGELSNAMED';
const GETTYSBURG_PLAINTEXT =
  'FOURSCOREANDSEVENYEARSAGOOURFATHERSBROUGHTFORTHONTHISCONTINENTANEW';

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

// A demo for the "Breaking it" section: opens the cracker on a decent
// ciphertext without appearing among the practice challenges.
const VIGENERE_DEMO_PLAINTEXT =
  'THEQUICKBROWNFOXJUMPSOVERTHELAZYDOGLIESDOWNBYTHESAATNOONANDRESTSFORGET';
const VIGENERE_DEMO = {
  id: 'vigenere-demo',
  cipher: 'vigenere',
  titleKey: 'learning.challenges.vigenere-demo.title',
  ciphertext: vigenereEncrypt(VIGENERE_DEMO_PLAINTEXT, 'LEMON'),
  difficulty: 'easy' as ChallengeDifficulty,
  keyLength: 5,
  hints: [],
  answer: VIGENERE_DEMO_PLAINTEXT,
  listOnPractice: false,
};

export const CHALLENGES: Record<string, Challenge> = {
  'vigenere-demo': VIGENERE_DEMO,
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
  'vigenere-easy-2': buildChallenge(
    'vigenere-easy-2',
    'vigenere',
    'LEMON',
    DICKENS_PLAINTEXT_LONG,
    'easy',
    [
      'learning.challenges.vigenere-easy-2.hint1',
      'learning.challenges.vigenere-easy-2.hint2',
    ],
  ),
  'vigenere-medium-1': buildChallenge(
    'vigenere-medium-1',
    'vigenere',
    'ORANGE',
    AUSTEN_PLAINTEXT,
    'medium',
    [
      'learning.challenges.vigenere-medium-1.hint1',
      'learning.challenges.vigenere-medium-1.hint2',
    ],
  ),
  'vigenere-medium-2': buildChallenge(
    'vigenere-medium-2',
    'vigenere',
    'RAVEN',
    POE_PLAINTEXT,
    'medium',
    [
      'learning.challenges.vigenere-medium-2.hint1',
      'learning.challenges.vigenere-medium-2.hint2',
    ],
  ),
  'vigenere-hard-1': buildChallenge(
    'vigenere-hard-1',
    'vigenere',
    'NIGHTINGALE',
    HAMLET_PLAINTEXT,
    'hard',
    [
      'learning.challenges.vigenere-hard-1.hint1',
      'learning.challenges.vigenere-hard-1.hint2',
      'learning.challenges.vigenere-hard-1.hint3',
    ],
  ),
  'vigenere-hard-2': buildChallenge(
    'vigenere-hard-2',
    'vigenere',
    'UNBREAKABLE',
    GETTYSBURG_PLAINTEXT,
    'hard',
    [
      'learning.challenges.vigenere-hard-2.hint1',
      'learning.challenges.vigenere-hard-2.hint2',
      'learning.challenges.vigenere-hard-2.hint3',
    ],
  ),
};

export const getChallenges = (cipher: string): Challenge[] =>
  Object.values(CHALLENGES).filter(
    (challenge) => challenge.cipher === cipher && challenge.listOnPractice !== false,
  );

export const getChallenge = (id: string): Challenge | null => CHALLENGES[id] || null;
