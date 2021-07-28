import { useEffect, useState } from 'react';
import { enigmaEncrypt } from './enigma-crypt';

import {
  Rotor,
  Reflector,
  Plugboard,
  EntryWheel,
  Enigma,
} from 'enigma';


const I = new Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ', 'Q');
const II = new Rotor('AJDKSIRUXBLHWTMCQGZNPYFVOE', 'E');
const III = new Rotor('BDFHJLCPRTXVZNYEIWGAKMUSQO', 'V');
const R = new Reflector('YRUHQSLDPXNGOKMIEBFZCWVJAT');
const P = new Plugboard('');
const W = new EntryWheel('ABCDEFGHIJKLMNOPQRSTUVWXYZ');

var enigma = new Enigma([I, II, III], R, P, W);

const useEnigma = ({
  input,
  onProcessingEnd,
  isDecryptMode,
}) => {


  const [ secretKey, setSecretKey ] = useState('AAA');
  // const [ multiplier, setMultiplier ] = useState('1');
  // const [ keepSpaces, setKeepSpaces ] = useState(false);
  // const [ keepCase, setKeepCase ] = useState(false);

  useEffect(() => {
    onProcessingEnd({
      output: secretKey.length === 3
      ? (() => {
        enigma.setPositions(secretKey);

        return enigma.string(input);
      })()
      : ''
    });
  }, [
    input,
    secretKey,
    isDecryptMode,
    // keepCase,
    // keepSpaces,
    // multiplier
  ]);

  const handleKeyChange = (event) => setSecretKey(event.target.value);
  // const handleKeepSpacesChange = (event) => setKeepSpaces(event.target.checked);
  // const handleKeepCaseChange = (event) => setKeepCase(event.target.checked);
  // const handleMultiplierChange = (event) => setMultiplier(event.target.value);

  return {
    secretKey,
    // keepCase,
    // keepSpaces,
    // multiplier,
    handleKeyChange,
    // handleKeepSpacesChange,
    // handleKeepCaseChange,
    // handleMultiplierChange,
  };
};

export default useEnigma;
