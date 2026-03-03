import SignUpSuccessCard from "@/components/authentication/SignUpSuccessCard";
import { useDocumentTitle } from "@/lib/utils";

const SignupSuccess = () => {
  useDocumentTitle("Dashboard");

  return <SignUpSuccessCard />;
};

export default SignupSuccess;
