import React from 'react';

import AutokeyCryptanalysis from '@encryptors/Autokey/Cryptanalysis';
import VigenereCryptanalysis from '@encryptors/Vigenere/Cryptanalysis';
import BeaufortCryptanalysis from '@encryptors/Beaufort/Cryptanalysis';
import AdfgvxCryptanalysis from '@encryptors/Adfgvx/Cryptanalysis';
import AffineCryptanalysis from '@encryptors/Affine/Cryptanalysis';
import PlayfairCryptanalysis from '@encryptors/Playfair/Cryptanalysis';
import AlbertiCryptanalysis from '@encryptors/Alberti/Cryptanalysis';
import KeywordCryptanalysis from '@encryptors/Keyword/Cryptanalysis';
import ColumnarCryptanalysis from '@encryptors/Columnar/Cryptanalysis';
import RailFenceCryptanalysis from '@encryptors/RailFence/Cryptanalysis';
import NihilistCryptanalysis from '@encryptors/Nihilist/Cryptanalysis';
import PolybiusCryptanalysis from '@encryptors/Polybius/Cryptanalysis';

interface CipherCrackerProps {
  algorithm: string;
  input: string;
  onInputChange: (value: string) => void;
}

// Dispatches the Cryptanalysis tab to the cipher's cracker organism.
// Only ciphers with a cracker can be routed here (getStaticPaths guards
// the route; the standard doc's cipher matrix is the source of truth).
const CRACKERS: Record<string, React.ComponentType<{ input: string; onInputChange: (value: string) => void }>> = {
  vigenere: VigenereCryptanalysis,
  beaufort: BeaufortCryptanalysis,
  autokey: AutokeyCryptanalysis,
  adfgvx: AdfgvxCryptanalysis,
  affine: AffineCryptanalysis,
  playfair: PlayfairCryptanalysis,
  alberti: AlbertiCryptanalysis,
  keyword: KeywordCryptanalysis,
  columnar: ColumnarCryptanalysis,
  railFence: RailFenceCryptanalysis,
  nihilist: NihilistCryptanalysis,
  polybius: PolybiusCryptanalysis,
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
