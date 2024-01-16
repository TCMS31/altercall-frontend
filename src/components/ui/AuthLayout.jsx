import { buildPlan } from "../../services/coach/planner";
import Logo from "./Logo";

// A real excerpt from the built-in planner, so the panel shows the product
// rather than describing it.
const SAMPLE = buildPlan({ goal: "strength", experience: "intermediate", daysPerWeek: 3 });
const SAMPLE_SESSION = SAMPLE.sessions[0];

/** Whiteboard panel plus form column, shared by sign-in and sign-up. */
export const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
    <aside className="hidden flex-col justify-between bg-brand-900 px-12 py-12 text-brand-100 lg:flex">
      <Logo inverted />

      <div className="max-w-md">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-signal-400">
          On the board this week
        </p>
        <p className="mt-3 font-display text-5xl font-bold uppercase leading-[0.95] text-paper">
          Write the week once. Coach it all month.
        </p>

        <figure className="mt-10 rounded-xl border border-brand-700 bg-brand-950/40 p-5">
          <figcaption className="flex items-baseline justify-between gap-4 border-b border-brand-700 pb-3">
            <span className="font-display text-2xl font-bold uppercase text-paper">
              {SAMPLE_SESSION.day.slice(0, 3)} · {SAMPLE_SESSION.title}
            </span>
            <span className="text-xs text-brand-200">{SAMPLE_SESSION.durationMin} min</span>
          </figcaption>
          <ul className="mt-3 space-y-2">
            {SAMPLE_SESSION.blocks.map((block) => (
              <li
                key={block.name}
                className="flex items-baseline justify-between gap-4 text-sm"
              >
                <span className="text-brand-100">{block.name}</span>
                <span className="font-mono text-xs text-signal-400">{block.prescription}</span>
              </li>
            ))}
          </ul>
        </figure>
      </div>

      <p className="text-xs text-brand-200">
        Plans come from the built-in planner or your own hosted model.
      </p>
    </aside>

    <main className="flex items-center justify-center px-4 py-10 sm:px-8">
      <div className="w-full max-w-md">
        <div className="mb-8 lg:hidden">
          <Logo />
        </div>
        <h1 className="font-display text-4xl font-bold uppercase text-ink-900">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-ink-600">{subtitle}</p> : null}
        <div className="mt-6 rounded-2xl border border-ink-200 bg-white p-5 shadow-panel sm:p-6">
          {children}
        </div>
        {footer ? <div className="mt-6 text-sm text-ink-600">{footer}</div> : null}
      </div>
    </main>
  </div>
);

export default AuthLayout;
