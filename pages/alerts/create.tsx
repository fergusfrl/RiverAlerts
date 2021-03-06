import { ChangeEvent, MouseEvent, ReactElement, useState } from 'react';
import axios from 'axios';
import { verifyIdToken } from '../../firebaseAuth';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import nookies from 'nookies';
import firebase from '../../firebaseClient';
import 'firebase/auth';

import Layout from '../../components/Layout';

import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography, Divider } from '@material-ui/core';
import { useEffect } from 'react';
import { Gauge } from '../../types';
import EditAlertForm from '../../components/EditAlertForm';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2.5),
    maxWidth: 600,
  },
  header: {
    marginBottom: theme.spacing(1),
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
  session: { uid: string; email: string } | null;
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
  const [includeEmail, setIncludeEmail] = useState(true);

  const {
    query: { gaugeId },
  } = router;

  useEffect(() => {
    axios
      .post('https://data.riverguide.co.nz/', {
        action: 'get_features',
        crossDomain: true,
        filters: ['flow', 'stage_height'],
      })
      .then((res) => {
        const orderedGauges: Gauge[] = res.data.features.sort((a: Gauge, b: Gauge) => {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
          return 0;
        });
        setGauges(orderedGauges);

        if (gaugeId) {
          setSelectedGauge(orderedGauges.find((gauge) => gauge.id === gaugeId) || null);
        }
      })
      .catch(() => {
        enqueueSnackbar('Could not get gauges', {
          variant: 'error',
        });
      });
  }, [enqueueSnackbar, gaugeId]);

  const formIsValid = (): boolean => {
    return title !== '' && selectedGauge != null && value != null && includeEmail;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    if (event.target.id === 'title') setTitle(value);
    if (event.target.id === 'description') setDescription(value);
  };

  const handleGaugeSelect = (_: ChangeEvent<unknown>, value: Gauge | null): void => {
    setSelectedGauge(value);
  };

  const handleOperationSelect = (event: ChangeEvent<{ value: unknown }>): void => {
    if (typeof event.target.value === 'string') setOperation(event.target.value);
  };

  const handleUnitsSelect = (event: ChangeEvent<{ value: unknown }>): void => {
    if (typeof event.target.value === 'string') setUnits(event.target.value);
  };

  const handleValueChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const val = parseFloat(event.target.value) || null;
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
        .add({
          name: title,
          description: description,
          gauge: selectedGauge,
          threshold: {
            operation,
            value,
            units,
          },
          contactPreference: {
            email: session.email,
            includeEmail,
          },
        })
        .then((docRef) => {
          router.push(`/alerts/${docRef.id}`);
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
        <EditAlertForm
          handleChange={handleChange}
          title={title}
          description={description}
          handleGaugeSelect={handleGaugeSelect}
          gaugeId={selectedGauge?.id || (gaugeId as string) || null}
          gauges={gauges}
          handleOperationSelect={handleOperationSelect}
          operation={operation}
          handleUnitsSelect={handleUnitsSelect}
          units={units}
          handleValueChange={handleValueChange}
          value={value}
          email={session?.email || ''}
          includeEmail={includeEmail}
          setIncludeEmail={setIncludeEmail}
        />
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
            disabled={!formIsValid()}
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
    const { uid, email } = token;

    return { props: { session: { uid, email } } };
  } catch (err) {
    context.res.writeHead(302, { location: '/login' });
    context.res.end();
    return { props: { session: null, email: null } };
  }
};

export default CreateAlert;
