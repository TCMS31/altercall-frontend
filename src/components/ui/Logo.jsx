/** Wordmark used in the app header and on the auth screens. */
export const Logo = ({ className = "" }) => (
  <span className={`inline-flex items-center gap-2 ${className}`}>
    <span
      aria-hidden="true"
      className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-sm font-bold text-white"
    >
      A
    </span>
    <span className="text-sm font-semibold tracking-[0.18em] text-ink-900">ALTERCALL</span>
  </span>
);

export default Logo;
