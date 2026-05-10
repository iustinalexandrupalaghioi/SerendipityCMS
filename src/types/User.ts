type UserRole = "admin" | "user";

export type Profile = {
  id: string;
  display_id: number;
  email: string;
  role: UserRole;
  created_at: string;
  full_name: string;
  date_of_birth: string;
  avatar_url: string;
};
