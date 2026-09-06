import { create } from 'zustand';
import { Peserta as PesertaType } from '../types/peserta';

interface PesertaState {
  Peserta: PesertaType[];
  loading: boolean;
  selectedPeserta: PesertaType | null;
  sidebarOpen: boolean;
  pageTitle: string;
  setPeserta: (Peserta: PesertaType[]) => void;
  setLoading: (loading: boolean) => void;
  setSelectedPeserta: (Peserta: PesertaType | null) => void;
  toggleSidebar: () => void;
  setPageTitle: (title: string) => void;
}

export const usePesertaStore = create<PesertaState>((set) => ({
  Peserta: [],
  loading: true,
  selectedPeserta: null,
  sidebarOpen: true,
  pageTitle: '',
  setPeserta: (Peserta) => set({ Peserta }),
  setLoading: (loading) => set({ loading }),
  setSelectedPeserta: (Peserta) => set({ selectedPeserta: Peserta }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setPageTitle: (title) => set({ pageTitle: title }),
}));
