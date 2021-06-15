import { ChangeEvent, MouseEvent, ReactElement, useState } from 'react';
import axios from 'axios';
import { verifyIdToken } from '../../firebaseAuth';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSnackbar } from 'notistack';
import nookies from 'nookies';
import firebaseClient from '../../firebaseClient';
import firebase from 'firebase/app';
import 'firebase/auth';

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
import { useEffect } from 'react';
import { Gauge } from '../../types';

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

type Props = {
  session: { uid: string } | null;
};

const CreateAlert = ({ session }: Props): ReactElement => {
  const classes = useStyles();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [gauges, setGauges] = useState<Gauge[]>([]);
  const [selectedGauge, setSelectedGauge] = useState<Gauge | null>(null);
  const [operation, setOperation] = useState('greater-than');
  const [value, setValue] = useState<number | null>(null);
  const [units, setUnits] = useState('Cumecs');
  const [email, setEmail] = useState(false);
  const [sms, setSms] = useState(false);

  firebaseClient();

  useEffect(() => {
    axios
      .post('https://data.riverguide.co.nz/', {
        action: 'get_features',
        crossDomain: true,
        filters: ['flow', 'stage_height'],
      })
      .then((res) => {
        const orderedGauges = res.data.features.sort((a: Gauge, b: Gauge) => {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
          return 0;
        });
        setGauges(orderedGauges);
      })
      .catch(() => {
        enqueueSnackbar('Could not get gauges', {
          variant: 'error',
        });
      });
  }, [enqueueSnackbar]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    if (event.target.id === 'title') setTitle(value);
    if (event.target.id === 'description') setDescription(value);
  };

  const handleGaugeSelect = (event: ChangeEvent<{ value: unknown }>): void => {
    const gauge = gauges.find((gauge) => gauge.id === event.target.value) || null;
    setSelectedGauge(gauge);
  };

  const handleOperationSelect = (event: ChangeEvent<{ value: unknown }>): void => {
    if (typeof event.target.value === 'string') setOperation(event.target.value);
  };

  const handleUnitsSelect = (event: ChangeEvent<{ value: unknown }>): void => {
    if (typeof event.target.value === 'string') setUnits(event.target.value);
  };

  const handleValueChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const val = parseInt(event.target.value, 10) || null;
    setValue(val);
  };

  const handleCreate = (event: MouseEvent): void => {
    event.preventDefault();
    if (session) {
      firebase
        .firestore()
        .collection('users')
        .doc(session.uid)
        .collection('alerts')
        .doc()
        .set({
          name: title,
          description: description,
          gauge: selectedGauge,
          threshold: {
            operation,
            value,
            units,
          },
          contactPreference: {
            email,
            sms,
          },
        })
        .then(() => {
          router.push('/alerts');
        })
        .catch(() => {
          enqueueSnackbar('Something went wrong.', {
            variant: 'error',
          });
        });
    }
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
          <div className={classes.threshold}>
            <div className={classes.gridItem}>
              <Typography variant="body1" color="primary" style={{ whiteSpace: 'nowrap' }}>
                Send me an Alert when
              </Typography>
            </div>
            <div className={classes.gridItem}>
              <Select
                defaultValue={0}
                variant="outlined"
                className={classes.inlineSelect}
                placeholder="Gauge name"
                onChange={handleGaugeSelect}
              >
                {gauges.map((gauge) => (
                  <MenuItem key={gauge.id} value={gauge.id}>
                    {gauge.name}
                  </MenuItem>
                ))}
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
                onChange={handleOperationSelect}
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
                onChange={handleValueChange}
                className={classes.valueInput}
              />
            </div>
            <div className={classes.gridItem}>
              <Select
                defaultValue="Cumecs"
                variant="outlined"
                className={classes.inlineSelect}
                onChange={handleUnitsSelect}
              >
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
              <FormControlLabel
                control={
                  <Checkbox name="email" checked={email} onChange={() => setEmail(!email)} />
                }
                label="Email"
              />
              <FormControlLabel
                control={<Checkbox name="sms" checked={sms} onChange={() => setSms(!sms)} />}
                label="SMS"
              />
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
            onClick={handleCreate}
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
