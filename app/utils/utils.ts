import { create } from "zustand";

interface TokenStore {
    token: string | null;
    setToken: (token: string) => void;
    removeToken: () => void;
}

interface SitesStore {
    sites: any[];
    setSites: (sites: any[]) => void;
}

export const tokenStore = create<TokenStore>((set) => ({
    token: null,
    setToken: (token: string) => set({ token }),
    removeToken: () => set({ token: null }),
}))

export const sitesStore = create<SitesStore>((set) => ({
    sites: [],
    setSites: (sites: any[]) => set({ sites }),
}))
