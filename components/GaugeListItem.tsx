import React, { ReactElement, useState } from 'react';

import { Collapse, Divider, ListItem, ListItemText, ListSubheader } from '@material-ui/core';
import { RegionGroup } from '../types';

type Props = {
  region: RegionGroup;
};

const GaugeListItem = ({ region }: Props): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <ListItem button onClick={() => setIsOpen(!isOpen)}>
        <ListItemText primary={region.region} />
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
