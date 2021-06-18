import { ReactElement, useMemo } from 'react';
import { verifyIdToken, getUserAlerts } from '../firebaseAuth';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import nookies from 'nookies';
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
  alerts: Alert[] | null;
};

const AlertsPage = ({ alerts }: Props): ReactElement => {
  const classes = useStyles();
  const router = useRouter();
  const {
    query: { alertId },
  } = router;

  const selectedAlertId = typeof alertId === 'string' ? alertId : null;

  const selectedAlert = useMemo(
    () => alerts?.find((alert) => alert.id === alertId),
    [alerts, alertId]
  );

  const renderNotSelected = (): ReactElement => (
    <div className={classes.center}>
      <NotificationsIcon />
      <Typography>Select an alert to view</Typography>
      {alertId && <div>{`fetch details for alert with id: ${alertId}`}</div>}
    </div>
  );

  return (
    <Layout title="Alerts">
      {alerts && <AlertList alerts={alerts} selectedId={selectedAlertId} />}
      <div className={classes.container}>
        {alertId ? <AlertDisplay alert={selectedAlert} /> : renderNotSelected()}
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

    const alerts = await getUserAlerts(uid);
    const sortedAlerts = alerts.sort((a, b) => {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0;
    });

    return {
      props: { alerts: sortedAlerts || null },
    };
  } catch (err) {
    context.res.writeHead(302, { location: '/login' });
    context.res.end();
    return {
      props: { alerts: null },
    };
  }
};

export default AlertsPage;
