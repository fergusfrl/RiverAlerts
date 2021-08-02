import { ReactElement, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../auth';
import { useSnackbar } from 'notistack';
import firebase from '../firebaseClient';
import 'firebase/auth';

import SearchBar from './SearchBar';
import { Alert } from '../types';

import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CircularProgress,
  Drawer,
  Fab,
  Grid,
  Tooltip,
  Typography,
} from '@material-ui/core';
import PlaceOutlinedIcon from '@material-ui/icons/PlaceOutlined';
import AddIcon from '@material-ui/icons/AddAlert';
import WarningIcon from '@material-ui/icons/Warning';
import AlertActiveIcon from '@material-ui/icons/NotificationsActive';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: '100%',
    zIndex: theme.zIndex.drawer - 1,
    [theme.breakpoints.up('sm')]: {
      left: '5em',
      width: 380,
    },
    overflow: 'auto',
    paddingBottom: theme.spacing(2.5),
  },
  list: {
    paddingTop: 0,
    [theme.breakpoints.down('xs')]: {
      paddingBottom: '4em',
    },
  },
  card: {
    backgroundColor: theme.palette.primary.main,
  },
  cardWrapper: {
    margin: theme.spacing(),
  },
  cardTitle: {
    fontSize: '1.25em',
    marginBottom: theme.spacing(),
  },
  cardSubtitle: {
    fontSize: '0.8em',
    marginLeft: theme.spacing(),
  },
  cardContent: {
    paddingTop: 0,
  },
  cardContentTypography: {
    fontSize: '1em',
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    left: theme.spacing(37),
  },
  fabIcon: {
    marginRight: theme.spacing(),
  },
  center: {
    alignSelf: 'center',
  },
  maxItemsMessage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningIcon: {
    marginRight: theme.spacing(1),
  },
  throbber: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(4),
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing(2.5),
    width: '100%',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    backgroundColor: theme.palette.primary.contrastText,
    ...theme.mixins.toolbar,
    [theme.breakpoints.up('sm')]: {
      paddingBottom: theme.spacing(3),
    },
  },
}));

const getOperationTranslation = (operation: string): string => {
  if (operation === 'greater-than') return 'Greater than';
  if (operation === 'less-than') return 'Less than';
  if (operation === 'equals') return 'Equals';

  return '';
};

type Props = {
  selectedId: string | null;
};

const AlertList = ({ selectedId }: Props): ReactElement => {
  const classes = useStyles();
  const router = useRouter();
  const { user }: { user: firebase.User | null } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [searchString, setSearchString] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    setIsLoading(true);

    if (user) {
      firebase
        .firestore()
        .collection('users')
        .doc(user.uid)
        .collection('alerts')
        .get()
        .then((querySnap) => {
          const alertData = querySnap.docs.map((doc) => doc.data() as Alert);
          const orderedAlerts = alertData.sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0;
          });
          setAlerts(orderedAlerts);
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar('Something went wrong getting your alerts.', {
            variant: 'error',
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [enqueueSnackbar, user]);

  const filteredAlerts = alerts.filter((alert) => {
    if (!searchString) return true;
    const searchStr = searchString.toLowerCase();
    return (
      alert.name.toLowerCase().includes(searchStr) ||
      alert.gauge.name.toLowerCase().includes(searchStr) ||
      alert.gauge.river_name.toLowerCase().includes(searchStr)
    );
  });

  const renderEmptyList = (): ReactElement => (
    <p className={classes.center}>No alerts. Get started by creating one.</p>
  );

  const renderAlerts = (): ReactElement[] =>
    filteredAlerts.map((alert) => {
      const isSelected = alert.id === selectedId;
      return (
        <div key={alert.id} className={classes.cardWrapper}>
          <Card className={isSelected ? classes.card : ''} elevation={isSelected ? 0 : 2}>
            <CardActionArea
              onClick={() => {
                router.push(`/alerts/${alert.id}`);
              }}
            >
              <CardHeader
                title={
                  <Typography
                    color="primary"
                    variant="h5"
                    className={classes.cardTitle}
                    style={{ color: isSelected ? 'white' : '' }}
                  >
                    {alert.name}
                  </Typography>
                }
                subheader={
                  <Grid
                    container
                    justify="flex-start"
                    alignItems="center"
                    direction="row"
                    wrap="nowrap"
                    style={{ color: isSelected ? 'lightGrey' : '' }}
                  >
                    <PlaceOutlinedIcon fontSize="small" />
                    <Typography variant="subtitle1" className={classes.cardSubtitle}>
                      {`${alert.gauge.name}, ${alert.gauge.river_name}`}
                    </Typography>
                  </Grid>
                }
                action={
                  alert.active && (
                    <Tooltip title="Alert is active">
                      <AlertActiveIcon color="secondary" />
                    </Tooltip>
                  )
                }
              />
              <CardContent className={classes.cardContent}>
                <Typography
                  color="primary"
                  variant="body1"
                  className={classes.cardContentTypography}
                  style={{ color: isSelected ? 'white' : '' }}
                >
                  {getOperationTranslation(alert.threshold.operation)}
                  <strong>{` ${alert.threshold.value} ${alert.threshold.units}`}</strong>
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
      );
    });

  const renderMaxAlertsMessage = (): ReactElement => (
    <div className={classes.maxItemsMessage}>
      <WarningIcon className={classes.warningIcon} />
      <p>Max of 3 Alerts</p>
    </div>
  );

  const renderAlertsNotFound = (): ReactElement => (
    <p className={classes.center}>No Alerts Found</p>
  );

  return (
    <Drawer variant="permanent" classes={{ root: classes.drawer, paper: classes.drawer }}>
      <AppBar position="sticky" elevation={0} className={classes.toolbar}>
        <SearchBar handleSearch={setSearchString} placeholder="Search Alerts" />
      </AppBar>
      {isLoading && (
        <div className={classes.throbber}>
          <CircularProgress size={20} />
        </div>
      )}
      {!isLoading && alerts.length === 0 && renderEmptyList()}
      {!isLoading && alerts.length > 0 && renderAlerts()}
      {!isLoading && alerts.length >= 3 && renderMaxAlertsMessage()}
      {!isLoading && alerts.length > 0 && filteredAlerts.length === 0 && renderAlertsNotFound()}
      <Fab
        size="large"
        disabled={alerts.length >= 3}
        color="secondary"
        variant="extended"
        className={classes.fab}
        onClick={() => {
          router.push('/alerts/create');
        }}
      >
        <AddIcon className={classes.fabIcon} />
        Add Alert
      </Fab>
    </Drawer>
  );
};

export default AlertList;
