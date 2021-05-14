import { ReactElement } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

import { Button } from '@material-ui/core';

const IndexPage = (): ReactElement => (
  <Layout title="Home | Next.js + TypeScript Example">
    <h1>
      Hello Next.js{' '}
      <span role="img" aria-label="wave emoji">
        👋
      </span>
    </h1>
    <Button color="primary" variant="contained">
      Click me here
    </Button>
    <p>
      <Link href="/about">
        <a>About</a>
      </Link>
    </p>
  </Layout>
);

export default IndexPage;
