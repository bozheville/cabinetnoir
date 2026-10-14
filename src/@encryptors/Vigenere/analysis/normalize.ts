export interface NormalizedText {
  // Uppercase A-Z only.
  letters: string;
  // originalIndices[i] is the index of letters[i] in the original input.
  originalIndices: number[];
}

export const normalize = (input: string): NormalizedText => {
  const letters: string[] = [];
  const originalIndices: number[] = [];

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    if (/[a-z]/i.test(char)) {
      letters.push(char.toUpperCase());
      originalIndices.push(i);
    }
  }

  return { letters: letters.join(''), originalIndices };
};
