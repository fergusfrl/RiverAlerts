import React, { ReactElement, ReactNode } from 'react';
import Link from 'next/link';

import { makeStyles } from '@material-ui/core/styles';
import { Grid, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.primary.contrastText,
    minWidth: theme.spacing(1),
  },
  iconLabel: {
    fontSize: '0.7em',
  },
}));

type Props = {
  link: string;
  label: string;
  icon: ReactNode;
  disabled?: boolean;
};

const NavItem = ({ link, label, icon, disabled = false }: Props): ReactElement => {
  const classes = useStyles();
  return (
    <Link href={link}>
      <ListItem
        button
        component={Grid}
        container
        direction="column"
        justify="center"
        alignItems="center"
        disabled={disabled}
      >
        <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
        <ListItemText primary={<Typography className={classes.iconLabel}>{label}</Typography>} />
      </ListItem>
    </Link>
  );
};

export default NavItem;
