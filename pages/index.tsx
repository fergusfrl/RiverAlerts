import { ReactElement, useMemo, useState } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

import { Gauge } from '../types';
import Layout from '../components/Layout';
import GaugeList from '../components/GaugeList';
import GaugeMap from '../components/GaugeMap';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const LIST_VIEW = 'LIST_VIEW';
const MAP_VIEW = 'MAP_VIEW';

type Props = {
  gauges: Gauge[];
};

const IndexPage = ({ gauges }: Props): ReactElement => {
  const [searchString, setSearchString] = useState('');
  const [viewType, setViewType] = useState(LIST_VIEW);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('xs'));

  const handleSearch = debounce((value: string) => {
    setSearchString(value);
  }, 300);

  const toggleViewType = (): void => {
    setViewType(viewType === LIST_VIEW ? MAP_VIEW : LIST_VIEW);
  };

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
      <GaugeList
        gauges={filterGauges}
        handleSearch={handleSearch}
        toggleViewType={toggleViewType}
        viewType={viewType}
      />
      {!matches && <GaugeMap gauges={filterGauges} />}
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
