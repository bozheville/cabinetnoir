// Per-cipher history timelines, embeddable in history markdown via
// {{timeline:<cipher>}}. Each event carries an i18n key for its text and
// a source URL, so every fact stays verifiable.
export interface TimelineEvent {
  // Year or range label, e.g. "1553" or "1854–1863" — not translated.
  year: string;
  // i18n key of the event text.
  textKey: string;
  // Source backing the event.
  sourceUrl: string;
}

export const TIMELINES: Record<string, TimelineEvent[]> = {
  morse: [
    {
      year: '1837',
      textKey: 'learning.timeline.morse.1837',
      sourceUrl: 'https://en.wikipedia.org/wiki/Morse_code',
    },
    {
      year: '1844',
      textKey: 'learning.timeline.morse.1844',
      sourceUrl: 'https://en.wikipedia.org/wiki/Morse_code',
    },
    {
      year: '1865',
      textKey: 'learning.timeline.morse.1865',
      sourceUrl: 'https://en.wikipedia.org/wiki/Morse_code',
    },
    {
      year: '1906',
      textKey: 'learning.timeline.morse.1906',
      sourceUrl: 'https://en.wikipedia.org/wiki/SOS',
    },
    {
      year: '1999',
      textKey: 'learning.timeline.morse.1999',
      sourceUrl: 'https://en.wikipedia.org/wiki/Morse_code',
    },
  ],
  atbash: [
    {
      year: 'c. 586 BC',
      textKey: 'learning.timeline.atbash.586bc',
      sourceUrl: 'https://en.wikipedia.org/wiki/Atbash',
    },
    {
      year: 'c. 1100',
      textKey: 'learning.timeline.atbash.1100',
      sourceUrl: 'https://en.wikipedia.org/wiki/Atbash',
    },
  ],
  affine: [
    {
      year: '58 BC',
      textKey: 'learning.timeline.affine.58bc',
      sourceUrl: 'https://en.wikipedia.org/wiki/Caesar_cipher',
    },
    {
      year: 'c. 850',
      textKey: 'learning.timeline.affine.850',
      sourceUrl: 'https://en.wikipedia.org/wiki/Frequency_analysis',
    },
    {
      year: '1976',
      textKey: 'learning.timeline.affine.1976',
      sourceUrl: 'https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange',
    },
  ],
  alberti: [
    {
      year: '1467',
      textKey: 'learning.timeline.alberti.1467',
      sourceUrl: 'https://en.wikipedia.org/wiki/Alberti_cipher',
    },
    {
      year: '1508',
      textKey: 'learning.timeline.alberti.1508',
      sourceUrl: 'https://en.wikipedia.org/wiki/Tabula_recta',
    },
    {
      year: '1553',
      textKey: 'learning.timeline.alberti.1553',
      sourceUrl: 'https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher',
    },
  ],
  caesar: [
    {
      year: '58 BC',
      textKey: 'learning.timeline.caesar.58bc',
      sourceUrl: 'https://en.wikipedia.org/wiki/Caesar_cipher',
    },
    {
      year: 'c. 121',
      textKey: 'learning.timeline.caesar.121',
      sourceUrl: 'https://en.wikipedia.org/wiki/Caesar_cipher',
    },
    {
      year: 'c. 800',
      textKey: 'learning.timeline.caesar.800',
      sourceUrl: 'https://en.wikipedia.org/wiki/Frequency_analysis',
    },
    {
      year: '1553',
      textKey: 'learning.timeline.caesar.1553',
      sourceUrl: 'https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher',
    },
  ],
  vigenere: [
    {
      year: '1467',
      textKey: 'learning.timeline.vigenere.1467',
      sourceUrl: 'https://en.wikipedia.org/wiki/Alberti_cipher',
    },
    {
      year: '1508',
      textKey: 'learning.timeline.vigenere.1508',
      sourceUrl: 'https://en.wikipedia.org/wiki/Tabula_recta',
    },
    {
      year: '1553',
      textKey: 'learning.timeline.vigenere.1553',
      sourceUrl: 'https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher',
    },
    {
      year: '1586',
      textKey: 'learning.timeline.vigenere.1586',
      sourceUrl: 'https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher',
    },
    {
      year: '1863',
      textKey: 'learning.timeline.vigenere.1863',
      sourceUrl: 'https://en.wikipedia.org/wiki/Kasiski_examination',
    },
    {
      year: '1920s',
      textKey: 'learning.timeline.vigenere.1920s',
      sourceUrl: 'https://en.wikipedia.org/wiki/Index_of_coincidence',
    },
  ],
};

export const getTimeline = (cipher: string): TimelineEvent[] => TIMELINES[cipher] || [];
