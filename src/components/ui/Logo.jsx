import classNames from "classnames";

/** Wordmark used in the app header and on the auth screens. */
export const Logo = ({ inverted = false, className }) => (
  <span className={classNames("inline-flex items-center gap-2.5", className)}>
    <svg aria-hidden="true" viewBox="0 0 32 32" className="h-8 w-8">
      <rect
        width="32"
        height="32"
        rx="7"
        className={inverted ? "fill-paper" : "fill-brand-700"}
      />
      <path
        d="M9 23 16 8l7 15"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={inverted ? "stroke-brand-800" : "stroke-paper"}
      />
      <path
        d="M11.5 18h9"
        strokeWidth="3"
        strokeLinecap="round"
        className="stroke-signal-500"
      />
    </svg>
    <span
      className={classNames(
        "font-display text-xl font-bold uppercase tracking-[0.14em]",
        inverted ? "text-paper" : "text-ink-900"
      )}
    >
      AlterCall
    </span>
  </span>
);

export default Logo;
