import React from 'react';
import styled from 'styled-components';

import { Minion } from '@typography';

// Release info sits on the espresso footer band: cream-muted ink.
const ReleaseText = styled(Minion)`
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const ReleaseInfo: React.FC = () => {
  const timeStamp = process.env.NEXT_PUBLIC_RELEASE_DATE;
  const version = process.env.NEXT_PUBLIC_RELEASE_VERSION;

  if (!timeStamp || !version) {
    return null;
  }

  const date = new Date(parseInt(timeStamp, 10));
  const formattedDate = `${`${date.getDate()}`.padStart(2, '0')}.${`${date.getMonth() + 1}`.padStart(2, '0')}.${date.getFullYear()}`;
  return (
    <ReleaseText>v.{version} // released on {formattedDate}</ReleaseText>
  );
};

ReleaseInfo.displayName = 'ReleaseInfo';

export default ReleaseInfo;
