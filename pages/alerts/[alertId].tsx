import { ReactElement, useState } from 'react';
import { GetServerSideProps } from 'next';
import { verifyIdToken, getUserAlerts } from '../../firebaseAuth';
import nookies from 'nookies';

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

type Props = {
  selectedAlert: Alert | null;
  alerts: Alert[] | null;
};

const AlertPage = ({ selectedAlert, alerts }: Props): ReactElement => {
  const classes = useStyles();
  const [selAlert, setSelAlert] = useState<Alert | null>(selectedAlert);

  const renderNotSelected = (): ReactElement => (
    <div className={classes.center}>
      <NotificationsIcon />
      <Typography>Select an alert to view</Typography>
    </div>
  );

  return (
    <Layout title={selectedAlert?.name}>
      {alerts && <AlertList alerts={alerts} selectedId={selAlert?.id || null} />}
      <div className={classes.container}>
        {selAlert?.id ? (
          <AlertDisplay alert={selectedAlert} onDelete={() => setSelAlert(null)} />
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
    const alertId = context.params?.alertId;
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { uid } = token;

    const alerts = await getUserAlerts(uid);
    const selectedAlert = alerts.find((alert) => alert.id === alertId);
    const sortedAlerts = alerts.sort((a, b) => {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0;
    });

    return {
      props: { selectedAlert: selectedAlert || null, alerts: sortedAlerts },
    };
  } catch (err) {
    context.res.writeHead(302, { location: '/login' });
    context.res.end();
    return { props: { alerts: null, selectedAlert: null } };
  }
};

export default AlertPage;
