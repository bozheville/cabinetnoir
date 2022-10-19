import React from 'react';

import useStatisticalCryptanalysis from './useStatisticalCryptanalysis';
import { TextInput } from '@atoms';
import { parseText } from '@math/parser';

import {
  Text,
  StatisticalCryptanalysisSection,
  TextWrapper,
  ParsedStats
} from './elements';


const StatisticalCryptanalysis: React.FC = () => {
  const  {
    hints,
    trigramTable,
    encryptionStat,
    exampleTextStat,
    decryptedSourceChars,
    decryptedTargetChars,
    positionStats,

    encrypted,
    highlightedGroup,
    decrypted,
    decryptionScore,

    plugboardRef,

    handlePlugboardChange,
    handleMouseOver,
    handleMouseOut,
  } = useStatisticalCryptanalysis();

  return (
    <StatisticalCryptanalysisSection>
      <div>Decrypted: {decryptionScore}%</div>
      <TextWrapper>
        {decrypted.map((item, index) => (
          <Text
            isHighlighted={highlightedGroup === item.type}
            onMouseOver={handleMouseOver(item.type)}
            onMouseOut={handleMouseOut(item.type)}
            type={item.type}
            key={`${item.value}-${index}`}
          >
            {item.value}
          </Text>
        ))}
      </TextWrapper>
      <TextInput ref={plugboardRef} onChange={handlePlugboardChange} />

      <table>
        <thead>
          <tr>
            <th></th>
            {Object.keys(positionStats).map((char)=> (<th>{char}</th>))}
          </tr>

        </thead>
        <tbody>
        {Object.keys(positionStats).map((char, index) => (
          <tr>
            <td>{char}</td>
            {Object.keys(positionStats).map((c)=> (<td>{positionStats[char]?.before[c]}/{positionStats[char]?.after[c]}</td>))}
          </tr>
        ))}
        </tbody>

      </table>

      {hints && (
        <>
        <table>
        <thead>
          <tr>
            <th>Encrypted trigram</th>
            <th>Count</th>
            <th>Frequency</th>
            <th>Frequency</th>
            <th>Count</th>
            <th>Open trigram</th>
          </tr>

        </thead>
        <tbody>
        {Array.from(new Array(10)).map((_, index) => (
          <tr key={hints.topEncriptedTrigrams[index].value}>
            <td>{hints.topEncriptedTrigrams[index].value.split('').map((char) => (
              <span className={decryptedSourceChars.includes(char) ? 'decrypted' : ''}>
                {char}
              </span>
            ))}</td>
            <td>{hints.topEncriptedTrigrams[index].count}</td>
            <td>{hints.topEncriptedTrigrams[index].frequency.toFixed(3)}</td>
            <td>{hints.topExampleTrigrams[index].frequency.toFixed(3)}</td>
            <td>{hints.topExampleTrigrams[index].count}</td>
            <td>{hints.topExampleTrigrams[index].value.split('').map((char) => (
              <span className={decryptedTargetChars.includes(char) ? 'decrypted' : ''}>
                {char}
              </span>
            ))}</td>
          </tr>
        ))}
        </tbody>

      </table>
      <table>
        <thead>
          <tr>
            <th>Encrypted bigram</th>
            <th>Count</th>
            <th>Frequency</th>
            <th>Frequency</th>
            <th>Count</th>
            <th>Open bigram</th>
          </tr>

        </thead>
        <tbody>
        {Array.from(new Array(10)).map((_, index) => (
          <tr key={hints.topEncriptedBigrams[index].value}>
            <td>{hints.topEncriptedBigrams[index].value.split('').map((char) => (
              <span className={decryptedSourceChars.includes(char) ? 'decrypted' : ''}>
                {char}
              </span>
            ))}</td>
            <td>{hints.topEncriptedBigrams[index].count}</td>
            <td>{hints.topEncriptedBigrams[index].frequency.toFixed(3)}</td>
            <td>{hints.topExampleBigrams[index].frequency.toFixed(3)}</td>
            <td>{hints.topExampleBigrams[index].count}</td>
            <td>{hints.topExampleBigrams[index].value.split('').map((char) => (
              <span className={decryptedTargetChars.includes(char) ? 'decrypted' : ''}>
                {char}
              </span>
            ))}</td>
          </tr>
        ))}
        </tbody>

      </table>
      <table>
        <thead>
          <tr>
            <th>Encrypted doubles</th>
            <th>Count</th>
            <th>Frequency</th>
            <th>Frequency</th>
            <th>Count</th>
            <th>Open doubles</th>
          </tr>

        </thead>
        <tbody>
        {Array.from(new Array(10)).map((_, index) => (
          <tr key={hints.topEncriptedDoubles[index].value}>
            <td>{hints.topEncriptedDoubles[index].value.split('').map((char) => (
              <span className={decryptedSourceChars.includes(char) ? 'decrypted' : ''}>
                {char}
              </span>
            ))}</td>
            <td>{hints.topEncriptedDoubles[index].count}</td>
            <td>{hints.topEncriptedDoubles[index].frequency.toFixed(3)}</td>
            <td>{hints.topExampleDoubles[index].frequency.toFixed(3)}</td>
            <td>{hints.topExampleDoubles[index].count}</td>
            <td>{hints.topExampleDoubles[index].value.split('').map((char) => (
              <span className={decryptedTargetChars.includes(char) ? 'decrypted' : ''}>
                {char}
              </span>
            ))}</td>
          </tr>
        ))}
        </tbody>

      </table>
      <table>
        <thead>
          <tr>
            <th>Trigram</th>
            <th>Frequency</th>
            <th>Pattern</th>
            <th>Encrypted pattern</th>
            <th>Secret</th>
            <th>Possible variants</th>
          </tr>

        </thead>
        <tbody>
        {trigramTable.map((row) => (
          <tr key={row.value}>
            <td>{row.value}</td>
            <td>{row.count}</td>
            <td>{row.pattern}</td>
            <td>{row.patternEncrypted}</td>
            <td>{row.secret}</td>
            <td>{row.variants}</td>
          </tr>
        ))}
        </tbody>

      </table>
        </>
      )}
    <style jsx>{`.decrypted{text-decoration: line-through 2px red;}`}</style>
    </StatisticalCryptanalysisSection>
  );
};

StatisticalCryptanalysis.displayName = 'StatisticalCryptanalysis';

export default StatisticalCryptanalysis;
