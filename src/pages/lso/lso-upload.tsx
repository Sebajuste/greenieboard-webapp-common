import { Card } from "@mui/material";
import { useEffect } from "react";
import { useAuth } from "../../contexts/auth-context";
import { useUserInfo } from "../../contexts/user-context";


const GUILD_2ND_FFS_ID = "728323096947327108";

const USER_ID = "245285030644023297";

const LSO_ROLE_ID = "764045431852236800";

export function LSOUpload() {

  const { token } = useAuth();

  const { isLSO } = useUserInfo();

  useEffect(() => {

    /*
    fetch(`https://discordapp.com/api/users/@me`, {
      headers: {
        'Authorization': `Bearer ${token.access_token}`,
        'Content-Type': "application/json"
      }
    }).then(response => response.json())//
      .then(response => {
        console.log('User Info: ', response)
      })

    fetch(`https://discordapp.com/api/users/@me/guilds`, {
      headers: {
        'Authorization': `Bearer ${token.access_token}`,
        'Content-Type': "application/json"
      }
    }).then(response => response.json())//
      .then(response => {
        console.log('Guild User Info: ', response)
      })
        */

    /*
  fetch(`https://discordapp.com/api/users/@me/guilds/${GUILD_2ND_FFS_ID}/member `, {
    headers: {
      'Authorization': `Bearer ${token.access_token}`,
      'Content-Type': "application/json"
    }
  }).then(response => response.json())//
    .then(response => _.find(response.roles, role => role === LSO_ROLE_ID) != undefined)//
    .then(setIsLSO);
    */

    /*
  fetch(`https://discordapp.com/api/guilds/${GUILD_2ND_FFS_ID}/roles`, {
    headers: {
      'Authorization': `Bearer ${token.access_token}`,
      'Content-Type': "application/json"
    }
  }).then(response => response.json())//
    .then(response => {
      console.log('Role Info: ', response)
    })
      */


  }, []);

  if (!isLSO) {
    return (
      <Card>
        Your are not a LSO.
      </Card>
    );
  }

  return (
    // @ts-ignore
    <div>Upload</div>
  )

}