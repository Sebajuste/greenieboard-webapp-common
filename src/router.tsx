import { createHashRouter } from "react-router-dom";
import { LsoEvaluationPage } from "./pages/lso-evaluation/lso-evaluation-page";
import LsoPage from "./pages/lso/lso-page";
import { Dashboard } from "./pages/dashboard/dasboard";
import { Portal, PortalHeader } from "./components/portal/portal";


export const APP_ROUTER = createHashRouter([
  {
    path: "/",
    element: <LsoPage />
  }, {
    path: "/lso",
    element: <LsoPage />
  }, {
    path: "/lso/new-evaluation",
    element: <LsoEvaluationPage />
  }
]);