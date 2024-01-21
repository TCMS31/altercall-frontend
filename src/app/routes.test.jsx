import userEvent from "@testing-library/user-event";

import { AUTHENTICATED_SESSION, renderWithProviders, screen } from "../test/utils";
import AppRoutes from "./routes";

describe("AppRoutes", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("redirects an anonymous visitor away from the planner", async () => {
    renderWithProviders(<AppRoutes />, { route: "/" });
    expect(await screen.findByRole("heading", { name: /^sign in$/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /session planner/i })).not.toBeInTheDocument();
  });

  it("sends an unknown path to the planner, which itself is guarded", async () => {
    renderWithProviders(<AppRoutes />, { route: "/nope" });
    expect(await screen.findByRole("heading", { name: /^sign in$/i })).toBeInTheDocument();
  });

  it("renders the planner for a signed-in coach", async () => {
    renderWithProviders(<AppRoutes />, { route: "/", session: AUTHENTICATED_SESSION });
    expect(
      await screen.findByRole("heading", { name: /session planner/i })
    ).toBeInTheDocument();
    expect(screen.getByText(AUTHENTICATED_SESSION.userName)).toBeInTheDocument();
  });

  it("serves the sign-up page", async () => {
    renderWithProviders(<AppRoutes />, { route: "/signup" });
    expect(
      await screen.findByRole("heading", { name: /create your account/i })
    ).toBeInTheDocument();
  });

  it("signs the coach out and returns them to sign-in", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppRoutes />, { route: "/", session: AUTHENTICATED_SESSION });

    await screen.findByRole("heading", { name: /session planner/i });
    await user.click(screen.getByRole("button", { name: /sign out/i }));

    expect(await screen.findByRole("heading", { name: /^sign in$/i })).toBeInTheDocument();
  });
});
