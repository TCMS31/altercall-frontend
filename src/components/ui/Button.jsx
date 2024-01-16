import classNames from "classnames";

import Spinner from "./Spinner";

const VARIANTS = {
  primary:
    "border-transparent bg-brand-600 text-white enabled:hover:bg-brand-700 focus-visible:ring-brand-300",
  secondary:
    "border-ink-200 bg-white text-ink-800 enabled:hover:bg-ink-50 focus-visible:ring-ink-200",
};

const SIZES = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
};

/**
 * The one button in the app. `busy` swaps the label for a spinner and
 * `busyLabel`, and disables the control so a slow request is not sent twice.
 */
export const Button = ({
  variant = "primary",
  size = "md",
  type = "button",
  busy = false,
  busyLabel,
  disabled,
  className,
  children,
  ...props
}) => (
  <button
    type={type}
    disabled={disabled || busy}
    aria-busy={busy || undefined}
    className={classNames(
      "inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition focus:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60",
      VARIANTS[variant] ?? VARIANTS.primary,
      SIZES[size] ?? SIZES.md,
      className
    )}
    {...props}
  >
    {busy ? (
      <>
        <Spinner />
        <span>{busyLabel ?? children}</span>
      </>
    ) : (
      children
    )}
  </button>
);

export default Button;
