import { useEffect, ReactElement, useState, forwardRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import firebase from '../firebaseClient';

import TimeSeriesGraph from './TimeSeriesGraph';

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
  Divider,
  Grid,
  IconButton,
  Slide,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import CloseIcon from '@material-ui/icons/Close';
import PlaceOutlinedIcon from '@material-ui/icons/PlaceOutlined';
import AddAlertIcon from '@material-ui/icons/AddAlert';

import { Gauge, GaugeData, User } from '../types/index';
import { useAuth } from '../auth';

const useStyles = makeStyles((theme) => ({
  card: {
    position: 'absolute',
    zIndex: 1000,
    bottom: theme.spacing(2),
    left: '465px',
    width: `calc(100% - ${475}px)`,
    maxHeight: `calc(100% - ${30}px)`,
  },
  cardHeader: {
    zIndex: 1000,
    position: 'fixed',
    width: `calc(100% - ${491}px)`,
    backgroundColor: 'white',
    borderRadius: '4px',
  },
  cardHeaderContent: {},
  subtitle: {
    marginLeft: theme.spacing(1),
  },
  cardContentWrapper: {
    maxHeight: `calc(100vh - ${120}px)`,
    overflow: 'auto',
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
  const [alertCount, setAlertCount] = useState<number | null>(null);
  const { user } = useAuth();
  const classes = useStyles();
  const router = useRouter();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('xs'));
  const {
    query: { gaugeId },
  } = router;

  const flowData = liveData?.flows
    .filter((observation) => !!observation.flow)
    .map(({ flow, time }) => ({ flow, time }));

  const stageHeigthData = liveData?.flows
    .filter((observation) => !!observation.stage_height)
    .map(({ stage_height, time }) => ({ stage_height, time }));

  useEffect(() => {
    if (gaugeId) {
      setLiveData(null);
      axios
        .post('https://data.riverguide.co.nz/', {
          action: 'get_flows',
          id: [gaugeId],
        })
        .then((res) => {
          setLiveData(res.data);
        });
    }

    if (user) {
      firebase
        .firestore()
        .doc(`users/${user.uid}`)
        .get()
        .then((userDoc) => {
          const { alertCount: userAlertCount } = userDoc.data() as User;
          setAlertCount(userAlertCount);
        });
    }
  }, [gaugeId, user]);

  // On small screen, use Full Screen Dialog
  const renderDialog = (): ReactElement => (
    <Dialog fullScreen open={!!gaugeId} TransitionComponent={Transition}>
      <DialogTitle>{gaugeData?.name}</DialogTitle>
      <DialogContent>
        <DialogContentText>{liveData?.last_updated}</DialogContentText>
      </DialogContent>
    </Dialog>
  );

  // On large screen, use Card Popup
  const renderModal = (): ReactElement => (
    <Slide in={!!gaugeId} direction="up" timeout={150}>
      <Card className={classes.card}>
        <CardHeader
          title={
            <Typography color="primary" variant="h5">
              {gaugeData?.name}
            </Typography>
          }
          subheader={
            <Grid container justify="flex-start" alignItems="center">
              <PlaceOutlinedIcon />
              <Typography
                variant="subtitle1"
                className={classes.subtitle}
              >{`${gaugeData?.river_name}, ${gaugeData?.region}`}</Typography>
            </Grid>
          }
          action={
            <>
              <Tooltip title={`Create Alert for ${gaugeData?.name}`}>
                <span>
                  <IconButton
                    disabled={!user || (alertCount !== null && alertCount >= 3)}
                    color="secondary"
                    onClick={() => router.push(`./alerts/create?gaugeId=${gaugeData?.id}`)}
                  >
                    <AddAlertIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <IconButton onClick={() => router.push('/')}>
                <CloseIcon />
              </IconButton>
            </>
          }
        />
        <Divider />
        <CardContent className={classes.cardContentWrapper}>
          {flowData && flowData.length > 0 && (
            <TimeSeriesGraph
              data={flowData}
              units="cumecs"
              gaugeSource={gaugeData?.data_source}
              lightTheme
            />
          )}
          {stageHeigthData && stageHeigthData.length > 0 && (
            <TimeSeriesGraph
              data={stageHeigthData}
              units="metres"
              gaugeSource={gaugeData?.data_source}
              lightTheme
            />
          )}
        </CardContent>
      </Card>
    </Slide>
  );

  return <>{matches ? renderDialog() : renderModal()}</>;
};

export default DetailsModal;
