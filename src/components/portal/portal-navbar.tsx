import { Box, useMediaQuery, Theme, styled, AppBar, Toolbar } from "@mui/material";
import { useContext } from "react";
import { TitleContext } from "./contexts/portal-context";
import { Label } from "@mui/icons-material";

// custom styled components
const DashboardNavbarRoot = styled(AppBar)(() => ({
  zIndex: 11,
  boxShadow: "none",
  paddingTop: "1rem",
  paddingBottom: "1rem",
  backdropFilter: "blur(6px)",
  backgroundColor: "transparent",
}));

const StyledToolBar = styled(Toolbar)(() => ({
  "@media (min-width: 0px)": {
    paddingLeft: 0,
    paddingRight: 0,
    minHeight: "auto",
  },
}));

const ToggleIcon = styled(Box)(({ theme }) => ({
  width: 25,
  height: 3,
  margin: "5px",
  borderRadius: "10px",
  transition: "width 0.3s",
  backgroundColor: theme.palette.primary.main,
}));

const StyledH2 = styled(Box)(({ theme }) => ({
  fontSize: 21,
  lineHeight: 0,
  mx: 1,
  fontWeight: "700",
  color: theme.palette.text.primary,
}));

/*
<h2
          fontSize={21}
          lineHeight={0}
          mx={1}
          fontWeight="700"
          color="text.primary"
        >
          {title}
        </h2>
*/

export function PortalNavbar({ onToggleShowSideBar, children }: { onToggleShowSideBar?: () => void, children?: any }) {

  const { title } = useContext(TitleContext);

  const upSm = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"));
  const downSm = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  const downMd = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

  console.log('title: ', title);

  if (downSm) {
    return (
      <DashboardNavbarRoot position="sticky">
        <StyledToolBar>

          <Box sx={{ cursor: "pointer" }} onClick={(e) => { if (onToggleShowSideBar) onToggleShowSideBar() }} >
            <ToggleIcon />
            <ToggleIcon />
            <ToggleIcon />
          </Box>


          <Box flexGrow={1} textAlign="center">
            <img
              src="/logo.png"
              width="30"
              height="30"
              alt="Logo"
            />
          </Box>

          {children}

          {/* 
          <LanguagePopover />
          <ProfilePopover />
          */}
        </StyledToolBar>
      </DashboardNavbarRoot>
    );
  }

  return (
    <DashboardNavbarRoot position="sticky">
      <StyledToolBar>

        {downMd ? (
          <Box sx={{ cursor: "pointer" }} onClick={(e) => { if (onToggleShowSideBar) onToggleShowSideBar() }}>
            <ToggleIcon />
            <ToggleIcon />
            <ToggleIcon />
          </Box>
        ) : null}


        <StyledH2>
          {title}
        </StyledH2>

        <Box flexGrow={1} ml={1} />

        {children}
        {/*upSm && (
          <>
            <LanguagePopover />
            <NotificationsPopover />
            <ServicePopover />
          </>
        )*/}
        { /*<ProfilePopover /> */}
      </StyledToolBar>
    </DashboardNavbarRoot>
  );

}