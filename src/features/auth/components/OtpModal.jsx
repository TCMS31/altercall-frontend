import { useMutation } from "@apollo/client";
import { Form, Formik } from "formik";
import { useCallback, useState } from "react";

import Alert from "../../../components/ui/Alert";
import Button from "../../../components/ui/Button";
import Field from "../../../components/ui/Field";
import Modal from "../../../components/ui/Modal";
import { validateOtp } from "../../../lib/validation";
import { USER_CONFIRMATION_MUTATION } from "../api/mutations";

/**
 * Collects the emailed confirmation code. The modal stays open on failure so the
 * user can correct the code instead of losing the flow.
 */
export const OtpModal = ({ shouldShow, onClose, onConfirmed, username, email }) => {
  const [confirmUser] = useMutation(USER_CONFIRMATION_MUTATION);
  const [formError, setFormError] = useState(null);

  const handleSubmit = useCallback(
    async (values, { setSubmitting }) => {
      setFormError(null);
      try {
        const { data } = await confirmUser({
          variables: { username, otp: values.otp.trim() },
        });

        if (!data?.confirmUser?.success) {
          setFormError("That code did not match. Check the email and try again.");
          return;
        }
        onConfirmed?.();
      } catch (error) {
        setFormError(error?.message ?? "We could not confirm the code.");
      } finally {
        setSubmitting(false);
      }
    },
    [confirmUser, onConfirmed, username]
  );

  return (
    <Modal show={shouldShow} onClose={onClose} title="Confirm your email">
      <p className="mb-4 text-sm text-ink-500">
        We sent a six-digit code to {email ? <strong>{email}</strong> : "your inbox"}. Enter it
        to activate the account.
      </p>
      <Formik initialValues={{ otp: "" }} validate={validateOtp} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form className="space-y-4" noValidate>
            {formError ? (
              <Alert tone="error" title="Confirmation failed">
                {formError}
              </Alert>
            ) : null}
            <Field
              name="otp"
              label="Confirmation code"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              required
            />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" busy={isSubmitting} busyLabel="Confirming…">
                Confirm
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default OtpModal;
