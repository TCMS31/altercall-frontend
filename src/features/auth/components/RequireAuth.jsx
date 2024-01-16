import { Navigate, useLocation } from "react-router-dom";

import { useSession } from "../session/SessionContext";

/** Route guard: anything wrapped in this is unreachable without a session. */
export const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useSession();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }
  return children;
};

export default RequireAuth;
