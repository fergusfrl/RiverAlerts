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
  TextField,
  Typography,
  CircularProgress,
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

  const handleSignIn = (): void => {
    setIsAuthenticating(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        router.push('/');
        enqueueSnackbar('Welcome Back.', {
          variant: 'success',
        });
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
          title="Sign In"
          subheader={
            <Typography className={classes.subheader}>
              Don&apos;t have an account? <Link href="/register">Create your account</Link>, it
              takes less than a minute.
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
            onClick={handleSignIn}
            disabled={isAuthenticating}
          >
            {isAuthenticating ? <CircularProgress size={25} /> : 'Sign In'}
          </Button>
        </CardActions>
      </Card>
    </Layout>
  );
};

export default RegisterPage;
