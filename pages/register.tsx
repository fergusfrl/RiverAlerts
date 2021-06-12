import { useState, ReactElement, ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import firebaseClient from '../firebaseClient';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useSnackbar } from 'notistack';

import Layout from '../components/Layout';

import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CircularProgress,
  TextField,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(10, 'auto'),
    maxWidth: '400px',
  },
  subheader: {
    marginTop: theme.spacing(1),
    fontSize: '0.85em',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardActions: {
    float: 'right',
  },
}));

const RegisterPage = (): ReactElement => {
  firebaseClient();
  const classes = useStyles();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    if (event.target.id === 'email') setEmail(value);
    if (event.target.id === 'password') setPassword(value);
  };

  const handleRegister = (): void => {
    setIsAuthenticating(true);
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        enqueueSnackbar('Welcome to River Alerts', {
          variant: 'success',
        });
        router.push('/profile');
      })
      .catch((err) => {
        enqueueSnackbar(err.message, {
          variant: 'error',
        });
      })
      .finally(() => {
        setIsAuthenticating(false);
      });
  };

  return (
    <Layout>
      <Card className={classes.card}>
        <CardHeader
          title="Register an Account"
          subheader={
            <Typography className={classes.subheader}>
              Already have an account? <Link href="/login">Sign in</Link>
            </Typography>
          }
        />
        <CardContent>
          <form className={classes.form}>
            <TextField
              value={email}
              label="Email Address"
              id="email"
              variant="outlined"
              required
              onChange={handleChange}
              disabled={isAuthenticating}
            />
            <br />
            <TextField
              value={password}
              label="Password"
              id="password"
              type="password"
              variant="outlined"
              required
              onChange={handleChange}
              disabled={isAuthenticating}
            />
          </form>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <Link href="/">
            <Button disabled={isAuthenticating}>Back</Button>
          </Link>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleRegister}
            disabled={isAuthenticating}
          >
            {isAuthenticating ? <CircularProgress size={25} /> : 'Register'}
          </Button>
        </CardActions>
      </Card>
    </Layout>
  );
};

export default RegisterPage;
