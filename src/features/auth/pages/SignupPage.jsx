import { Link } from "react-router-dom";

import AuthLayout from "../../../components/ui/AuthLayout";
import SignupForm from "../components/SignupForm";

export const SignupPage = () => (
  <AuthLayout
    title="Create your account"
    subtitle="Two minutes to set up, then start building plans."
    footer={
      <>
        Already have an account?{" "}
        <Link
          className="font-medium text-brand-700 underline-offset-2 hover:underline"
          to="/signin"
        >
          Sign in
        </Link>
      </>
    }
  >
    <SignupForm />
  </AuthLayout>
);

export default SignupPage;
