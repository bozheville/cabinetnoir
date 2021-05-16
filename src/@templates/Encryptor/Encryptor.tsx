import React, {useState} from 'react';

import { EncryptionInputs, EncryptionSettings, EncryptionDescription } from '@organisms';
import styled from 'styled-components';

const EncryptorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  padding: 0;
  border; 1px solid #aaa;

  box-shadow: 0px 2px 4px 0px #999;
  margin: 24px auto;
  background-color: ${({ theme }) => theme.colorScheme.blank};
  overflow: hidden;


  ${({ theme }) => theme.breakpoints.small} {
    margin: 4px;
  }

  ${({ theme }) => theme.breakpoints.desktop} {
    border-radius: 8px;
    max-width: 1016px;
  }
`;

const Encryptor: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  return (
    <>
      <EncryptorWrapper>
        <EncryptionSettings
          input={input}
          onOutputUpdate={({ output }) => {
            setOutput(output);
          }}
        />
        <EncryptionInputs
          onChange={setInput}
          output={output}
        />
      </EncryptorWrapper>
      <EncryptionDescription />
    </>
  );
};

Encryptor.displayName = 'Encryptor';

export default Encryptor;
