import classNames from "classnames";

import Alert from "../../../components/ui/Alert";
import Badge from "../../../components/ui/Badge";
import { DAY_NAMES } from "../../../services/coach/planner";

const minutesToLabel = (minutes) => {
  if (!minutes) return "—";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest}m`;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
};

/** Monday-to-Sunday row that shows at a glance where the training days fall. */
const WeekStrip = ({ sessions }) => {
  const trainingDays = new Set(sessions.map((session) => session.day));
  return (
    <ol aria-label="Training days this week" className="grid grid-cols-7 gap-1.5">
      {DAY_NAMES.map((day) => {
        const trains = trainingDays.has(day);
        return (
          <li
            key={day}
            className={classNames(
              "rounded-md py-2 text-center font-display text-sm font-bold uppercase",
              trains ? "bg-brand-700 text-paper" : "bg-ink-100 text-ink-500"
            )}
          >
            <span aria-hidden="true">{day.slice(0, 3)}</span>
            <span className="sr-only">
              {day}: {trains ? "training" : "rest"}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

const LoadFigure = ({ label, value, className }) => (
  <div className={classNames("border-l-2 border-ink-200 pl-3", className)}>
    <dt className="text-xs font-semibold uppercase tracking-wide text-ink-600">{label}</dt>
    <dd className="font-display text-3xl font-bold leading-tight text-ink-900">{value}</dd>
  </div>
);

/** Renders one generated plan: week overview, sessions, and coaching notes. */
export const PlanView = ({ plan }) => {
  if (!plan) return null;
  const sessions = plan.sessions ?? [];

  return (
    <article className="animate-fade-up space-y-6">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="brand">{plan.providerLabel ?? "Built-in planner"}</Badge>
          {plan.focusAreas?.slice(0, 2).map((area) => (
            <Badge key={area}>{area}</Badge>
          ))}
        </div>
        <h3 className="font-display text-3xl font-bold uppercase leading-none text-ink-900">
          {plan.headline}
        </h3>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-700">{plan.summary}</p>
      </header>

      {plan.degraded ? (
        <Alert tone="warning" title="Using the built-in planner">
          The hosted coaching model did not respond, so this plan was generated locally.
          {plan.degradedReason ? ` (${plan.degradedReason})` : null}
        </Alert>
      ) : null}

      <div className="space-y-3 rounded-xl border border-ink-200 bg-ink-50 p-4">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
          <LoadFigure label="Sessions" value={plan.weeklyLoad?.sessions ?? 0} />
          <LoadFigure
            label="Weekly time"
            value={minutesToLabel(plan.weeklyLoad?.estimatedMinutes)}
          />
          <LoadFigure
            label="Intensity"
            value={plan.weeklyLoad?.intensity ?? "—"}
            className="col-span-2 sm:col-span-1"
          />
        </dl>
        {sessions.length ? <WeekStrip sessions={sessions} /> : null}
      </div>

      <div className="space-y-4">
        {sessions.map((session) => (
          <section
            key={`${session.day}-${session.title}`}
            aria-label={`${session.day}: ${session.title}`}
            className="overflow-hidden rounded-xl border border-ink-200 bg-white"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-100 px-4 py-3">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-2xl font-bold uppercase text-signal-600">
                  {session.day.slice(0, 3)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink-900">
                    {session.day} · {session.title}
                  </p>
                  <p className="text-xs text-ink-600">{session.focus}</p>
                </div>
              </div>
              <span className="rounded-md bg-ink-100 px-2 py-0.5 text-xs font-semibold text-ink-700">
                {session.durationMin} min
              </span>
            </div>
            <ul className="divide-y divide-ink-100">
              {session.blocks?.map((block) => (
                <li key={block.name} className="px-4 py-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <p className="text-sm font-semibold text-ink-900">{block.name}</p>
                    <p className="font-mono text-sm text-signal-700">{block.prescription}</p>
                  </div>
                  {block.note ? (
                    <p className="mt-1 text-sm text-ink-600">{block.note}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {plan.coachingNotes?.length ? (
        <section className="rounded-xl border-l-4 border-signal-500 bg-signal-100/50 px-4 py-4">
          <h4 className="font-display text-lg font-bold uppercase tracking-wide text-ink-900">
            Coaching notes
          </h4>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink-800 marker:text-signal-600">
            {plan.coachingNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
};

export default PlanView;
