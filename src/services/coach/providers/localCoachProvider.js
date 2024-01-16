import { buildPlan } from "../planner";

/**
 * The always-available provider. It runs entirely in the browser, so the product
 * still does something useful with no backend, no API key and no network.
 */
export const createLocalCoachProvider = () => ({
  id: "local",
  label: "Built-in planner",
  priority: 0,
  isAvailable: () => true,
  async createPlan(profile) {
    return { ...buildPlan(profile), source: "local" };
  },
});

export default createLocalCoachProvider;
