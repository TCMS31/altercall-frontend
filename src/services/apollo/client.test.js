import { ApolloLink, gql, Observable } from "@apollo/client";

import { createApolloClient, isUnauthenticated } from "./client";

const PING = gql`
  query Ping {
    ping
  }
`;

const linkReturning = (result, capture) =>
  new ApolloLink((operation) => {
    capture?.(operation);
    return new Observable((observer) => {
      observer.next(result);
      observer.complete();
    });
  });

describe("isUnauthenticated", () => {
  it("detects the UNAUTHENTICATED extension code", () => {
    expect(isUnauthenticated([{ extensions: { code: "UNAUTHENTICATED" } }])).toBe(true);
  });

  it("detects an unauthenticated message without an extension code", () => {
    expect(isUnauthenticated([{ message: "User is not authenticated" }])).toBe(true);
  });

  it("detects a 401 network error", () => {
    expect(isUnauthenticated([], { statusCode: 401 })).toBe(true);
  });

  it("ignores ordinary errors", () => {
    expect(isUnauthenticated([{ message: "Field not found" }])).toBe(false);
    expect(isUnauthenticated([], { statusCode: 500 })).toBe(false);
  });
});

describe("createApolloClient", () => {
  it("attaches the bearer token from the session", async () => {
    let operation;
    const client = createApolloClient({
      getToken: () => "token-123",
      link: linkReturning({ data: { ping: "pong" } }, (op) => {
        operation = op;
      }),
    });

    await client.query({ query: PING, fetchPolicy: "no-cache" });

    expect(operation.getContext().headers.authorization).toBe("Bearer token-123");
  });

  it("sends no authorization header when signed out", async () => {
    let operation;
    const client = createApolloClient({
      getToken: () => undefined,
      link: linkReturning({ data: { ping: "pong" } }, (op) => {
        operation = op;
      }),
    });

    await client.query({ query: PING, fetchPolicy: "no-cache" });

    expect(operation.getContext().headers?.authorization).toBeUndefined();
  });

  it("clears the session when the server rejects the token", async () => {
    const onUnauthenticated = jest.fn();
    const client = createApolloClient({
      getToken: () => "stale",
      onUnauthenticated,
      link: linkReturning({
        data: null,
        errors: [{ message: "nope", extensions: { code: "UNAUTHENTICATED" } }],
      }),
    });

    await client.query({ query: PING, fetchPolicy: "no-cache", errorPolicy: "all" });

    expect(onUnauthenticated).toHaveBeenCalledTimes(1);
  });

  it("leaves the session alone for an ordinary error", async () => {
    const onUnauthenticated = jest.fn();
    const client = createApolloClient({
      getToken: () => "good",
      onUnauthenticated,
      link: linkReturning({ data: null, errors: [{ message: "Field not found" }] }),
    });

    await client.query({ query: PING, fetchPolicy: "no-cache", errorPolicy: "all" });

    expect(onUnauthenticated).not.toHaveBeenCalled();
  });
});
