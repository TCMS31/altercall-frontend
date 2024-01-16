import { useEffect, useId, useRef } from "react";

/**
 * A modal built on the native <dialog>, which already provides the focus trap,
 * the inert background and Escape-to-close that a hand-rolled overlay has to fake.
 * It is mounted only while `show` is true, so closed content never sits in the DOM.
 */
export const Modal = ({ show, title, onClose, children }) => {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (show && dialog && !dialog.open) dialog.showModal();
  }, [show]);

  if (!show) return null;

  return (
    // Escape reaches onCancel, so the backdrop click is only a pointer shortcut.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose?.();
      }}
      onClick={(event) => {
        // A click on the dialog element itself (not its content) is a click on the backdrop.
        if (event.target === dialogRef.current) onClose?.();
      }}
      className="w-[calc(100%-2rem)] max-w-md rounded-2xl border border-ink-200 bg-white p-0 text-ink-900 shadow-panel backdrop:bg-ink-950/60"
    >
      <div className="border-b border-ink-100 px-5 py-4">
        <h2 id={titleId} className="font-display text-lg font-semibold">
          {title}
        </h2>
      </div>
      <div className="px-5 py-5">{children}</div>
    </dialog>
  );
};

export default Modal;
