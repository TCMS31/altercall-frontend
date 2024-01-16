import Alert from "../../../components/ui/Alert";
import Button from "../../../components/ui/Button";
import AppShell from "../../../components/ui/AppShell";
import EmptyState from "../../../components/ui/EmptyState";
import Panel, { PanelBody, PanelHeader } from "../../../components/ui/Panel";
import { isRemoteCoachConfigured } from "../../../config/env";
import { useSession } from "../../auth/session/SessionContext";
import CoachProfileForm from "../components/CoachProfileForm";
import PlanHistoryList from "../components/PlanHistoryList";
import PlanSkeleton from "../components/PlanSkeleton";
import PlanView from "../components/PlanView";
import useCoachPlan from "../hooks/useCoachPlan";

export const CoachPage = () => {
  const { displayName, signOut } = useSession();
  const { status, plan, error, history, isLoading, generate, selectFromHistory } =
    useCoachPlan();

  return (
    <AppShell displayName={displayName} onSignOut={signOut}>
      <div className="no-print mb-8">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-signal-600">
          Weekly programming
        </p>
        <h1 className="font-display text-4xl font-bold uppercase text-ink-900 sm:text-5xl">
          Session planner
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-600">
          Describe the athlete once and get a structured training week you can hand over as it
          is, or edit before you send it.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="no-print space-y-6">
          <Panel>
            <PanelHeader title="Athlete profile" description="All fields are required." />
            <PanelBody>
              <CoachProfileForm onSubmit={generate} isLoading={isLoading} />
              {!isRemoteCoachConfigured() ? (
                <p className="mt-4 text-xs leading-relaxed text-ink-600">
                  No hosted model is configured, so plans are built by the on-device planner.
                  Set <code className="font-mono text-ink-800">VITE_COACH_API_URL</code> to use
                  a hosted one.
                </p>
              ) : null}
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Recent plans" description="Saved on this device only." />
            <PanelBody>
              <PlanHistoryList
                history={history}
                activeId={plan?.id}
                onSelect={selectFromHistory}
              />
            </PanelBody>
          </Panel>
        </div>

        <Panel className="min-h-[560px]">
          <PanelHeader
            title="This week"
            description={plan ? "Generated plan" : "Nothing generated yet"}
            actions={
              plan ? (
                <Button size="sm" variant="secondary" onClick={() => window.print()}>
                  Print
                </Button>
              ) : null
            }
          />
          <PanelBody>
            {isLoading ? <PlanSkeleton /> : null}

            {!isLoading && status === "error" ? (
              <Alert tone="error" title="We could not build that plan">
                {error}
              </Alert>
            ) : null}

            {!isLoading && status === "idle" ? (
              <EmptyState
                title="Fill in the profile to start"
                description="A plan takes under a second and you can regenerate as often as you like."
              />
            ) : null}

            {!isLoading && status === "ready" ? <PlanView plan={plan} /> : null}
          </PanelBody>
        </Panel>
      </div>
    </AppShell>
  );
};

export default CoachPage;
