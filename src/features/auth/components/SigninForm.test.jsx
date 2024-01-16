import userEvent from "@testing-library/user-event";

import { renderWithProviders, screen, waitFor } from "../../../test/utils";
import { SESSION_KEY } from "../../../lib/storage";
import { SIGNIN_MUTATION } from "../api/mutations";
import SigninForm from "./SigninForm";

const variables = { username: "alex@altercall.com", password: "coach2024" };

const successMock = {
  request: { query: SIGNIN_MUTATION, variables },
  result: {
    data: {
      signin: {
        __typename: "SigninMutation",
        accessToken: "token-123",
        refreshToken: "refresh-123",
        userId: "u-1",
        userName: "Alex Morgan",
        userEmail: "alex@altercall.com",
      },
    },
  },
};

const fillAndSubmit = async (user) => {
  await user.type(screen.getByLabelText(/email or username/i), variables.username);
  await user.type(screen.getByLabelText(/password/i), variables.password);
  await user.click(screen.getByRole("button", { name: /sign in/i }));
};

describe("SigninForm", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("blocks submission and reports field errors for an invalid form", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SigninForm />);

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText(/enter your email or username/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it("persists the session as JSON on success", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SigninForm />, { mocks: [successMock] });

    await fillAndSubmit(user);

    await waitFor(() => {
      expect(window.localStorage.getItem(SESSION_KEY)).not.toBeNull();
    });
    const stored = JSON.parse(window.localStorage.getItem(SESSION_KEY));
    expect(stored.accessToken).toBe("token-123");
    expect(stored.userName).toBe("Alex Morgan");
  });

  it("shows an inline error and stores nothing when the server rejects the credentials", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SigninForm />, {
      mocks: [
        {
          request: { query: SIGNIN_MUTATION, variables },
          error: new Error("Invalid username or password"),
        },
      ],
    });

    await fillAndSubmit(user);

    expect(await screen.findByRole("alert")).toHaveTextContent(/invalid username or password/i);
    expect(window.localStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it("treats a null signin payload as a failure rather than a login", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SigninForm />, {
      mocks: [
        {
          request: { query: SIGNIN_MUTATION, variables },
          result: { data: { signin: null } },
        },
      ],
    });

    await fillAndSubmit(user);

    expect(await screen.findByRole("alert")).toHaveTextContent(/did not match an account/i);
    expect(window.localStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it("signs in with the username chosen at sign-up", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SigninForm />, {
      mocks: [
        {
          request: {
            query: SIGNIN_MUTATION,
            variables: { username: "alex.morgan", password: variables.password },
          },
          result: successMock.result,
        },
      ],
    });

    await user.type(screen.getByLabelText(/email or username/i), "alex.morgan");
    await user.type(screen.getByLabelText(/password/i), variables.password);
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(window.localStorage.getItem(SESSION_KEY)).not.toBeNull();
    });
  });
});
