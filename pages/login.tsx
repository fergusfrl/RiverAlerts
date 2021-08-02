import { useState, ReactElement, ChangeEvent, MouseEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import firebase from '../firebaseClient';
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
    display: 'flex',
    justifyContent: 'space-between',
  },
  primaryButton: {
    marginLeft: theme.spacing(),
  },
  emailInput: {
    marginBottom: theme.spacing(2),
  },
}));

const RegisterPage = (): ReactElement => {
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

  const handleSignIn = (event: MouseEvent): void => {
    event.preventDefault();
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
    <Layout title="Login">
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
          <form className={classes.form} id="login-form">
            <TextField
              value={email}
              label="Email Address"
              id="email"
              variant="outlined"
              required
              onChange={handleChange}
              disabled={isAuthenticating}
              className={classes.emailInput}
            />
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
          <Typography className={classes.subheader}>
            <Link href="/forgot-password">Forgot your password?</Link>
          </Typography>

          <div>
            <Link href="/">
              <Button disabled={isAuthenticating}>Back</Button>
            </Link>
            <Button
              form="login-form"
              type="submit"
              variant="contained"
              color="secondary"
              onClick={handleSignIn}
              disabled={isAuthenticating}
              className={classes.primaryButton}
            >
              {isAuthenticating ? <CircularProgress size={25} /> : 'Sign In'}
            </Button>
          </div>
        </CardActions>
      </Card>
    </Layout>
  );
};

export default RegisterPage;
