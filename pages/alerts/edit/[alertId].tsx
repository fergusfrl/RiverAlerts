import { ChangeEvent, MouseEvent, ReactElement, useState } from 'react';
import axios from 'axios';
import { getUserAlert, verifyIdToken } from '../../../firebaseAuth';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import nookies from 'nookies';
import firebase from '../../../firebaseClient';
import 'firebase/auth';

import Layout from '../../../components/Layout';

import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography, Divider } from '@material-ui/core';
import { useEffect } from 'react';
import { Alert, Gauge } from '../../../types';
import EditAlertForm from '../../../components/EditAlertForm';

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
  alert: Alert | null;
  session: {
    uid: string;
    email: string;
  } | null;
};

const EditAlert = ({ session, alert }: Props): ReactElement => {
  const classes = useStyles();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [title, setTitle] = useState(alert?.name || '');
  const [description, setDescription] = useState(alert?.description || '');
  const [gauges, setGauges] = useState<Gauge[]>([]);
  const [selectedGauge, setSelectedGauge] = useState<Gauge | null>(alert?.gauge || null);
  const [operation, setOperation] = useState(alert?.threshold?.operation || 'greater-than');
  const [value, setValue] = useState<number | null>(alert?.threshold?.value || null);
  const [units, setUnits] = useState(alert?.threshold?.units || 'Cumecs');
  const [includeEmail, setIncludeEmail] = useState(alert?.contactPreference?.includeEmail || false);

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

  const handleOperationSelect = (event: ChangeEvent<{ value: any }>): void => {
    const opVal = event.target.value;
    if (
      typeof opVal === 'string' &&
      (opVal === 'greater-than' || opVal === 'less-than' || opVal === 'equals')
    ) {
      setOperation(event.target.value);
    }
  };

  const handleUnitsSelect = (event: ChangeEvent<{ value: unknown }>): void => {
    if (typeof event.target.value === 'string') setUnits(event.target.value);
  };

  const handleValueChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const val = parseFloat(event.target.value) || null;
    setValue(val);
  };

  const handleEdit = (event: MouseEvent): void => {
    event.preventDefault();
    if (session && alert) {
      firebase
        .firestore()
        .collection('users')
        .doc(session.uid)
        .collection('alerts')
        .doc(alert.id)
        .update({
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
        .then(() => {
          router.push(`/alerts/${alert.id}`);
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar('Something went wrong.', {
            variant: 'error',
          });
        });
    }
  };

  return (
    <Layout title="Edit Alert">
      <div className={classes.container}>
        <Typography variant="h5" className={classes.header}>
          Edit Alert
        </Typography>
        <Divider />
        <EditAlertForm
          handleChange={handleChange}
          title={title}
          description={description}
          handleGaugeSelect={handleGaugeSelect}
          gaugeId={selectedGauge?.id || null}
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
            form="edit-alert"
            type="submit"
            className={classes.primaryButton}
            onClick={handleEdit}
            disabled={!formIsValid()}
          >
            Edit Alert
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const alertId = context.params?.alertId;
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { uid, email } = token;

    if (typeof alertId === 'string') {
      const alert = await getUserAlert(uid, alertId);
      return {
        props: { alert, session: { uid, email } },
      };
    }

    return { props: { alert: null, session: null } };
  } catch (err) {
    console.log(err);
    context.res.writeHead(302, { location: '/login' });
    context.res.end();
    return { props: { alert: null, session: null } };
  }
};

export default EditAlert;
