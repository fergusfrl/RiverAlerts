import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import firebase from '../firebaseClient';
import 'firebase/auth';

import { useAuth } from '../auth';
import { Alert, GaugeData } from '../types';
import TimeSeriesGraph from './TimeSeriesGraph';

import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AlertActiveIcon from '@material-ui/icons/NotificationsActive';
import EmailIcon from '@material-ui/icons/Email';

const useStyles = makeStyles((theme) => ({
  alert: {
    width: '100%',
    marginRight: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
  },
  titleWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: theme.spacing(1, 1, 0, 0),
  },
  subtitle: {
    display: 'flex',
    alignItems: 'center',
  },
  subtitleIcon: {
    marginRight: theme.spacing(),
    color: theme.palette.text.secondary,
  },
  description: {
    margin: theme.spacing(1, 0),
  },
  body: {
    marginTop: theme.spacing(1),
    fontSize: '1.1rem',
  },
  highlight: {
    color: theme.palette.secondary.main,
  },
  subheader: {
    marginTop: theme.spacing(4),
  },
  liveData: {
    padding: theme.spacing(2, 0, 4, 0),
  },
  chips: {
    marginTop: theme.spacing(1),
    display: 'flex',
  },
  chip: {
    marginRight: theme.spacing(1),
  },
  titleAlertWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    margin: theme.spacing(3, 0, 6, 0),
  },
  chipLine: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    alignItems: 'center',
    margin: theme.spacing(2, 0),
  },
  active: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    margin: theme.spacing(1, 0, 0, 1),
  },
}));

type Props = {
  alert: Alert | null;
  onDelete: () => void;
};

const getOperationTranslation = (operation: string | undefined): string => {
  if (operation === 'greater-than') return 'Greater Than';
  if (operation === 'less-than') return 'Less Than';
  if (operation === 'equals') return 'Equal To';

  return '';
};

const AlertDisplay = ({ alert, onDelete }: Props): ReactElement => {
  const classes = useStyles();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { user }: { user: firebase.User | null } = useAuth();
  const [liveData, setLiveData] = useState<GaugeData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (alert?.gauge.id) {
      setLiveData(null);
      axios
        .post('https://data.riverguide.co.nz/', {
          action: 'get_flows',
          id: [alert.gauge.id],
        })
        .then((res) => {
          setLiveData(res.data);
        });
    } else {
      setLiveData(null);
    }
  }, [alert?.gauge.id]);

  const flowData = liveData?.flows
    .filter((observation) => !!observation.flow)
    .map(({ flow, time }) => ({ flow, time }));

  const stageHeigthData = liveData?.flows
    .filter((observation) => !!observation.stage_height)
    .map(({ stage_height, time }) => ({ stage_height, time }));

  const handleDelete = (): void => {
    firebase
      .firestore()
      .collection('users')
      .doc(user?.uid)
      .collection('alerts')
      .doc(alert?.id)
      .delete()
      .then(() => {
        setDeleteDialogOpen(false);
        onDelete();
        router.push('/alerts');
        enqueueSnackbar('Successfully deleted alert.', {
          variant: 'success',
        });
      })
      .catch(() => {
        enqueueSnackbar('Something went wrong deleting this alert.', {
          variant: 'error',
        });
      });
  };

  return (
    <div className={classes.alert}>
      {/* HEADER */}
      <div className={classes.titleWrapper}>
        <div className={classes.titleAlertWrapper}>
          <Typography color="primary" variant="h5" className={classes.title}>
            {alert?.name}
          </Typography>
          {alert?.active && (
            <div className={classes.active}>
              <AlertActiveIcon color="secondary" />
              <Typography color="secondary">Active</Typography>
            </div>
          )}
        </div>

        <div>
          <Tooltip title="Edit Alert">
            <IconButton
              onClick={() => {
                router.push(`/alerts/edit/${alert?.id}`);
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Alert">
            <IconButton
              onClick={() => {
                setDeleteDialogOpen(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className={classes.subtitle}>
        <Typography variant="subtitle1" color="textSecondary">
          {alert?.description}
        </Typography>
      </div>
      {/* CONTENT */}
      <div className={classes.content}>
        <div className={classes.chipLine}>
          <Typography>Trigger alert when</Typography>
          <Chip label={<strong>{alert?.gauge.name}</strong>} />
          <Typography>is</Typography>
          <Chip label={<strong>{getOperationTranslation(alert?.threshold.operation)}</strong>} />
          <Chip label={<strong>{`${alert?.threshold.value} ${alert?.threshold.units}`}</strong>} />
        </div>
        <div className={classes.chipLine}>
          <Typography>Recipients:</Typography>
          {alert?.contactPreference.includeEmail && (
            <Tooltip title="email">
              <Chip label={alert?.contactPreference.email} icon={<EmailIcon fontSize="small" />} />
            </Tooltip>
          )}
          {/* TODO: include SMS */}
        </div>
      </div>

      {/* GRAPHS */}
      <div className={classes.liveData}>
        {flowData && flowData.length > 0 && (
          <TimeSeriesGraph
            data={flowData}
            units="cumecs"
            gaugeSource={alert?.gauge.data_source}
            alertName={alert?.name}
            alertThreshold={
              alert?.threshold.units === 'Cumecs' ? alert?.threshold.value : undefined
            }
          />
        )}
        {stageHeigthData && stageHeigthData.length > 0 && (
          <TimeSeriesGraph
            data={stageHeigthData}
            units="metres"
            gaugeSource={alert?.gauge.data_source}
            alertName={alert?.name}
            alertThreshold={
              alert?.threshold.units === 'Metres' ? alert?.threshold.value : undefined
            }
          />
        )}
      </div>
      <Dialog open={deleteDialogOpen}>
        <DialogTitle>Delete Alert</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this alert? This action is not reversable.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleDelete}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AlertDisplay;
