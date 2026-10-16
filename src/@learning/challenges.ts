// Practice challenges, rendered as challenge cards on the Practice tab.
// Plaintexts come from public-domain sources; the ciphertexts are
// generated from the cipher implementations so they always match the tool.
import { vigenereEncrypt } from '@encryptors/Vigenere/vigenere-encryption';
import { rotate, getAffineAlphabet } from '@encryptors/utils';
import { monoalphabeticEncrypt } from '@encryptors/Monoalphabetic/monoalphabetic-crypt';
import {
  albertiEncrypt,
  ALBERTI_STATIC_DISC,
  ALBERTI_DYNAMIC_DISC,
} from '@encryptors/Alberti/alberti-crypt';
import { playfairEncrypt } from '@encryptors/Playfair/playfair-encryption';
import { morseEncoding } from '@encryptors/Morse/morse-encoding';
import { createEnigmaMachine } from '@learning/enigma-machine';

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
  // Tool mode the challenge should open in (decode challenges).
  mode?: 'encrypt' | 'decrypt';
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

// Caesar: the key is a rotation of the alphabet, so the ciphertext comes
// straight from the tool's own substitution routine.
const LATIN_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const buildCaesarChallenge = (
  id: string,
  rotation: number,
  plaintext: string,
  difficulty: ChallengeDifficulty,
  hints: string[],
): Challenge => ({
  id,
  cipher: 'caesar',
  titleKey: `learning.challenges.${id}.title`,
  ciphertext: monoalphabeticEncrypt({
    alphabet: LATIN_ALPHABET,
    targetAlphabet: rotate(LATIN_ALPHABET, rotation),
    input: plaintext,
  }),
  difficulty,
  keyLength: 1,
  hints,
  answer: plaintext,
});

// A demo for the "Breaking it" section: opens the tool on a ciphertext
// without appearing among the practice challenges.
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

const CAESAR_DEMO_PLAINTEXT =
  'NOTHINGISHIDDENWHICHSHALLNOTBEREVEALEDNEITHERWASANYTHINGKEPTSECRET';
const CAESAR_DEMO = {
  id: 'caesar-demo',
  cipher: 'caesar',
  titleKey: 'learning.challenges.caesar-demo.title',
  ciphertext: monoalphabeticEncrypt({
    alphabet: LATIN_ALPHABET,
    targetAlphabet: rotate(LATIN_ALPHABET, 3),
    input: CAESAR_DEMO_PLAINTEXT,
  }),
  difficulty: 'easy' as ChallengeDifficulty,
  keyLength: 1,
  hints: [],
  answer: CAESAR_DEMO_PLAINTEXT,
  listOnPractice: false,
};

// Affine: y = (a·x + b) mod 26 — the key is the multiplier/shift pair.
const buildAffineChallenge = (
  id: string,
  multiplier: number,
  shift: number,
  plaintext: string,
  difficulty: ChallengeDifficulty,
  hints: string[],
): Challenge => ({
  id,
  cipher: 'affine',
  titleKey: `learning.challenges.${id}.title`,
  ciphertext: monoalphabeticEncrypt({
    alphabet: LATIN_ALPHABET,
    targetAlphabet: getAffineAlphabet({
      alphabet: LATIN_ALPHABET,
      multiplier,
      shift,
    }),
    input: plaintext,
  }),
  difficulty,
  keyLength: 2,
  hints,
  answer: plaintext,
});

const AFFINE_DEMO_PLAINTEXT = 'ATTACKATDAWN';
const AFFINE_DEMO = {
  id: 'affine-demo',
  cipher: 'affine',
  titleKey: 'learning.challenges.affine-demo.title',
  ciphertext: monoalphabeticEncrypt({
    alphabet: LATIN_ALPHABET,
    targetAlphabet: getAffineAlphabet({
      alphabet: LATIN_ALPHABET,
      multiplier: 5,
      shift: 8,
    }),
    input: AFFINE_DEMO_PLAINTEXT,
  }),
  difficulty: 'easy' as ChallengeDifficulty,
  keyLength: 2,
  hints: [
    'learning.challenges.affine-demo.hint1',
  ],
  answer: AFFINE_DEMO_PLAINTEXT,
  listOnPractice: false,
};

// Atbash: a fixed mirror alphabet, so the "key" is always the same.
const buildAtbashChallenge = (
  id: string,
  plaintext: string,
  difficulty: ChallengeDifficulty,
  hints: string[],
): Challenge => ({
  id,
  cipher: 'atbash',
  titleKey: `learning.challenges.${id}.title`,
  ciphertext: monoalphabeticEncrypt({
    alphabet: LATIN_ALPHABET,
    targetAlphabet: LATIN_ALPHABET.split('').reverse().join(''),
    input: plaintext,
  }),
  difficulty,
  keyLength: 0,
  hints,
  answer: plaintext,
});

// Playfair: the key is the keyword of the 5x5 square. The answer must
// be exactly what the tool's decrypt returns — so the plaintexts are
// even-length and free of doubled pairs (no X filler needed) and
// avoid J (it folds into I).
const buildPlayfairChallenge = (
  id: string,
  key: string,
  plaintext: string,
  difficulty: ChallengeDifficulty,
  hints: string[],
): Challenge => ({
  id,
  cipher: 'playfair',
  titleKey: `learning.challenges.${id}.title`,
  ciphertext: playfairEncrypt(plaintext, key),
  difficulty,
  keyLength: key.length,
  hints,
  answer: plaintext,
});

const PLAYFAIR_DEMO = {
  id: 'playfair-demo',
  cipher: 'playfair',
  titleKey: 'learning.challenges.playfair-demo.title',
  ciphertext: playfairEncrypt('ATTACKATDAWN', 'MONARCHY'),
  difficulty: 'easy' as ChallengeDifficulty,
  keyLength: 8,
  hints: [
    'learning.challenges.playfair-demo.hint1',
  ],
  answer: 'ATTACKATDAWN',
  listOnPractice: false,
};

// Enigma: the three-letter key (start positions) must travel in the
// hints — otherwise the key would be the whole answer. The machine is
// reciprocal, so a decrypted run reproduces the plaintext exactly as
// typed into the tool (letters only).
const buildEnigmaChallenge = (
  id: string,
  key: string,
  plaintext: string,
  difficulty: ChallengeDifficulty,
  hints: string[],
): Challenge => {
  const machine = createEnigmaMachine();
  machine.setPositions(key);
  return {
    id,
    cipher: 'enigma',
    titleKey: `learning.challenges.${id}.title`,
    ciphertext: machine.string(plaintext),
    difficulty,
    keyLength: 3,
    hints,
    answer: plaintext,
    mode: 'decrypt',
  };
};

const ENIGMA_DEMO = (() => {
  const machine = createEnigmaMachine();
  machine.setPositions('QCV');
  return {
    id: 'enigma-demo',
    cipher: 'enigma',
    titleKey: 'learning.challenges.enigma-demo.title',
    ciphertext: machine.string('ATTACKATDAWN'),
    difficulty: 'easy' as ChallengeDifficulty,
    keyLength: 3,
    hints: [
      'learning.challenges.enigma-demo.hint1',
    ],
    answer: 'ATTACKATDAWN',
    listOnPractice: false,
  };
})();

// ROT13 decode challenges: the shift is fixed, so decoding is the
// same operation; the challenge opens in decrypt mode anyway.
const buildRot13Challenge = (
  id: string,
  plaintext: string,
  difficulty: ChallengeDifficulty,
  hints: string[],
): Challenge => ({
  id,
  cipher: 'rot13',
  titleKey: `learning.challenges.${id}.title`,
  ciphertext: monoalphabeticEncrypt({
    alphabet: LATIN_ALPHABET,
    targetAlphabet: rotate(LATIN_ALPHABET, 13),
    input: plaintext,
    keepSpaces: true,
    keepCase: true,
  }),
  difficulty,
  keyLength: 0,
  hints,
  answer: plaintext,
  mode: 'decrypt',
});

// Base64 decode challenges: the ciphertext is a plain encoding, the
// challenge opens in decrypt mode.
const buildBase64Challenge = (
  id: string,
  plaintext: string,
  difficulty: ChallengeDifficulty,
  hints: string[],
): Challenge => ({
  id,
  cipher: 'base64',
  titleKey: `learning.challenges.${id}.title`,
  ciphertext: btoa(plaintext),
  difficulty,
  keyLength: 0,
  hints,
  answer: plaintext,
  mode: 'decrypt',
});

// Morse decode challenges: the ciphertext column carries the dots and
// dashes in the tool's default symbols, and the challenge opens in
// decrypt mode.
const buildMorseChallenge = (
  id: string,
  plaintext: string,
  difficulty: ChallengeDifficulty,
  hints: string[],
): Challenge => ({
  id,
  cipher: 'morse',
  titleKey: `learning.challenges.${id}.title`,
  ciphertext: morseEncoding(plaintext, { dotSymbol: '•', dashSymbol: '-' }),
  difficulty,
  keyLength: 0,
  hints,
  answer: plaintext,
  mode: 'decrypt',
});

// Alberti: the discs are fixed in the tool, so the challenge's secret is
// the period and the turn step; the ciphertext starts from the default
// disc alignment. Plaintexts must use only the 20 letters of Alberti's
// disc (no H, J, K, U, W, Y) — authentic Latin works perfectly.
const buildAlbertiChallenge = (
  id: string,
  iterationStep: number,
  period: number,
  plaintext: string,
  difficulty: ChallengeDifficulty,
  hints: string[],
): Challenge => ({
  id,
  cipher: 'alberti',
  titleKey: `learning.challenges.${id}.title`,
  ciphertext: albertiEncrypt({
    input: plaintext,
    isDecryptMode: false,
    staticDisc: ALBERTI_STATIC_DISC,
    dynamicDisc: ALBERTI_DYNAMIC_DISC,
    iterationStep,
    period,
  }),
  difficulty,
  keyLength: period,
  hints,
  answer: plaintext,
});

const ALBERTI_DEMO_PLAINTEXT = 'FORTVNAFAVETFORTIBVS';
const ALBERTI_DEMO = {
  id: 'alberti-demo',
  cipher: 'alberti',
  titleKey: 'learning.challenges.alberti-demo.title',
  ciphertext: albertiEncrypt({
    input: ALBERTI_DEMO_PLAINTEXT,
    isDecryptMode: false,
    staticDisc: ALBERTI_STATIC_DISC,
    dynamicDisc: ALBERTI_DYNAMIC_DISC,
    iterationStep: 3,
    period: 2,
  }),
  difficulty: 'easy' as ChallengeDifficulty,
  keyLength: 2,
  hints: [],
  answer: ALBERTI_DEMO_PLAINTEXT,
  listOnPractice: false,
};

const FDR_PLAINTEXT =
  'THEONLYTHINGWEHAVETOFEARISFEARTHITSELF';
const DOYLE_PLAINTEXT =
  'WHENYOUHAVEELIMINATEDTHEIMPOSSIBLEWHATEVERREMAINSHOWEVERIMPROBABLEMUSTBETHETRUTH';
const SHAKESPEARE_PLAINTEXT =
  'FRIENDSROMANSCOUNTRYMENLENDMEYOUREARSICOMETOBURYCAESARNOTTOPRAISEHIM';
const PROVERB_PLAINTEXT = 'VENIVIDIVICI';
const ECCLESIASTES_PLAINTEXT = 'PERASPERAADASTRA';
const TAO_PLAINTEXT = 'GALLIAESTOMNISDIVISAINPARTESSTRES';

export const CHALLENGES: Record<string, Challenge> = {
  'vigenere-demo': VIGENERE_DEMO,
  'caesar-demo': CAESAR_DEMO,
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
  'caesar-easy-1': buildCaesarChallenge(
    'caesar-easy-1',
    3,
    FDR_PLAINTEXT,
    'easy',
    [
      'learning.challenges.caesar-easy-1.hint1',
      'learning.challenges.caesar-easy-1.hint2',
    ],
  ),
  'caesar-medium-1': buildCaesarChallenge(
    'caesar-medium-1',
    11,
    DOYLE_PLAINTEXT,
    'medium',
    [
      'learning.challenges.caesar-medium-1.hint1',
      'learning.challenges.caesar-medium-1.hint2',
    ],
  ),
  'caesar-hard-1': buildCaesarChallenge(
    'caesar-hard-1',
    23,
    SHAKESPEARE_PLAINTEXT,
    'hard',
    [
      'learning.challenges.caesar-hard-1.hint1',
      'learning.challenges.caesar-hard-1.hint2',
    ],
  ),
  'alberti-demo': ALBERTI_DEMO,
  'alberti-easy-1': buildAlbertiChallenge(
    'alberti-easy-1',
    3,
    2,
    PROVERB_PLAINTEXT,
    'easy',
    [
      'learning.challenges.alberti-easy-1.hint1',
      'learning.challenges.alberti-easy-1.hint2',
    ],
  ),
  'alberti-medium-1': buildAlbertiChallenge(
    'alberti-medium-1',
    4,
    3,
    ECCLESIASTES_PLAINTEXT,
    'medium',
    [
      'learning.challenges.alberti-medium-1.hint1',
      'learning.challenges.alberti-medium-1.hint2',
    ],
  ),
  'alberti-hard-1': buildAlbertiChallenge(
    'alberti-hard-1',
    7,
    4,
    TAO_PLAINTEXT,
    'hard',
    [
      'learning.challenges.alberti-hard-1.hint1',
      'learning.challenges.alberti-hard-1.hint2',
      'learning.challenges.alberti-hard-1.hint3',
    ],
  ),
  'affine-demo': AFFINE_DEMO,
  'affine-easy-1': buildAffineChallenge(
    'affine-easy-1',
    3,
    7,
    'FORTUNEFAVORSTHEBRAVE',
    'easy',
    [
      'learning.challenges.affine-easy-1.hint1',
      'learning.challenges.affine-easy-1.hint2',
    ],
  ),
  'affine-medium-1': buildAffineChallenge(
    'affine-medium-1',
    7,
    11,
    'ELEMENTARYMYDEARWATSON',
    'medium',
    [
      'learning.challenges.affine-medium-1.hint1',
      'learning.challenges.affine-medium-1.hint2',
    ],
  ),
  'affine-hard-1': buildAffineChallenge(
    'affine-hard-1',
    11,
    5,
    GETTYSBURG_PLAINTEXT,
    'hard',
    [
      'learning.challenges.affine-hard-1.hint1',
      'learning.challenges.affine-hard-1.hint2',
      'learning.challenges.affine-hard-1.hint3',
    ],
  ),
  'atbash-easy-1': buildAtbashChallenge(
    'atbash-easy-1',
    'KEEPTHISSECRET',
    'easy',
    [
      'learning.challenges.atbash-easy-1.hint1',
      'learning.challenges.atbash-easy-1.hint2',
    ],
  ),
  'atbash-medium-1': buildAtbashChallenge(
    'atbash-medium-1',
    'INGODWETRUST',
    'medium',
    [
      'learning.challenges.atbash-medium-1.hint1',
      'learning.challenges.atbash-medium-1.hint2',
    ],
  ),
  'atbash-hard-1': buildAtbashChallenge(
    'atbash-hard-1',
    GETTYSBURG_PLAINTEXT,
    'hard',
    [
      'learning.challenges.atbash-hard-1.hint1',
      'learning.challenges.atbash-hard-1.hint2',
    ],
  ),
  'morse-easy-1': buildMorseChallenge(
    'morse-easy-1',
    'THEEAGLEHASLANDED',
    'easy',
    [
      'learning.challenges.morse-easy-1.hint1',
      'learning.challenges.morse-easy-1.hint2',
    ],
  ),
  'morse-medium-1': buildMorseChallenge(
    'morse-medium-1',
    'WHATHATHGODWROUGHT',
    'medium',
    [
      'learning.challenges.morse-medium-1.hint1',
      'learning.challenges.morse-medium-1.hint2',
    ],
  ),
  'morse-hard-1': buildMorseChallenge(
    'morse-hard-1',
    'SOSWEHAVESTRUCKANICEBERG',
    'hard',
    [
      'learning.challenges.morse-hard-1.hint1',
      'learning.challenges.morse-hard-1.hint2',
      'learning.challenges.morse-hard-1.hint3',
    ],
  ),
  'base64-easy-1': buildBase64Challenge(
    'base64-easy-1',
    'MEETMEATDAWN',
    'easy',
    [
      'learning.challenges.base64-easy-1.hint1',
      'learning.challenges.base64-easy-1.hint2',
    ],
  ),
  'base64-medium-1': buildBase64Challenge(
    'base64-medium-1',
    'ALLTHATGLISTERSISNOTGOLD',
    'medium',
    [
      'learning.challenges.base64-medium-1.hint1',
      'learning.challenges.base64-medium-1.hint2',
    ],
  ),
  'base64-hard-1': buildBase64Challenge(
    'base64-hard-1',
    DOYLE_PLAINTEXT,
    'hard',
    [
      'learning.challenges.base64-hard-1.hint1',
      'learning.challenges.base64-hard-1.hint2',
    ],
  ),
  'rot13-easy-1': buildRot13Challenge(
    'rot13-easy-1',
    'THECAKEISALIE',
    'easy',
    [
      'learning.challenges.rot13-easy-1.hint1',
      'learning.challenges.rot13-easy-1.hint2',
    ],
  ),
  'rot13-medium-1': buildRot13Challenge(
    'rot13-medium-1',
    'THEARISTOCRATS',
    'medium',
    [
      'learning.challenges.rot13-medium-1.hint1',
      'learning.challenges.rot13-medium-1.hint2',
    ],
  ),
  'rot13-hard-1': buildRot13Challenge(
    'rot13-hard-1',
    'TWOROADSDIVERGEDINAYELLOWWOOD',
    'hard',
    [
      'learning.challenges.rot13-hard-1.hint1',
      'learning.challenges.rot13-hard-1.hint2',
      'learning.challenges.rot13-hard-1.hint3',
    ],
  ),
  'playfair-demo': PLAYFAIR_DEMO,
  'playfair-easy-1': buildPlayfairChallenge(
    'playfair-easy-1',
    'SHADOW',
    'SAILBOATATDAWN',
    'easy',
    [
      'learning.challenges.playfair-easy-1.hint1',
      'learning.challenges.playfair-easy-1.hint2',
    ],
  ),
  'playfair-medium-1': buildPlayfairChallenge(
    'playfair-medium-1',
    'TREASURE',
    'WHENTHEGAMEISAFOOT',
    'medium',
    [
      'learning.challenges.playfair-medium-1.hint1',
      'learning.challenges.playfair-medium-1.hint2',
    ],
  ),
  'playfair-hard-1': buildPlayfairChallenge(
    'playfair-hard-1',
    'VICTORY',
    'ITWASTHEWORSTOFTIMES',
    'hard',
    [
      'learning.challenges.playfair-hard-1.hint1',
      'learning.challenges.playfair-hard-1.hint2',
      'learning.challenges.playfair-hard-1.hint3',
    ],
  ),
  'enigma-demo': ENIGMA_DEMO,
  'enigma-easy-1': buildEnigmaChallenge(
    'enigma-easy-1',
    'AAA',
    'THEWEATHERISFAIR',
    'easy',
    [
      'learning.challenges.enigma-easy-1.hint1',
      'learning.challenges.enigma-easy-1.hint2',
    ],
  ),
  'enigma-medium-1': buildEnigmaChallenge(
    'enigma-medium-1',
    'GKD',
    'REINFORCEMENTSATDAWN',
    'medium',
    [
      'learning.challenges.enigma-medium-1.hint1',
      'learning.challenges.enigma-medium-1.hint2',
    ],
  ),
  'enigma-hard-1': buildEnigmaChallenge(
    'enigma-hard-1',
    'BXY',
    'THEREISNOTHINGMOREDECEPTIVETHANANOBVIOUSFACT',
    'hard',
    [
      'learning.challenges.enigma-hard-1.hint1',
      'learning.challenges.enigma-hard-1.hint2',
      'learning.challenges.enigma-hard-1.hint3',
    ],
  ),
};

export const getChallenges = (cipher: string): Challenge[] =>
  Object.values(CHALLENGES).filter(
    (challenge) => challenge.cipher === cipher && challenge.listOnPractice !== false,
  );

export const getChallenge = (id: string): Challenge | null => CHALLENGES[id] || null;
