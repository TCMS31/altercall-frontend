import classNames from "classnames";

const TONES = {
  error: "border-red-200 bg-red-50 text-red-800",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  info: "border-brand-200 bg-brand-50 text-brand-900",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
};

/** Inline, non-blocking feedback. Replaces the `alert()` calls this app used to make. */
export const Alert = ({ tone = "info", title, children, className, ...props }) => (
  <div
    role={tone === "error" ? "alert" : "status"}
    className={classNames(
      "rounded-xl border px-4 py-3 text-sm",
      TONES[tone] ?? TONES.info,
      className
    )}
    {...props}
  >
    {title ? <p className="font-semibold">{title}</p> : null}
    {children ? <div className={classNames(title && "mt-1")}>{children}</div> : null}
  </div>
);

export default Alert;
