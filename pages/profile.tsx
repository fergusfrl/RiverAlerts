import { ChangeEvent, MouseEvent, ReactElement, useState } from 'react';
import { useRouter } from 'next/router';
import { verifyIdToken, getUser } from '../firebaseAuth';
import { GetServerSideProps } from 'next';
import { useSnackbar } from 'notistack';
import nookies from 'nookies';
import firebaseClient from '../firebaseClient';
import firebase from 'firebase/app';
import 'firebase/auth';

import Layout from '../components/Layout';
import { User } from '../types';

import { makeStyles } from '@material-ui/core/styles';
import { Button, CircularProgress, Divider, Typography, TextField } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2.5),
    maxWidth: 600,
    height: '93vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: theme.spacing(1),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  name: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: theme.spacing(2, 0),
  },
  nameField: {
    width: '48%',
  },
  buttonGroup: {
    float: 'right',
  },
  primaryButton: {
    marginLeft: theme.spacing(),
  },
  logoutButton: {
    maxWidth: 100,
  },
  emailInput: {
    marginBottom: theme.spacing(2),
  },
}));

type Props = {
  session: {
    uid: string;
    email: string | undefined;
  } | null;
  user: User | null;
};

const ProfilePage = ({ user, session }: Props): ReactElement => {
  const router = useRouter();
  if (!session) {
    router.push('/');
  }

  firebaseClient();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [firstName, setFirstName] = useState(user?.name.first || '');
  const [lastName, setLastName] = useState(user?.name.last || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleLogout = (): void => {
    setIsLoggingOut(true);
    firebase
      .auth()
      .signOut()
      .then(() => {
        router.push('/');
      })
      .finally(() => {
        setIsLoggingOut(false);
      });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setIsDirty(true);
    const { id, value } = event.target;
    if (id === 'firstName') setFirstName(value);
    if (id === 'lastName') setLastName(value);
    if (id === 'email') setEmail(value);
  };

  const handleUpdate = (event: MouseEvent): void => {
    event.preventDefault();
    if (session) {
      firebase
        .firestore()
        .collection('/users')
        .doc(session.uid)
        .set({
          name: {
            first: firstName,
            last: lastName,
          },
          email,
        })
        .then(() => {
          enqueueSnackbar('Successfully updated information', {
            variant: 'success',
          });
          setIsDirty(false);
        })
        .catch((err) => {
          enqueueSnackbar(err.message, {
            variant: 'error',
          });
        });
    } else {
      router.push('/');
    }
  };

  const handleClear = (): void => {
    if (!user) return;
    setFirstName(user?.name.first);
    setLastName(user?.name.last);
    setEmail(user.email);
    setIsDirty(false);
  };

  return (
    <Layout title="Profile">
      <div className={classes.container}>
        <div>
          <Typography variant="h5" className={classes.header}>
            Personal Information
          </Typography>
          <Divider />
          <form className={classes.form} id="user-info">
            <div className={classes.name}>
              <TextField
                variant="outlined"
                label="First Name"
                id="firstName"
                onChange={handleChange}
                value={firstName}
                className={classes.nameField}
              />
              <TextField
                variant="outlined"
                label="Last Name"
                id="lastName"
                onChange={handleChange}
                value={lastName}
                className={classes.nameField}
              />
            </div>
            <TextField
              variant="outlined"
              label="Email"
              id="email"
              onChange={handleChange}
              value={email}
              className={classes.emailInput}
            />
          </form>
          <div className={classes.buttonGroup}>
            <Button disabled={!isDirty} onClick={handleClear}>
              Clear Changes
            </Button>
            <Button
              disabled={!isDirty}
              variant="outlined"
              color="secondary"
              onClick={handleUpdate}
              form="user-info"
              type="submit"
              className={classes.primaryButton}
            >
              Update Info
            </Button>
          </div>
        </div>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={classes.logoutButton}
        >
          {isLoggingOut ? <CircularProgress size={25} /> : 'Logout'}
        </Button>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context
): Promise<{ props: Props }> => {
  try {
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { uid, email } = token;

    const user = await getUser(uid);

    return {
      props: {
        session: { uid, email },
        user: user || null,
      },
    };
  } catch (err) {
    context.res.writeHead(302, { location: '/login' });
    context.res.end();
    return {
      props: {
        session: null,
        user: null,
      },
    };
  }
};

export default ProfilePage;
