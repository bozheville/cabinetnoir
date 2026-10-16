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
  alberti: {
    tabs: ['learn', 'history', 'practice'],
    sections: {
      learn: ['how-it-works', 'guides', 'breaking-it', 'glossary'],
      history: ['history'],
      practice: ['challenges'],
    },
    atGlance: {
      type: 'learning.types.polyalphabetic',
      difficulty: 'learning.difficulty.easy',
      era: 'learning.alberti.era',
      origin: 'learning.alberti.origin',
      modes: ['encrypt', 'decrypt'],
    },
    glossary: [
      'plaintext',
      'ciphertext',
      'key',
      'alphabet',
      'substitution',
      'polyalphabetic',
      'period',
      'frequency-analysis',
      'brute-force',
    ],
    furtherReading: [
      {
        url: 'https://en.wikipedia.org/wiki/Alberti_cipher',
        labelKey: 'learning.furtherReading.wikipedia',
      },
    ],
  },
  affine: {
    tabs: ['learn', 'history', 'practice'],
    sections: {
      learn: ['how-it-works', 'guides', 'breaking-it', 'glossary'],
      history: ['history'],
      practice: ['challenges'],
    },
    atGlance: {
      type: 'learning.types.substitution',
      difficulty: 'learning.difficulty.easy',
      era: 'learning.affine.era',
      origin: 'learning.affine.origin',
      modes: ['encrypt', 'decrypt'],
    },
    glossary: [
      'plaintext',
      'ciphertext',
      'key',
      'alphabet',
      'substitution',
      'modular-arithmetic',
      'frequency-analysis',
      'brute-force',
    ],
    furtherReading: [
      {
        url: 'https://en.wikipedia.org/wiki/Affine_cipher',
        labelKey: 'learning.furtherReading.wikipedia',
      },
    ],
  },
  atbash: {
    tabs: ['learn', 'history', 'practice'],
    sections: {
      learn: ['how-it-works', 'guides', 'breaking-it', 'glossary'],
      history: ['history'],
      practice: ['challenges'],
    },
    atGlance: {
      type: 'learning.types.substitution',
      difficulty: 'learning.difficulty.trivial',
      era: 'learning.atbash.era',
      origin: 'learning.atbash.origin',
      modes: ['encrypt', 'decrypt'],
    },
    glossary: [
      'plaintext',
      'ciphertext',
      'alphabet',
      'substitution',
    ],
    furtherReading: [
      {
        url: 'https://en.wikipedia.org/wiki/Atbash',
        labelKey: 'learning.furtherReading.wikipedia',
      },
    ],
  },
  morse: {
    tabs: ['learn', 'history', 'practice'],
    sections: {
      learn: ['how-it-works', 'guides', 'glossary'],
      history: ['history'],
      practice: ['challenges'],
    },
    atGlance: {
      type: 'learning.types.encoding',
      difficulty: 'learning.difficulty.trivial',
      era: 'learning.morse.era',
      origin: 'learning.morse.origin',
      modes: ['encode', 'decode'],
    },
    glossary: [
      'encoding',
      'dot',
      'dash',
    ],
    furtherReading: [
      {
        url: 'https://en.wikipedia.org/wiki/Morse_code',
        labelKey: 'learning.furtherReading.wikipedia',
      },
    ],
  },
  base64: {
    tabs: ['learn', 'history', 'practice'],
    sections: {
      learn: ['how-it-works', 'guides', 'glossary'],
      history: ['history'],
      practice: ['challenges'],
    },
    atGlance: {
      type: 'learning.types.encoding',
      difficulty: 'learning.difficulty.trivial',
      era: 'learning.base64.era',
      origin: 'learning.base64.origin',
      modes: ['encode', 'decode'],
    },
    glossary: [
      'encoding',
    ],
    furtherReading: [
      {
        url: 'https://en.wikipedia.org/wiki/Base64',
        labelKey: 'learning.furtherReading.wikipedia',
      },
    ],
  },
  rot13: {
    tabs: ['learn', 'history', 'practice'],
    sections: {
      learn: ['how-it-works', 'guides', 'breaking-it', 'glossary'],
      history: ['history'],
      practice: ['challenges'],
    },
    atGlance: {
      type: 'learning.types.substitution',
      difficulty: 'learning.difficulty.trivial',
      era: 'learning.rot13.era',
      origin: 'learning.rot13.origin',
      modes: ['encrypt', 'decrypt'],
    },
    glossary: [
      'plaintext',
      'ciphertext',
      'alphabet',
      'substitution',
    ],
    furtherReading: [
      {
        url: 'https://en.wikipedia.org/wiki/ROT13',
        labelKey: 'learning.furtherReading.wikipedia',
      },
    ],
  },
  playfair: {
    tabs: ['learn', 'history', 'practice'],
    sections: {
      learn: ['how-it-works', 'guides', 'breaking-it', 'glossary'],
      history: ['history'],
      practice: ['challenges'],
    },
    atGlance: {
      type: 'learning.types.substitution',
      difficulty: 'learning.difficulty.hard',
      era: 'learning.playfair.era',
      origin: 'learning.playfair.origin',
      modes: ['encrypt', 'decrypt'],
    },
    glossary: [
      'plaintext',
      'ciphertext',
      'key',
      'alphabet',
      'digraph',
      'crib',
    ],
    furtherReading: [
      {
        url: 'https://en.wikipedia.org/wiki/Playfair_cipher',
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
