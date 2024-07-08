import { createHashRouter, Navigate } from "react-router-dom";
import SpeedIcon from '@mui/icons-material/Speed';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { LsoEvaluationPage } from "./pages/lso-evaluation/lso-evaluation-page";
import LsoPage from "./pages/lso/lso-page";
import PortalLayout from "./components/portal/portal-layout";
import { MenuList } from "./components/portal";
import { ServicePopover } from "./components/popovers/service-popover";
import { AuthGuard } from "./components/authentification/auth-gard";
import { LoginPage } from "./pages/authentication/login";


const NAV_BAR_CONTENT = (
  <>
    <ServicePopover />
  </>
);

const MENU_LIST: MenuList = [
  /*{
    title: "Dashboard",
    path: "",
    Icon: DashboardIcon
  },*/ {
    title: "LSO",
    path: "lso",
    Icon: SpeedIcon
  }, {
    title: "Evaluation",
    path: "evaluation-upload",
    Icon: CloudUploadIcon
  }
]

export const APP_ROUTER = createHashRouter([
  {
    path: "/",
    element: <Navigate to="dashboard" />,
  }, {
    path: "/dashboard",
    element: (<PortalLayout menuList={MENU_LIST} navBarContent={NAV_BAR_CONTENT} />),
    children: [
      {
        path: "",
        element: <LsoPage />
      }, {
        path: "lso",
        element: <LsoPage />
      }, {
        path: "evaluation-upload",
        element: (
          <AuthGuard login={<LoginPage />} >
            <LsoEvaluationPage />
          </AuthGuard>
        )
      }
    ]
  }, {
    path: "/evaluation/:modex",
    element: <LsoEvaluationPage />
  }, {
    path: "*",
    element: (<div>Not found :(</div>),
  },
]);