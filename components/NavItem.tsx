import React, { ReactElement, ReactNode } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { makeStyles } from '@material-ui/core/styles';
import { Grid, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  listItem: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    opacity: 0.7,
    transition: 'opacity 0.3s',
    '&:hover': {
      opacity: 1,
    },
  },
  selected: {
    boxShadow: `3px 0 0 0 ${theme.palette.primary.contrastText} inset`,
    opacity: 1,
  },
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
  const router = useRouter();

  const isSelected = (): boolean => {
    if (router.pathname === '/' && link === '/') {
      return true;
    }
    if (link === '/') {
      return false;
    }
    return router.pathname.includes(link);
  };

  return (
    <Link href={link}>
      <ListItem
        button
        disableGutters
        component={Grid}
        container
        direction="column"
        justify="center"
        alignItems="center"
        disabled={disabled}
        className={classes.listItem}
        selected={isSelected()}
        classes={{
          selected: classes.selected,
        }}
      >
        <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
        <ListItemText primary={<Typography className={classes.iconLabel}>{label}</Typography>} />
      </ListItem>
    </Link>
  );
};

export default NavItem;
