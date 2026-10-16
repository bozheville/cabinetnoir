import { useEffect, useState } from 'react';
import { Rotor, Reflector, Plugboard, EntryWheel, Enigma } from 'enigma';
import { usePendingExample } from '@learning/pendingExample';

const I = new Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ', 'Q');
const II = new Rotor('AJDKSIRUXBLHWTMCQGZNPYFVOE', 'E');
const III = new Rotor('BDFHJLCPRTXVZNYEIWGAKMUSQO', 'V');
const R = new Reflector('YRUHQSLDPXNGOKMIEBFZCWVJAT');
const P = new Plugboard('');
const W = new EntryWheel('ABCDEFGHIJKLMNOPQRSTUVWXYZ');

// A single shared machine: Enigma is reciprocal and stateless between
// runs as long as the positions are reset before every encryption,
// which the effect below does on each keystroke.
var enigma = new Enigma([I, II, III], R, P, W);

const isValidKey = (key: string) => /^[A-Z]{3}$/.test(key);

const useEnigma = ({
  input,
  onProcessingEnd,
  isDecryptMode,
}) => {
  const [ secretKey, setSecretKey ] = useState('AAA');

  // "Try it in the tool": the example's key carries the 3-letter
  // start positions. The context is only non-null when the example
  // targets this cipher; the message itself is pre-filled by
  // EncryptionInputs.
  const pendingExample = usePendingExample();
  useEffect(() => {
    if (pendingExample?.key) {
      setSecretKey(pendingExample.key);
    }
  }, [pendingExample]);

  useEffect(() => {
    if (!isValidKey(secretKey)) {
      onProcessingEnd({ output: '' });
      return;
    }

    enigma.setPositions(secretKey);
    onProcessingEnd({
      output: enigma.string(input),
    });
  }, [
    input,
    secretKey,
    isDecryptMode,
  ]);

  const handleKeyChange = (event) => setSecretKey(event.target.value.toUpperCase());

  return {
    secretKey,
    handleKeyChange,
  };
};

export default useEnigma;
