import classNames from "classnames";
import { Label, Select, TextInput } from "./flowbite";
import { ErrorMessage, useField } from "formik";

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
  const Control = options ? Select : TextInput;

  return (
    <div className={classNames("space-y-1.5", className)}>
      <Label htmlFor={name} className="text-sm font-medium text-ink-800">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-0.5 text-red-500">
            *
          </span>
        ) : null}
      </Label>

      <Control
        id={name}
        {...field}
        {...(options ? {} : { type })}
        color={hasError ? "failure" : "gray"}
        aria-invalid={hasError}
        aria-describedby={classNames(hasError && errorId, hint && hintId) || undefined}
        aria-required={required || undefined}
        {...props}
      >
        {options
          ? options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          : null}
      </Control>

      {hint && !hasError ? (
        <p id={hintId} className="text-xs text-ink-500">
          {hint}
        </p>
      ) : null}

      <ErrorMessage name={name}>
        {(message) => (
          <p id={errorId} role="alert" className="text-xs font-medium text-red-600">
            {message}
          </p>
        )}
      </ErrorMessage>
    </div>
  );
};

export default Field;
