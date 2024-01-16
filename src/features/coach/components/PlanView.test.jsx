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

  it("marks the training and rest days across the week", () => {
    render(<PlanView plan={plan} />);
    const week = screen.getByRole("list", { name: /training days this week/i });
    plan.sessions.forEach((session) => {
      expect(week).toHaveTextContent(`${session.day}: training`);
    });
    expect(week).toHaveTextContent("Tuesday: rest");
  });

  it("shows a sub-hour week in minutes rather than as 0h", () => {
    render(
      <PlanView plan={{ ...plan, weeklyLoad: { ...plan.weeklyLoad, estimatedMinutes: 45 } }} />
    );
    expect(screen.getByText("45m")).toBeInTheDocument();
  });

  it("leaves out the week strip for a plan with no sessions", () => {
    render(<PlanView plan={{ ...plan, sessions: [] }} />);
    expect(screen.queryByRole("list", { name: /training days/i })).not.toBeInTheDocument();
  });
});
