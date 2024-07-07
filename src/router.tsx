import { createHashRouter, Navigate } from "react-router-dom";

import { LsoEvaluationPage } from "./pages/lso-evaluation/lso-evaluation-page";
import LsoPage from "./pages/lso/lso-page";
import PortalLayout from "./components/portal/portal-layout";
import { Dashboard } from "./pages/dashboard/dasboard";
import { MenuList } from "./components/portal";

import SpeedIcon from '@mui/icons-material/Speed';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Box } from "@mui/material";
import { ServicePopover } from "./components/popovers/service-popover";


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
      }
    ]
  }, {
    path: "/lso",
    element: <LsoPage />
  }, {
    path: "/evaluation/:modex",
    element: <LsoEvaluationPage />
  },
  {
    path: "*",
    element: (<div>Not found :(</div>),
  },
]);