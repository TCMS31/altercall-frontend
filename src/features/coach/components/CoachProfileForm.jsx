import { Button, Spinner } from "../../../components/ui/flowbite";
import { Form, Formik } from "formik";

import Field from "../../../components/ui/Field";
import { validateCoachProfile } from "../../../lib/validation";
import { EXPERIENCE_LEVELS, GOALS } from "../../../services/coach/planner";

export const DEFAULT_PROFILE = {
  age: "",
  height: "",
  goal: "strength",
  experience: "intermediate",
  daysPerWeek: "4",
};

const toOptions = (entries) => entries.map(({ id, label }) => ({ value: id, label }));

const DAY_OPTIONS = [2, 3, 4, 5, 6].map((value) => ({
  value: String(value),
  label: `${value} days a week`,
}));

export const CoachProfileForm = ({ onSubmit, isLoading, initialValues = DEFAULT_PROFILE }) => (
  <Formik
    initialValues={initialValues}
    validate={validateCoachProfile}
    enableReinitialize
    onSubmit={async (values, helpers) => {
      await onSubmit({
        age: Number(values.age),
        height: Number(values.height),
        goal: values.goal,
        experience: values.experience,
        daysPerWeek: Number(values.daysPerWeek),
      });
      helpers.setSubmitting(false);
    }}
  >
    {({ isSubmitting }) => {
      const busy = isSubmitting || isLoading;
      return (
        <Form className="space-y-4" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field name="age" label="Age" inputMode="numeric" placeholder="34" required />
            <Field
              name="height"
              label="Height (ft)"
              inputMode="decimal"
              placeholder="5.9"
              hint="Decimal feet, e.g. 5.9"
              required
            />
          </div>

          <Field name="goal" label="Primary goal" options={toOptions(GOALS)} required />
          <Field
            name="experience"
            label="Training experience"
            options={toOptions(EXPERIENCE_LEVELS)}
            required
          />
          <Field name="daysPerWeek" label="Availability" options={DAY_OPTIONS} required />

          <Button type="submit" color="brand" className="w-full" disabled={busy}>
            {busy ? (
              <>
                <Spinner size="sm" aria-hidden="true" />
                <span className="ml-2">Building plan…</span>
              </>
            ) : (
              "Generate plan"
            )}
          </Button>
        </Form>
      );
    }}
  </Formik>
);

export default CoachProfileForm;
