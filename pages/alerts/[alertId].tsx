import { ReactElement, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../auth';
import firebaseClient from '../../firebaseClient';
import firebase from 'firebase/app';
import 'firebase/auth';

import Layout from '../../components/Layout';
import AlertDisplay from '../../components/AlertDisplay';
import { Alert } from '../../types';

import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/NotificationsNone';
import AlertLayout from '../../components/AlertLayout';

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
  const classes = useStyles();
  const router = useRouter();
  const { user }: { user: firebase.User | null } = useAuth();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const {
    query: { alertId },
  } = router;

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (typeof alertId !== 'string') {
      return;
    }

    firebase
      .firestore()
      .collection('users')
      .doc(user.uid)
      .collection('alerts')
      .doc(alertId)
      .get()
      .then((doc) => {
        setSelectedAlert(doc.data() as Alert);
      });
  }, [user, router, alertId]);

  const renderNotSelected = (): ReactElement => (
    <div className={classes.center}>
      <NotificationsIcon />
      <Typography>Select an alert to view</Typography>
    </div>
  );

  return (
    <Layout title={selectedAlert?.name}>
      <AlertLayout selectedId={selectedAlert?.id}>
        <div className={classes.container}>
          {selectedAlert?.id ? (
            <AlertDisplay alert={selectedAlert} onDelete={() => setSelectedAlert(null)} />
          ) : (
            renderNotSelected()
          )}
        </div>
      </AlertLayout>
    </Layout>
  );
};

export default AlertPage;
