import React, { ReactElement } from 'react';

import { groupByRegionAndRiver } from '../utils/utils';
import { Gauge, RegionGroup } from '../types';
import GaugeListItem from './GaugeListItem';
import SearchBar from './SearchBar';
import GaugeMap from './GaugeMap';

import { makeStyles } from '@material-ui/core/styles';
import { Drawer, List } from '@material-ui/core';

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
}));

type Props = {
  gauges: Gauge[];
  handleSearch: (searchString: string) => void;
  toggleViewType: () => void;
  viewType: string;
};

const GaugeList = ({ gauges, handleSearch, toggleViewType, viewType }: Props): ReactElement => {
  const classes = useStyles();
  return (
    <Drawer variant="permanent" classes={{ root: classes.drawer, paper: classes.drawer }}>
      <SearchBar handleSearch={handleSearch} toggleViewType={toggleViewType} viewType={viewType} />
      {viewType === 'LIST_VIEW' ? (
        <List classes={{ root: classes.list }}>
          {groupByRegionAndRiver(gauges).map((region: RegionGroup) => (
            <GaugeListItem region={region} key={region.region} />
          ))}
        </List>
      ) : (
        <GaugeMap />
      )}
    </Drawer>
  );
};

export default GaugeList;
