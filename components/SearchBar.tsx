import React, { ChangeEvent, ReactElement, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Hidden, IconButton, InputBase, Paper, Tab, Tabs } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing(3),
    width: '100%',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    backgroundColor: theme.palette.primary.contrastText,
    ...theme.mixins.toolbar,
    [theme.breakpoints.up('sm')]: {
      paddingBottom: theme.spacing(3),
    },
  },
  paper: {
    margin: theme.spacing(0, 2),
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '90%',
    [theme.breakpoints.up('sm')]: {
      width: 340,
    },
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  tabContainer: {
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      paddingTop: theme.spacing(1),
    },
  },
}));

type Props = {
  handleSearch: (searchString: string) => void;
};

const SearchBar = ({ handleSearch }: Props): ReactElement => {
  const classes = useStyles();
  const [searchVal, setSearchVal] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    handleSearch(value);
    setSearchVal(value);
  };

  const handleClick = (): void => {
    if (searchVal.length > 0) {
      handleSearch('');
      setSearchVal('');
    }
  };

  return (
    <AppBar className={classes.toolbar} position="sticky" elevation={0}>
      <Paper className={classes.paper} elevation={4}>
        <InputBase
          value={searchVal}
          className={classes.input}
          placeholder="Search Gauges"
          inputProps={{ 'aria-label': `Search Gauges` }}
          onChange={handleChange}
        />
        <IconButton className={classes.iconButton} aria-label="search" onClick={handleClick}>
          {searchVal.length === 0 ? <SearchIcon /> : <CloseIcon />}
        </IconButton>
      </Paper>
      <div className={classes.tabContainer}>
        <Hidden implementation="css" smUp>
          <Tabs variant="fullWidth" textColor="primary" indicatorColor="primary" value={0}>
            <Tab label="List" />
            <Tab label="Map" />
          </Tabs>
        </Hidden>
      </div>
    </AppBar>
  );
};

export default SearchBar;
