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
