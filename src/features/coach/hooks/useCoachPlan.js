import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getCoachService } from "../../../services/coach";
import { appendToHistory, loadHistory, makeHistoryId, saveHistory } from "../planHistory";

export const STATUS = {
  idle: "idle",
  loading: "loading",
  ready: "ready",
  error: "error",
};

/**
 * Owns the plan-generation state machine and the locally persisted history.
 *
 * The coach service is injected (defaulting to the app-wide one) so tests can
 * pass a stub and never touch the network.
 */
export const useCoachPlan = ({ service = getCoachService(), now = () => Date.now() } = {}) => {
  const [status, setStatus] = useState(STATUS.idle);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(() => loadHistory());
  const requestId = useRef(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const generate = useCallback(
    async (profile) => {
      const currentRequest = requestId.current + 1;
      requestId.current = currentRequest;
      setStatus(STATUS.loading);
      setError(null);

      try {
        const result = await service.createPlan(profile);
        // Ignore a response that a newer request has already superseded.
        if (!mounted.current || requestId.current !== currentRequest) return null;

        const entry = {
          ...result,
          id: makeHistoryId(profile, now()),
          createdAt: now(),
          profile,
        };
        setPlan(entry);
        setStatus(STATUS.ready);
        setHistory((previous) => {
          const next = appendToHistory(previous, entry);
          saveHistory(next);
          return next;
        });
        return entry;
      } catch (caught) {
        if (!mounted.current || requestId.current !== currentRequest) return null;
        setError(caught?.message ?? "Could not build a plan right now.");
        setStatus(STATUS.error);
        return null;
      }
    },
    [now, service]
  );

  const selectFromHistory = useCallback((id) => {
    setHistory((previous) => {
      const found = previous.find((entry) => entry.id === id);
      if (found) {
        setPlan(found);
        setStatus(STATUS.ready);
        setError(null);
      }
      return previous;
    });
  }, []);

  const reset = useCallback(() => {
    setPlan(null);
    setError(null);
    setStatus(STATUS.idle);
  }, []);

  return useMemo(
    () => ({
      status,
      plan,
      error,
      history,
      isLoading: status === STATUS.loading,
      generate,
      selectFromHistory,
      reset,
    }),
    [error, generate, history, plan, reset, selectFromHistory, status]
  );
};

export default useCoachPlan;
