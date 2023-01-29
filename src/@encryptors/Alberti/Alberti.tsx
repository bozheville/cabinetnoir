import React from 'react';
import { Checkbox, Pane, Select } from 'evergreen-ui';
import { CrypterProps } from '../types';
import { useAlberti } from './useAlberti';

const Alberti: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const {} = useAlberti({
    input,
    onProcessingEnd,
    isDecryptMode
  });

  return (
    <Pane
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      width="100%"
      paddingX="16px"
      paddingBottom="16px"
      {...paneProps}
    >
      settings
    </Pane>
  );
};

Alberti.displayName = 'Alberti';

export default Alberti;
