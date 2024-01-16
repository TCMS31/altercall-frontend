import { ApolloProvider } from "@apollo/client";
import { BrowserRouter } from "react-router-dom";

import { SessionProvider } from "../../features/auth/session/SessionContext";

/**
 * Composition root. Every cross-cutting provider is assembled here and nowhere
 * else, which keeps `App` a one-liner and makes the same tree easy to mount in
 * tests with a mocked client and router.
 */
export const AppProviders = ({ client, children, router: Router = BrowserRouter }) => (
  <ApolloProvider client={client}>
    <SessionProvider>
      <Router>{children}</Router>
    </SessionProvider>
  </ApolloProvider>
);

export default AppProviders;
