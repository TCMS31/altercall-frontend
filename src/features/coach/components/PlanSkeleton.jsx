/** Loading placeholder that mirrors the real plan layout, so nothing jumps. */
export const PlanSkeleton = () => (
  <div className="space-y-6" role="status" aria-live="polite" aria-busy="true">
    <span className="sr-only">Building your plan</span>
    <div className="space-y-3">
      <div className="h-5 w-48 animate-pulse rounded bg-ink-100" />
      <div className="h-8 w-3/4 animate-pulse rounded bg-ink-100" />
      <div className="h-3 w-full animate-pulse rounded bg-ink-100" />
    </div>
    <div className="h-36 animate-pulse rounded-xl bg-ink-100" />
    {[0, 1, 2].map((key) => (
      <div key={key} className="space-y-2 rounded-xl border border-ink-100 p-4">
        <div className="h-5 w-40 animate-pulse rounded bg-ink-100" />
        <div className="h-3 w-full animate-pulse rounded bg-ink-100" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-ink-100" />
      </div>
    ))}
  </div>
);

export default PlanSkeleton;
