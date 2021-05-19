import React, { ReactElement, useState } from 'react';

import {
  Collapse,
  Divider,
  ListItem,
  ListItemText,
  ListSubheader,
  Typography,
} from '@material-ui/core';
import { RegionGroup } from '../types';

type Props = {
  region: RegionGroup;
};

const GaugeListItem = ({ region }: Props): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const gaugeCount = region.rivers.reduce((acc, curr) => acc + curr.gauges.length, 0);

  return (
    <div>
      <ListItem button onClick={() => setIsOpen(!isOpen)}>
        <ListItemText primary={region.region} />
        <Typography>{gaugeCount}</Typography>
      </ListItem>
      <Collapse in={isOpen}>
        {region.rivers.map((river) => (
          <div key={river.river}>
            <ListSubheader>{river.river}</ListSubheader>
            {river.gauges.map((gauge) => (
              <ListItem button dense key={gauge.id}>
                <ListItemText inset>{gauge.name}</ListItemText>
              </ListItem>
            ))}
          </div>
        ))}
      </Collapse>
      <Divider />
    </div>
  );
};

export default GaugeListItem;
