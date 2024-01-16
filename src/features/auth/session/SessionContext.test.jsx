import { act, render, screen } from "@testing-library/react";

import { clearSession, SESSION_KEY, writeSession } from "../../../lib/storage";
import { AUTHENTICATED_SESSION } from "../../../test/utils";
import { SessionProvider, useSession } from "./SessionContext";

const Probe = () => {
  const { isAuthenticated, displayName } = useSession();
  return <p>{isAuthenticated ? `in as ${displayName}` : "signed out"}</p>;
};

const renderProbe = (initialSession) =>
  render(
    <SessionProvider initialSession={initialSession}>
      <Probe />
    </SessionProvider>
  );

describe("SessionProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("signs the UI out when the session is cleared outside React", () => {
    renderProbe(AUTHENTICATED_SESSION);
    expect(screen.getByText(/in as alex morgan/i)).toBeInTheDocument();

    // This is what the Apollo error link does on an UNAUTHENTICATED response.
    act(() => clearSession());

    expect(screen.getByText(/signed out/i)).toBeInTheDocument();
  });

  it("picks up a session written elsewhere", () => {
    renderProbe(null);
    act(() => {
      writeSession({ ...AUTHENTICATED_SESSION, userName: "Sam Ortiz" });
    });
    expect(screen.getByText(/in as sam ortiz/i)).toBeInTheDocument();
  });

  it("follows a sign-out made in another tab", () => {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(AUTHENTICATED_SESSION));
    renderProbe(null);
    expect(screen.getByText(/in as alex morgan/i)).toBeInTheDocument();

    act(() => {
      window.localStorage.removeItem(SESSION_KEY);
      window.dispatchEvent(new StorageEvent("storage", { key: SESSION_KEY }));
    });

    expect(screen.getByText(/signed out/i)).toBeInTheDocument();
  });

  it("refuses a sign-in payload without an access token", () => {
    let api;
    const Capture = () => {
      api = useSession();
      return null;
    };
    render(
      <SessionProvider>
        <Capture />
      </SessionProvider>
    );
    expect(() => api.signIn({ userName: "x" })).toThrow(/access token/i);
  });
});
