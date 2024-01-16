import { fireEvent, render, screen } from "@testing-library/react";

import Modal from "./Modal";

const renderModal = (props) =>
  render(
    <Modal title="Confirm your email" onClose={props.onClose} show={props.show}>
      <button type="button">Inside</button>
    </Modal>
  );

describe("Modal", () => {
  it("renders nothing while closed", () => {
    renderModal({ show: false, onClose: () => {} });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens as a dialog named by its title", () => {
    renderModal({ show: true, onClose: () => {} });
    expect(screen.getByRole("dialog", { name: /confirm your email/i })).toBeInTheDocument();
  });

  it("asks to close on Escape instead of closing itself", () => {
    const onClose = vi.fn();
    renderModal({ show: true, onClose });
    const cancel = new Event("cancel", { cancelable: true });
    fireEvent(screen.getByRole("dialog"), cancel);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(cancel.defaultPrevented).toBe(true);
  });

  it("closes on a backdrop click but not on a click inside", () => {
    const onClose = vi.fn();
    renderModal({ show: true, onClose });
    fireEvent.click(screen.getByRole("button", { name: /inside/i }));
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
