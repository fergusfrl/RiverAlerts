import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { verifyIdToken } from '../firebaseAuth';
import { GetServerSideProps } from 'next';
import nookies from 'nookies';
import 'firebase/auth';

import Layout from '../components/Layout';

type Props = {
  session: {
    uid: string;
    email: string | undefined;
  } | null;
};

const AlertsPage = ({ session }: Props): ReactElement => {
  const router = useRouter();

  if (!session) {
    router.push('/login');
  }

  return (
    <Layout title="Alerts | River Alerts">
      <h1>Alerts Page</h1>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context
): Promise<{ props: Props }> => {
  try {
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { uid, email } = token;

    // TODO: use uid + firebase to get user alerts

    return {
      props: { session: { uid, email } },
    };
  } catch (err) {
    context.res.writeHead(302, { location: '/login' });
    context.res.end();
    return { props: { session: null } };
  }
};

export default AlertsPage;
