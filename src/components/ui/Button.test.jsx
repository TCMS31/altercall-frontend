import { render, screen } from "@testing-library/react";

import Button from "./Button";

describe("Button", () => {
  it("defaults to type=button so it never submits a form by accident", () => {
    render(<Button>Print</Button>);
    expect(screen.getByRole("button", { name: "Print" })).toHaveAttribute("type", "button");
  });

  it("shows the busy label and blocks a second click while busy", () => {
    render(
      <Button type="submit" busy busyLabel="Signing in…">
        Sign in
      </Button>
    );
    const button = screen.getByRole("button", { name: /signing in/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });
});
