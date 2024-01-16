import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  clearSession,
  isValidSession,
  readSession,
  SESSION_KEY,
  subscribeToSession,
  writeSession,
} from "../../../lib/storage";

const SessionContext = createContext(null);

/**
 * Holds the signed-in user for the whole app and keeps localStorage in step.
 * Components read it through `useSession()` and never touch storage directly.
 */
export const SessionProvider = ({ children, initialSession = null }) => {
  const [session, setSession] = useState(() => initialSession ?? readSession());

  useEffect(() => {
    const unsubscribe = subscribeToSession(setSession);
    // Signing in or out in another tab only shows up as a storage event here.
    const onStorage = (event) => {
      if (event.key === SESSION_KEY || event.key === null) setSession(readSession());
    };
    window.addEventListener("storage", onStorage);
    return () => {
      unsubscribe();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const signIn = useCallback((payload) => {
    if (!isValidSession(payload)) {
      throw new Error("Sign-in did not return an access token");
    }
    writeSession(payload);
    return payload;
  }, []);

  const signOut = useCallback(() => {
    clearSession();
  }, []);

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: isValidSession(session),
      displayName: session?.userName ?? session?.userEmail ?? "Athlete",
      signIn,
      signOut,
    }),
    [session, signIn, signOut]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used inside a <SessionProvider>");
  }
  return context;
};

export default SessionContext;
