// All UI texts of the Vigenere tool and its cracker (en only for now).
// Later: move to public/locales/{en,fr,ua}/common.json.

const strings = {
  keyLabel: 'Key',
  unknownKey: 'Unknown key',
  hints: {
    title: 'Hints',
    presets: {
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      custom: 'Custom',
    },
    toggles: {
      highlightRepeats: 'Highlight repeated sequences',
      showGaps: 'Show gaps between repeats',
      confidenceBars: 'Key length confidence bars',
      englishReference: 'English reference on chart',
      matchScore: 'Match score %',
      mostLikelyGlow: '"Most likely" glow',
      livePreview: 'Live decryption preview',
      cribs: 'Cribs',
    },
  },
} as const;

export default strings;
