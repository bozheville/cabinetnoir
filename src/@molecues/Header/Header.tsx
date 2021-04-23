import React from 'react';
import { Pane } from 'evergreen-ui';
import { DoublePica } from '@typography';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  children,
}) => {
  return (
    <Pane
        marginBottom="36px"
        paddingX="24px"
        paddingY="16px"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        boxShadow="0px 0px 3px 0px #999"
      >
        <DoublePica>{title}</DoublePica>
        {children}
      </Pane>
  );
};

Header.displayName = 'Header';

export default Header;
