import { ReactElement, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import debounce from 'lodash.debounce';

import { Gauge } from '../types';
import Layout from '../components/Layout';
import GaugeList from '../components/GaugeList';
import GaugeMap from '../components/GaugeMap';
import DetailsModal from '../components/DetailsModal';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useEffect } from 'react';

const LIST_VIEW = 'LIST_VIEW';
const MAP_VIEW = 'MAP_VIEW';

const IndexPage = (): ReactElement => {
  const [searchString, setSearchString] = useState('');
  const [viewType, setViewType] = useState(LIST_VIEW);
  const [isLoading, setIsLoading] = useState(false);
  const [gauges, setGauges] = useState<Gauge[]>([]);
  const router = useRouter();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('xs'));

  useEffect(() => {
    setIsLoading(true);
    axios
      .post('https://data.riverguide.co.nz/', {
        action: 'get_features',
        crossDomain: true,
        filters: ['flow', 'stage_height'],
      })
      .then((response) => {
        setGauges(response.data.features);
      })
      .catch(() => {
        // TODO: enqueue error snackbar
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

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
    <Layout title="Gauges">
      <GaugeList
        gauges={filterGauges}
        handleSearch={handleSearch}
        toggleViewType={toggleViewType}
        viewType={viewType}
        isLoading={isLoading}
      />
      {!matches && <GaugeMap gauges={filterGauges} />}
      <DetailsModal gaugeData={gauges.find((gauge) => gauge.id === router.query.gaugeId)} />
    </Layout>
  );
};

export default IndexPage;
