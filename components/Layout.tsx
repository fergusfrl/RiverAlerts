import React, { ReactNode, ReactElement } from 'react';
import Head from 'next/head';
import { makeStyles } from '@material-ui/core/styles';
import SideNav from './SideNav';

const useStyles = makeStyles((theme) => ({
  content: {
    paddingLeft: theme.spacing(11),
  },
}));

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
      <SideNav />
      <div className={classes.content}>{children}</div>
    </div>
  );
};

export default Layout;
