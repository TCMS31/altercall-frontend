import { getEnv } from "../../config/env";
import { createCoachRegistry } from "./registry";
import { createLocalCoachProvider } from "./providers/localCoachProvider";
import { createRemoteCoachProvider } from "./providers/remoteCoachProvider";

/**
 * Wires the registry and adds the one policy the UI cares about: if a better
 * provider is configured but fails, fall back to the built-in planner and say so,
 * rather than showing the user an error and nothing else.
 */
export const createCoachService = ({ registry, logger = console } = {}) => {
  const resolved =
    registry ??
    (() => {
      const env = getEnv();
      return createCoachRegistry([
        createLocalCoachProvider(),
        createRemoteCoachProvider({ url: env.coachApiUrl, timeoutMs: env.coachTimeoutMs }),
      ]);
    })();

  let lastFailure;

  const createPlan = async (profile) => {
    const candidates = resolved.available();
    if (candidates.length === 0) {
      throw new Error("No coaching provider is available");
    }

    for (let index = 0; index < candidates.length; index += 1) {
      const provider = candidates[index];
      const isLast = index === candidates.length - 1;
      try {
        const plan = await provider.createPlan(profile);
        return {
          ...plan,
          providerId: provider.id,
          providerLabel: provider.label,
          degraded: index > 0,
          degradedReason: index > 0 ? lastFailure : undefined,
        };
      } catch (error) {
        lastFailure = error?.message ?? "Unknown coaching error";
        logger?.warn?.(`Coach provider "${provider.id}" failed: ${lastFailure}`);
        if (isLast) throw error;
      }
    }

    /* istanbul ignore next - unreachable: the loop always returns or throws */
    throw new Error("No coaching provider produced a plan");
  };

  return { createPlan, providers: resolved };
};

let singleton;

/** Lazily built default service, shared across the app. */
export const getCoachService = () => {
  if (!singleton) singleton = createCoachService();
  return singleton;
};

export { createCoachRegistry } from "./registry";
export { createLocalCoachProvider } from "./providers/localCoachProvider";
export { createRemoteCoachProvider } from "./providers/remoteCoachProvider";
export { CoachError, COACH_ERROR_CODES } from "./errors";
