import { StateStorage } from 'zustand/middleware';

export const safeStorage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      return localStorage.getItem(name);
    } catch (e) {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value);
    } catch (e) {
      console.warn(`[safeStorage] Failed to setItem for ${name}. Quota may be exceeded or browser is in private mode.`);
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name);
    } catch (e) {
      console.warn(`[safeStorage] Failed to removeItem for ${name}.`);
    }
  }
};
