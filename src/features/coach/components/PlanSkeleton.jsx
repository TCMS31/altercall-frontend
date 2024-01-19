/** Loading placeholder that mirrors the real plan layout, so nothing jumps. */
export const PlanSkeleton = () => (
  <div className="space-y-4" role="status" aria-live="polite" aria-busy="true">
    <span className="sr-only">Building your plan</span>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {[0, 1, 2].map((key) => (
        <div key={key} className="h-[74px] animate-pulse rounded-xl bg-ink-100" />
      ))}
    </div>
    {[0, 1, 2].map((key) => (
      <div key={key} className="space-y-2 rounded-xl border border-ink-100 p-4">
        <div className="h-4 w-40 animate-pulse rounded bg-ink-100" />
        <div className="h-3 w-full animate-pulse rounded bg-ink-100" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-ink-100" />
      </div>
    ))}
  </div>
);

export default PlanSkeleton;
