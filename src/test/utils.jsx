import { MockedProvider } from "@apollo/client/testing";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { SessionProvider } from "../features/auth/session/SessionContext";

export const AUTHENTICATED_SESSION = {
  accessToken: "test-access-token",
  refreshToken: "test-refresh-token",
  userId: "u-1",
  userName: "Alex Morgan",
  userEmail: "alex@altercall.com",
};

/** Renders a tree inside the same providers the real app uses, minus the network. */
export const renderWithProviders = (
  ui,
  { mocks = [], route = "/", session = null, ...options } = {}
) =>
  render(ui, {
    wrapper: ({ children }) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        <SessionProvider initialSession={session}>
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </SessionProvider>
      </MockedProvider>
    ),
    ...options,
  });

export * from "@testing-library/react";
