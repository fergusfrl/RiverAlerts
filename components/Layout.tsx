import React, { ReactNode, ReactElement } from 'react';
import Head from 'next/head';
import { makeStyles } from '@material-ui/core/styles';

import SideNav from './SideNav';
import BottomNav from './BottomNav';

import { Hidden } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PlaceIcon from '@material-ui/icons/Place';

const useStyles = makeStyles((theme) => ({
  content: {
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(11),
    },
  },
}));

const NAV_LIST = [
  { link: '/profile', label: 'Profile', icon: <PersonIcon />, disabled: false },
  {
    link: '/alerts',
    label: 'My Alerts',
    icon: <NotificationsIcon />,
    disabled: false,
  },
  { link: '/', label: 'Gauges', icon: <PlaceIcon />, disabled: false },
];

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'This is the default title' }: Props): ReactElement => {
  const classes = useStyles();

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Hidden implementation="css" xsDown>
        <SideNav navList={NAV_LIST} />
      </Hidden>
      <Hidden implementation="css" smUp>
        <BottomNav navList={NAV_LIST} />
      </Hidden>
      <div className={classes.content}>{children}</div>
    </div>
  );
};

export default Layout;
