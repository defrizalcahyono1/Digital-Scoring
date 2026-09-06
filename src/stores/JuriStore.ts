import { create } from 'zustand';
import { Juri as JuriType } from '../types/juri';

interface JuriState {
  Juri: JuriType[];
  loading: boolean;
  selectedJuri: JuriType | null;
  sidebarOpen: boolean;
  pageTitle: string;
  setJuri: (Juri: JuriType[]) => void;
  setLoading: (loading: boolean) => void;
  setSelectedJuri: (Juri: JuriType | null) => void;
  toggleSidebar: () => void;
  setPageTitle: (title: string) => void;
}

export const useJuriStore = create<JuriState>((set) => ({
  Juri: [],
  loading: true,
  selectedJuri: null,
  sidebarOpen: true,
  pageTitle: '',
  setJuri: (Juri) => set({ Juri }),
  setLoading: (loading) => set({ loading }),
  setSelectedJuri: (Juri) => set({ selectedJuri: Juri }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setPageTitle: (title) => set({ pageTitle: title }),
}));
