import React, { ReactElement, ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NavItem from './NavItem';

import { makeStyles } from '@material-ui/core/styles';
import { Drawer, Grid, List } from '@material-ui/core';
// import LogoutIcon from '@material-ui/icons/ExitToApp';

const useStyles = makeStyles((theme) => ({
  drawer: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    boxShadow:
      '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)', // CSS for material ui elevation 4 due to elevation not working on permanent drawers
  },
  drawerContent: {
    height: '100%',
  },
  logo: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    cursor: 'pointer',
  },
}));

type NavItem = {
  link: string;
  label: string;
  icon: ReactNode;
  disabled?: boolean;
};

type Props = {
  navList: NavItem[];
};

const SideNav = ({ navList }: Props): ReactElement => {
  const classes = useStyles();
  return (
    <Drawer variant="permanent" className={classes.drawer} classes={{ paper: classes.drawer }}>
      <Grid
        container
        direction="column"
        justify="space-between"
        alignItems="center"
        className={classes.drawerContent}
      >
        <div>
          {/* LOGO */}
          <Grid container justify="center" alignItems="center" className={classes.logo}>
            <Link href="/">
              <Image src="/logo.png" priority alt="River Alerts Logo" width={45} height={45} />
            </Link>
          </Grid>

          {/* NAVIGATION */}
          <List>
            {navList.map((navItem) => (
              <NavItem {...navItem} key={navItem.label.toLowerCase()} />
            ))}
          </List>
        </div>
        {/* LOGOUT */}
        {/* <NavItem link="/" label="Logout" icon={<LogoutIcon fontSize="large" />} disabled /> */}
      </Grid>
    </Drawer>
  );
};

export default SideNav;
