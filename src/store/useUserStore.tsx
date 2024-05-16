import { create } from 'zustand';

import type { StateCreator } from 'zustand';

interface User {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

interface StoreType {
  user: User | null;
  markSignIn: (user: User) => void;
  markSignOut: () => void;
}

const storeCreator: StateCreator<StoreType> = set => ({
  user: null,
  markSignIn: (user: User) => set({ user }),
  markSignOut: () => set({ user: null }),
});

const useUserStore = create<StoreType>()(storeCreator);

export default useUserStore;
