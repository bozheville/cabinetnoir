// Nihilist cracker math, all pure: the number stream's key length and
// the range constraint that pins each key number. No React, no i18n.
import { splitSum } from '../nihilist-crypt';

// --- Key length from the stream's periodicity ---

export type KeyLengthLabel = 'veryLikely' | 'possible' | 'unlikely';

export interface NihilistKeyLengthCandidate {
  length: number;
  // 0–100: slice coincidence of the number stream + repeat spacing.
  confidence: number;
  label: KeyLengthLabel;
  averageIC: number;
}

// The stream's symbols are sums of two 1–5 digit pairs; a random stream
// of ~85 distinct values has IC ≈ 0.012, a correctly sliced one shares
// the key's digit-pair bias and climbs well above.
const IC_RANDOM = 0.012;
const IC_TARGET = 0.055;

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

const indexOfCoincidenceValues = (values: number[]): number => {
  const total = values.length;
  if (total < 2) {
    return 0;
  }
  const counts = new Map<number, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  const pairs = [...counts.values()].reduce((sum, count) => sum + count * (count - 1), 0);
  return pairs / (total * (total - 1));
};

const averageSliceIC = (values: number[], length: number): number => {
  let sum = 0;
  let counted = 0;
  for (let offset = 0; offset < length; offset += 1) {
    const slice: number[] = [];
    for (let index = offset; index < values.length; index += length) {
      slice.push(values[index]);
    }
    if (slice.length >= 4) {
      sum += indexOfCoincidenceValues(slice);
      counted += 1;
    }
  }
  return counted === 0 ? 0 : sum / counted;
};

// Repeat spacing: the same short run of numbers reappearing every key
// period. Counted per length as the divisors of the gaps between
// repeats of a 3-number run.
const divisorBonus = (values: number[], maxLength: number): Map<number, number> => {
  const bonus = new Map<number, number>();
  const seen = new Map<string, number>();
  const RUN = 3;
  for (let index = 0; index + RUN <= values.length; index += 1) {
    const run = values.slice(index, index + RUN).join(',');
    const previous = seen.get(run);
    if (previous !== undefined) {
      const gap = index - previous;
      for (let length = 2; length <= Math.min(maxLength, gap); length += 1) {
        if (gap % length === 0) {
          bonus.set(length, (bonus.get(length) || 0) + 1);
        }
      }
    }
    seen.set(run, index);
  }
  return bonus;
};

const VERY_LIKELY = 60;
const POSSIBLE = 30;
const IC_WEIGHT = 0.7;
const REPEAT_WEIGHT = 0.3;

export const rankKeyLengths = (
  values: number[],
  maxLength = 20,
): NihilistKeyLengthCandidate[] => {
  if (values.length < 8) {
    return [];
  }
  const repeats = divisorBonus(values, maxLength);
  const maxBonus = Math.max(0, ...repeats.values());

  const candidates: NihilistKeyLengthCandidate[] = [];
  for (let length = 2; length <= maxLength; length += 1) {
    if (values.length / length < 4) {
      continue;
    }
    const averageIC = averageSliceIC(values, length);
    const bonus = (repeats.get(length) || 0) / (maxBonus || 1);
    const confidence = Math.round(
      100 * (IC_WEIGHT * clamp01((averageIC - IC_RANDOM) / (IC_TARGET - IC_RANDOM))
        + REPEAT_WEIGHT * bonus),
    );
    candidates.push({
      length,
      confidence,
      label: confidence >= VERY_LIKELY
        ? 'veryLikely'
        : confidence >= POSSIBLE ? 'possible' : 'unlikely',
      averageIC,
    });
  }
  return candidates.sort((a, b) => b.confidence - a.confidence || a.length - b.length);
};

// --- The range constraint that pins each key number ---

// The numbers of one key column: values[index], values[index + length], …
export const columnNumbers = (
  values: number[],
  length: number,
  index: number,
): number[] => values.filter((_, position) => position % length === index);

// Every key number (two 1–5 digits, 11–55) consistent with a column:
// subtracting it from EVERY value in the column must leave both digits
// in 1–5 — otherwise that cell would fall outside the square. This
// alone usually pins the key number to a handful of candidates.
export const consistentKeyNumbers = (column: number[]): number[] => {
  const consistent: number[] = [];
  for (let keyRow = 1; keyRow <= 5; keyRow += 1) {
    for (let keyColumn = 1; keyColumn <= 5; keyColumn += 1) {
      const fits = column.every((value) => {
        const [sumRow, sumColumn] = splitSum(value);
        const row = sumRow - keyRow;
        const col = sumColumn - keyColumn;
        return row >= 1 && row <= 5 && col >= 1 && col <= 5;
      });
      if (fits) {
        consistent.push(keyRow * 10 + keyColumn);
      }
    }
  }
  return consistent;
};
