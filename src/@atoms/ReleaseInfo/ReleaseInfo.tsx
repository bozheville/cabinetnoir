import React from 'react';

import releaseinfo from '../../../public/release-info.json';

import Minion from '@typography/Minion';

const ReleaseInfo: React.FC = () => {
  const date = new Date(releaseinfo.time);
  const formattedDate = `${`${date.getDate()}`.padStart(2, '0')}.${`${date.getMonth()}`.padStart(2, '0')}.${date.getFullYear()}`;
  return (
    <Minion>v.{releaseinfo.version} // released on {formattedDate}</Minion>
  );
};

ReleaseInfo.displayName = 'ReleaseInfo';

export default ReleaseInfo;
