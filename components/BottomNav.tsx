import React, { ReactElement, ReactNode } from 'react';

import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';

type NavItem = {
  link: string;
  label: string;
  icon: ReactNode;
  disabled?: boolean;
};

type Props = {
  navList: NavItem[];
};

const BottomNav = ({ navList }: Props): ReactElement => {
  return (
    <BottomNavigation showLabels>
      {navList.map((navItem) => (
        <BottomNavigationAction
          label={navItem.label}
          icon={navItem.icon}
          key={navItem.label.toLowerCase()}
        />
      ))}
    </BottomNavigation>
  );
};

export default BottomNav;
