import { useState, ReactElement, ChangeEvent, MouseEvent } from 'react';
import Link from 'next/link';
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

const ForgotPassword = (): ReactElement => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  const handleForgotPassword = (event: MouseEvent): void => {
    event.preventDefault();
    setIsSending(true);
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        enqueueSnackbar('Password reset email send.', {
          variant: 'success',
        });
      })
      .catch((err) => {
        enqueueSnackbar(err.message, {
          variant: 'error',
        });
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <Layout title="Forgot Password">
      <Card className={classes.card}>
        <CardHeader
          title="Forgot Password?"
          subheader={
            <Typography className={classes.subheader}>
              Enter your email below and we will help you reset your password
            </Typography>
          }
        />
        <CardContent>
          <form className={classes.form} id="forgot-password-form">
            <TextField
              value={email}
              label="Email Address"
              id="email"
              variant="outlined"
              required
              onChange={handleChange}
              disabled={isSending}
            />
          </form>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <Link href="/">
            <Button disabled={isSending}>Back</Button>
          </Link>
          <Button
            form="forgot-password-form"
            type="submit"
            variant="contained"
            color="secondary"
            onClick={handleForgotPassword}
            disabled={isSending}
          >
            {isSending ? <CircularProgress size={25} /> : 'Reset Password'}
          </Button>
        </CardActions>
      </Card>
    </Layout>
  );
};

export default ForgotPassword;
