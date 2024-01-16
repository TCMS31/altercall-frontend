import Button from "./Button";
import Logo from "./Logo";

/** Signed-in chrome: header with the current user and a sign-out control. */
export const AppShell = ({ displayName, onSignOut, children }) => (
  <div className="min-h-screen">
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-30 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-semibold"
    >
      Skip to the planner
    </a>
    <header className="no-print sticky top-0 z-20 border-b border-ink-200 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo />
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold leading-tight text-ink-900">{displayName}</p>
            <p className="text-xs leading-tight text-ink-600">Coaching workspace</p>
          </div>
          <Button size="sm" variant="secondary" onClick={onSignOut}>
            Sign out
          </Button>
        </div>
      </div>
    </header>
    <main id="main" className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      {children}
    </main>
  </div>
);

export default AppShell;
