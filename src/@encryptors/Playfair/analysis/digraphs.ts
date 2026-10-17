// English digraph statistics for the Playfair attack.
//
// Approximate frequencies (percent of English text) for the common
// digraphs; every digraph not listed scores at the floor. Log-space
// scoring keeps long texts from dominating.
export const ENGLISH_DIGRAPHS: Record<string, number> = {
  TH: 3.56, HE: 3.07, IN: 2.43, ER: 2.17, AN: 2.17, RE: 1.85, ON: 1.76,
  AT: 1.49, EN: 1.45, ND: 1.45, TI: 1.34, ES: 1.34, OR: 1.28, TE: 1.20,
  OF: 1.17, ED: 1.17, IS: 1.13, IT: 1.12, AL: 1.09, AR: 1.07, ST: 1.05,
  TO: 1.05, NT: 1.00, NG: 0.95, SE: 0.93, HA: 0.93, AS: 0.87, OU: 0.86,
  IO: 0.83, LE: 0.83, VE: 0.83, CO: 0.79, ME: 0.79, DE: 0.76, HI: 0.76,
  RI: 0.73, RO: 0.73, IC: 0.70, NE: 0.69, EA: 0.69, RA: 0.69, CE: 0.65,
  LI: 0.62, CH: 0.60, LL: 0.60, BE: 0.59, MA: 0.59, SI: 0.55, OM: 0.55,
  UR: 0.54,
};

// Score for digraphs missing from the table (0.01% of text).
const FLOOR = Math.log10(0.01);

export const digraphScore = (digraph: string): number => {
  const frequency = ENGLISH_DIGRAPHS[digraph];
  return frequency === undefined ? FLOOR : Math.log10(frequency);
};

// English-likeness of a plaintext candidate: average log-frequency of
// its (non-overlapping) digraphs, normalized to 0-100. English text
// averages around -0.5 log per digraph, random text sits at the floor.
export const scoreDigraphs = (plaintextLetters: string): number => {
  const pairs = plaintextLetters.match(/.{2}/g) || [];
  if (pairs.length === 0) {
    return 0;
  }

  let sum = 0;
  for (const pair of pairs) {
    sum += digraphScore(pair);
  }

  const average = sum / pairs.length;
  const ENGLISH_AVERAGE = -0.5;
  const RANDOM_AVERAGE = FLOOR; // -2
  const normalized = (average - RANDOM_AVERAGE) / (ENGLISH_AVERAGE - RANDOM_AVERAGE);
  return Math.round(100 * Math.max(0, Math.min(1, normalized)));
};

// The most common digraphs of the ciphertext, ranked by count.
export const topDigraphs = (letters: string, limit: number = 8): Array<{ digraph: string; count: number }> => {
  const counts = new Map<string, number>();
  const pairs = letters.match(/.{2}/g) || [];
  for (const pair of pairs) {
    counts.set(pair, (counts.get(pair) || 0) + 1);
  }

  return [...counts.entries()]
    .map(([digraph, count]) => ({ digraph, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

// The reference list for the hints panel: the English digraphs above a
// frequency floor, most common first.
export const commonEnglishDigraphs = (limit: number = 12): string[] =>
  Object.entries(ENGLISH_DIGRAPHS)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([digraph]) => digraph);
