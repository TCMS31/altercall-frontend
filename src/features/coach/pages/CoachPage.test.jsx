import userEvent from "@testing-library/user-event";

import {
  AUTHENTICATED_SESSION,
  renderWithProviders,
  screen,
  waitFor,
} from "../../../test/utils";
import CoachPage from "./CoachPage";

describe("CoachPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("starts in an explicit empty state", () => {
    renderWithProviders(<CoachPage />, { session: AUTHENTICATED_SESSION });
    expect(screen.getByText(/fill in the profile to start/i)).toBeInTheDocument();
    expect(screen.getByText(/no plans yet/i)).toBeInTheDocument();
  });

  it("generates a plan with the built-in planner and stores it in history", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CoachPage />, { session: AUTHENTICATED_SESSION });

    await user.type(screen.getByLabelText(/^age/i), "34");
    await user.type(screen.getByLabelText(/height/i), "5.9");
    await user.selectOptions(screen.getByLabelText(/primary goal/i), "fat-loss");
    await user.click(screen.getByRole("button", { name: /generate plan/i }));

    await waitFor(() =>
      expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(/lose body fat/i)
    );
    expect(screen.getByText(/coaching notes/i)).toBeInTheDocument();
    expect(screen.queryByText(/no plans yet/i)).not.toBeInTheDocument();
  });

  it("refuses to generate a plan from an invalid profile", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CoachPage />, { session: AUTHENTICATED_SESSION });

    await user.type(screen.getByLabelText(/^age/i), "4");
    await user.type(screen.getByLabelText(/height/i), "5.9");
    await user.click(screen.getByRole("button", { name: /generate plan/i }));

    expect(await screen.findByText(/age must be between/i)).toBeInTheDocument();
    expect(screen.getByText(/fill in the profile to start/i)).toBeInTheDocument();
  });

  it("explains that no hosted model is configured", () => {
    renderWithProviders(<CoachPage />, { session: AUTHENTICATED_SESSION });
    expect(screen.getByText(/REACT_APP_COACH_API_URL/)).toBeInTheDocument();
  });
});
