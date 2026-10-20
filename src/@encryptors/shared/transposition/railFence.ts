// Rail fence: the classic zigzag transposition. The text rides a fence
// of `rails` rails, bouncing between the top and bottom rail; the
// ciphertext is the rails read one after another, top to bottom.
//
// `offset` shifts where the zigzag starts (which rail the first letter
// sits on, heading down — or up, when starting on the bottom rail).
// Offset 0 is the classic fence; the variant kills the "first letter is
// always rail 0" tell.
//
// Shared by the RailFence tool/cracker and, through the identification
// helpers, by the /identify rules — the offset-0 behaviour matches the
// original roadmap identification helper exactly.

interface RailFenceOptions {
  offset?: number;
}

// The zigzag pattern: pattern[i] = rail of the i-th character.
const zigzagPattern = (length: number, rails: number, offset: number): number[] => {
  const pattern: number[] = [];
  let row = Math.min(Math.max(offset, 0), rails - 1);
  let direction = row === rails - 1 ? -1 : 1;
  for (let index = 0; index < length; index += 1) {
    pattern.push(row);
    row += direction;
    // Flip at the rails' ends, exactly like the classic pattern walk.
    if (row === rails - 1 || row === 0) {
      direction = -direction;
    }
    if (row < 0 || row > rails - 1) {
      // Defensive: a single-rail fence cannot zigzag.
      direction = -direction;
      row += 2 * direction;
    }
  }
  return pattern;
};

export const railFenceEncrypt = (
  text: string,
  rails: number,
  options: RailFenceOptions = {},
): string => {
  if (rails < 2 || text.length === 0) {
    return text;
  }
  const pattern = zigzagPattern(text.length, rails, options.offset ?? 0);
  const rows: string[][] = Array.from({ length: rails }, () => []);
  pattern.forEach((rail, index) => rows[rail].push(text[index]));
  return rows.map((row) => row.join('')).join('');
};

export const railFenceDecrypt = (
  ciphertext: string,
  rails: number,
  options: RailFenceOptions = {},
): string => {
  if (rails < 2 || ciphertext.length === 0) {
    return ciphertext;
  }
  const pattern = zigzagPattern(ciphertext.length, rails, options.offset ?? 0);
  // The ciphertext is the rails concatenated: count how many letters
  // each rail owns, then slice the ciphertext into the rails in order.
  const railLengths = new Array(rails).fill(0) as number[];
  pattern.forEach((rail) => { railLengths[rail] += 1; });
  const railContents: string[] = [];
  let cursor = 0;
  for (let rail = 0; rail < rails; rail += 1) {
    railContents.push(ciphertext.slice(cursor, cursor + railLengths[rail]));
    cursor += railLengths[rail];
  }
  const railCursors = new Array(rails).fill(0) as number[];
  const output: string[] = [];
  pattern.forEach((rail) => {
    output.push(railContents[rail][railCursors[rail]]);
    railCursors[rail] += 1;
  });
  return output.join('');
};

// Both directions in one call, mirroring the monoalphabetic core style.
export const railFenceTransform = (
  text: string,
  rails: number,
  isDecryptMode: boolean,
  options: RailFenceOptions = {},
): string => (isDecryptMode
  ? railFenceDecrypt(text, rails, options)
  : railFenceEncrypt(text, rails, options));
