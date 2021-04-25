type Square = string[];

const getSquare = (key: string): Square => {
  const alphabet = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`;
  const keyUpper = key.toUpperCase();
  const square = (
      keyUpper +
        alphabet
          .split('')
          .filter((c) => ![...keyUpper, 'J'].includes(c))
          .join('')
    )
    .match(/(.{5})/g);

  return square;
};

const getPosition = (square: Square, char: string): number[] => {
  let x = 0;
  let y = 0;

  for (const [index, line] of square.entries()) {
    if ((x = line.indexOf(char)) !== -1) {
      y = index;
      break;
    }
  }

  return [x, y];
};


export const playfairEncrypt = (input: string, key: string): string => {
  if (!input || !key) {
    return '';
  }
  const square = getSquare(key);

  const bigramList = [];
  const encryptedBigramList = [];
  const refinedMessage = input
    .toUpperCase()
    .replace(/j/ig, 'i')
    .split('')
    .filter((c) => /[A-Z]/.test(c))

  const encryptBigram = (bigram) => {
    const [a, b] = bigram;

    const [ax, ay] = getPosition(square, a);
    const [bx, by] = getPosition(square, b);

    let ac = '';
    let bc = '';

    if (ay === by) {
      ac = square[ay][(ax+1)%5];
      bc = square[ay][(bx+1)%5];
    } else if (ax === bx) {
      ac = square[(ay+1)%5][ax];
      bc = square[(by+1)%5][bx];
    } else {
      ac = square[ay][bx];
      bc = square[by][ax];
    }

    return [ac, bc];
  }

  while(refinedMessage.length) {
    const bigram = [refinedMessage.shift()];

    if (refinedMessage.length) {
      bigram.push(refinedMessage.shift());

      if (bigram[0] === bigram[1]) {
        refinedMessage.unshift(bigram.pop());
        bigram.push('X');
      }
    } else {
      bigram.push('X');
    }

    encryptedBigramList.push(encryptBigram(bigram).join(''))

    bigramList.push(bigram.join(''));
  }

  return encryptedBigramList.join(' ');
}

export const playfairDecrypt = (input: string, key: string): string => {
  if (!input || !key) {
    return '';
  }

  const square = getSquare(key);

  const encryptedBigramList = input
    .replace(/\s/g, '')
    .toUpperCase()
    .match(/.{2}/g);

  const decryptBigram = (bigram) => {
    const [a, b] = bigram;

    const [ax, ay] = getPosition(square, a);
    const [bx, by] = getPosition(square, b);

    let ac = '';
    let bc = '';

    if (ay === by) {
      ac = square[ay][(ax+4)%5];
      bc = square[ay][(bx+4)%5];
    } else if (ax === bx) {
      ac = square[(ay+4)%5][ax];
      bc = square[(by+4)%5][bx];
    } else {
      ac = square[ay][bx];
      bc = square[by][ax];
    }

    return [ac, bc];
  }

  return encryptedBigramList
    .map((bigram) => decryptBigram(bigram).join(''))
    .join(' ');
}
