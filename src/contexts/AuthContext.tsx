import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@/types/User";
import { useNavigate } from "react-router";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserWithAvatar = async (supabaseUser: any) => {
      if (!supabaseUser) return null;

      let signedUrl: string | undefined;
      if (supabaseUser.user_metadata.avatar_path) {
        const { data } = await supabase.storage
          .from("avatars")
          .createSignedUrl(supabaseUser.user_metadata.avatar_path, 60 * 60); // 1 hour
        signedUrl = data?.signedUrl;
      }

      if (supabaseUser) {
        let { data: profile, error } = await supabase
          .from("profile")
          .select("role")
          .eq("id", supabaseUser.id)
          .single();

        if (error || profile?.role !== "admin") {
          await supabase.auth.signOut();
          navigate("/unauthorized", { replace: true });
          return null;
        }
        return {
          ...supabaseUser,
          user_metadata: {
            ...supabaseUser.user_metadata,
            avatar_url: signedUrl,
          },
          profile,
        };
      }

      return {
        ...supabaseUser,
        user_metadata: {
          ...supabaseUser.user_metadata,
          avatar_url: signedUrl,
        },
      };
    };

    // Initial fetch on page load
    (async () => {
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser();

      const userWithAvatar = await getUserWithAvatar(supabaseUser);
      setUser(userWithAvatar);
      setLoading(false);
    })();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        (async () => {
          const userWithAvatar = await getUserWithAvatar(session?.user ?? null);
          setUser(userWithAvatar);
        })();
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
