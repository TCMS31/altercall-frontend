import { Link } from "react-router-dom";

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
          className="font-medium text-brand-700 underline-offset-2 hover:underline"
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
