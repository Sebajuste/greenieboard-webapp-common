import { Box, ButtonBase, Divider, Popover } from "@mui/material";
import React, { FC } from "react";

// component props interface
interface PopoverLayoutProps {
  title: string | JSX.Element;
  hiddenViewButton?: boolean;
  popoverOpen: boolean;
  popoverClose: () => void;
  children: React.ReactNode;
  handleButton?: () => void;
  anchorRef: React.MutableRefObject<null>;
  minWidth?: number | string;
  maxWidth?: number | string;
}

const PopoverLayout: FC<PopoverLayoutProps> = (props) => {
  const {
    children,
    popoverClose,
    popoverOpen,
    anchorRef,
    title,
    hiddenViewButton,
    minWidth,
    maxWidth,
  } = props;
  return (
    <Popover
      open={popoverOpen}
      onClose={popoverClose}
      anchorEl={anchorRef.current}
      anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      PaperProps={{
        sx: {
          minWidth: minWidth || 250,
          maxWidth: maxWidth || 350,
          width: "100%",
          padding: "0.5rem 0",
        },
      }}
    >
      <h4 style={{ fontWeight: 700, padding: '1em', margin: 0 }} >
        {title || "Notifications"}
      </h4>
      <Divider />

      {children}

      {!hiddenViewButton && (
        <Box p={2}>
          <ButtonBase
            disableRipple
            sx={{
              margin: "auto",
              display: "block",
              color: "primary.main",
            }}
          >
            View all Notifications
          </ButtonBase>
        </Box>
      )}
    </Popover>
  );
};

export default PopoverLayout;
