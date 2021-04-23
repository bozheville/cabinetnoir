const alias = [
  ['A', '.-'],
  ['B', '-...'],
  ['C', '-.-.'],
  ['D', '-..'],
  ['E', '.'],
  ['F', '..-.'],
  ['G', '--.'],
  ['H', '....'],
  ['I', '..'],
  ['J', '.---'],
  ['K', '-.-'],
  ['L', '.-..'],
  ['M', '--'],
  ['N', '-.'],
  ['O', '---'],
  ['P', '.--.'],
  ['Q', '--.-'],
  ['R', '.-.'],
  ['S', '...'],
  ['T', '-'],
  ['U', '..-'],
  ['V', '...-'],
  ['W', '.--'],
  ['X', '-..-'],
  ['Y', '-.--'],
  ['Z', '--..'],
];

export const morseEncoding = (input: string): string => {
  const directMap = alias.reduce((result, current) => ({
    ...result,
    [current[0]]: current[1],
  }), {});

  return input
    .toUpperCase()
    .split('')
    .filter((c) => /[A-Z]/.test(c))
    .map((c) => directMap[c])
    .join(' ');
};

export const morseDecoding = (input: string): string => {
  const reverseMap = alias.reduce((result, current) => ({
    ...result,
    [current[1]]: current[0],
  }), {});

  return input
    .split(' ')
    .map((c) => reverseMap[c])
    .join('');
};
