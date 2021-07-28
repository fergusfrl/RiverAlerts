import { ReactElement } from 'react';
import Link from 'next/link';

import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  authButtons: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(0, 1, 1, 1),
  },
  registerButton: {
    marginBottom: theme.spacing(1),
  },
}));

const AuthButtons = (): ReactElement => {
  const classes = useStyles();

  return (
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
  );
};

export default AuthButtons;
