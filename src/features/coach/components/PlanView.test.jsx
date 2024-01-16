import { render, screen } from "@testing-library/react";

import { buildPlan } from "../../../services/coach/planner";
import PlanView from "./PlanView";

const plan = {
  ...buildPlan({
    age: 34,
    height: 6.4,
    goal: "strength",
    experience: "advanced",
    daysPerWeek: 4,
  }),
  providerLabel: "Built-in planner",
};

describe("PlanView", () => {
  it("renders nothing without a plan", () => {
    const { container } = render(<PlanView plan={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the summary strip", () => {
    render(<PlanView plan={plan} />);
    expect(screen.getByText("Sessions")).toBeInTheDocument();
    expect(screen.getByText("5h")).toBeInTheDocument();
    expect(screen.getByText("Moderate-high")).toBeInTheDocument();
  });

  it("renders every session with its prescriptions", () => {
    render(<PlanView plan={plan} />);
    plan.sessions.forEach((session) => {
      expect(
        screen.getByText(new RegExp(`${session.day}.*${session.title}`))
      ).toBeInTheDocument();
    });
    expect(screen.getAllByText(/RPE 7/).length).toBeGreaterThan(0);
  });

  it("lists the coaching notes", () => {
    render(<PlanView plan={plan} />);
    expect(screen.getByText(/Long levers/)).toBeInTheDocument();
  });

  it("warns the user when the plan came from the fallback provider", () => {
    render(<PlanView plan={{ ...plan, degraded: true, degradedReason: "timeout" }} />);
    const warning = screen.getByRole("status");
    expect(warning).toHaveTextContent(/using the built-in planner/i);
    expect(warning).toHaveTextContent(/did not respond/i);
    expect(warning).toHaveTextContent(/timeout/i);
  });

  it("does not warn for a healthy plan", () => {
    render(<PlanView plan={plan} />);
    expect(screen.queryByText(/did not respond/i)).not.toBeInTheDocument();
  });
});
