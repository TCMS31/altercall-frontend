import { useMutation } from "@apollo/client";
import { Button, Spinner } from "../../../components/ui/flowbite";
import { Form, Formik } from "formik";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import Alert from "../../../components/ui/Alert";
import Field from "../../../components/ui/Field";
import { validateSignin } from "../../../lib/validation";
import { SIGNIN_MUTATION } from "../api/mutations";
import { useSession } from "../session/SessionContext";

const INITIAL_VALUES = { email: "", password: "" };

export const SigninForm = ({ redirectTo = "/" }) => {
  const navigate = useNavigate();
  const { signIn } = useSession();
  const [signinMutation] = useMutation(SIGNIN_MUTATION);
  const [formError, setFormError] = useState(null);

  const handleSubmit = useCallback(
    async (values, { setSubmitting }) => {
      setFormError(null);
      try {
        const { data } = await signinMutation({
          variables: { username: values.email.trim(), password: values.password },
        });

        // The server answers 200 with a null payload for bad credentials, so an
        // absent access token has to be treated as a failure rather than a login.
        signIn(data?.signin);
        navigate(redirectTo, { replace: true });
      } catch (error) {
        setFormError(error?.message ?? "We could not sign you in. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [navigate, redirectTo, signIn, signinMutation]
  );

  return (
    <Formik initialValues={INITIAL_VALUES} validate={validateSignin} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form className="space-y-4" noValidate>
          {formError ? (
            <Alert tone="error" title="Sign-in failed">
              {formError}
            </Alert>
          ) : null}

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
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />

          <Button type="submit" color="brand" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner size="sm" aria-hidden="true" />
                <span className="ml-2">Signing in…</span>
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default SigninForm;
