import { Link } from "react-router";

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
          className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
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
