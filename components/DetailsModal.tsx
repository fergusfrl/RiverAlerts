import { useEffect, ReactElement, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardHeader, IconButton, Slide, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { Gauge, GaugeData } from '../types/index';

const useStyles = makeStyles((theme) => ({
  card: {
    position: 'absolute',
    zIndex: 1000,
    bottom: theme.spacing(2),
    left: '465px',
    width: `calc(100% - ${475}px)`,
  },
}));

type Props = {
  gaugeData: Gauge | undefined;
};

const DetailsModal = ({ gaugeData }: Props): ReactElement => {
  const [liveData, setLiveData] = useState<GaugeData | null>(null);
  const classes = useStyles();
  const router = useRouter();
  const {
    query: { gaugeId },
  } = router;

  useEffect(() => {
    axios
      .post('https://data.riverguide.co.nz/', {
        action: 'get_flows',
        id: [gaugeId],
      })
      .then((res) => {
        setLiveData(res.data);
      });
  }, [gaugeId]);

  return (
    <Slide in={!!gaugeId} direction="up" timeout={150}>
      <Card className={classes.card}>
        <CardHeader
          title={
            <Typography color="primary" variant="h5">
              {liveData?.name}
            </Typography>
          }
          subheader={`${gaugeData?.river_name}, ${gaugeData?.region}`}
          action={
            <IconButton onClick={() => router.push('/')}>
              <CloseIcon />
            </IconButton>
          }
        />
        <CardContent>{liveData?.name}</CardContent>
      </Card>
    </Slide>
  );
};

export default DetailsModal;
