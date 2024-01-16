/** Small labelled figure used in the plan summary strip. */
export const StatTile = ({ label, value, sublabel }) => (
  <div className="rounded-xl border border-ink-100 bg-ink-50 px-4 py-3">
    <p className="text-xs font-medium uppercase tracking-wide text-ink-500">{label}</p>
    <p className="mt-1 text-xl font-semibold text-ink-900">{value}</p>
    {sublabel ? <p className="text-xs text-ink-500">{sublabel}</p> : null}
  </div>
);

export default StatTile;
