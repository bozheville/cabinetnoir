// Per-cipher learning material config.
//
// One entry per cipher says which learning tabs the cipher has, which
// sections each tab holds (in the fixed standard order) and the facts for
// the at-a-glance card. Texts are never stored here: every value is an i18n
// key resolved from public/locales/{en,fr,ua}/common.json.
//
// Plain CommonJS (not TypeScript) so plain Node scripts can require it,
// exactly like src/@encryptors/algorithms.js is used by
// scripts/generate-sitemap.js. Types live in config.d.ts.

// Learning tab names, sharing the second URL segment with the encryption
// modes (direct / reverse) on /encoder/<cipher>/<action> pages.
const LEARNING_TABS = ['learn', 'history', 'practice'];

const learningConfig = {
  vigenere: {
    tabs: ['learn', 'history', 'practice'],
    sections: {
      learn: ['how-it-works', 'guides', 'breaking-it', 'glossary'],
      history: ['history'],
      practice: ['challenges'],
    },
    atGlance: {
      type: 'learning.types.polyalphabetic',
      difficulty: 'learning.difficulty.hard',
      era: 'learning.vigenere.era',
      origin: 'learning.vigenere.origin',
      modes: ['encrypt', 'decrypt', 'cryptoanalysis'],
    },
    glossary: [
      'plaintext',
      'ciphertext',
      'key',
      'alphabet',
      'key-length',
      'slice',
      'frequency-analysis',
      'index-of-coincidence',
      'kasiski-examination',
      'crib',
    ],
    furtherReading: [
      {
        url: 'https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher',
        labelKey: 'learning.furtherReading.wikipedia',
      },
    ],
  },
  caesar: {
    tabs: ['learn', 'history', 'practice'],
    sections: {
      learn: ['how-it-works', 'guides', 'breaking-it', 'glossary'],
      history: ['history'],
      practice: ['challenges'],
    },
    atGlance: {
      type: 'learning.types.substitution',
      difficulty: 'learning.difficulty.trivial',
      era: 'learning.caesar.era',
      origin: 'learning.caesar.origin',
      modes: ['encrypt', 'decrypt'],
    },
    glossary: [
      'plaintext',
      'ciphertext',
      'key',
      'shift',
      'alphabet',
      'substitution',
      'frequency-analysis',
      'brute-force',
    ],
    furtherReading: [
      {
        url: 'https://en.wikipedia.org/wiki/Caesar_cipher',
        labelKey: 'learning.furtherReading.wikipedia',
      },
    ],
  },
};

const getLearningConfig = (cipher) => learningConfig[cipher] || null;

const hasTab = (cipher, tab) => {
  const config = getLearningConfig(cipher);
  return !!config && config.tabs.indexOf(tab) !== -1;
};

module.exports = {
  LEARNING_TABS,
  learningConfig,
  getLearningConfig,
  hasTab,
};
