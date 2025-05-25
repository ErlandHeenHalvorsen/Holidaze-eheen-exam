import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      hydrated: false,

      setAuth: (user, token) => set({ user, accessToken: token }),
      clearAuth: () => set({ user: null, accessToken: null }),

      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "auth-storage",
      getStorage: () => sessionStorage,
      onRehydrateStorage: () => (state) => {
        state.setHydrated(); 
      },
    }
  )
);
