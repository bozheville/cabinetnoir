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

// The cryptoanalysis tab: a first-class tab for ciphers with a cracker
// wizard, not a decrypt-mode checkbox. Governed by
// specs/learning-material-standardisation/standard.md §10.
const CRYPTOANALYSIS_TAB = 'cryptoanalysis';

// Home-page cipher ladder (#74): every cipher in one difficulty-ordered
// list, trivial → hardest. Base64 is excluded on purpose — it is a
// digital-era utility, not pen-and-paper cryptography; it stays
// reachable through the ladder's footnote link. The Start-here card
// points at the classic first cipher.
const CIPHER_LADDER = [
  'morse',
  'rot13',
  'atbash',
  'pigpen',
  'caesar',
  'polybius',
  'railFence',
  'affine',
  'keyword',
  'columnar',
  'playfair',
  'beaufort',
  'vigenere',
  'autokey',
  'nihilist',
  'adfgvx',
  'alberti',
  'enigma',
];

const START_HERE_CIPHER = 'caesar';

const learningConfig = {
  beaufort: {
    tabs: ['learn', 'history', 'practice'],
    sections: {
      learn: ['how-it-works', 'guides', 'breaking-it', 'glossary'],
      history: ['history'],
      practice: ['challenges'],
    },
    atGlance: {
      type: 'learning.types.polyalphabetic',
      difficulty: 'learning.difficulty.hard',
      era: 'learning.beaufort.era',
      origin: 'learning.beaufort.origin',
      modes: ['encrypt', 'decrypt', 'cryptoanalysis'],
    },
    glossary: [
      'plaintext',
      'ciphertext',
      'key',
      'alphabet',
      'tabula-recta',
      'reciprocal',
      'key-length',
      'slice',
      'frequency-analysis',
      'index-of-coincidence',
      'kasiski-examination',
      'crib',
    ],
    furtherReading: [
      {
        url: 'https://en.wikipedia.org/wiki/Beaufort_cipher',
        labelKey: 'learning.furtherReading.wikipedia',
      },
    ],
  },
  autokey: {
    tabs: ['learn', 'history', 'practice'],
    sections: {
      learn: ['how-it-works', 'guides', 'breaking-it', 'glossary'],
      history: ['history'],
      practice: ['challenges'],
    },
    atGlance: {
      type: 'learning.types.polyalphabetic',
      difficulty: 'learning.difficulty.hard',
      era: 'learning.autokey.era',
      origin: 'learning.autokey.origin',
      modes: ['encrypt', 'decrypt', 'cryptoanalysis'],
    },
    glossary: [
      'plaintext',
      'ciphertext',
      'key',
      'alphabet',
      'primer',
      'keystream',
      'crib',
      'frequency-analysis',
    ],
    furtherReading: [
      {
        url: 'https://en.wikipedia.org/wiki/Autokey_cipher',
        labelKey: 'learning.furtherReading.wikipedia',
      },
    ],
  },
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
      modes: ['encrypt', 'decrypt', 'cryptoanalysis'],
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
      modes: ['encrypt', 'decrypt', 'cryptoanalysis'],
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
  keyword: {
    tabs: ['learn', 'history', 'practice'],
    sections: {
      learn: ['how-it-works', 'guides', 'breaking-it', 'glossary'],
      history: ['history'],
      practice: ['challenges'],
    },
    atGlance: {
      type: 'learning.types.substitution',
      difficulty: 'learning.difficulty.easy',
      era: 'learning.keyword.era',
      origin: 'learning.keyword.origin',
      modes: ['encrypt', 'decrypt', 'cryptoanalysis'],
    },
    glossary: [
      'plaintext',
      'ciphertext',
      'key',
      'alphabet',
      'substitution',
      'cipher-alphabet',
      'pattern-word',
      'frequency-analysis',
    ],
    furtherReading: [
      {
        url: 'https://en.wikipedia.org/wiki/Substitution_cipher',
        labelKey: 'learning.furtherReading.wikipedia',
      },
    ],
  },
  // Columnar: full learning material (English content task). The cracker
  // shipped first with empty tabs; this flips them on.
  columnar: {
    tabs: ['learn', 'history', 'practice'],
    sections: {
      learn: ['how-it-works', 'guides', 'breaking-it', 'glossary'],
      history: ['history'],
      practice: ['challenges'],
    },
    atGlance: {
      type: 'learning.types.transposition',
      difficulty: 'learning.difficulty.easy',
      era: 'learning.columnar.era',
      origin: 'learning.columnar.origin',
      modes: ['encrypt', 'decrypt', 'cryptoanalysis'],
    },
    glossary: [
      'plaintext',
      'ciphertext',
      'key',
      'transposition',
      'column-order',
      'anagramming',
    ],
    furtherReading: [
      {
        url: 'https://en.wikipedia.org/wiki/Transposition_cipher',
        labelKey: 'learning.furtherReading.wikipedia',
      },
    ],
  },
  // Rail fence: full learning material (English content task). The
  // cracker shipped first with empty tabs; this flips them on.
  railFence: {
    tabs: ['learn', 'history', 'practice'],
    sections: {
      learn: ['how-it-works', 'guides', 'breaking-it', 'glossary'],
      history: ['history'],
      practice: ['challenges'],
    },
    atGlance: {
      type: 'learning.types.transposition',
      difficulty: 'learning.difficulty.trivial',
      era: 'learning.railFence.era',
      origin: 'learning.railFence.origin',
      modes: ['encrypt', 'decrypt', 'cryptoanalysis'],
    },
    glossary: [
      'plaintext',
      'ciphertext',
      'key',
      'transposition',
      'rail-fence',
      'zigzag',
    ],
    furtherReading: [
      {
        url: 'https://en.wikipedia.org/wiki/Rail_fence_cipher',
        labelKey: 'learning.furtherReading.wikipedia',
      },
    ],
  },
  // Polybius square: coordinates instead of letters — a substitution in
  // disguise. The cryptoanalysis tab shares the guided square-deciphing
  // step with Nihilist and ADFGVX: an unknown-keyword square is rebuilt
  // from the coordinate stream, then handed back to the tool.
  polybius: {
    tabs: ['learn', 'history', 'practice'],
    sections: {
      learn: ['how-it-works', 'guides', 'breaking-it', 'glossary'],
      history: ['history'],
      practice: ['challenges'],
    },
    atGlance: {
      type: 'learning.types.substitution',
      difficulty: 'learning.difficulty.trivial',
      era: 'learning.polybius.era',
      origin: 'learning.polybius.origin',
      modes: ['encrypt', 'decrypt', 'cryptoanalysis'],
    },
    glossary: [
      'plaintext',
      'ciphertext',
      'key',
      'alphabet',
      'polybius-square',
      'substitution',
    ],
    furtherReading: [
      {
        url: 'https://en.wikipedia.org/wiki/Polybius_square',
        labelKey: 'learning.furtherReading.wikipedia',
      },
    ],
  },
  // Nihilist: Polybius square + a periodic additive key — "Vigenère on
  // numbers". Full learning material (English content task).
  nihilist: {
    tabs: ['learn', 'history', 'practice'],
    sections: {
      learn: ['how-it-works', 'guides', 'breaking-it', 'glossary'],
      history: ['history'],
      practice: ['challenges'],
    },
    atGlance: {
      type: 'learning.types.polyalphabetic',
      difficulty: 'learning.difficulty.medium',
      era: 'learning.nihilist.era',
      origin: 'learning.nihilist.origin',
      modes: ['encrypt', 'decrypt', 'cryptoanalysis'],
    },
    glossary: [
      'plaintext',
      'ciphertext',
      'key',
      'polybius-square',
      'additive-key',
      'key-length',
      'frequency-analysis',
      'index-of-coincidence',
      'kasiski-examination',
    ],
    furtherReading: [
      {
        url: 'https://en.wikipedia.org/wiki/Nihilist_cipher',
        labelKey: 'learning.furtherReading.wikipedia',
      },
    ],
  },
  pigpen: {
    tabs: ['learn', 'history', 'practice'],
    sections: {
      learn: ['how-it-works', 'guides', 'breaking-it', 'glossary'],
      history: ['history'],
      practice: ['challenges'],
    },
    atGlance: {
      type: 'learning.types.substitution',
      difficulty: 'learning.difficulty.trivial',
      era: 'learning.pigpen.era',
      origin: 'learning.pigpen.origin',
      modes: ['encrypt', 'decrypt'],
    },
    glossary: [
      'plaintext',
      'ciphertext',
      'substitution',
      'frequency-analysis',
    ],
    furtherReading: [
      {
        url: 'https://en.wikipedia.org/wiki/Pigpen_cipher',
        labelKey: 'learning.furtherReading.wikipedia',
      },
    ],
  },
  // Saknussemm (easter egg, epic #104): the runic parchment from
  // "Journey to the Centre of the Earth" — a reversal + route
  // transposition, letters only. Off the cipher ladder on purpose: it
  // is a literary homage, not a graded step. §10-exempt: no cracker —
  // the practice tab's single challenge is the parchment itself.
  saknussemm: {
    tabs: ['learn', 'history', 'practice'],
    sections: {
      learn: ['how-it-works', 'guides', 'breaking-it', 'glossary'],
      history: ['history'],
      practice: ['challenges'],
    },
    atGlance: {
      type: 'learning.types.transposition',
      difficulty: 'learning.difficulty.easy',
      era: 'learning.saknussemm.era',
      origin: 'learning.saknussemm.origin',
      modes: ['encrypt', 'decrypt'],
    },
    glossary: [
      'plaintext',
      'ciphertext',
      'transposition',
    ],
    furtherReading: [
      {
        url: 'https://en.wikipedia.org/wiki/Journey_to_the_Centre_of_the_Earth',
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
      modes: ['encrypt', 'decrypt', 'cryptoanalysis'],
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
  enigma: {
    tabs: ['learn', 'history', 'practice'],
    sections: {
      learn: ['how-it-works', 'guides', 'breaking-it', 'glossary'],
      history: ['history'],
      practice: ['challenges'],
    },
    atGlance: {
      type: 'learning.types.polyalphabetic',
      difficulty: 'learning.difficulty.hard',
      era: 'learning.enigma.era',
      origin: 'learning.enigma.origin',
      modes: ['encrypt', 'decrypt'],
    },
    glossary: [
      'plaintext',
      'ciphertext',
      'key',
      'alphabet',
      'polyalphabetic',
      'rotor',
      'plugboard',
      'reflector',
      'crib',
    ],
    furtherReading: [
      {
        url: 'https://en.wikipedia.org/wiki/Enigma_machine',
        labelKey: 'learning.furtherReading.wikipedia',
      },
    ],
  },
  adfgvx: {
    tabs: LEARNING_TABS,
    sections: {
      learn: ['how-it-works', 'guides', 'breaking-it', 'glossary'],
      history: ['history'],
      practice: ['challenges'],
    },
    atGlance: {
      type: 'learning.types.fractionation',
      difficulty: 'learning.difficulty.hard',
      era: 'learning.adfgvx.era',
      origin: 'learning.adfgvx.origin',
      modes: ['encrypt', 'decrypt', 'cryptoanalysis'],
    },
    glossary: [
      'plaintext',
      'ciphertext',
      'key',
      'alphabet',
      'polybius-square',
      'fractionation',
      'transposition',
      'frequency-analysis',
      'crib',
    ],
    furtherReading: [
      {
        url: 'https://en.wikipedia.org/wiki/ADFGVX_cipher',
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

// The Cryptoanalysis tab exists only for ciphers that ship a cracker
// wizard; the atGlance.modes flag is the single source of truth.
const hasCryptoanalysis = (cipher) => {
  const config = getLearningConfig(cipher);
  return !!config && config.atGlance.modes.indexOf('cryptoanalysis') !== -1;
};

module.exports = {
  LEARNING_TABS,
  CRYPTOANALYSIS_TAB,
  CIPHER_LADDER,
  START_HERE_CIPHER,
  learningConfig,
  getLearningConfig,
  hasTab,
  hasCryptoanalysis,
};
