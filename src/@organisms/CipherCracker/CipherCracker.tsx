import React from 'react';

import VigenereCryptoanalysis from '@encryptors/Vigenere/Cryptoanalysis';
import AdfgvxCryptoanalysis from '@encryptors/Adfgvx/Cryptoanalysis';

interface CipherCrackerProps {
  algorithm: string;
  input: string;
  onInputChange: (value: string) => void;
}

// Dispatches the Cryptoanalysis tab to the cipher's cracker organism.
// Only ciphers with a cracker can be routed here (getStaticPaths guards
// the route; the standard doc's cipher matrix is the source of truth).
const CRACKERS: Record<string, React.ComponentType<{ input: string; onInputChange: (value: string) => void }>> = {
  vigenere: VigenereCryptoanalysis,
  adfgvx: AdfgvxCryptoanalysis,
};

const CipherCracker: React.FC<CipherCrackerProps> = ({ algorithm, input, onInputChange }) => {
  const Cracker = CRACKERS[algorithm];

  if (!Cracker) {
    return null;
  }

  return <Cracker input={input} onInputChange={onInputChange} />;
};

CipherCracker.displayName = 'CipherCracker';

export default CipherCracker;
