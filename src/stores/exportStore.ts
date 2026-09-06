import { create } from "zustand";

import type {
    BabakFilter,
    StatusFilter,
} from "../types/export";

interface ExportState {
    babak: BabakFilter;
    status: StatusFilter;

    exportingPertandingan: boolean;
    exportingBracket: boolean;

    error: string | null;

    setBabak: (
        babak: BabakFilter
    ) => void;

    setStatus: (
        status: StatusFilter
    ) => void;

    setExportingPertandingan: (
        value: boolean
    ) => void;

    setExportingBracket: (
        value: boolean
    ) => void;

    setError: (
        error: string | null
    ) => void;

    resetFilter: () => void;
}

export const useExportStore =
    create<ExportState>((set) => ({
        babak: "semua",
        status: "semua",

        exportingPertandingan: false,
        exportingBracket: false,

        error: null,

        setBabak: (babak) =>
            set({
                babak,
                error: null,
            }),

        setStatus: (status) =>
            set({
                status,
                error: null,
            }),

        setExportingPertandingan: (
            value
        ) =>
            set({
                exportingPertandingan:
                    value,
            }),

        setExportingBracket: (
            value
        ) =>
            set({
                exportingBracket: value,
            }),

        setError: (error) =>
            set({ error }),

        resetFilter: () =>
            set({
                babak: "semua",
                status: "semua",
                error: null,
            }),
    }));