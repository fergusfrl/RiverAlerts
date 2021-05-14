import React, { ReactNode, ReactElement } from 'react';
// import Link from 'next/link';
import Head from 'next/head';
import SideNav from './SideNav';

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'This is the default title' }: Props): ReactElement => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <SideNav />
    {children}
  </div>
);

export default Layout;
