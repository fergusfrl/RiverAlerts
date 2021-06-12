import { useEffect, ReactElement } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AuthProvider } from '../auth';

import theme from '../theme/theme';

function MyApp({ Component, pageProps }: any): ReactElement {
  useEffect(() => {
    const jssStyles: any = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <Component {...pageProps} />
        </SnackbarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;
