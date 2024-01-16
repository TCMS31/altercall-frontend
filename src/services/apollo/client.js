import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

import { getEnv } from "../../config/env";
import { clearSession, readSession } from "../../lib/storage";

const UNAUTHENTICATED_CODES = new Set(["UNAUTHENTICATED", "FORBIDDEN"]);

/** True when a GraphQL error list says the caller's token is no longer good. */
export const isUnauthenticated = (graphQLErrors = [], networkError) =>
  graphQLErrors.some(
    (error) =>
      UNAUTHENTICATED_CODES.has(error?.extensions?.code) ||
      /unauthenticated|not authenticated|invalid token/i.test(error?.message ?? "")
  ) || networkError?.statusCode === 401;

/**
 * Builds the Apollo client. Everything it depends on is injected so tests can
 * drive it without a network or a browser.
 */
export const createApolloClient = ({
  uri = getEnv().graphqlUri,
  getToken = () => readSession()?.accessToken,
  onUnauthenticated = () => clearSession(),
  link,
} = {}) => {
  const httpLink = link ?? new HttpLink({ uri });

  const authLink = setContext((_operation, { headers }) => {
    const token = getToken();
    return {
      headers: token ? { ...headers, authorization: `Bearer ${token}` } : headers,
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (isUnauthenticated(graphQLErrors ?? [], networkError)) {
      onUnauthenticated();
    }
  });

  return new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            // The signed-in user is a singleton; merging keeps partial fetches
            // from evicting fields another screen already cached.
            me: { merge: true },
          },
        },
      },
    }),
    defaultOptions: {
      watchQuery: { fetchPolicy: "cache-first", errorPolicy: "all" },
      query: { fetchPolicy: "cache-first", errorPolicy: "all" },
    },
  });
};

export default createApolloClient;
