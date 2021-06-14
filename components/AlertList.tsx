import { ReactElement, useState } from 'react';
import { useRouter } from 'next/router';

import SearchBar from './SearchBar';
import { Alert } from '../types';

import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Drawer,
  Fab,
  Grid,
  Typography,
} from '@material-ui/core';
import PlaceOutlinedIcon from '@material-ui/icons/PlaceOutlined';
import AddIcon from '@material-ui/icons/AddAlert';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: '100%',
    zIndex: theme.zIndex.drawer - 1,
    [theme.breakpoints.up('sm')]: {
      left: '5em',
      width: 380,
    },
  },
  list: {
    paddingTop: 0,
    [theme.breakpoints.down('xs')]: {
      paddingBottom: '4em',
    },
  },
  card: {
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
}));

const getOperationTranslation = (operation: string): string => {
  if (operation === 'greater-than') return 'Greater than';
  if (operation === 'less-than') return 'Less than';
  if (operation === 'equals') return 'Equals';

  return '';
};

type Props = {
  alerts: Alert[];
};

const AlertList = ({ alerts }: Props): ReactElement => {
  const classes = useStyles();
  const router = useRouter();
  const [searchString, setSearchString] = useState<string | null>(null);

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
    filteredAlerts.map((alert) => (
      <Card key={alert.name.toLowerCase()} className={classes.card}>
        <CardActionArea
          onClick={() => {
            console.log('card clicked...');
          }}
        >
          <CardHeader
            title={
              <Typography color="primary" variant="h5" className={classes.cardTitle}>
                {alert.name}
              </Typography>
            }
            subheader={
              <Grid container justify="flex-start" alignItems="center">
                <PlaceOutlinedIcon fontSize="small" />
                <Typography variant="subtitle1" className={classes.cardSubtitle}>
                  {`${alert.gauge.name}, ${alert.gauge.river_name}`}
                </Typography>
              </Grid>
            }
          />
          <CardContent className={classes.cardContent}>
            <Typography color="primary" variant="body1">
              {getOperationTranslation(alert.threshold.operation)}
              <strong>{` ${alert.threshold.value} ${alert.threshold.units}`}</strong>
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    ));

  const renderAlertsNotFound = (): ReactElement => (
    <p className={classes.center}>No alerts found.</p>
  );

  return (
    <Drawer variant="permanent" classes={{ root: classes.drawer, paper: classes.drawer }}>
      <SearchBar handleSearch={setSearchString} />
      {alerts.length === 0 && renderEmptyList()}
      {alerts.length > 0 && renderAlerts()}
      {alerts.length > 0 && filteredAlerts.length === 0 && renderAlertsNotFound()}
      <Fab
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
