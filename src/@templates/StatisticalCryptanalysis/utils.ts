export const alphabet = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`;

export const splitByGroups = (text) => {
  const groups = [];
  let group = [];
  let isUpperCaseGroup = text[0] === text[0].toUpperCase();

  let letters = text.split('');
  let char = ''
  let index = 0;

  const matched = {};

  for (let i = 0; i<text.length - 2; i++ ) {
    const pattern = `${text[i]}${text[i+1]}${text[i+2]}`;

    if (pattern.includes(' ') || pattern.toUpperCase() !== pattern) {
      continue;
    }

    const found = text.match(new RegExp(pattern, 'gm')).length;

    if (found > 2) {
      matched[pattern.toUpperCase()] = found;
    }

    if (i < text.length - 3) {
      const pattern4 = `${text[i]}${text[i+1]}${text[i+2]}${text[i+3]}`;
      if (pattern4.includes(' ')) {
        continue;
      }
      const found4 = text.match(new RegExp(pattern4, 'gm')).length;

      if (found4 > 2) {
        matched[pattern4.toUpperCase()] = found;
      }
    }
  }

  const popularGroups = Object
    .entries(matched)
    .sort((a,b) => b[1] - a[1])
    .slice(0,10)
    .map(([pattern]) => pattern);

  while (char = letters.shift()) {
    if (isUpperCaseGroup) {
      if (char !== char.toUpperCase()) {
        groups.push({
          type: 'cryptogram',
          value: [...group],
        });
        group = [char];
        isUpperCaseGroup = false;
      } else {
        if (
          (index === 0 || text[index-1] === ' ')
          && (index === text.length - 1 || text[index+1] === ' ')
        ) {
          groups.push({
            type: 'cryptogram',
            value: [...group],
          });
          groups.push({
            type: 'standalone',
            value: [char],
          });
          group = [];
        } else if (index !== text.length - 1 && char === text[index + 1]) {
          groups.push({
            type: 'cryptogram',
            value: [...group],
          });
          group = [char];
          while (letters[0] === char) {
            group.push(letters.shift());
            index++;
          }
          groups.push({
            type: 'double',
            value: group,
          });
          group = [];
        } else if(popularGroups.includes(`${char}${text[index + 1]}${text[index + 2]}`)) {
          groups.push({
            type: 'cryptogram',
            value: [...group],
          });
          group = [char, letters.shift(), letters.shift()];

          index += 2;
          groups.push({
            type: `group${popularGroups.indexOf(group.join(''))}`,
            value: group,
          });
          group = [];
        } else {
          group.push(char);
        }
      }
    } else {
      if (char === char.toUpperCase()) {
        if (
          (index === 0 || text[index-1] === ' ')
          && (index === text.length - 1 || text[index+1] === ' ')
        ) {
          groups.push({
            type: 'message',
            value: [...group],
          });
          groups.push({
            type: 'standalone',
            value: [char],
          });
          group = [];
        } else if (index !== text.length - 1 && char === text[index + 1]) {
          groups.push({
            type: 'message',
            value: [...group],
          });
          group = [char];
          while (letters[0] === char) {
            group.push(letters.shift());
            index++;
          }
          groups.push({
            type: 'double',
            value: group,
          });
          group = [];
        } else if(popularGroups.includes(`${char}${text[index + 1]}${text[index + 2]}`)) {
          groups.push({
            type: 'message',
            value: [...group],
          });
          group = [char, letters.shift(), letters.shift()];

          index += 2;
          groups.push({
            type: `group${popularGroups.indexOf(group.join(''))}`,
            value: group,
          });
          group = [];
        } else {
          groups.push({
            type: 'message',
            value: [...group],
          });

          group = [char];
        }

        isUpperCaseGroup = true;

      } else {
        group.push(char);
      }
    }

    index++;
  }

  return groups;
};

const MULTIPLIER = 1000;

export const generateStats = (text) => {
  return Object.entries(text
    .split('')
    .reduce((result, current) => ({
      ...result,
      [current.toUpperCase()]: (result[current.toUpperCase()] || 0) + 1,
    }),
    text.toUpperCase().match(/(.)\1+/gi).reduce((result, current) => ({
      ...result,
      [current]: (result[current] || 0) + 1,
    }), {})
    ))
    .sort((a,b) => b[1] - a[1])
    .map((item) => `${item[0]}: ${item[1]}`);
};

export const generateFullStats = (text) => {
  const alphabetQueue = alphabet.split('');

  const groups = [];

  for (let char of alphabetQueue) {
    const group =
    alphabetQueue.reduce((result, current) => {
      if (current === char) {
        return result;
      }

      return ({
        ...result,
        [`${current}*`]: (text.match(new RegExp(`${current}${char}`, 'gim')) || []).length * MULTIPLIER / text.length,
        [`*${current}`]: (text.match(new RegExp(`${char}${current}`, 'gim')) || []).length * MULTIPLIER / text.length,
      });
    },
    {
      char: {
        value: char,
        count: (text.match(new RegExp(char, 'gim')) || []).length * MULTIPLIER / text.length
      },
      [`**`]: (text.match(new RegExp(`${char}${char}`, 'gim')) || []).length * MULTIPLIER / text.length,
      [`**+`]: (text.match(new RegExp(`[${char}]{3,}`, 'gim')) || []).length * MULTIPLIER / text.length,
      [`_*`]: (text.match(new RegExp(`[^a-z]${char}`, 'gim')) || []).length * MULTIPLIER / text.length,
      [`*_`]: (text.match(new RegExp(`${char}[^a-z]`, 'gim')) || []).length * MULTIPLIER / text.length,
      [`_*_`]: (text.match(new RegExp(`[^a-z]${char}[^a-z]`, 'gim')) || []).length * MULTIPLIER / text.length,
    });

    groups.push(group);
  }

  groups.sort((a,b) => b.char.count - a.char.count);

  return groups;
};

export const getTopEntries = (stats, limit=10) => JSON.parse(JSON.stringify(stats))
    .sort((a, b) => b.count-a.count)
    .slice(0, limit);

export const shuffle = (array) => {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
};
