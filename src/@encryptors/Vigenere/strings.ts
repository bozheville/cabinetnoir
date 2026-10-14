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
  wizard: {
    steps: {
      keyLength: 'Key length',
      keyLetters: 'Key letters',
      done: 'Done',
    },
    back: 'Back',
    next: 'Next',
    skip: 'Skip, enter key manually',
    inputChanged: 'The text changed, analysis started over.',
    previewTitle: 'Live decryption preview',
    repeats: {
      title: 'Repeated sequences',
      gapsLabel: 'gaps',
      none: 'No repeated sequences found. Use the key length cards below instead.',
      emptyInput: 'Paste some text first.',
    },
    keyLength: {
      otherLabel: 'Other length',
      otherPlaceholder: '1-20',
      selected: 'Selected',
    },
    keyLetters: {
      sliceLabel: (index: number, total: number) => `Slice ${index + 1} of ${total}`,
      lockedPrefix: 'locked:',
      keyLetter: 'Key letter',
      lock: 'Lock letter',
      allLocked: 'All letters locked. Continue to step 3.',
      manualTag: 'manual',
      yourKey: 'Your key',
      keyHint: 'Type a letter to override, clear it to un-lock.',
    },
  },
} as const;

export default strings;
