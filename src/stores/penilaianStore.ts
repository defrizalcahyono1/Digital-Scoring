import { create } from "zustand";

import {
    PenilaianHistoryItem,
    Scoreboard,
    ScorePerJuri,
} from "../types/penilaian";

interface PenilaianStore {
    history: PenilaianHistoryItem[];

    scoreboard: Scoreboard | null;

    scorePerJuri: ScorePerJuri[];

    setHistory: (
        data: PenilaianHistoryItem[]
    ) => void;

    setScoreboard: (
        data: Scoreboard | null
    ) => void;

    setScorePerJuri: (
        data: ScorePerJuri[]
    ) => void;

    clear: () => void;
}

export const usePenilaianStore =
    create<PenilaianStore>((set) => ({
        history: [],

        scoreboard: null,

        scorePerJuri: [],

        setHistory: (data) =>
            set({
                history: data,
            }),

        setScoreboard: (data) =>
            set({
                scoreboard: data,
            }),

        setScorePerJuri: (data) =>
            set({
                scorePerJuri: data,
            }),

        clear: () =>
            set({
                history: [],
                scoreboard: null,
                scorePerJuri: [],
            }),
    }));