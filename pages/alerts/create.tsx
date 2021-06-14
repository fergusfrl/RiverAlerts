import { ChangeEvent, ReactElement, useState } from 'react';
import { verifyIdToken } from '../../firebaseAuth';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import nookies from 'nookies';

import Layout from '../../components/Layout';

import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  Divider,
  MenuItem,
  Select,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2.5),
    maxWidth: 600,
  },
  header: {
    marginBottom: theme.spacing(1),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(2),
  },
  threshold: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  valueInput: {
    width: theme.spacing(10),
  },
  inlineSelect: {
    margin: theme.spacing(0, 2),
  },
  gridItem: {
    marginBottom: theme.spacing(2),
  },
  contactInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  contactInfoLabel: {
    marginRight: theme.spacing(2),
  },
  buttonGroup: {
    marginTop: theme.spacing(2),
    float: 'right',
  },
  primaryButton: {
    marginLeft: theme.spacing(),
  },
}));

const CreateAlert = (): ReactElement => {
  const classes = useStyles();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    if (event.target.id === 'title') setTitle(value);
    if (event.target.id === 'description') setDescription(value);
  };

  return (
    <Layout title="Create Alert">
      <div className={classes.container}>
        <Typography variant="h5" className={classes.header}>
          Create Alert
        </Typography>
        <Divider />
        <form className={classes.form} id="create-alert">
          <TextField
            variant="outlined"
            label="Title"
            id="title"
            onChange={handleChange}
            value={title}
          />
          <br />
          <TextField
            variant="outlined"
            label="Description"
            id="description"
            multiline
            rows={3}
            onChange={handleChange}
            value={description}
          />
          <br />
          {/* <Divider /> */}
          {/* <br /> */}
          {/* <FormLabel component="legend">Alert Condition</FormLabel> */}
          <div className={classes.threshold}>
            <div className={classes.gridItem}>
              <Typography variant="body1" color="primary" style={{ whiteSpace: 'nowrap' }}>
                Send me an Alert when
              </Typography>
            </div>
            <div className={classes.gridItem}>
              <Select defaultValue={0} variant="outlined" className={classes.inlineSelect}>
                <MenuItem value={0}>Taieri at Outram</MenuItem>
                <MenuItem value={1}>Taieri at Sutton</MenuItem>
                <MenuItem value={2}>Taieri at Mouth</MenuItem>
              </Select>
            </div>
            <div className={classes.gridItem}>
              <Typography variant="body1" color="primary">
                Is
              </Typography>
            </div>
            <div className={classes.gridItem}>
              <Select
                defaultValue="greater-than"
                variant="outlined"
                className={classes.inlineSelect}
              >
                <MenuItem value={'greater-than'}>Greater Than</MenuItem>
                <MenuItem value={'less-than'}>Less Than</MenuItem>
                <MenuItem value={'equals'}>Equal To</MenuItem>
              </Select>
            </div>
            <div className={classes.gridItem}>
              <TextField
                id="value"
                placeholder="20"
                variant="outlined"
                className={classes.valueInput}
              />
            </div>
            <div className={classes.gridItem}>
              <Select defaultValue="Cumecs" variant="outlined" className={classes.inlineSelect}>
                <MenuItem value={'Cumecs'}>Cumecs</MenuItem>
                <MenuItem value={'Meters'}>Meters</MenuItem>
              </Select>
            </div>
          </div>
          <br />
          <Divider />
          <br />
          <div>
            <Typography variant="caption">
              Email address and contact phone number can be configured in your{' '}
              <Link href="/profile">user profile</Link>
            </Typography>
            <div className={classes.contactInfo}>
              <Typography variant="body1" color="primary" className={classes.contactInfoLabel}>
                Alert me by:
              </Typography>
              <FormControlLabel control={<Checkbox name="email" />} label="Email" />
              <FormControlLabel control={<Checkbox name="sms" />} label="SMS" />
            </div>
          </div>
        </form>
        <div className={classes.buttonGroup}>
          <Button
            onClick={() => {
              router.push('/alerts');
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            form="create-alert"
            type="submit"
            className={classes.primaryButton}
          >
            Create Alert
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { uid } = token;

    return { props: { session: { uid } } };
  } catch (err) {
    context.res.writeHead(302, { location: '/login' });
    context.res.end();
    return { props: { session: null } };
  }
};

export default CreateAlert;
