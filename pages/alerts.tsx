import { ReactElement, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useAuth } from '../auth';
import firebaseClient from '../firebaseClient';
import firebase from 'firebase/app';
import 'firebase/auth';

import { Alert } from '../types';
import Layout from '../components/Layout';
import AlertList from '../components/AlertList';

const AlertsPage = (): ReactElement => {
  firebaseClient();
  const { user }: { user: firebase.User | null } = useAuth();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    firebase
      .firestore()
      .collection('users')
      .doc(user.uid)
      .collection('alerts')
      .get()
      .then((querySnap) => {
        console.log('setting...');
        const alertData = querySnap.docs.map((doc) => doc.data() as Alert);
        const orderedAlerts = alertData.sort((a, b) => {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
          return 0;
        });
        setAlerts(orderedAlerts);
      })
      .catch(() => {
        enqueueSnackbar('Something went wrong getting your alerts.', {
          variant: 'error',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [user, router, enqueueSnackbar]);

  return (
    <Layout title="Alerts">
      <AlertList alerts={alerts} selectedId={null} isLoading={isLoading} />
    </Layout>
  );
};

export default AlertsPage;
