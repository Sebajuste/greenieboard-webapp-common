import React from 'react';
import logo from './logo.svg';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import { APP_ROUTER } from './router';
import EvaluationService from './services/evaluation-service';
import { createService } from './services/service-provider';
import { CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material';
import ffsTheme from './themes/2nd-theme';
import { Toaster } from 'react-hot-toast';



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
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={APP_ROUTER} />
          <Toaster toastOptions={toasterOptions} />
        </ThemeProvider>
      </StyledEngineProvider>
    </EvaluationServiceProvider.Provider>
  );

}

export default App;
