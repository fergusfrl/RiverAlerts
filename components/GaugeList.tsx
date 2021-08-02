import { ReactElement } from 'react';
import firebase from 'firebase/app';
import { useAuth } from '../auth';

import { groupByRegionAndRiver } from '../utils/utils';
import { Gauge, RegionGroup } from '../types';
import GaugeListItem from './GaugeListItem';
import SearchBar from './SearchBar';
import GaugeMap from './GaugeMap';

import { makeStyles } from '@material-ui/core/styles';
import { Drawer, List, CircularProgress, AppBar } from '@material-ui/core';
import AuthButtons from './AuthButtons';

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
  throbber: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(4),
  },
}));

type Props = {
  gauges: Gauge[];
  handleSearch: (searchString: string) => void;
  toggleViewType: () => void;
  viewType: string;
  isLoading: boolean;
};

const GaugeList = ({
  gauges,
  handleSearch,
  toggleViewType,
  viewType,
  isLoading,
}: Props): ReactElement => {
  const { user }: { user: firebase.User | null } = useAuth();
  const classes = useStyles();

  return (
    <Drawer variant="permanent" classes={{ root: classes.drawer, paper: classes.drawer }}>
      <AppBar position="sticky" elevation={0} className={classes.toolbar}>
        {!user && <AuthButtons />}
        <SearchBar
          handleSearch={handleSearch}
          toggleViewType={toggleViewType}
          viewType={viewType}
          placeholder="Search"
        />
      </AppBar>

      {viewType === 'LIST_VIEW' ? (
        <List classes={{ root: classes.list }}>
          {isLoading ? (
            <div className={classes.throbber}>
              <CircularProgress size={20} />
            </div>
          ) : (
            groupByRegionAndRiver(gauges).map((region: RegionGroup) => (
              <GaugeListItem region={region} key={region.region} />
            ))
          )}
        </List>
      ) : (
        <GaugeMap gauges={gauges} />
      )}
    </Drawer>
  );
};

export default GaugeList;
