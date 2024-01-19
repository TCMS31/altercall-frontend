/** Shown instead of a blank panel when there is genuinely nothing to display. */
export const EmptyState = ({ title, description, action, icon = "○" }) => (
  <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-ink-200 px-6 py-12 text-center">
    <span aria-hidden="true" className="text-2xl text-ink-300">
      {icon}
    </span>
    <p className="text-sm font-semibold text-ink-800">{title}</p>
    {description ? <p className="max-w-sm text-sm text-ink-500">{description}</p> : null}
    {action ? <div className="pt-2">{action}</div> : null}
  </div>
);

export default EmptyState;
