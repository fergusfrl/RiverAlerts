import React, { ReactNode, ReactElement } from 'react';
import Head from 'next/head';
import firebase from 'firebase/app';
import { useAuth } from '../auth';

import SideNav from './SideNav';
import BottomNav from './BottomNav';

import { makeStyles } from '@material-ui/core/styles';
import { Hidden } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PlaceIcon from '@material-ui/icons/Place';

const useStyles = makeStyles((theme) => ({
  content: {
    overflow: 'auto',
    height: '100vh',
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(11),
    },
  },
}));

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'This is the default title' }: Props): ReactElement => {
  const classes = useStyles();
  const { user }: { user: firebase.User | null } = useAuth();

  const navList = [
    { link: '/profile', label: 'Profile', icon: <PersonIcon />, disabled: !user },
    {
      link: '/alerts',
      label: 'My Alerts',
      icon: <NotificationsIcon />,
      disabled: !user,
    },
    { link: '/', label: 'Gauges', icon: <PlaceIcon />, disabled: false },
  ];

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Hidden implementation="css" xsDown>
        <SideNav navList={navList} />
      </Hidden>
      <Hidden implementation="css" smUp>
        <BottomNav navList={navList} />
      </Hidden>
      <div className={classes.content}>{children}</div>
    </div>
  );
};

export default Layout;
