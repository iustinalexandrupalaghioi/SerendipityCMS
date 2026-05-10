import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Profile } from "@/types/User";
import { useNavigate } from "react-router";

type AuthContextType = {
  user: Profile | null;
  provider: string | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<Profile | null>>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  provider: null,
  loading: true,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || data?.role !== "admin") {
      await supabase.auth.signOut();
      navigate("/unauthorized", { replace: true });
      return null;
    }

    // If avatar is a storage path (not a Google URL), sign it
    if (data.avatar_url && !data.avatar_url.startsWith("http")) {
      const { data: signedData } = await supabase.storage
        .from("avatars")
        .createSignedUrl(data.avatar_url, 60 * 60 * 24 * 7);
      return { ...data, avatar_url: signedData?.signedUrl ?? "" };
    }

    return data;
  };

  useEffect(() => {
    (async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        const profile = await fetchProfile(authUser.id);
        setUser(profile);
        setProvider(authUser.app_metadata?.provider ?? null);
      }

      setLoading(false);
    })();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        (async () => {
          if (session?.user) {
            const profile = await fetchProfile(session.user.id);
            setUser(profile);
            setProvider(session.user.app_metadata?.provider ?? null);
          } else {
            setUser(null);
            setProvider(null);
          }
        })();
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, provider, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
