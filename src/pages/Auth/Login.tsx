import { LoginForm } from "@/components/authentication/LoginForm";
import { useDocumentTitle } from "@/lib/utils";

const Login = () => {
  useDocumentTitle("Login");

  return <LoginForm />;
};

export default Login;
