import _ from "lodash";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth-context";

const GUILD_2ND_FFS_ID = "728323096947327108";
const LSO_ROLE_ID = "764045431852236800";

export type UserInfo = {
  username: string | null;
  avatarURL: string | null;
  isLSO: boolean;
}

const initialUserInfo = {
  username: null,
  avatarURL: null,
  isLSO: false
}

export const UserInfoContext = createContext<UserInfo>(initialUserInfo)

export function UserInfoProvider({ children }: { children: ReactNode }) {

  const [userInfo, setUserInfo] = useState<UserInfo>(initialUserInfo);

  const { isAuthenticated, isInitialized, token } = useAuth();

  useEffect(() => {

    if (isAuthenticated && isInitialized) {
      // Restore or get

      const userInfo = localStorage.getItem('user_info');

      if (userInfo != null) {
        // Restore
        setUserInfo(JSON.parse(userInfo));
      } else {
        // Load

        fetch(`https://discordapp.com/api/users/@me/guilds/${GUILD_2ND_FFS_ID}/member `, {
          headers: {
            'Authorization': `Bearer ${token.access_token}`,
            'Content-Type': "application/json"
          }
        }).then(response => response.json())//
          .then(response => {

            const isLSO = _.find(response.roles, role => role === LSO_ROLE_ID) != undefined;
            const username = response.nick ?? response.user.global_name;
            const avatarURL = `https://cdn.discordapp.com/avatars/${response.user.id}/${response.user.avatar}`;

            const userInfo = {
              username,
              avatarURL,
              isLSO
            };

            setUserInfo(userInfo);

            localStorage.setItem('user_info', JSON.stringify(userInfo));

          })//

      }

    } else if (!isAuthenticated) {
      // Clear cache
      localStorage.removeItem('user_info')
    }

  }, [isAuthenticated, isInitialized])

  return (
    <UserInfoContext.Provider value={userInfo}>
      {children}
    </UserInfoContext.Provider>
  );

}

export const useUserInfo = (): UserInfo => useContext(UserInfoContext);
