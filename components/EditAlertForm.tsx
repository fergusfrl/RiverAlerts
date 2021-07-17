import { ReactElement, ChangeEvent } from 'react';

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
    marginBottom: theme.spacing(2),
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
    marginBottom: theme.spacing(1),
  },
  buttonGroup: {
    marginTop: theme.spacing(2),
    float: 'right',
  },
  primaryButton: {
    marginLeft: theme.spacing(),
  },
  alertSelection: {
    marginTop: theme.spacing(2),
  },
  input: {
    marginBottom: theme.spacing(2),
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
  handleEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
  email: string;
  setIncludeEmail: (includeEmail: boolean) => void;
  includeEmail: boolean;
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
  handleEmailChange,
  includeEmail,
  setIncludeEmail,
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
        className={classes.input}
      />
      <TextField
        variant="outlined"
        label="Description"
        id="description"
        multiline
        rows={3}
        onChange={handleChange}
        value={description}
        className={classes.input}
      />
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
      <Divider />
      <div className={classes.alertSelection}>
        <Typography variant="body1" color="primary" className={classes.contactInfoLabel}>
          Alert me by:
        </Typography>
        <div className={classes.contactInfo}>
          <FormControlLabel
            control={
              <Checkbox
                name="email"
                checked={includeEmail}
                onChange={() => setIncludeEmail(!includeEmail)}
              />
            }
            label="Email"
          />
          <TextField
            size="small"
            disabled={!includeEmail}
            variant="outlined"
            label="Email address"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
      </div>
    </form>
  );
};

export default EditAlertForm;
