import React from 'react';

import Minion from '@typography/Minion';

const ReleaseInfo: React.FC = () => {
  const timeStamp = process.env.NEXT_PUBLIC_RELEASE_DATE;
  const version = process.env.NEXT_PUBLIC_RELEASE_VERSION;

  if (!timeStamp || !version) {
    return null;
  }

  const date = new Date(parseInt(timeStamp, 10));
  const formattedDate = `${`${date.getDate()}`.padStart(2, '0')}.${`${date.getMonth() + 1}`.padStart(2, '0')}.${date.getFullYear()}`;
  return (
    <Minion>v.{version} // released on {formattedDate}</Minion>
  );
};

ReleaseInfo.displayName = 'ReleaseInfo';

export default ReleaseInfo;
