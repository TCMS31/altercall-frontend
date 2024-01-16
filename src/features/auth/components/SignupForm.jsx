import { useMutation } from "@apollo/client";
import { Button, Spinner } from "../../../components/ui/flowbite";
import { Form, Formik } from "formik";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import Alert from "../../../components/ui/Alert";
import Field from "../../../components/ui/Field";
import { validateSignup } from "../../../lib/validation";
import { SIGN_UP_MUTATION } from "../api/mutations";
import OtpModal from "./OtpModal";

const INITIAL_VALUES = { name: "", username: "", email: "", password: "" };

export const SignupForm = () => {
  const navigate = useNavigate();
  const [signUpMutation] = useMutation(SIGN_UP_MUTATION);
  const [pendingUser, setPendingUser] = useState(null);
  const [formError, setFormError] = useState(null);

  const handleSubmit = useCallback(
    async (values, { setSubmitting }) => {
      setFormError(null);
      try {
        const { data } = await signUpMutation({
          // Only the variables the mutation declares are sent; `height` and
          // `weight` were dropped from the schema and must not be passed.
          variables: {
            username: values.username.trim(),
            name: values.name.trim(),
            email: values.email.trim(),
            password: values.password,
          },
        });

        const user = data?.signup?.user;
        if (!user) {
          setFormError("Sign-up did not complete. Please try again.");
          return;
        }
        setPendingUser(user);
      } catch (error) {
        setFormError(error?.message ?? "Sign-up failed. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [signUpMutation]
  );

  return (
    <>
      <Formik initialValues={INITIAL_VALUES} validate={validateSignup} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form className="space-y-4" noValidate>
            {formError ? (
              <Alert tone="error" title="Sign-up failed">
                {formError}
              </Alert>
            ) : null}

            <Field
              name="name"
              label="Full name"
              autoComplete="name"
              placeholder="Alex Morgan"
              required
            />
            <Field
              name="username"
              label="Username"
              autoComplete="username"
              placeholder="alex.morgan"
              required
            />
            <Field
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="coach@altercall.com"
              required
            />
            <Field
              name="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              hint="At least 8 characters, including a letter and a number."
              required
            />

            <Button type="submit" color="brand" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner size="sm" aria-hidden="true" />
                  <span className="ml-2">Creating account…</span>
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </Form>
        )}
      </Formik>

      <OtpModal
        shouldShow={Boolean(pendingUser)}
        username={pendingUser?.username}
        email={pendingUser?.email}
        onClose={() => setPendingUser(null)}
        onConfirmed={() => navigate("/signin", { replace: true })}
      />
    </>
  );
};

export default SignupForm;
