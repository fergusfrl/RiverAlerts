import { ReactElement } from 'react';
import axios from 'axios';

import { Gauge } from '../types';
import Layout from '../components/Layout';
import ListPanel from '../components/GaugeList';

type Props = {
  gauges: Gauge[];
};

const IndexPage = ({ gauges }: Props): ReactElement => {
  return (
    <Layout title="Gauge Map | River Alerts">
      <ListPanel gauges={gauges} />
      Map View
    </Layout>
  );
};

export const getStaticProps = async (): Promise<{ props: Props }> => {
  const response = await axios.post('https://data.riverguide.co.nz/', {
    action: 'get_features',
    crossDomain: true,
    filters: ['flow', 'stage_height'],
  });
  const data = response.data;

  return { props: { gauges: data.features } };
};

export default IndexPage;
