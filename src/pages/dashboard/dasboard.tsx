import { useContext, useEffect } from "react";
import { TitleContext, useTitle } from "../../components/portal/contexts/portal-context";

export function Dashboard() {


  useTitle("Saas");

  return (
    <div className="dashboard">
      My dashboard
    </div>
  );
}