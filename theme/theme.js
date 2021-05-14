import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
        main: '#193E60',
        contrastText: '#fff'
    },
    secondary: {
      main: '#E63B66',
      contrastText: '#fff'
    }
  },
});

export default theme;
