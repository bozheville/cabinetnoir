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
  keyword: [
    {
      year: 'c. 800',
      textKey: 'learning.timeline.keyword.800',
      sourceUrl: 'https://en.wikipedia.org/wiki/Al-Kindi',
    },
    {
      year: '1563',
      textKey: 'learning.timeline.keyword.1563',
      sourceUrl: 'https://en.wikipedia.org/wiki/Giambattista_della_Porta',
    },
    {
      year: '1586',
      textKey: 'learning.timeline.keyword.1586',
      sourceUrl: 'https://en.wikipedia.org/wiki/Babington_Plot',
    },
  ],
  railFence: [
    {
      year: 'c. 400 BC',
      textKey: 'learning.timeline.railFence.scytale',
      sourceUrl: 'https://en.wikipedia.org/wiki/Scytale',
    },
    {
      year: '1861',
      textKey: 'learning.timeline.railFence.civilWar',
      sourceUrl: 'https://en.wikipedia.org/wiki/Rail_fence_cipher',
    },
  ],
  columnar: [
    {
      year: '1914',
      textKey: 'learning.timeline.columnar.wwi',
      sourceUrl: 'https://en.wikipedia.org/wiki/Transposition_cipher',
    },
    {
      year: '1918',
      textKey: 'learning.timeline.columnar.1918',
      sourceUrl: 'https://en.wikipedia.org/wiki/ADFGVX_cipher',
    },
    {
      year: '1942',
      textKey: 'learning.timeline.columnar.1942',
      sourceUrl: 'https://en.wikipedia.org/wiki/Leo_Marks',
    },
  ],
  adfgvx: [
    {
      year: '1918',
      textKey: 'learning.timeline.adfgvx.1918-introduced',
      sourceUrl: 'https://en.wikipedia.org/wiki/ADFGVX_cipher',
    },
    {
      year: '1918',
      textKey: 'learning.timeline.adfgvx.1918-painvin',
      sourceUrl: 'https://en.wikipedia.org/wiki/Georges_Painvin',
    },
    {
      year: '1918',
      textKey: 'learning.timeline.adfgvx.1918-traffic',
      sourceUrl: 'https://en.wikipedia.org/wiki/ADFGVX_cipher',
    },
  ],
  enigma: [
    {
      year: '1918',
      textKey: 'learning.timeline.enigma.1918',
      sourceUrl: 'https://en.wikipedia.org/wiki/Enigma_machine',
    },
    {
      year: '1926',
      textKey: 'learning.timeline.enigma.1926',
      sourceUrl: 'https://en.wikipedia.org/wiki/Enigma_machine',
    },
    {
      year: '1932',
      textKey: 'learning.timeline.enigma.1932',
      sourceUrl: 'https://en.wikipedia.org/wiki/Cryptanalysis_of_the_Enigma',
    },
    {
      year: '1939',
      textKey: 'learning.timeline.enigma.1939',
      sourceUrl: 'https://en.wikipedia.org/wiki/Cryptanalysis_of_the_Enigma',
    },
    {
      year: '1940',
      textKey: 'learning.timeline.enigma.1940',
      sourceUrl: 'https://en.wikipedia.org/wiki/Bombe',
    },
    {
      year: '1942',
      textKey: 'learning.timeline.enigma.1942',
      sourceUrl: 'https://en.wikipedia.org/wiki/Cryptanalysis_of_the_Enigma',
    },
  ],
  playfair: [
    {
      year: '1854',
      textKey: 'learning.timeline.playfair.1854',
      sourceUrl: 'https://en.wikipedia.org/wiki/Playfair_cipher',
    },
    {
      year: '1899',
      textKey: 'learning.timeline.playfair.1899',
      sourceUrl: 'https://en.wikipedia.org/wiki/Playfair_cipher',
    },
    {
      year: '1914',
      textKey: 'learning.timeline.playfair.1914',
      sourceUrl: 'https://en.wikipedia.org/wiki/Playfair_cipher',
    },
  ],
  rot13: [
    {
      year: '1980s',
      textKey: 'learning.timeline.rot13.1980s',
      sourceUrl: 'https://en.wikipedia.org/wiki/ROT13',
    },
  ],
  base64: [
    {
      year: '1992',
      textKey: 'learning.timeline.base64.1992',
      sourceUrl: 'https://en.wikipedia.org/wiki/Base64',
    },
    {
      year: '1996',
      textKey: 'learning.timeline.base64.1996',
      sourceUrl: 'https://en.wikipedia.org/wiki/Base64',
    },
    {
      year: '2006',
      textKey: 'learning.timeline.base64.2006',
      sourceUrl: 'https://en.wikipedia.org/wiki/Base64',
    },
  ],
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
  pigpen: [
    {
      year: '1531',
      textKey: 'learning.timeline.pigpen.1531',
      sourceUrl: 'https://en.wikipedia.org/wiki/Pigpen_cipher',
    },
    {
      year: '1730',
      textKey: 'learning.timeline.pigpen.1730',
      sourceUrl: 'https://en.wikipedia.org/wiki/Pigpen_cipher',
    },
    {
      year: 'early 1700s',
      textKey: 'learning.timeline.pigpen.1700s',
      sourceUrl: 'https://en.wikipedia.org/wiki/Pigpen_cipher',
    },
    {
      year: '1860s',
      textKey: 'learning.timeline.pigpen.1860s',
      sourceUrl: 'https://en.wikipedia.org/wiki/Pigpen_cipher',
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
  polybius: [
    {
      year: 'c. 150 BC',
      textKey: 'learning.timeline.polybius.torches',
      sourceUrl: 'https://en.wikipedia.org/wiki/Polybius_square',
    },
    {
      year: '1880s',
      textKey: 'learning.timeline.polybius.nihilist',
      sourceUrl: 'https://en.wikipedia.org/wiki/Nihilist_cipher',
    },
    {
      year: '1940s',
      textKey: 'learning.timeline.polybius.tapCode',
      sourceUrl: 'https://en.wikipedia.org/wiki/Tap_code',
    },
  ],
  nihilist: [
    {
      year: '1880s',
      textKey: 'learning.timeline.nihilist.1880s',
      sourceUrl: 'https://en.wikipedia.org/wiki/Nihilist_cipher',
    },
    {
      year: '1940s',
      textKey: 'learning.timeline.nihilist.tapCode',
      sourceUrl: 'https://en.wikipedia.org/wiki/Tap_code',
    },
    {
      year: '1950s',
      textKey: 'learning.timeline.nihilist.vic',
      sourceUrl: 'https://en.wikipedia.org/wiki/VIC_cipher',
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
  beaufort: [
    {
      year: '1553',
      textKey: 'learning.timeline.beaufort.1553',
      sourceUrl: 'https://en.wikipedia.org/wiki/Beaufort_cipher',
    },
    {
      year: '1857',
      textKey: 'learning.timeline.beaufort.1857',
      sourceUrl: 'https://en.wikipedia.org/wiki/Beaufort_cipher',
    },
    {
      year: '1930s',
      textKey: 'learning.timeline.beaufort.1930s',
      sourceUrl: 'https://en.wikipedia.org/wiki/M-209',
    },
  ],
  autokey: [
    {
      year: '1553',
      textKey: 'learning.timeline.autokey.1553',
      sourceUrl: 'https://en.wikipedia.org/wiki/Autokey_cipher',
    },
    {
      year: '1586',
      textKey: 'learning.timeline.autokey.1586',
      sourceUrl: 'https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher',
    },
    {
      year: '1863',
      textKey: 'learning.timeline.autokey.1863',
      sourceUrl: 'https://en.wikipedia.org/wiki/Kasiski_examination',
    },
  ],
  saknussemm: [
    {
      year: 'c. 1530s (fiction)',
      textKey: 'learning.timeline.saknussemm.1530s',
      sourceUrl: 'https://en.wikipedia.org/wiki/Arne_Saknussemm',
    },
    {
      year: '1864',
      textKey: 'learning.timeline.saknussemm.1864',
      sourceUrl: 'https://en.wikipedia.org/wiki/Journey_to_the_Centre_of_the_Earth',
    },
    {
      year: '1871',
      textKey: 'learning.timeline.saknussemm.1871',
      sourceUrl: 'https://www.gutenberg.org/ebooks/18857',
    },
  ],
};

export const getTimeline = (cipher: string): TimelineEvent[] => TIMELINES[cipher] || [];
