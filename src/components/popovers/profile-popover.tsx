import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Avatar, Badge, Box, Button, IconButton } from "@mui/material";
import { Fragment, useRef, useState } from "react";
import { useAuth } from '../../contexts/auth-context';
import { useUserInfo } from '../../contexts/user-context';
import { DiscordIcon } from '../../icons/DiscordIcon';
import PopoverLayout from "./popover-layout";

export function ProfilePopover() {

  const anchorRef = useRef(null);

  const [open, setOpen] = useState(false);

  const auth = useAuth();

  const { username, avatarURL } = useUserInfo();

  const loginWithDiscord = () => {
    auth.login('', '').catch((err: any) => {
      console.error(err);
    });
    setOpen(false);
  };

  return (
    <Fragment>
      <IconButton ref={anchorRef} onClick={() => setOpen(true)}>
        <Badge color="error" badgeContent={0}>

          {auth.isAuthenticated ? (
            <Avatar
              sx={{ width: 30, height: 30 }}
              src={avatarURL ?? ''}
            ></Avatar>
          ) : (
            <AccountCircleIcon />
          )}

        </Badge>
      </IconButton>

      <PopoverLayout
        hiddenViewButton
        popoverOpen={open}
        anchorRef={anchorRef}
        title={username ?? 'Account'}
        popoverClose={() => setOpen(false)}
      >
        {auth.isAuthenticated ? (
          <Box style={{ padding: 2, textAlign: 'center' }}>
            <Button onClick={() => { auth.logout(); setOpen(false) }}>Logout</Button>
          </Box>
        ) : (
          <Box style={{ padding: 2, textAlign: 'center' }}>

            <Button
              variant="outlined"
              onClick={loginWithDiscord}
              startIcon={<DiscordIcon sx={{ mr: 1 }} />}
            >
              Sign in with Discord
            </Button >

          </Box>
        )}
      </PopoverLayout>
    </Fragment>
  );

}