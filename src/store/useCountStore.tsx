import { create } from 'zustand';

import type { StateCreator } from 'zustand';

interface StoreType {
  count: number;
  inc: () => void;
  dec: () => void;
}

const storeCreator: StateCreator<StoreType> = set => ({
  count: 0,
  inc: () => set(state => ({ count: state.count + 1 })),
  dec: () => set(state => ({ count: state.count - 1 })),
});

const useCountStore = create<StoreType>()(storeCreator);

export default useCountStore;
