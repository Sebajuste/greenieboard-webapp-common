import { Fragment, useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, styled } from "@mui/material";
import { MenuList, PortalSidebar } from "./portal-sidebar";
import { PortalNavbar } from "./portal-navbar";
import TitleContextProvider from "./contexts/portal-context";


const Wrapper = styled(Box)(({ theme }) => ({
  width: `calc(100% - 80px)`,
  maxWidth: 1200,
  margin: "auto",
  paddingLeft: 80,
  [theme.breakpoints.down("md")]: {
    width: "100%",
    marginLeft: 0,
    paddingLeft: "2rem",
    paddingRight: "2rem",
  },
}));

export default function PortalLayout({ menuList = [], navBarContent, children }: { menuList?: MenuList, navBarContent?: any, children?: any }) {

  const [showSideBar, setShowSideBar] = useState(false);

  return (
    <Fragment>
      <TitleContextProvider>
        <PortalSidebar
          menuList={menuList}
          showSideBar={showSideBar}
          closeSideBar={() => setShowSideBar(false)}
        />
        <Wrapper>
          <PortalNavbar onToggleShowSideBar={() => setShowSideBar((oldState) => !oldState)}>
            {navBarContent}
          </PortalNavbar>
          {children || <Outlet />}
        </Wrapper>
      </TitleContextProvider>
    </Fragment>
  );

}
