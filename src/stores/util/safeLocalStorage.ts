import type { StateStorage } from 'zustand/middleware';

export const safeLocalStorage: StateStorage = {
  getItem(name) {
    try {
      return window.localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem(name, value) {
    try {
      window.localStorage.setItem(name, value);
    } catch {
      // Persistence is best-effort; storage failures must not block the app.
    }
  },
  removeItem(name) {
    try {
      window.localStorage.removeItem(name);
    } catch {
      // Persistence is best-effort; storage failures must not block the app.
    }
  },
};
