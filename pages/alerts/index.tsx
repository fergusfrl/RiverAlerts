import { ReactElement } from 'react';

import Layout from '../../components/Layout';
import AlertLayout from '../../components/AlertLayout';

import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/NotificationsNone';

const useStyles = makeStyles((theme) => ({
  container: {
    marginLeft: theme.spacing(48),
    height: '100%',
    display: 'flex',
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    margin: theme.spacing(0, 'auto'),
    color: 'grey',
    paddingRight: theme.spacing(4),
  },
}));

const AlertsPage = (): ReactElement => {
  const classes = useStyles();
  return (
    <Layout title="Alerts">
      <AlertLayout>
        <div className={classes.container}>
          <div className={classes.center}>
            <NotificationsIcon />
            <Typography>Select an alert to view</Typography>
          </div>
        </div>
      </AlertLayout>
    </Layout>
  );
};

export default AlertsPage;
