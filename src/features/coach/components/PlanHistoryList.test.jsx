import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";

import PlanHistoryList from "./PlanHistoryList";

const history = [
  {
    id: "a",
    headline: "4-day block: build strength",
    createdAt: 1700000000000,
    profile: { daysPerWeek: 4 },
  },
  {
    id: "b",
    headline: "3-day block: lose body fat",
    createdAt: 1700000100000,
    profile: { daysPerWeek: 3 },
  },
];

describe("PlanHistoryList", () => {
  it("shows an empty state rather than a blank panel", () => {
    render(<PlanHistoryList history={[]} onSelect={() => {}} />);
    expect(screen.getByText(/no plans yet/i)).toBeInTheDocument();
  });

  it("renders one button per stored plan", () => {
    render(<PlanHistoryList history={history} onSelect={() => {}} />);
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("marks the active entry for assistive technology", () => {
    render(<PlanHistoryList history={history} activeId="b" onSelect={() => {}} />);
    expect(screen.getByRole("button", { current: true })).toHaveTextContent(/lose body fat/i);
  });

  it("reports the selected id", async () => {
    const onSelect = jest.fn();
    const user = userEvent.setup();
    render(<PlanHistoryList history={history} onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: /build strength/i }));

    expect(onSelect).toHaveBeenCalledWith("a");
  });
});
