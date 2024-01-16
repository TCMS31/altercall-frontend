import classNames from "classnames";
import { ErrorMessage, useField } from "formik";

const CONTROL_BASE =
  "block w-full rounded-lg border px-3 py-2.5 text-sm text-ink-900 placeholder-ink-400 focus:outline-none focus:ring-2";
const CONTROL_STATES = {
  valid: "border-ink-200 bg-white focus:border-brand-500 focus:ring-brand-500/40",
  invalid: "border-red-500 bg-red-50 focus:border-red-600 focus:ring-red-500/40",
};

/**
 * A labelled, validated form control bound to Formik.
 *
 * It delegates change and blur to Formik's own handlers so `touched` behaves
 * normally, and wires the error message to the input with aria-describedby.
 */
export const Field = ({
  name,
  label,
  type = "text",
  required = false,
  hint,
  options,
  className,
  ...props
}) => {
  const [field, meta] = useField(name);
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;
  const hasError = Boolean(meta.touched && meta.error);
  const controlProps = {
    id: name,
    ...field,
    className: classNames(CONTROL_BASE, CONTROL_STATES[hasError ? "invalid" : "valid"]),
    "aria-invalid": hasError,
    "aria-describedby": classNames(hasError && errorId, hint && hintId) || undefined,
    "aria-required": required || undefined,
    ...props,
  };

  return (
    <div className={classNames("space-y-1.5", className)}>
      <label htmlFor={name} className="block text-sm font-medium text-ink-800">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-0.5 text-red-600">
            *
          </span>
        ) : null}
      </label>

      {options ? (
        <select {...controlProps}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input type={type} {...controlProps} />
      )}

      {hint && !hasError ? (
        <p id={hintId} className="text-xs text-ink-500">
          {hint}
        </p>
      ) : null}

      <ErrorMessage name={name}>
        {(message) => (
          <p id={errorId} role="alert" className="text-xs font-medium text-red-700">
            {message}
          </p>
        )}
      </ErrorMessage>
    </div>
  );
};

export default Field;
