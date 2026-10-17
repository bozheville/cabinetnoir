export interface Repeat {
  // Uppercase A-Z sequence.
  sequence: string;
  // Start indices of every occurrence in the clean text, ascending.
  positions: number[];
  // Differences between consecutive positions.
  gaps: number[];
}

export interface DivisorCount {
  length: number;
  count: number;
}

const MIN_SEQUENCE_LENGTH = 3;
const MAX_SEQUENCE_LENGTH = 12;
const MIN_KEY_LENGTH = 2;
const MAX_KEY_LENGTH = 20;

export const findRepeats = (letters: string): Repeat[] => {
  const maxSequenceLength = Math.min(MAX_SEQUENCE_LENGTH, Math.floor(letters.length / 2));

  if (maxSequenceLength < MIN_SEQUENCE_LENGTH) {
    return [];
  }

  // positionKey -> repeat, longer sequences first so short ones get
  // dropped when fully contained in a longer repeat at the same positions.
  const byLength: Map<string, number[]>[] = [];

  for (let length = maxSequenceLength; length >= MIN_SEQUENCE_LENGTH; length -= 1) {
    const map = new Map<string, number[]>();

    for (let i = 0; i + length <= letters.length; i += 1) {
      const sequence = letters.slice(i, i + length);
      const positions = map.get(sequence) || [];
      positions.push(i);
      map.set(sequence, positions);
    }

    byLength.push(
      new Map([...map.entries()].filter(([, positions]) => positions.length >= 2)),
    );
  }

  const seenPositionKeys = new Set<string>();
  const repeats: Repeat[] = [];

  for (const map of byLength) {
    for (const [sequence, positions] of map) {
      const positionKey = positions.join(',');
      if (seenPositionKeys.has(positionKey)) {
        continue;
      }

      seenPositionKeys.add(positionKey);
      repeats.push({
        sequence,
        positions,
        gaps: positions.slice(1).map((position, i) => position - positions[i]),
      });
    }
  }

  // Shortest first: most useful for display.
  return repeats.reverse();
};

export const gapDivisorCounts = (
  repeats: Repeat[],
  maxLength: number = MAX_KEY_LENGTH,
): DivisorCount[] => {
  const counts = new Map<number, number>();

  for (let length = MIN_KEY_LENGTH; length <= maxLength; length += 1) {
    counts.set(length, 0);
  }

  for (const repeat of repeats) {
    for (const gap of repeat.gaps) {
      for (let length = MIN_KEY_LENGTH; length <= Math.min(maxLength, gap); length += 1) {
        if (gap % length === 0) {
          counts.set(length, (counts.get(length) as number) + 1);
        }
      }
    }
  }

  return [...counts.entries()]
    .filter(([, count]) => count > 0)
    .map(([length, count]) => ({ length, count }))
    .sort((a, b) => b.count - a.count);
};
