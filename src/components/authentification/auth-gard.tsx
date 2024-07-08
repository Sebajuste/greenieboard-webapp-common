import { Fragment, ReactNode, useState } from "react";
import { useAuth } from "../../contexts/jwt-auth-context";
import { Navigate, useLocation } from "react-router-dom";

interface AuthGuardProps {
  children: ReactNode;
  login: ReactNode;
}

export function AuthGuard({ children, login }: AuthGuardProps) {

  const { isAuthenticated } = useAuth();

  const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

  const { pathname } = useLocation();

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }

    return <Fragment>{login}</Fragment>;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return (<Fragment>{children}</Fragment>);

}