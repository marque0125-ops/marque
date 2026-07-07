import { StateStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';

export const safeStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (typeof window === 'undefined') return null;
    try {
      const val = await get(name);
      return val ? (val as string) : null;
    } catch (e) {
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (typeof window === 'undefined') return;
    try {
      await set(name, value);
    } catch (e) {
      console.warn(`[safeStorage] Failed to setItem for ${name}.`);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    if (typeof window === 'undefined') return;
    try {
      await del(name);
    } catch (e) {
      console.warn(`[safeStorage] Failed to removeItem for ${name}.`);
    }
  }
};
