import React, { ReactElement } from 'react';
import Link from 'next/link';
import firebase from 'firebase/app';
import { useAuth } from '../auth';

import { groupByRegionAndRiver } from '../utils/utils';
import { Gauge, RegionGroup } from '../types';
import GaugeListItem from './GaugeListItem';
import SearchBar from './SearchBar';
import GaugeMap from './GaugeMap';

import { makeStyles } from '@material-ui/core/styles';
import { Button, Drawer, List } from '@material-ui/core';

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
  authButtons: {
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(2.5, 1, 0, 1),
  },
  registerButton: {
    marginBottom: theme.spacing(1),
  },
}));

type Props = {
  gauges: Gauge[];
  handleSearch: (searchString: string) => void;
  toggleViewType: () => void;
  viewType: string;
};

const GaugeList = ({ gauges, handleSearch, toggleViewType, viewType }: Props): ReactElement => {
  const { user }: { user: firebase.User | null } = useAuth();
  const classes = useStyles();

  return (
    <Drawer variant="permanent" classes={{ root: classes.drawer, paper: classes.drawer }}>
      {!user && (
        <div className={classes.authButtons}>
          <Link href="/register">
            <Button variant="contained" color="secondary" className={classes.registerButton}>
              Register an Account
            </Button>
          </Link>
          <Link href="login">
            <Button variant="text" color="primary">
              Sign In
            </Button>
          </Link>
        </div>
      )}
      <SearchBar handleSearch={handleSearch} toggleViewType={toggleViewType} viewType={viewType} />
      {viewType === 'LIST_VIEW' ? (
        <List classes={{ root: classes.list }}>
          {groupByRegionAndRiver(gauges).map((region: RegionGroup) => (
            <GaugeListItem region={region} key={region.region} />
          ))}
        </List>
      ) : (
        <GaugeMap gauges={gauges} />
      )}
    </Drawer>
  );
};

export default GaugeList;
