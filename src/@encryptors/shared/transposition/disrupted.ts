// The disrupted ("diagonal") columnar transposition of the VIC cipher.
//
// Kahn, "Number One From Moscow", describes the disruption verbatim:
// "The first D area begins in the top row under keynumber 1 and runs to
// the right side of that row. In each of the following rows, it begins
// one column to the right. When the columns are exhausted, one row is
// skipped and another D area is started in the following row with the
// column under keynumber 2, and so forth for as many rows as are needed
// to accommodate all the cipher digits."
//
// The digits are written row by row, left to right, leaving the D cells
// blank; once the non-D cells are exhausted the remaining digits fill
// the D areas from the top row down. Read-out is column by column in
// keynumber order, ignoring the D distinction.
//
// Pure digit-string math — no React, no i18n.

// The disruption mask of a tableau: mask[row][column] === true means
// the cell belongs to a D (disruption) area.
export const disruptionMask = (
  width: number,
  // Column read order (like columnOrder): order[k] is the physical
  // column read k-th — "the column under keynumber k+1".
  order: number[],
  rows: number,
): boolean[][] => {
  const mask: boolean[][] = Array.from(
    { length: rows },
    () => new Array<boolean>(width).fill(false),
  );
  if (order.length === 0 || rows === 0) {
    return mask;
  }

  let triangle = 0;
  // The physical column where the current D area starts this row.
  let start = order[0];
  for (let row = 0; row < rows; row += 1) {
    if (start <= width - 1) {
      for (let column = start; column < width; column += 1) {
        mask[row][column] = true;
      }
      // The next row's D area begins one column to the right.
      start += 1;
    } else {
      // Columns exhausted: this row is skipped, the next D area starts
      // in the following row under the next keynumber (wrapping when
      // the key runs out of numbers — grids longer than the key are
      // rare, but must not crash).
      triangle = (triangle + 1) % order.length;
      start = order[triangle];
    }
  }
  return mask;
};

// The write order of the tableau: every non-D cell row by row, then
// every D cell row by row ("starting with the top row").
const writeOrder = (
  width: number,
  mask: boolean[][],
  length: number,
): Array<{ row: number; column: number }> => {
  const rows = mask.length;
  const cells: Array<{ row: number; column: number; d: boolean }> = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < width; column += 1) {
      cells.push({ row, column, d: mask[row][column] });
    }
  }
  const ordered = [
    ...cells.filter((cell) => !cell.d),
    ...cells.filter((cell) => cell.d),
  ];
  // Only as many cells as there are digits ever get written.
  return ordered.slice(0, length).map(({ row, column }) => ({ row, column }));
};

// Column read order given the mask: keynumber 1's column first, then
// top to bottom, over the written cells only.
const readOrder = (
  order: number[],
  mask: boolean[][],
  written: Set<number>,
): Array<{ row: number; column: number }> => {
  const width = mask[0]?.length ?? 0;
  const cells: Array<{ row: number; column: number }> = [];
  for (const column of order) {
    for (let row = 0; row < mask.length; row += 1) {
      if (written.has(row * width + column)) {
        cells.push({ row, column });
      }
    }
  }
  return cells;
};

export const disruptedColumnarEncrypt = (
  digits: string,
  order: number[],
): string => {
  const width = order.length;
  if (width === 0 || digits.length === 0) {
    return digits;
  }
  const rows = Math.ceil(digits.length / width);
  const mask = disruptionMask(width, order, rows);
  const grid = new Map<number, string>();
  writeOrder(width, mask, digits.length).forEach((cell, index) => {
    grid.set(cell.row * width + cell.column, digits[index]);
  });
  const written = new Set([...grid.keys()]);
  return readOrder(order, mask, written)
    .map((cell) => grid.get(cell.row * width + cell.column) as string)
    .join('');
};

export const disruptedColumnarDecrypt = (
  digits: string,
  order: number[],
): string => {
  const width = order.length;
  if (width === 0 || digits.length === 0) {
    return digits;
  }
  const rows = Math.ceil(digits.length / width);
  const mask = disruptionMask(width, order, rows);
  const grid = new Map<number, string>();
  const written = new Set(
    writeOrder(width, mask, digits.length).map((cell) => cell.row * width + cell.column),
  );
  readOrder(order, mask, written).forEach((cell, index) => {
    grid.set(cell.row * width + cell.column, digits[index]);
  });
  // Reading back in write order restores the pre-transposition stream.
  return writeOrder(width, mask, digits.length)
    .map((cell) => grid.get(cell.row * width + cell.column) as string)
    .join('');
};
