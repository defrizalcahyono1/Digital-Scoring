import { create } from "zustand";

import { Pertandingan, Ronde } from "../types/pertandingan";

interface PertandinganStore {
  pertandingan: Pertandingan[];

  selectedPertandingan: Pertandingan | null;

  activePertandingan: Pertandingan | null;

  setPertandingan: (data: Pertandingan[]) => void;

  setSelectedPertandingan: (data: Pertandingan | null) => void;

  setActivePertandingan: (data: Pertandingan | null) => void;

  updateActivePertandingan: (data: Partial<Pertandingan>) => void;

  updateSelectedPertandingan: (data: Partial<Pertandingan>) => void;

  setActiveRonde: (ronde: Ronde) => void;

  clearPertandingan: () => void;

  clearActivePertandingan: () => void;
}

export const usePertandinganStore = create<PertandinganStore>((set) => ({
  pertandingan: [],

  selectedPertandingan: null,

  activePertandingan: null,

  setPertandingan: (data) =>
    set({
      pertandingan: data,
    }),

  setSelectedPertandingan: (data) =>
    set({
      selectedPertandingan: data,
    }),

  setActivePertandingan: (data) =>
    set({
      activePertandingan: data,
    }),

  updateActivePertandingan: (data) =>
    set((state) => ({
      activePertandingan: state.activePertandingan
        ? {
            ...state.activePertandingan,
            ...data,
          }
        : null,
    })),

  updateSelectedPertandingan: (data) =>
    set((state) => ({
      selectedPertandingan: state.selectedPertandingan
        ? {
            ...state.selectedPertandingan,
            ...data,
          }
        : null,
    })),

  setActiveRonde: (ronde) =>
    set((state) => ({
      activePertandingan: state.activePertandingan
        ? {
            ...state.activePertandingan,
            ronde_aktif: ronde,
          }
        : null,
    })),

  clearPertandingan: () =>
    set({
      pertandingan: [],
      selectedPertandingan: null,
    }),

  clearActivePertandingan: () =>
    set({
      activePertandingan: null,
    }),
}));
