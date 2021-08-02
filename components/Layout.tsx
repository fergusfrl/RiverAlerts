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
  shareTitle?: string;
};

const Layout = ({ children, title = '', shareTitle }: Props): ReactElement => {
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
        <title>{title.length === 0 ? 'River Alerts' : `${title} | River Alerts`}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        {shareTitle && <meta property="og:title" content={shareTitle} />}
        <meta property="og:image" content="/river-alerts-share-screenshot.png" />
        <meta property="og:url" content="www.riveralerts.co.nz" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta
          property="og:description"
          content="View up to date NZ river levels. Set Alerts and Notifications."
        />
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
