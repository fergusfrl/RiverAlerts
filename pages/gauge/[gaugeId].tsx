import { ReactElement } from 'react';
import { GetServerSideProps } from 'next';
import axios from 'axios';

import { Gauge, GaugeData } from '../../types';
import Layout from '../../components/Layout';
import TimeSeriesGraph from '../../components/TimeSeriesGraph';

import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import PlaceOutlinedIcon from '@material-ui/icons/PlaceOutlined';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing(3, 3, 0, 0),
  },
  subtitle: {
    marginLeft: theme.spacing(1),
  },
  graphs: {
    margin: theme.spacing(4, 0),
    overflow: 'auto',
  },
}));

type Props = {
  gaugeInfo: Gauge;
  observations: GaugeData;
};

const GaugePage = ({ gaugeInfo, observations }: Props): ReactElement => {
  const classes = useStyles();

  const flowData = observations.flows
    .filter((observation) => !!observation.flow)
    .map(({ flow, time }) => ({ flow, time }));

  const stageHeigthData = observations.flows
    .filter((observation) => !!observation.stage_height)
    .map(({ stage_height, time }) => ({ stage_height, time }));

  return (
    <Layout title={gaugeInfo ? gaugeInfo.name : 'Gauge'}>
      <div className={classes.container}>
        <Typography color="primary" variant="h5">
          {gaugeInfo?.name}
        </Typography>
        <Grid container justify="flex-start" alignItems="center">
          <PlaceOutlinedIcon />
          <Typography
            variant="subtitle1"
            className={classes.subtitle}
          >{`${gaugeInfo?.river_name}, ${gaugeInfo?.region}`}</Typography>
        </Grid>
        <div className={classes.graphs}>
          {flowData && flowData.length > 0 && (
            <TimeSeriesGraph data={flowData} units="cumecs" gaugeSource={gaugeInfo.data_source} />
          )}
          {stageHeigthData && stageHeigthData.length > 0 && (
            <TimeSeriesGraph
              data={stageHeigthData}
              units="metres"
              gaugeSource={gaugeInfo.data_source}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context
): Promise<{ props: Props }> => {
  const gaugeId = context.query.gaugeId;

  // make all requests in parallel
  const [gauges, observations] = await Promise.all([
    // get all gauges
    axios.post('https://data.riverguide.co.nz/', {
      action: 'get_features',
      crossDomain: true,
      filters: ['flow', 'stage_height'],
    }),
    // get historical flow
    axios.post('https://data.riverguide.co.nz/', {
      action: 'get_flows',
      id: [gaugeId],
    }),
  ]);

  const data = await gauges.data;
  const gaugeInfo = data.features.find((gauge: Gauge) => gaugeId === gauge.id);
  const observationData = await observations.data;

  return {
    props: {
      gaugeInfo,
      observations: observationData,
    },
  };
};

export default GaugePage;
