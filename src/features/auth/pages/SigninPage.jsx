import { Link } from "react-router";

import AuthLayout from "../../../components/ui/AuthLayout";
import SigninForm from "../components/SigninForm";

export const SigninPage = () => (
  <AuthLayout
    title="Sign in"
    subtitle="Pick up where you left off with your athletes."
    footer={
      <>
        Do not have an account?{" "}
        <Link
          className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
          to="/signup"
        >
          Create one
        </Link>
      </>
    }
  >
    <SigninForm />
  </AuthLayout>
);

export default SigninPage;
