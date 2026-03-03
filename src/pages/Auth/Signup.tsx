import { SignUpForm } from "@/components/authentication/SignUpForm";
import { useDocumentTitle } from "@/lib/utils";

const Signup = () => {
  useDocumentTitle("Sign up");

  return <SignUpForm />;
};

export default Signup;
