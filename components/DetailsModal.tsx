import { useEffect, ReactElement, useState, forwardRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Slide,
  Typography,
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
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

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type Props = {
  gaugeData: Gauge | undefined;
};

const DetailsModal = ({ gaugeData }: Props): ReactElement => {
  const [liveData, setLiveData] = useState<GaugeData | null>(null);
  const classes = useStyles();
  const router = useRouter();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('xs'));
  const {
    query: { gaugeId },
  } = router;

  useEffect(() => {
    if (gaugeId) {
      axios
        .post('https://data.riverguide.co.nz/', {
          action: 'get_flows',
          id: [gaugeId],
        })
        .then((res) => {
          setLiveData(res.data);
        });
    }
  }, [gaugeId]);

  return (
    <>
      {matches ? (
        <Dialog fullScreen open={!!gaugeId} TransitionComponent={Transition}>
          <DialogTitle>{gaugeData?.name}</DialogTitle>
          <DialogContent>
            <DialogContentText>{liveData?.last_updated}</DialogContentText>
          </DialogContent>
        </Dialog>
      ) : (
        <Slide in={!!gaugeId} direction="up" timeout={150}>
          <Card className={classes.card}>
            <CardHeader
              title={
                <Typography color="primary" variant="h5">
                  {gaugeData?.name}
                </Typography>
              }
              subheader={`${gaugeData?.river_name}, ${gaugeData?.region}`}
              action={
                <IconButton onClick={() => router.push('/')}>
                  <CloseIcon />
                </IconButton>
              }
            />
            <CardContent>{liveData?.last_updated}</CardContent>
          </Card>
        </Slide>
      )}
    </>
  );
};

export default DetailsModal;
