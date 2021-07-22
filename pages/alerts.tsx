import { ReactElement, useState, useEffect } from 'react';
import { verifyIdToken } from '../firebaseAuth';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import nookies from 'nookies';
import firebaseClient from '../firebaseClient';
import firebase from 'firebase/app';
import 'firebase/auth';

import { Alert } from '../types';
import Layout from '../components/Layout';
import AlertList from '../components/AlertList';
import AlertDisplay from '../components/AlertDisplay';

import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/NotificationsNone';

const useStyles = makeStyles((theme) => ({
  container: {
    marginLeft: theme.spacing(48),
    height: '100%',
    display: 'flex',
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    margin: theme.spacing(0, 'auto'),
    color: 'grey',
    paddingRight: theme.spacing(4),
  },
}));

type Props = {
  session: { uid: string } | null;
};

const AlertsPage = ({ session }: Props): ReactElement => {
  firebaseClient();
  const classes = useStyles();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const {
    query: { alertId },
  } = router;

  useEffect(() => {
    if (session) {
      setIsLoading(true);
      firebase
        .firestore()
        .collection('users')
        .doc(session.uid)
        .collection('alerts')
        .get()
        .then((querySnap) => {
          const alertData = querySnap.docs.map((doc) => doc.data() as Alert);
          const orderedAlerts = alertData.sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0;
          });
          setAlerts(orderedAlerts);

          const alert = orderedAlerts.find((alert: Alert) => alert.id === alertId);
          setSelectedAlert(alert || null);
        })
        .catch(() => {
          enqueueSnackbar('Something went wrong getting your alerts.', {
            variant: 'error',
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [session, alertId, enqueueSnackbar]);

  const renderNotSelected = (): ReactElement => (
    <div className={classes.center}>
      <NotificationsIcon />
      <Typography>Select an alert to view</Typography>
    </div>
  );

  return (
    <Layout title="Alerts">
      {alerts && <AlertList alerts={alerts} selectedId={selectedAlert?.id || null} />}
      <div className={classes.container}>
        {isLoading ? (
          <p>loading...</p>
        ) : alertId ? (
          <AlertDisplay alert={selectedAlert} onDelete={() => setSelectedAlert(null)} />
        ) : (
          renderNotSelected()
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context
): Promise<{ props: Props }> => {
  try {
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { uid } = token;

    return {
      props: {
        session: { uid },
      },
    };
  } catch (err) {
    context.res.writeHead(302, { location: '/login' });
    context.res.end();
    return {
      props: {
        session: null,
      },
    };
  }
};

export default AlertsPage;
