import { ReactElement, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../auth';
import firebase from 'firebase/app';

import Layout from '../../components/Layout';
import AlertLayout from '../../components/AlertLayout';

const AlertsPage = (): ReactElement => {
  const { user }: { user: firebase.User | null } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, router]);

  return (
    <Layout title="Alerts">
      <AlertLayout />
    </Layout>
  );
};

export default AlertsPage;
