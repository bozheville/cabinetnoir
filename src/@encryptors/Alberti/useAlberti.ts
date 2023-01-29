import { useEffect, useState } from 'react';
import { useMonoalphabetic } from '@encryptors/Monoalphabetic/useMonoalphabetic';
import {
  monoalphabeticEncrypt,
  monoalphabeticDecrypt
} from '@encryptors/Monoalphabetic/monoalphabetic-crypt';
import { rotate } from '@encryptors/utils';

const AlbertiEncryption = ({
  staticDisc,
  dynamicDisc,
  input,
  shift,
}) => {

}
// A|B|C|D|E|F|G|I|L|M|N|O|P|Q|R|S|T|V|X|Z|1|2|3|4|
// m|q|i|h|f|d|b|a|c|e|g|k|l|n|p|r|t|u|z|&|x|y|s|o|

export const useAlberti = ({
  input,
  onProcessingEnd,
  isDecryptMode,
}) => {
  const [staticDisc, setStaticDisc] = useState('ABCDEFGILMNOPQRSTVXZ1234');
  const [dynamicDisc, setDynamicDisc] = useState('mqihfdbacegklnprtuz&xyso');
  // const [dynamicDisc, setDynamicDisc] = useState('usqomkhfdbacegilnprtxz&y');
  const [shift, setShift] = useState(0);
  const [startindex, setStartindex] = useState('m');
  const [iterationStep, setIterationStep] = useState(1);

  useEffect(() => {
    const roundAlphabet = rotate(dynamicDisc, dynamicDisc.indexOf(startindex));
    let output = `${roundAlphabet[0]}`;
    // let roundAlphabet = dynamicDisc;
    // const trace = [];

    output += input ? monoalphabeticEncrypt({
      input,
      alphabet: staticDisc,
      targetAlphabet: roundAlphabet,
      keepSpaces: false,
      keepCase: false
    }) : '';

      // output += `${roundAlphabet[input.length]}`;

    // for (const char of input) {

      // trace.push(roundAlphabet);
      // output += monoalphabeticEncrypt({
      //   alphabet:staticDisc,
      //   input: char,
      //   targetAlphabet: roundAlphabet,
      //   keepSpaces: false,
      //   keepCase: false
      // });
      // roundAlphabet = rotate(roundAlphabet, iterationStep);
    // }

    // console.table(trace);

    onProcessingEnd({ output });

  }, [input, dynamicDisc, staticDisc, startindex]);



  // const monoalphabeticProps = useMonoalphabetic({
  //   input,
  //   onProcessingEnd,
  //   isDecryptMode,
  //   alphabet: staticDisc,
  //   targetAlphabet: dynamicDisc,
  // });


  const rotateLeft = () => {
    const index = dynamicDisc.indexOf(startindex) + dynamicDisc.length - 1;
    setStartindex(dynamicDisc[index]);
    setDynamicDisc(rotate(dynamicDisc, index));
  };

  const rotateRight = () => {
    const index = dynamicDisc.indexOf(startindex) + 1;
    setStartindex(dynamicDisc[index]);
    setDynamicDisc(rotate(dynamicDisc, index));
  };




  return {
    staticDisc,
    dynamicDisc,
    shift,
    iterationStep,
    rotateLeft,
    rotateRight,
    // handleKeyChange,
    // handleAlphabetChange,
    // ...monoalphabeticProps,
  };
};
