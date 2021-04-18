import React from 'react';
import { Heading, Pane } from 'evergreen-ui';

const Footer: React.FC = () => {
  return (
    <Pane
      marginTop="36px"
      textAlign="center"
      padding="16px"
    >
      <Heading size={100}>
        Created by Denys Grybov in 2021
      </Heading>
    </Pane>
  );
};

Footer.displayName = 'Footer';

export default Footer;
