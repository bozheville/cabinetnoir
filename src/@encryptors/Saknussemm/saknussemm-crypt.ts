// The Saknussemm parchment (Jules Verne, "Journey to the Centre of the
// Earth", chapter III): a route transposition + reversal, not a
// substitution. The novel's mechanics, reproduced for any input:
//
//   1. Reverse the letter stream (Axel reads the parchment "backwards").
//   2. Write the reversed stream across the rows of a grid that is
//      `clusterWidth` letters tall and `clusterWidth × clustersPerLine`
//      columns wide at most — the parchment's shape.
//   3. Read the grid down its columns: each column becomes one cluster,
//      printed `clustersPerLine` per line, separated by spaces.
//
// Decoding inverts this: the clusters (whitespace-separated groups, or a
// plain letter blob split with the same shape rule) rebuild the grid as
// columns, the rows read across spell the reversed message, one final
// reversal restores the plaintext.
//
// The novel's own numbers: clusterWidth 7, clustersPerLine 3 — the
// famous dictation "mm.rnlls esruel seecJde …" is 21 clusters of 6–7
// letters, three per line. See specs/cipher-roadmap/saknussemm-notes.md.

export interface SaknussemmShape {
  // Letters per cluster — also the height of the layout grid.
  clusterWidth: number;
  // Clusters printed per output line.
  clustersPerLine: number;
}

// The parchment's shape: Lidenbrock's 7-letter clusters, 3 per line.
export const SAKNUSSEMM_DEFAULTS: SaknussemmShape = {
  clusterWidth: 7,
  clustersPerLine: 3,
};

export const SAKNUSSEMM_MIN_CLUSTER_WIDTH = 2;
export const SAKNUSSEMM_MAX_CLUSTER_WIDTH = 12;
export const SAKNUSSEMM_MIN_CLUSTERS_PER_LINE = 2;
export const SAKNUSSEMM_MAX_CLUSTERS_PER_LINE = 6;

// The parchment's Latin message, as printed in the Ward/Gutenberg
// translation ("kem" / "audas" — the French original reads "quem" /
// "audax").
export const SAKNUSSEMM_PARCHMENT_PLAIN =
  'In Sneffels Yoculis craterem kem delibat umbra Scartaris Julii '
  + 'intra calendas descende, audas viator, et terrestre centrum '
  + 'attinges. Kod feci. Arne Saknussemm';

// The scrambled transcription Professor Lidenbrock dictates, verbatim
// from the same edition (typos included — see the notes file).
export const SAKNUSSEMM_PARCHMENT_DICTATION =
  'mm.rnlls esruel seecJde sgtssmf unteief niedrke kt,samn atrateS '
  + 'Saodrrn emtnaeI nuaect rrilSa Atvaar .nscrc ieaabs ccdrmi eeutul '
  + 'frantu dt,iac oseibo KediiY';

const lettersOnly = (text: string): string =>
  text.toUpperCase().replace(/[^A-Z]/g, '');

export const isSaknussemmShape = (shape: SaknussemmShape): boolean =>
  shape.clusterWidth >= SAKNUSSEMM_MIN_CLUSTER_WIDTH
    && shape.clusterWidth <= SAKNUSSEMM_MAX_CLUSTER_WIDTH
    && shape.clustersPerLine >= SAKNUSSEMM_MIN_CLUSTERS_PER_LINE
    && shape.clustersPerLine <= SAKNUSSEMM_MAX_CLUSTERS_PER_LINE;

// Total cluster count for a letter stream: enough clusters to hold every
// letter at clusterWidth letters each, padded to a whole number of full
// output lines. The padding mirrors the novel's parchment, whose last
// columns run one letter short rather than truncating a line.
export const saknussemmClusterCount = (
  length: number,
  shape: SaknussemmShape,
): number => {
  const needed = Math.ceil(length / shape.clusterWidth);
  return shape.clustersPerLine * Math.ceil(needed / shape.clustersPerLine);
};

// The grid: `clusterWidth` rows × `clusters` columns, filled row-major
// with the reversed letter stream (missing tail cells stay empty).
const buildGrid = (letters: string, clusters: number, clusterWidth: number) => {
  const grid: Array<Array<string | null>> = [];
  let index = 0;
  for (let row = 0; row < clusterWidth; row += 1) {
    const cells: Array<string | null> = [];
    for (let column = 0; column < clusters; column += 1) {
      cells.push(index < letters.length ? letters[index] : null);
      index += 1;
    }
    grid.push(cells);
  }
  return grid;
};

// Read the grid down its columns: each column becomes one cluster.
const readClusters = (grid: Array<Array<string | null>>): string[] => {
  const clusters: string[] = [];
  for (let column = 0; column < grid[0].length; column += 1) {
    let cluster = '';
    for (const row of grid) {
      const letter = row[column];
      if (letter !== null) {
        cluster += letter;
      }
    }
    clusters.push(cluster);
  }
  return clusters;
};

// Rows read across the rebuilt grid: the reversed plaintext.
const readRows = (clusters: string[]): string => {
  const rows: string[] = [];
  let row = 0;
  let reading = true;
  while (reading) {
    let line = '';
    reading = false;
    for (const cluster of clusters) {
      if (cluster[row] !== undefined) {
        line += cluster[row];
        reading = true;
      }
    }
    if (reading) {
      rows.push(line);
    }
    row += 1;
  }
  return rows.join('');
};

// Encrypt: reverse → fill the grid row-major → read down the columns →
// print `clustersPerLine` clusters per whitespace-separated line.
export const saknussemmEncrypt = (text: string, shape: SaknussemmShape): string => {
  const letters = lettersOnly(text);
  if (letters.length === 0) {
    return '';
  }
  const clusters = saknussemmClusterCount(letters.length, shape);
  const grid = buildGrid(letters.split('').reverse().join(''), clusters, shape.clusterWidth);
  const groups = readClusters(grid);
  const lines: string[] = [];
  for (let index = 0; index < groups.length; index += shape.clustersPerLine) {
    lines.push(groups.slice(index, index + shape.clustersPerLine).join(' '));
  }
  return lines.join('\n');
};

// Decrypt: rebuild the clusters (whitespace-separated groups win; a plain
// letter blob is sliced with the same shape rule), read the grid's rows
// across, reverse once.
export const saknussemmDecrypt = (text: string, shape: SaknussemmShape): string => {
  const groups = text.toUpperCase().trim().split(/\s+/).filter(Boolean);
  if (groups.length === 0 || (groups.length === 1 && groups[0].length === 0)) {
    return '';
  }

  let clusters: string[];
  if (groups.length > 1) {
    // Whitespace-separated clusters: the groups are the grid's columns.
    clusters = groups.map((group) => group.replace(/[^A-Z]/g, '')).filter(Boolean);
  } else {
    // One solid blob: split it with the encrypt shape rule. Clusters are
    // ragged (the last grid row is short), so split by column lengths —
    // a fixed stride would tear letters across cluster boundaries.
    const letters = lettersOnly(groups[0]);
    if (letters.length === 0) {
      return '';
    }
    const count = saknussemmClusterCount(letters.length, shape);
    const rows = Math.ceil(letters.length / count);
    const lastRowLength = letters.length - (rows - 1) * count;
    clusters = [];
    let index = 0;
    for (let column = 0; column < count; column += 1) {
      const length = column < lastRowLength ? rows : rows - 1;
      clusters.push(letters.slice(index, index + length));
      index += length;
    }
  }

  if (clusters.length === 0) {
    return '';
  }

  return readRows(clusters).split('').reverse().join('');
};

// One call for both directions, the shape every tool pane uses.
export const saknussemmTransform = (
  text: string,
  isDecryptMode: boolean,
  shape: SaknussemmShape = SAKNUSSEMM_DEFAULTS,
): string => (isDecryptMode ? saknussemmDecrypt(text, shape) : saknussemmEncrypt(text, shape));
