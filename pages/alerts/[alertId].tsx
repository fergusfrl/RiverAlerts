import { ReactElement, useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useAuth } from '../../auth';
import firebaseClient from '../../firebaseClient';
import firebase from 'firebase/app';
import 'firebase/auth';

import Layout from '../../components/Layout';
import AlertList from '../../components/AlertList';
import AlertDisplay from '../../components/AlertDisplay';
import { Alert } from '../../types';

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

const AlertPage = (): ReactElement => {
  firebaseClient();
  const { user }: { user: firebase.User | null } = useAuth();
  const classes = useStyles();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    query: { alertId },
  } = router;

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

  useEffect(() => {
    if (alerts.length > 0) {
      const alert = alerts.find((alert: Alert) => alert.id === alertId);
      setSelectedAlert(alert || null);
    }
  }, [alerts, alertId]);

  const renderNotSelected = (): ReactElement => (
    <div className={classes.center}>
      <NotificationsIcon />
      <Typography>Select an alert to view</Typography>
    </div>
  );

  return (
    <Layout title={selectedAlert?.name}>
      <AlertList alerts={alerts} selectedId={selectedAlert?.id || null} isLoading={isLoading} />
      <div className={classes.container}>
        {selectedAlert?.id ? (
          <AlertDisplay alert={selectedAlert} onDelete={() => setSelectedAlert(null)} />
        ) : (
          renderNotSelected()
        )}
      </div>
    </Layout>
  );
};

export default AlertPage;
