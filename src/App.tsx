import React from 'react';
import logo from './logo.svg';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import { APP_ROUTER } from './router';
import EvaluationService from './services/evaluation-service';
import { createService } from './services/service-provider';



export const EvaluationServiceProvider = createService<EvaluationService>(new EvaluationService());

function App() {

  return (
    <div className="App">
      <EvaluationServiceProvider.Provider>
        <RouterProvider router={APP_ROUTER} />
      </EvaluationServiceProvider.Provider>
    </div>
  );

}

export default App;
