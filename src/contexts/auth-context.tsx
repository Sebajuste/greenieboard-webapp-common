import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createContext, ReactNode, useContext, useEffect, useReducer } from "react";

export type AuthUser = null | Record<string, any>;

// All types
// =============================================
export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
  ? {
    type: Key;
  }
  : {
    type: Key;
    payload: M[Key];
  };
};

export type AuthState = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUser;
  token: any | null;
};

enum Types {
  Init = "INIT",
  Login = "LOGIN",
  Logout = "LOGOUT",
  Register = "REGISTER",
}

type JWTAuthPayload = {
  [Types.Init]: {
    isAuthenticated: boolean;
    user: AuthUser;
    token: any | null;
  };
  [Types.Logout]: undefined;
  [Types.Login]: { user: AuthUser, token: any };
  [Types.Register]: { user: AuthUser };
};

type JWTActions = ActionMap<JWTAuthPayload>[keyof ActionMap<JWTAuthPayload>];

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  token: null
};

const isValidToken = (accessToken: string) => {
  if (!accessToken) return false;

  if (!accessToken.includes('.')) {

    // const decodedToken = JSON.parse(accessToken)
    return true;
  };

  const decodedToken = jwtDecode<{ exp: number }>(accessToken);
  const currentTime = Date.now() / 1000;
  return decodedToken.exp > currentTime;
};

const setSession = (accessToken: string | null) => {
  if (accessToken) {
    localStorage.setItem("accessToken", JSON.stringify(accessToken));
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem("accessToken");
    delete axios.defaults.headers.common.Authorization;
  }
};

function getSession() {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    return JSON.parse(accessToken);
  }

  return null;
}

const reducer = (state: AuthState, action: JWTActions) => {
  switch (action.type) {
    case "INIT": {
      return {
        isInitialized: true,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: action.payload.isAuthenticated,
      };
    }
    case "LOGIN": {
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    }
    case "LOGOUT": {
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    }
    case "REGISTER": {
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    }

    default: {
      return state;
    }
  }
};



export interface AuthHandler {
  login: (email: string, password: string) => Promise<any>
  logout: () => void;
  register: (email: string, password: string, username: string) => Promise<any>;
}

export interface AuthService extends AuthState, AuthHandler {
  /*
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  register: (email: string, password: string, username: string) => Promise<any>;
  */
}

export const AuthContext = createContext({
  /*
  isAuthenticated: initialState.isAuthenticated,
  isInitialized: initialState.isInitialized,
  user: initialState.user,
  accessToken: initialState.accessToken,
  */
  ...initialState,
  // method: "JWT",
  login: (email: string, password: string) => Promise.resolve({}),
  logout: () => { },
  register: (email: string, password: string, username: string) => Promise.resolve()
} as AuthService);

type AuthProviderProps = {
  children: ReactNode;
  authHandler: AuthHandler;
};

export function AuthProvider({ children, authHandler }: AuthProviderProps) {

  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async (email: string, password: string) => {
    /*
    const response = await axios.post("/api/auth/login", {
      email,
      password,
    });
    //@ts-ignore
    const { accessToken, user } = response.data;
    */

    return authHandler.login(email, password).then(token => {
      setSession(token);
      // const { accessToken, user } = response.data;
      const user = null;
      dispatch({
        type: Types.Login,
        payload: {
          user,
          token
        }
      });
      return token;
    });

  };

  const register = async (email: string, username: string, password: string) => {

    return authHandler.register(email, password, username);

    /*
    const response = await axios.post("/api/auth/register", {
      email,
      username,
      password,
    });
    // @ts-ignore
    const { accessToken, user } = response.data;
    setSession(accessToken);
    console.log(response.data);

    dispatch({
      type: Types.Register,
      payload: {
        user,
      },
    });
    */
  };

  const logout = () => {
    authHandler.logout();
    setSession(null);
    dispatch({ type: Types.Logout });
  };

  useEffect(() => {

    const token = getSession();

    if (token) { // && isValidToken(token)) {
      // Session can be restored
      setSession(token);

      const user = null;
      dispatch({
        type: Types.Init,
        payload: {
          user,
          isAuthenticated: true,
          token
        },
      });
    } else {
      // No session exists
      dispatch({
        type: Types.Init,
        payload: {
          user: null,
          isAuthenticated: false,
          token: null
        },
      });
    }


    /*
    (async () => {
      try {
        const accessToken = window.localStorage.getItem("accessToken");

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          const response = await axios.get("/api/auth/profile");
          //@ts-ignore
          const { user } = response.data;

          dispatch({
            type: Types.Init,
            payload: {
              user,
              isAuthenticated: true,
            },
          });
        } else {
          dispatch({
            type: Types.Init,
            payload: {
              user: null,
              isAuthenticated: false,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: Types.Init,
          payload: {
            user: null,
            isAuthenticated: false,
          },
        });
      }
    })();
    */
  }, []);

  if (!state.isInitialized) {
    // return <LoadingScreen />;
    //@ts-ignore
    return (<div>Loading</div>)
  }

  return (
    //@ts-ignore
    <AuthContext.Provider
      value={{
        ...state,
        // method: "JWT",
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

};

export const useAuth = (): AuthService => useContext(AuthContext);