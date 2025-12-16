import { create } from "zustand";
import { api } from "./api";


interface TokenStore {
  token: string | null;
  setToken: (token: string) => void;
  removeToken: () => void;
}

export const tokenStore = create<TokenStore>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
  removeToken: () => set({ token: null }),
}));

interface Site {
  siteId: string;
  name: string;
}

interface SitesStore {
  sites: Site[];
  selectedSiteId: string | null;
  loading: boolean;

  loadSites: () => Promise<void>;
  setSelectedSiteId: (id: string) => void;
}

export const sitesStore = create<SitesStore>((set, get) => ({
  sites: [],
  selectedSiteId: null,
  loading: false,

  loadSites: async () => {
    // ✅ Prevent duplicate API calls (StrictMode safe)
    if (get().sites.length > 0) return;

    try {
      set({ loading: true });

      const response = await api.getSites();
      const sites = response.data ?? [];

      set({
        sites,
        selectedSiteId: sites[0]?.siteId ?? null,
      });
    } catch (err) {
      console.error("Error loading sites:", err);
    } finally {
      set({ loading: false });
    }
  },

  setSelectedSiteId: (id) => set({ selectedSiteId: id }),
}));

export const TodayDate = () => {
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  return { now, yesterday };
};
