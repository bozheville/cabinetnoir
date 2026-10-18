import { describe, expect, it } from 'vitest';

import { matchKnownTexts } from './knownTexts';

describe('matchKnownTexts: Arne Saknussemm', () => {
  const plain =
    'In Sneffels Yoculis craterem kem delibat umbra Scartaris Julii '
    + 'intra calendas descende, audas viator, et terrestre centrum '
    + 'attinges. Kod feci. Arne Saknussemm';

  it('matches the plain Latin message', () => {
    const match = matchKnownTexts(plain.toUpperCase());
    expect(match?.id).toBe('saknussemm');
  });

  it('matches the scrambled transcription', () => {
    const scrambled =
      'mm.rnlls esruel seecJde sgtssmf unteief niedrke kt,samn atrateS '
      + 'Saodrrn emtnaeI nuaect rrilSa Atvaar .nscrc ieaabs ccdrmi eeutul '
      + 'frantu dt,iac oseibo KediiY';
    const match = matchKnownTexts(scrambled);
    expect(match?.id).toBe('saknussemm');
  });

  it('matches a long fragment of the message', () => {
    const match = matchKnownTexts('calendas descende, audas viator, et terrestre centrum attinges. Kod feci. Arne Saknussemm');
    expect(match?.id).toBe('saknussemm');
  });

  it('rejects a too-short fragment', () => {
    expect(matchKnownTexts('descende audas viator')).toBeNull();
  });

  it('rejects unrelated text', () => {
    expect(matchKnownTexts('THEQUICKBROWNFOXJUMPSOVERTHELAZYDOGANDTHENHERANINTOTHEWOODS')).toBeNull();
    expect(matchKnownTexts('')).toBeNull();
  });
});
