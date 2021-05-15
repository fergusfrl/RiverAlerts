import React, { ReactElement } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NavItem from './NavItem';

import { makeStyles } from '@material-ui/core/styles';
import { Drawer, Grid, List } from '@material-ui/core';

import PersonIcon from '@material-ui/icons/Person';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PlaceIcon from '@material-ui/icons/Place';
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

const NAV_ITEMS = [
  { link: '/profile', label: 'Profile', icon: <PersonIcon fontSize="large" />, disabled: false },
  {
    link: '/alerts',
    label: 'My Alerts',
    icon: <NotificationsIcon fontSize="large" />,
    disabled: false,
  },
  { link: '/', label: 'Gauge Map', icon: <PlaceIcon fontSize="large" />, disabled: false },
];

const SideNav = (): ReactElement => {
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
              <Image src="/logo.png" alt="River Alerts Logo" width={45} height={45} />
            </Link>
          </Grid>

          {/* NAVIGATION */}
          <List>
            {NAV_ITEMS.map((navItem) => (
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
