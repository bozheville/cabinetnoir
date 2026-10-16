// Splitting the ciphertext back into its transposition columns.
//
// The engine pads the fractionated text to a full rectangle (rows x key
// length) before the columnar transposition, so a ciphertext of engine
// origin splits into equal contiguous chunks: chunk j is grid column
// order[j], in whatever order the key happens to read them. External
// ciphertext with an unpadded last row falls back to the classic
// irregular column lengths.

export interface ColumnSplit {
  columns: string[];
  rows: number;
}

export const splitColumns = (cipherText: string, keyLength: number): ColumnSplit => {
  const length = cipherText.length;
  const rows = Math.ceil(length / keyLength);
  const remainder = length % keyLength;

  const columns: string[] = [];
  for (let column = 0; column < keyLength; column += 1) {
    if (remainder === 0) {
      // Full rectangle: chunk j is one whole grid column.
      columns.push(cipherText.slice(column * rows, (column + 1) * rows));
      continue;
    }
    const columnLength = column < remainder ? rows : rows - 1;
    let text = '';
    for (let row = 0; row < columnLength; row += 1) {
      const position = row * keyLength + column;
      if (position < length) text += cipherText[position];
    }
    columns.push(text);
  }
  return { columns, rows };
};
