import { Badge } from "../../../components/ui/flowbite";

import Alert from "../../../components/ui/Alert";
import StatTile from "../../../components/ui/StatTile";

const minutesToLabel = (minutes) => {
  if (!minutes) return "—";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
};

/** Renders one generated plan: summary strip, sessions, and coaching notes. */
export const PlanView = ({ plan }) => {
  if (!plan) return null;

  return (
    <article className="animate-fade-up space-y-6">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge color="info">{plan.providerLabel ?? "Built-in planner"}</Badge>
          {plan.focusAreas?.slice(0, 2).map((area) => (
            <Badge key={area} color="gray">
              {area}
            </Badge>
          ))}
        </div>
        <h3 className="text-xl font-semibold capitalize text-ink-900">{plan.headline}</h3>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-600">{plan.summary}</p>
      </header>

      {plan.degraded ? (
        <Alert tone="warning" title="Using the built-in planner">
          The hosted coaching model did not respond, so this plan was generated locally.
          {plan.degradedReason ? ` (${plan.degradedReason})` : null}
        </Alert>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatTile label="Sessions" value={plan.weeklyLoad?.sessions ?? 0} sublabel="per week" />
        <StatTile
          label="Time"
          value={minutesToLabel(plan.weeklyLoad?.estimatedMinutes)}
          sublabel="weekly total"
        />
        <StatTile
          label="Intensity"
          value={plan.weeklyLoad?.intensity ?? "—"}
          sublabel="average effort"
        />
      </div>

      <div className="space-y-4">
        {plan.sessions?.map((session) => (
          <section
            key={`${session.day}-${session.title}`}
            className="overflow-hidden rounded-xl border border-ink-200"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink-100 bg-ink-50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-ink-900">
                  {session.day} · {session.title}
                </p>
                <p className="text-xs text-ink-500">{session.focus}</p>
              </div>
              <span className="text-xs font-medium text-ink-500">
                {session.durationMin} min
              </span>
            </div>
            <ul className="divide-y divide-ink-100">
              {session.blocks?.map((block) => (
                <li key={block.name} className="px-4 py-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-sm font-medium text-ink-900">{block.name}</p>
                    <p className="font-mono text-xs text-brand-700">{block.prescription}</p>
                  </div>
                  {block.note ? (
                    <p className="mt-1 text-xs text-ink-500">{block.note}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {plan.coachingNotes?.length ? (
        <section className="rounded-xl border border-brand-200 bg-brand-50 px-4 py-4">
          <h4 className="text-sm font-semibold text-brand-900">Coaching notes</h4>
          <ul className="mt-2 space-y-1.5">
            {plan.coachingNotes.map((note) => (
              <li key={note} className="flex gap-2 text-sm text-brand-900">
                <span aria-hidden="true" className="text-brand-500">
                  ·
                </span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
};

export default PlanView;
