import { Button, Card } from "@mui/material";
import { FlexBox } from "../../components/flex-box";
import { useAuth } from "../../contexts/auth-context";
import { DiscordIcon } from "../../icons/DiscordIcon";

export function LoginPage() {

  const auth = useAuth();


  const loginWithDiscord = () => {
    auth.login('', '').catch((err: any) => {
      console.error(err);
    });
  };

  return (
    // @ts-ignore
    <FlexBox
      sx={{
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        height: { sm: "100%" },
      }}
    >
      <Card sx={{ padding: 4, maxWidth: 600, boxShadow: 1 }}>

        {/* @ts-ignore */}
        <FlexBox justifyContent="space-between" flexWrap="wrap" my="1rem">
          <Button
            variant="outlined"
            onClick={loginWithDiscord}
            startIcon={<DiscordIcon sx={{ mr: 1 }} />}
          >
            Sign in with Discord
          </Button >

          {/* @ts-ignore */}
          <label>test %REACT_APP_DISCORD_CLIENTID% -- {process.env.REACT_APP_DISCORD_CLIENTID} -- </label>

        </FlexBox>
      </Card>
    </FlexBox>
  );

}