import React, { ReactElement } from 'react';

import { groupByRegionAndRiver } from '../utils/utils';
import { Gauge, RegionGroup } from '../types';

import { makeStyles } from '@material-ui/core/styles';
import { Drawer, List } from '@material-ui/core';
import GaugeListItem from './GaugeListItem';
import SearchBar from './SearchBar';

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
};

const GaugeList = ({ gauges }: Props): ReactElement => {
  const classes = useStyles();
  return (
    <Drawer variant="permanent" classes={{ root: classes.drawer, paper: classes.drawer }}>
      <SearchBar />
      <List classes={{ root: classes.list }}>
        {groupByRegionAndRiver(gauges).map((region: RegionGroup) => (
          <GaugeListItem region={region} key={region.region} />
        ))}
      </List>
    </Drawer>
  );
};

export default GaugeList;
