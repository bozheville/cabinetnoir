import { useRef, useState, useEffect} from 'react';

import { monoalphabeticEncrypt } from '@encryptors/Monoalphabetic/monoalphabetic-crypt';
import { getAlphabet } from '@encryptors/constants';
import { parseText } from '@math/parser';

import { text } from './texts';
import { splitByGroups, shuffle, getTopEntries } from './utils';

const getBeforeAfterStat = (text: string) => {
  const charArray = text.split('');
  return charArray.reduce((result, current, index) => {
    const updated = {
      [current] : {...(result?.[current] || {})}
    };

    if (index > 0) {
      updated[current] = {
        ...(updated?.[current]||{}),
        after: {
          ...(updated?.[current]?.after || {}),
          [charArray[index-1]]: (updated?.[current]?.before?.[charArray[index-1]] || 0) + 1
        }
      }
    }

    if (index < charArray.length -1) {
      updated[current] = {
        ...(updated?.[current]||{}),
        before: {
          ...(updated?.[current]?.before || {}),
          [charArray[index+1]]: (updated?.[current]?.before?.[charArray[index+1]] || 0) + 1
        }
      }
    }

    return {
      ...result,
      ...updated,
    }
  }, {});
};

const getTrigramsMatch = ({
  encryptionStat,
  exampleTextStat,
  decryptedChars,
  mapping,
}) => {
  const updatedTable = [];


  for (const trigram of encryptionStat.trigrams) {
    let counter = 0;

    for (const trigramPart of trigram.value.split('')) {
      for (const letter of decryptedChars) {
        if (letter === trigramPart) {
          counter++;

          if (counter === 3) {
            break;
          }
        }
      }
    }

    if (counter === 2) {
      const decrypted = [];
      const pattern = [];
      const patternEncrypted = [];
      let secret = '';

      for (const char of trigram.value.split('')) {
        if (mapping[char]) {
          decrypted.push(mapping[char].toLowerCase());
          pattern.push(mapping[char].toLowerCase());
          patternEncrypted.push(char.toUpperCase());
        } else {
          decrypted.push(char.toUpperCase());
          pattern.push('(.)');
          patternEncrypted.push('.');
          secret = char.toUpperCase();
        }
      }

      const variants = exampleTextStat
        .trigrams
        .reduce(
          (variants, current) => {
            const searchPattern = `^${pattern.join('')}$`;

            if ((new RegExp(searchPattern, 'i')).test(current.value)) {
              const variant = current.value.match(new RegExp(searchPattern, 'i'))[1];
              if (!decryptedChars.includes(variant)) {
                return [...variants, variant];
              }
            }

            return variants;
          }
          , []
        ).join(',')

      updatedTable.push(
        {
          variants,
          secret,
          decrypted: decrypted.join(''),
          pattern: pattern.join(''),
          patternEncrypted: patternEncrypted.join(''),
          value: trigram.value,
          count: trigram.count,
        }
      );
    }
  }

  updatedTable.sort((a,b) => {
    const sortBy = 'pattern';
    if(a[sortBy] < b[sortBy]) { return -1; }
    if(a[sortBy] > b[sortBy]) { return 1; }

    return b.frequency - a.frequency;
  });

  return updatedTable;
}

const useStatisticalCryptanalysis = () => {
  const [encrypted, setEncrypted] = useState('');
  const [decrypted, setDecrypted] = useState<any>([{isDecrypted: false, value: ''}]);
  // const [stats, setStats] = useState(null);
  // const [mapping, setMapping] = useState({});
  // const [reverseMapping, setReverseMapping] = useState({});
  const [highlightedGroup, setHighlightedGroup] = useState(null);
  const [decryptionScore, setDecryptionScore] = useState('0');

  const [encryptionStat, setEncryptionStat] = useState<any>({});
  const [exampleTextStat, setExampleTextStat] = useState<any>({});
  const [plugboardValue, setPlugboardValue] = useState('');
  const [alphabetMapping, setAlphabetMapping] = useState<any>({});
  const [trigramTable, setTrigramTable] = useState<any>([]);
  const [decryptedSourceChars, setDecryptedSourceChars] = useState<string[]>([]);
  const [decryptedTargetChars, setDecryptedTargetChars] = useState<string[]>([]);
  const [positionStats, setPositionStats] = useState({});




  const [hints, setHints] = useState<any>(null);


  const plugboardRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const alphabet = getAlphabet({key: 'latin'}).value;
    const cryptogram = monoalphabeticEncrypt({
      input: text,
      alphabet,
      targetAlphabet: shuffle(alphabet.split('')).join(''),
      keepSpaces: false,
      keepCase: false,
    });
    console.log(getBeforeAfterStat(cryptogram));

    setPositionStats(getBeforeAfterStat(cryptogram));

    setEncrypted(cryptogram);
    setDecrypted(splitByGroups(cryptogram));

    const cryptogramStats = parseText(cryptogram);
    const languageStats = parseText();

    const topEncriptedBigrams = getTopEntries(cryptogramStats.bigrams);
    const topExampleBigrams = getTopEntries(languageStats.bigrams);
    const topEncriptedTrigrams = getTopEntries(cryptogramStats.trigrams);
    const topExampleTrigrams = getTopEntries(languageStats.trigrams);
    const topEncriptedDoubles = getTopEntries(cryptogramStats.doubles);
    const topExampleDoubles = getTopEntries(languageStats.doubles);

    setHints({
      topEncriptedBigrams,
      topExampleBigrams,
      topEncriptedTrigrams,
      topExampleTrigrams,
      topEncriptedDoubles,
      topExampleDoubles,
    });
    setEncryptionStat(cryptogramStats);
    setExampleTextStat(languageStats);

    if (
      languageStats.trigrams[0].value.includes(languageStats.bigrams[0].value)
      && cryptogramStats.trigrams[0].value.includes(cryptogramStats.bigrams[0].value)
    ) {
      const plugboard = [
        // `${cryptogramStats.bigrams[0].value[0]}${languageStats.bigrams[0].value[0]}`,
        // `${cryptogramStats.bigrams[0].value[1]}${languageStats.bigrams[0].value[1]}`,
      ];

      setPlugboardValue(plugboard.join(' '));
      plugboardRef.current.value = plugboard.join(' ');
    }
  }, []);

  useEffect(() => {
    if (!plugboardValue) {
      return null;
    }

    const mapping = {' ': ' '};
    const decryptedOriginals = [];
    const decryptedSource = [];
    const decryptedTarget = [];

    for (const current of plugboardValue.split(' ')) {
      if (current[1]) {
        mapping[current[0].toUpperCase()] = current[1].toLowerCase();
        mapping[current[0]] = current[1].toLowerCase();
        decryptedSource.push(current[0].toUpperCase());
        decryptedTarget.push(current[1].toUpperCase());
      }
    }

    setDecryptedSourceChars(decryptedSource);
    setDecryptedTargetChars(decryptedTarget);

    // const mapping = plugboardValue.split(' ').reduce((result, current) => {
    //   if (current[1]) {
    //     return {
    //       ...result,
    //       [current[0].toUpperCase()]: current[1].toLowerCase(),
    //       [current[0]]: current[1].toLowerCase(),
    //     }
    //   }

    //   return result;
    // }, {' ': ' '});

    let decrypted = 0;

    const tmp = encrypted.split('').map((item) => {
      if (mapping[item]) {
        decrypted++;
        return mapping[item];
      }
      return item;
    }).join('');

    setDecryptionScore((decrypted*100/encrypted.length).toFixed(1));
    setDecrypted(splitByGroups(tmp));

    const decryptedChars = plugboardValue.trim().split(' ').map((item) => item[0].toUpperCase());
    const updatedTable = decryptedChars.length >= 2
    ? getTrigramsMatch({
        encryptionStat,
        exampleTextStat,
        decryptedChars,
        mapping,
      })
    : [];

    setTrigramTable(updatedTable);

  }, [plugboardValue, encrypted, encryptionStat, exampleTextStat]);

  const handlePlugboardChange = (event) => {
    setPlugboardValue(event.target.value);
  }

  const handleMouseOver = (type) => () => {
    if (type.match('group')) {
      setHighlightedGroup(type);
    }
  };

  const handleMouseOut = (type) => () => {
    if (type.match('group')) {
      setHighlightedGroup(null);
    }
  };

  return {
    decryptedSourceChars,
    decryptedTargetChars,
    hints,
    trigramTable,
    encryptionStat,
    exampleTextStat,
    positionStats,

    encrypted,
    highlightedGroup,
    decrypted,
    decryptionScore,

    plugboardRef,

    handlePlugboardChange,
    handleMouseOver,
    handleMouseOut,
  };
};

export default useStatisticalCryptanalysis;
