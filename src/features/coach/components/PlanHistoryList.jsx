import classNames from "classnames";

import EmptyState from "../../../components/ui/EmptyState";

const formatTime = (timestamp) =>
  new Date(timestamp).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/** Locally persisted list of previously generated plans. */
export const PlanHistoryList = ({ history, activeId, onSelect }) => {
  if (!history?.length) {
    return (
      <EmptyState
        title="No plans yet"
        description="Generate a plan and it will be saved here on this device."
      />
    );
  }

  return (
    <ul className="space-y-2">
      {history.map((entry) => {
        const isActive = entry.id === activeId;
        return (
          <li key={entry.id}>
            <button
              type="button"
              onClick={() => onSelect(entry.id)}
              aria-current={isActive ? "true" : undefined}
              className={classNames(
                "w-full rounded-xl border px-3 py-2.5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                isActive
                  ? "border-brand-400 bg-brand-50"
                  : "border-ink-200 bg-white hover:border-ink-300 hover:bg-ink-50"
              )}
            >
              <p className="truncate text-sm font-medium capitalize text-ink-900">
                {entry.headline}
              </p>
              <p className="mt-0.5 text-xs text-ink-500">
                {entry.profile?.daysPerWeek ?? entry.weeklyLoad?.sessions} days ·{" "}
                {formatTime(entry.createdAt)}
              </p>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default PlanHistoryList;
