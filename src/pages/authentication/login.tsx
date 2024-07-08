import { Button, Card } from "@mui/material";
import { FlexBox } from "../../components/flex-box";
import { DiscordIcon } from "../../icons/DiscordIcon";

export function LoginPage() {

  return (
    <FlexBox
      sx={{
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        height: { sm: "100%" },
      }}
    >
      <Card sx={{ padding: 4, maxWidth: 600, boxShadow: 1 }}>


        <FlexBox justifyContent="space-between" flexWrap="wrap" my="1rem">
          <Button
            variant="outlined"
            // onClick={loginWithDiscord}
            startIcon={<DiscordIcon sx={{ mr: 1 }} />}
          >
            Sign in with Discord
          </Button >


        </FlexBox>
      </Card>
    </FlexBox>
  );

}