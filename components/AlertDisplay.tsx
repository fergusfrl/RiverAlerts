import { ReactElement } from 'react';

import { Alert } from '../types';

import { makeStyles } from '@material-ui/core/styles';
import { Typography, Divider, IconButton, Tooltip } from '@material-ui/core';
import PlaceOutlinedIcon from '@material-ui/icons/PlaceOutlined';
import EditIcon from '@material-ui/icons/Edit';

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
  },
  title: {
    marginTop: theme.spacing(),
  },
  subtitle: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(1, 0),
  },
  subtitleIcon: {
    marginRight: theme.spacing(),
    color: theme.palette.text.secondary,
  },
  description: {
    marginTop: theme.spacing(2),
  },
  body: {
    marginTop: theme.spacing(1),
    fontSize: '1.3rem',
  },
  highlight: {
    color: theme.palette.secondary.main,
  },
}));

type Props = {
  alert: Alert | undefined;
};

const getOperationTranslation = (operation: string | undefined): string => {
  if (operation === 'greater-than') return 'greater than';
  if (operation === 'less-than') return 'less than';
  if (operation === 'equals') return 'equals';

  return '';
};

const AlertDisplay = ({ alert }: Props): ReactElement => {
  const classes = useStyles();

  return (
    <div className={classes.alert}>
      <div className={classes.titleWrapper}>
        <Typography color="primary" variant="h5" className={classes.title}>
          {alert?.name}
        </Typography>
        <Tooltip title="Edit Alert">
          <IconButton>
            <EditIcon />
          </IconButton>
        </Tooltip>
      </div>
      <div className={classes.subtitle}>
        <PlaceOutlinedIcon fontSize="small" className={classes.subtitleIcon} />
        <Typography variant="subtitle1" color="textSecondary">
          {`${alert?.gauge.name}, ${alert?.gauge.river_name}`}
        </Typography>
      </div>
      <Divider />
      <Typography variant="body1" className={classes.description}>
        {alert?.description}
      </Typography>
      <Typography variant="body1" className={classes.body}>
        Send me an alert when <span className={classes.highlight}>{alert?.gauge.name}</span> is{' '}
        <span className={classes.highlight}>
          {getOperationTranslation(alert?.threshold.operation)}{' '}
          <strong>
            {alert?.threshold.value} {alert?.threshold.units}
          </strong>
        </span>
      </Typography>
    </div>
  );
};

export default AlertDisplay;
