import React, { ReactElement } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NavItem } from '../types';

import { makeStyles } from '@material-ui/core/styles';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  bottomNav: {
    position: 'fixed',
    width: '100%',
    bottom: 0,
    backgroundColor: 'red', // theme.palette.primary.main,
    zIndex: theme.zIndex.drawer + 1,
  },
  navItem: {
    color: `${theme.palette.primary.contrastText} !important`,
    opacity: 0.7,
  },
  selected: {
    opacity: 1,
  },
}));

type Props = {
  navList: NavItem[];
};

const BottomNav = ({ navList }: Props): ReactElement => {
  const classes = useStyles();
  const router = useRouter();

  return (
    <BottomNavigation classes={{ root: classes.bottomNav }}>
      {navList.map(({ link, label, icon, disabled }) => (
        <Link href={link} key={label.toLowerCase()}>
          <BottomNavigationAction
            value={link}
            label={label}
            icon={icon}
            showLabel
            selected={router.pathname === link}
            disabled={disabled}
            classes={{
              root: classes.navItem,
              selected: classes.selected,
            }}
          />
        </Link>
      ))}
    </BottomNavigation>
  );
};

export default BottomNav;
