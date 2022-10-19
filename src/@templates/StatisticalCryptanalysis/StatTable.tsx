import React from 'react';
// import { StatTableProps } from './types.d';
import { alphabet } from './utils';

const alphabetArray = alphabet.split('');

interface AlphabetStat {
  ['_*_']: number;
  ['*_']: number;
  ['_*']: number;
  ['**']: number;
  ['**+']: number;
  ['*A']: number;
  ['A*']: number;
  ['*B']: number;
  ['B*']: number;
  ['*C']: number;
  ['C*']: number;
  ['*D']: number;
  ['D*']: number;
  ['*E']: number;
  ['E*']: number;
  ['*F']: number;
  ['F*']: number;
  ['*G']: number;
  ['G*']: number;
  ['*H']: number;
  ['H*']: number;
  ['*I']: number;
  ['I*']: number;
  ['*J']: number;
  ['J*']: number;
  ['*K']: number;
  ['K*']: number;
  ['*L']: number;
  ['L*']: number;
  ['*M']: number;
  ['M*']: number;
  ['*N']: number;
  ['N*']: number;
  ['*O']: number;
  ['O*']: number;
  ['*P']: number;
  ['P*']: number;
  ['*Q']: number;
  ['Q*']: number;
  ['*R']: number;
  ['R*']: number;
  ['*S']: number;
  ['S*']: number;
  ['*T']: number;
  ['T*']: number;
  ['*U']: number;
  ['U*']: number;
  ['*V']: number;
  ['V*']: number;
  ['*W']: number;
  ['W*']: number;
  ['*X']: number;
  ['X*']: number;
  ['*Y']: number;
  ['Y*']: number;
  ['*Z']: number;
  ['Z*']: number;
  char: {
    value: string;
    count: number;
  };
}

interface StatTableProps {
  value: AlphabetStat[];
  mapping: {
    [key: string]: string;
  };
}

const StatTable: React.FC<StatTableProps> = ({
  value,
  mapping,
}) => {

  const omit = Object.keys(mapping || {}).map(c => c.toUpperCase());

  return (
    <table style={{border: 1}}>
      <thead>
        <th></th>
        <th>№</th>
        {alphabetArray.map((letter) => (
          <>
            <td>{letter}&bull;</td>
            <td>&bull;{letter}</td>
          </>
        ))}
        <th>&bull;&bull;</th>
        <th>&bull;&bull;+</th>
        <th>_&bull;</th>
        <th>&bull;_</th>
        <th>_&bull;_</th>
      </thead>
      <tbody>
        {value.map((row) => omit.includes(row.char.value) ? null : (
          <tr>
            <td>{row.char.value}</td>
            <td>{row.char.count.toFixed(1)}</td>
            {alphabet.split('').map((letter) => (
              <>
                <td>{row.char.value === letter ? '-' : row[`${letter}*`].toFixed(1)}</td>
                <td>{row.char.value === letter ? '-' : row[`*${letter}`].toFixed(1)}</td>
              </>
            ))}
            <td>{row['**'].toFixed(1)}</td>
            <td>{row['**+'].toFixed(1)}</td>
            <td>{row['_*'].toFixed(1)}</td>
            <td>{row['*_'].toFixed(1)}</td>
            <td>{row['_*_'].toFixed(1)}</td>
          </tr>
        ))}

      </tbody>
    </table>
  );
};

StatTable.displayName = 'StatTable';

export default StatTable;
