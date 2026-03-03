import type { Profile } from "@/types/User";
import { create } from "zustand";

interface UserStore {
  selectedUser: Profile | null;
  setSelectedUser: (User: Profile | null) => void;
  clearSelectedUser: () => void;
}

const useUserStore = create<UserStore>((set) => ({
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
  clearSelectedUser: () => set({ selectedUser: null }),
}));

export default useUserStore;
