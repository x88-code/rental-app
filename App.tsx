import "./global.css";

import { AuthScreen } from "./src/components/AuthScreen";
import { DashboardScreen } from "./src/components/DashboardScreen";
import { useRentalApp } from "./src/hooks/useRentalApp";

export default function App() {
  const { authenticatedUser, authScreenProps, dashboardProps } = useRentalApp();

  if (!authenticatedUser) {
    return <AuthScreen {...authScreenProps} />;
  }

  return <DashboardScreen {...dashboardProps} />;
}
