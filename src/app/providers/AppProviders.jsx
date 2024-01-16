import { ApolloProvider } from "@apollo/client";
import { Flowbite } from "../../components/ui/flowbite";
import { BrowserRouter } from "react-router-dom";

import flowbiteTheme from "../../components/ui/flowbiteTheme";
import { SessionProvider } from "../../features/auth/session/SessionContext";

/**
 * Composition root. Every cross-cutting provider is assembled here and nowhere
 * else, which keeps `App` a one-liner and makes the same tree easy to mount in
 * tests with a mocked client and router.
 */
export const AppProviders = ({ client, children, router: Router = BrowserRouter }) => (
  <ApolloProvider client={client}>
    <Flowbite theme={{ theme: flowbiteTheme }}>
      <SessionProvider>
        <Router>{children}</Router>
      </SessionProvider>
    </Flowbite>
  </ApolloProvider>
);

export default AppProviders;
