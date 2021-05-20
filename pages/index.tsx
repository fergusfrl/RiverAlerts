import { ReactElement, useMemo, useState } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

import { Gauge } from '../types';
import Layout from '../components/Layout';
import GaugeList from '../components/GaugeList';

type Props = {
  gauges: Gauge[];
};

const IndexPage = ({ gauges }: Props): ReactElement => {
  const [searchString, setSearchString] = useState('');

  const handleSearch = debounce((value: string) => {
    setSearchString(value);
  }, 300);

  const filterGauges = useMemo(() => {
    if (searchString.length === 0) {
      return gauges;
    }

    const lowerCaseSearchString = searchString.toLowerCase();
    return gauges.filter(
      (gauge) =>
        gauge.name.toLowerCase().includes(lowerCaseSearchString) ||
        gauge.river_name.toLowerCase().includes(lowerCaseSearchString) ||
        gauge.region.toLowerCase().includes(lowerCaseSearchString)
    );
  }, [searchString, gauges]);

  return (
    <Layout title="Gauges | River Alerts">
      <GaugeList gauges={filterGauges} handleSearch={handleSearch} />
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
