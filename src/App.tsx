import { CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/auth-context';
import { UserInfoProvider } from './contexts/user-context';
import { APP_ROUTER } from './router';
import EvaluationService from './services/evaluation-service';
import { ImplicitGrantParams, OAuth2ImplicitGrant } from './services/oauth2/oauth2-implicit-grant';
import { createService } from './services/service-provider';
import ffsTheme from './themes/2nd-theme';



const OAUTH2_DISCORD: ImplicitGrantParams = {
  clientId: '1259077922929639520',
  // authorizationUrl: `https://discord.com/oauth2/authorize?client_id=1259077922929639520&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000&scope=identify`,
  authorizationUrl: `https://discord.com/oauth2/authorize?response_type=token&client_id=1259077922929639520&scope=identify+guilds+guilds.members.read`,
  redirectPath: 'http://localhost:3000',
  scope: 'identity',
  // tokenResult: (result: any) => result.code,
  popupWidth: 600,
  popupHeight: 800
};


export const EvaluationServiceProvider = createService<EvaluationService>(new EvaluationService());

function App() {

  // App theme
  const theme = ffsTheme();

  // toaster options
  const toasterOptions = {
    style: {
      fontWeight: 500,
      fontFamily: "'Montserrat', sans-serif",
    },
  };

  return (
    <EvaluationServiceProvider.Provider>
      <StyledEngineProvider injectFirst>
        <AuthProvider authHandler={OAuth2ImplicitGrant(OAUTH2_DISCORD)}>
          <UserInfoProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <RouterProvider router={APP_ROUTER} />
              {/* @ts-ignore */}
              <Toaster toastOptions={toasterOptions} />
            </ThemeProvider>
          </UserInfoProvider>
        </AuthProvider>
      </StyledEngineProvider>
    </EvaluationServiceProvider.Provider>
  );

}

export default App;
