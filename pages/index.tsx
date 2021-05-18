import { ReactElement } from 'react';
import axios from 'axios';

import { Gauge } from '../types';
import Layout from '../components/Layout';

const IndexPage = ({ gauges }: { gauges: Gauge[] }): ReactElement => {
  return (
    <Layout title="Gauge Map | River Alerts">
      <h1>Gauge Map Page</h1>
      {gauges.map((item: Gauge) => (
        <h1 key={item.id}>{item.name}</h1>
      ))}
    </Layout>
  );
};

export const getStaticProps = async (): Promise<{ props: { gauges: Gauge[] } }> => {
  const response = await axios.post('https://data.riverguide.co.nz/', {
    action: 'get_features',
    crossDomain: true,
    filters: ['flow', 'stage_height'],
  });
  const data = await response.data;

  return { props: { gauges: data.features } };
};

export default IndexPage;
