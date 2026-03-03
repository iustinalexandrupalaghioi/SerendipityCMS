import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Loader from "@/components/ui/loader";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (user.profile?.role !== "admin") {
        (async () => {
          await supabase.auth.signOut();
          navigate("/auth/login", { replace: true });
        })();
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center my-10 p-5">
        <Loader />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/auth/login" replace />;
}
