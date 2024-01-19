import { Button } from "./flowbite";

import Logo from "./Logo";

/** Signed-in chrome: header with the current user and a sign-out control. */
export const AppShell = ({ displayName, onSignOut, children }) => (
  <div className="min-h-screen bg-ink-50 font-sans text-ink-900">
    <header className="sticky top-0 z-20 border-b border-ink-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo />
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium leading-tight text-ink-900">{displayName}</p>
            <p className="text-xs leading-tight text-ink-500">Coaching workspace</p>
          </div>
          <Button size="xs" color="light" onClick={onSignOut}>
            Sign out
          </Button>
        </div>
      </div>
    </header>
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
  </div>
);

export default AppShell;
