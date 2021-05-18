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

  ['1', '.----'],
  ['2', '..---'],
  ['3', '...--'],
  ['4', '....-'],
  ['5', '.....'],
  ['6', '-....'],
  ['7', '--...'],
  ['8', '---..'],
  ['9', '----.'],
  ['0', '-----'],

  [' ', '/'],
];

export const morseEncoding = (input: string, {
  dotSymbol,
  dashSymbol,
}): string => {
  if (!input) {
    return '';
  }

  const directMap = alias.reduce((result, current) => ({
    ...result,
    [current[0]]: current[1],
  }), {});

  return input
    .toUpperCase()
    .replace(/\s+/, ' ')
    .split('')
    .filter((c) => alias.map(i => i[0]).includes(c))
    .map((c) => directMap[c])
    .join(' ')
    .replaceAll('.', dotSymbol)
    .replaceAll('-', dashSymbol);
};

export const morseDecoding = (input: string, {
  dotSymbols,
  dashSymbols,
}): string => {
  if (!input) {
    return '';
  }

  const reverseMap = alias.reduce((result, current) => ({
    ...result,
    [current[1]]: current[0],
  }), {});

  return input
    .replaceAll(new RegExp(`[${dashSymbols}]`, 'g'), '-')
    .replaceAll(new RegExp(`[${dotSymbols}]`, 'g'), '.')
    .replaceAll(new RegExp(`\s*/\s*`, 'g'), ' / ')
    .split(' ')
    .map((c) => reverseMap[c])
    .join('');
};
