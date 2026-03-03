import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { LogoutButton } from "./LogoutButton";
import { useAuth } from "@/contexts/AuthContext";

export function AuthButton() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return <LogoutButton />;
  }

  return (
    <div className="flex gap-2">
      <Link to="/auth/login">
        <Button size="sm" variant="outline">
          Sign in
        </Button>
      </Link>
      <Link to="/auth/signup">
        <Button size="sm" variant="default">
          Sign up
        </Button>
      </Link>
    </div>
  );
}
