import classNames from "classnames";

/** Neutral surface used for every card-like block, so spacing stays consistent. */
export const Panel = ({ as: Tag = "section", className, children, ...props }) => (
  <Tag
    className={classNames("rounded-2xl border border-ink-200 bg-white shadow-panel", className)}
    {...props}
  >
    {children}
  </Tag>
);

export const PanelHeader = ({ title, description, actions, className }) => (
  <div
    className={classNames(
      "flex flex-col gap-3 border-b border-ink-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6",
      className
    )}
  >
    <div className="min-w-0">
      <h2 className="truncate text-base font-semibold text-ink-900">{title}</h2>
      {description ? <p className="mt-0.5 text-sm text-ink-500">{description}</p> : null}
    </div>
    {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
  </div>
);

export const PanelBody = ({ className, children }) => (
  <div className={classNames("px-5 py-5 sm:px-6", className)}>{children}</div>
);

export default Panel;
