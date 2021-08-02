import { ReactElement } from 'react';

import Layout from '../../components/Layout';
import AlertLayout from '../../components/AlertLayout';

const AlertsPage = (): ReactElement => {
  return (
    <Layout title="Alerts">
      <AlertLayout />
    </Layout>
  );
};

export default AlertsPage;
