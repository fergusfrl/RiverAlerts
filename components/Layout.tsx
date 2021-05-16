import React, { ReactNode, ReactElement } from 'react';
import Head from 'next/head';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import SideNav from './SideNav';
import BottomNav from './BottomNav';

import PersonIcon from '@material-ui/icons/Person';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PlaceIcon from '@material-ui/icons/Place';

const useStyles = makeStyles((theme) => ({
  content: {
    paddingLeft: theme.spacing(11),
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
  { link: '/', label: 'Gauge Map', icon: <PlaceIcon />, disabled: false },
];

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'This is the default title' }: Props): ReactElement => {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {matches ? <SideNav navList={NAV_LIST} /> : <BottomNav navList={NAV_LIST} />}
      <div className={classes.content}>{children}</div>
    </div>
  );
};

export default Layout;
