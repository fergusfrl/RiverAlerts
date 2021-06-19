import { ReactElement, ChangeEvent } from 'react';
import Link from 'next/link';

import { makeStyles } from '@material-ui/core/styles';
import {
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  Divider,
  MenuItem,
  Select,
} from '@material-ui/core';
import { Gauge } from '../types';

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
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  title: string;
  description: string;
  handleGaugeSelect: (event: ChangeEvent<{ value: unknown }>) => void;
  gaugeId: string | null;
  gauges: Gauge[];
  handleOperationSelect: (event: ChangeEvent<{ value: unknown }>) => void;
  operation: string;
  handleValueChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: number | null;
  handleUnitsSelect: (event: ChangeEvent<{ value: unknown }>) => void;
  units: string;
  email: boolean;
  setEmail: (val: boolean) => void;
  sms: boolean;
  setSms: (val: boolean) => void;
};

const EditAlertForm = ({
  handleChange,
  title,
  description,
  handleGaugeSelect,
  gaugeId,
  gauges,
  handleOperationSelect,
  operation,
  handleValueChange,
  value,
  handleUnitsSelect,
  units,
  email,
  setEmail,
  sms,
  setSms,
}: Props): ReactElement => {
  const classes = useStyles();
  return (
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
            value={gaugeId}
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
            value={operation}
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
            value={value}
            id="value"
            placeholder="20"
            variant="outlined"
            onChange={handleValueChange}
            className={classes.valueInput}
          />
        </div>
        <div className={classes.gridItem}>
          <Select
            value={units}
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
            control={<Checkbox name="email" checked={email} onChange={() => setEmail(!email)} />}
            label="Email"
          />
          <FormControlLabel
            control={<Checkbox name="sms" checked={sms} onChange={() => setSms(!sms)} />}
            label="SMS"
          />
        </div>
      </div>
    </form>
  );
};

export default EditAlertForm;
