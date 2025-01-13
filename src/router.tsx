import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SpeedIcon from '@mui/icons-material/Speed';
import { createHashRouter, Navigate } from "react-router-dom";

import { AuthGuard } from "./components/authentification/auth-gard";
import { ServicePopover } from "./components/popovers/service-popover";
import { MenuList } from "./components/portal";
import PortalLayout from "./components/portal/portal-layout";
import { LoginPage } from "./pages/authentication/login";
import { LsoEvaluationPage } from "./pages/lso-evaluation/lso-evaluation-page";
import LsoPage from "./pages/lso/lso-page";
import { LSOUpload } from './pages/lso/lso-upload';


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
    title: "Upload Evaluations",
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
            <LSOUpload />
          </AuthGuard>
        )
      }
    ]
  }, {
    path: "/evaluation/:modex",
    element: <LsoEvaluationPage />
  }, {
    path: "/login",
    element: <LoginPage />
  }, {
    path: "*",
    element: (<div>Not found :(</div>),
  },
]);