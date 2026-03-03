import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { LogOutIcon } from "lucide-react";
import { useNavigate } from "react-router";

export function LogoutButton() {
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/auth/login");
  };

  return (
    <Button
      variant={"ghost"}
      size="sm"
      className="text-destructive hover:text-destructive"
      onClick={logout}
    >
      <LogOutIcon className="text-destructive mr-1" /> Logout
    </Button>
  );
}
