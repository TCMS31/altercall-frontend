import classNames from "classnames";

const TONES = {
  brand: "bg-brand-100 text-brand-800",
  neutral: "bg-ink-100 text-ink-700",
};

export const Badge = ({ tone = "neutral", children }) => (
  <span
    className={classNames(
      "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
      TONES[tone] ?? TONES.neutral
    )}
  >
    {children}
  </span>
);

export default Badge;
