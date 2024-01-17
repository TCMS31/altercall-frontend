/**
 * Provider registry - the extension seam of this codebase.
 *
 * A new coaching backend (a different vendor, an on-prem model, a canned plan for
 * a demo account) is added by registering an object with this shape:
 *
 *   { id, label, priority, isAvailable(): boolean, createPlan(profile): Promise<Plan> }
 *
 * Nothing in the UI layer knows which provider answered; it only sees a plan and a
 * `source`. Resolution is highest-priority-available-first, so a remote model wins
 * when it is configured and the built-in planner takes over when it is not.
 */

const requiredMethods = ["isAvailable", "createPlan"];

export const createCoachRegistry = (initialProviders = []) => {
  const providers = [];

  const register = (provider) => {
    if (!provider || typeof provider !== "object" || !provider.id) {
      throw new TypeError("A coach provider needs an `id`");
    }
    const missing = requiredMethods.filter((method) => typeof provider[method] !== "function");
    if (missing.length > 0) {
      throw new TypeError(`Coach provider "${provider.id}" is missing: ${missing.join(", ")}`);
    }
    const existing = providers.findIndex((entry) => entry.id === provider.id);
    if (existing >= 0) providers.splice(existing, 1, provider);
    else providers.push(provider);
    return registry;
  };

  const list = () => [...providers].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  /** Every available provider, best first. */
  const available = () => list().filter((provider) => provider.isAvailable());

  const resolve = () => available()[0] ?? null;

  const registry = { register, list, available, resolve };
  initialProviders.forEach(register);
  return registry;
};

export default createCoachRegistry;
