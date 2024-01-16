/** Decorative spinner; the surrounding control carries the accessible label. */
export const Spinner = () => (
  <span
    aria-hidden="true"
    className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
  />
);

export default Spinner;
