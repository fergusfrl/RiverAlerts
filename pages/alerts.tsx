import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { verifyIdToken, getUserAlerts } from '../firebaseAuth';
import { GetServerSideProps } from 'next';
import nookies from 'nookies';
import 'firebase/auth';

import { Alert } from '../types';
import Layout from '../components/Layout';
import AlertList from '../components/AlertList';

import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/NotificationsNone';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing(2.5, 0, 0, 48),
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
  session: {
    uid: string;
    email: string | undefined;
  } | null;
  alerts: Alert[] | null;
};

const AlertsPage = ({ session, alerts }: Props): ReactElement => {
  const router = useRouter();
  const classes = useStyles();

  if (!session) {
    router.push('/login');
  }

  return (
    <Layout title="Alerts">
      {alerts && <AlertList alerts={alerts} />}
      <div className={classes.container}>
        <div className={classes.center}>
          <NotificationsIcon />
          <Typography>Select an alert to view</Typography>
        </div>
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
    const { uid, email } = token;

    const alerts = await getUserAlerts(uid);

    return {
      props: {
        session: { uid, email },
        alerts: alerts || null,
      },
    };
  } catch (err) {
    context.res.writeHead(302, { location: '/login' });
    context.res.end();
    return { props: { session: null, alerts: null } };
  }
};

export default AlertsPage;
