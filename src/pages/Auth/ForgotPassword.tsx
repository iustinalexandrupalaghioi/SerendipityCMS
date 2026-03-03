import { ForgotPasswordForm } from "@/components/authentication/ForgotPasswordForm";
import { useDocumentTitle } from "@/lib/utils";

const ForgotPassword = () => {
  useDocumentTitle("Forgot password");

  return <ForgotPasswordForm />;
};

export default ForgotPassword;
