import { ReactElement, useState } from 'react';
import { useRouter } from 'next/router';
import { verifyIdToken } from '../firebaseAuth';
import { GetServerSideProps } from 'next';
import nookies from 'nookies';
import firebaseClient from '../firebaseClient';
import firebase from 'firebase/app';
import 'firebase/auth';

import Layout from '../components/Layout';

import { Button, CircularProgress } from '@material-ui/core';

type Props = {
  session: {
    uid: string;
    email: string | undefined;
  } | null;
};

const ProfilePage = ({ session }: Props): ReactElement => {
  firebaseClient();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = (): void => {
    setIsLoggingOut(true);
    firebase
      .auth()
      .signOut()
      .then(() => {
        router.push('/');
      })
      .finally(() => {
        setIsLoggingOut(false);
      });
  };

  return (
    <Layout title="Profile | River Alerts">
      <h1>Profile</h1>
      <p>{session?.uid}</p>
      <p>{session?.email}</p>
      <Button variant="contained" color="secondary" onClick={handleLogout} disabled={isLoggingOut}>
        {isLoggingOut ? <CircularProgress size={25} /> : 'Logout'}
      </Button>
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

    // TODO: use uid + firebase to get user information

    return {
      props: { session: { uid, email } },
    };
  } catch (err) {
    context.res.writeHead(302, { location: '/login' });
    context.res.end();
    return { props: { session: null } };
  }
};

export default ProfilePage;
