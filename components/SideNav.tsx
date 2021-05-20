import React, { ReactElement } from 'react';
import Image from 'next/image';
import { NavItem as NavItemProps } from '../types';
import NavItem from './NavItem';

import { makeStyles } from '@material-ui/core/styles';
import { Drawer, Grid, List } from '@material-ui/core';

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
  logo: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

type Props = {
  navList: NavItemProps[];
};

const SideNav = ({ navList }: Props): ReactElement => {
  const classes = useStyles();

  return (
    <Drawer variant="permanent" className={classes.drawer} classes={{ paper: classes.drawer }}>
      <Grid
        container
        direction="column"
        justify="space-between"
        alignItems="center"
        className={classes.drawerContent}
      >
        <div>
          {/* LOGO */}
          <Grid container justify="center" alignItems="center" className={classes.logo}>
            <Image src="/logo.png" priority alt="River Alerts Logo" width={45} height={45} />
          </Grid>

          {/* NAVIGATION */}
          <List>
            {navList.map((navItem) => (
              <NavItem {...navItem} key={navItem.label.toLowerCase()} />
            ))}
          </List>
        </div>
      </Grid>
    </Drawer>
  );
};

export default SideNav;
