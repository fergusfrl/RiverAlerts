import React, { ReactElement } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, List, ListItem, ListItemText } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  drawer: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    boxShadow:
      '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)', // CSS for material ui elevation 4 due to elevation not working on permanent drawers
  },
  drawerContent: {
    height: '100%',
  },
}));

const SideNav = (): ReactElement => {
  const classes = useStyles();
  return (
    <Drawer variant="permanent" className={classes.drawer} classes={{ paper: classes.drawer }}>
      <List>
        <ListItem button>
          <ListItemText>Gauges</ListItemText>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default SideNav;
