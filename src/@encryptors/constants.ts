export const alphabet = ``;
export const alphabetCyrillic = `АБВГДЕЖСИЙКАЛМНОПРСТУВХ`;


export const alphabetCollection = [
  {
    type: 'latin',
    value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  },
  {
    type: 'german', // TBD
    value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  },
  {
    type: 'french', // TBD
    value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  },
  {
    type: 'russian',
    value: 'АБВГДЕËЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ',
  },
  {
    type: 'ukrainian',
    value: 'АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ',
  },
];


export const getAlphabet = ({ key }) => alphabetCollection.find((item) => item.type === key);
