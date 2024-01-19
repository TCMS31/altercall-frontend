import Logo from "./Logo";

/** Two-column marketing / form split used by sign-in and sign-up. */
export const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="grid min-h-screen grid-cols-1 bg-ink-50 font-sans text-ink-900 lg:grid-cols-[1.1fr_1fr]">
    <aside className="hidden flex-col justify-between bg-ink-950 px-10 py-12 text-ink-100 lg:flex">
      <span className="inline-flex items-center gap-2">
        <span
          aria-hidden="true"
          className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500 text-sm font-bold text-ink-950"
        >
          A
        </span>
        <span className="text-sm font-semibold tracking-[0.18em] text-white">ALTERCALL</span>
      </span>

      <div className="max-w-md">
        <h1 className="text-3xl font-semibold leading-tight text-white">
          Training plans your clients will actually follow.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-300">
          Capture an athlete profile once, generate a structured week, and keep every revision
          side by side.
        </p>
        <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-ink-800 pt-6 text-left">
          {[
            ["4", "sessions a week"],
            ["<1s", "to a full plan"],
            ["0", "spreadsheets"],
          ].map(([value, label]) => (
            <div key={label}>
              <dt className="text-2xl font-semibold text-brand-300">{value}</dt>
              <dd className="text-xs text-ink-400">{label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="text-xs text-ink-500">Built for coaches, not for spreadsheets.</p>
    </aside>

    <div className="flex items-center justify-center px-4 py-10 sm:px-8">
      <div className="w-full max-w-md">
        <div className="mb-6 lg:hidden">
          <Logo />
        </div>
        <h2 className="text-2xl font-semibold text-ink-900">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-ink-500">{subtitle}</p> : null}
        <div className="mt-6">{children}</div>
        {footer ? <div className="mt-6 text-sm text-ink-500">{footer}</div> : null}
      </div>
    </div>
  </div>
);

export default AuthLayout;
