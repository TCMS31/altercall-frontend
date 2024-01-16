import userEvent from "@testing-library/user-event";

import { fireEvent, renderWithProviders, screen, waitFor } from "../../../test/utils";
import { SIGN_UP_MUTATION, USER_CONFIRMATION_MUTATION } from "../api/mutations";
import SignupForm from "./SignupForm";

const values = {
  name: "Alex Morgan",
  username: "alex.morgan",
  email: "alex@altercall.com",
  password: "coach2024",
};

const signupMock = {
  request: { query: SIGN_UP_MUTATION, variables: values },
  result: {
    data: { signup: { user: { username: values.username, email: values.email } } },
  },
};

const fillAndSubmit = async (user) => {
  await user.type(screen.getByLabelText(/full name/i), values.name);
  await user.type(screen.getByLabelText(/username/i), values.username);
  await user.type(screen.getByLabelText(/email/i), values.email);
  await user.type(screen.getByLabelText(/password/i), values.password);
  await user.click(screen.getByRole("button", { name: /create account/i }));
};

describe("SignupForm", () => {
  it("rejects a weak password before calling the server", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignupForm />, { mocks: [] });

    await user.type(screen.getByLabelText(/full name/i), values.name);
    await user.type(screen.getByLabelText(/username/i), values.username);
    await user.type(screen.getByLabelText(/email/i), values.email);
    await user.type(screen.getByLabelText(/password/i), "weak");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText(/at least 8 characters/i)).toBeInTheDocument();
  });

  it("opens the OTP modal after a successful sign-up", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignupForm />, { mocks: [signupMock] });

    await fillAndSubmit(user);

    expect(await screen.findByText(/confirm your email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmation code/i)).toBeInTheDocument();
  });

  it("keeps the modal open and explains a rejected code", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignupForm />, {
      mocks: [
        signupMock,
        {
          request: {
            query: USER_CONFIRMATION_MUTATION,
            variables: { username: values.username, otp: "000000" },
          },
          result: { data: { confirmUser: { success: false } } },
        },
      ],
    });

    await fillAndSubmit(user);
    await screen.findByLabelText(/confirmation code/i);

    // The modal traps focus, so set the code in one change event rather than
    // keystroke-by-keystroke.
    fireEvent.change(screen.getByLabelText(/confirmation code/i), {
      target: { value: "000000" },
    });
    await user.click(screen.getByRole("button", { name: /^confirm$/i }));

    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/did not match/i), {
      timeout: 4000,
    });
    // The modal must survive a rejected code so the user can retype it.
    expect(screen.getByLabelText(/confirmation code/i)).toBeInTheDocument();
  });

  it("surfaces a server error inline instead of an alert() dialog", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignupForm />, {
      mocks: [
        {
          request: { query: SIGN_UP_MUTATION, variables: values },
          error: new Error("Username already taken"),
        },
      ],
    });

    await fillAndSubmit(user);

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(/username already taken/i)
    );
  });
});
