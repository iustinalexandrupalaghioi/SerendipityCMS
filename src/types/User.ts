export type User = {
  id: string;
  aud: string;
  role: string;
  email: string;
  phone: string;
  is_anonymous: boolean;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    email: string;
    email_verified: boolean;
    first_name: string;
    last_name: string;
    phone_verified: boolean;
    avatar_path: string;
    avatar_url: string;
    date_of_birth: string;
  };
  profile: {
    role: "admin" | "user";
  };
};

export type Profile = {
  id: string;
  email: string;
  role: string;
  created_at: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
};
