import { ReactElement } from 'react';
import { GetServerSideProps } from 'next';
import { verifyIdToken, getUserAlerts } from '../../firebaseAuth';
import nookies from 'nookies';

import Layout from '../../components/Layout';
import AlertList from '../../components/AlertList';
import { Alert } from '../../types';

type Props = {
  selectedAlert: Alert | null;
  alerts: Alert[] | null;
};

const AlertPage = ({ selectedAlert, alerts }: Props): ReactElement => {
  return (
    <Layout title={selectedAlert?.name}>
      {alerts && <AlertList alerts={alerts} selectedId={selectedAlert?.id || null} />}
      <h1>{selectedAlert?.name}</h1>
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
