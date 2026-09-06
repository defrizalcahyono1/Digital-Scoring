import { create } from 'zustand';
import { PIC as PICType } from '../types/pic';

interface PICState {
  pic: PICType[];
  loading: boolean;
  selectedPIC: PICType | null;
  sidebarOpen: boolean;
  pageTitle: string;
  setPIC: (pic: PICType[]) => void;
  setLoading: (loading: boolean) => void;
  setSelectedPIC: (pic: PICType | null) => void;
  toggleSidebar: () => void;
  setPageTitle: (title: string) => void;
}

export const usePICStore = create<PICState>((set) => ({
  pic: [],
  loading: true,
  selectedPIC: null,
  sidebarOpen: true,
  pageTitle: '',
  setPIC: (pic) => set({ pic }),
  setLoading: (loading) => set({ loading }),
  setSelectedPIC: (pic) => set({ selectedPIC: pic }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setPageTitle: (title) => set({ pageTitle: title }),
}));
