export const BABAK_VALUES = [
    "semua",
    "penyisihan",
    "enam_belas_besar",
    "perempat_final",
    "semi_final",
    "final",
] as const;

export type BabakFilter =
    (typeof BABAK_VALUES)[number];

export const STATUS_VALUES = [
    "semua",
    "belum_mulai",
    "berlangsung",
    "pause",
    "selesai",
] as const;

export type StatusFilter =
    (typeof STATUS_VALUES)[number];

export interface ExportJuri {
    id: number;
    nama: string;
}

export interface ExportPeserta {
    id: number;
    nama: string;
    berat: number | string | null;
    regional: string | null;
    total: number;
}

export interface ExportScorePerJuri {
    juri_id: number;
    juri: string;
    peserta1_score: number;
    peserta2_score: number;
}

export interface ExportPertandingan {
    id: number;
    babak: Exclude<
        BabakFilter,
        "semua"
    >;
    status: Exclude<
        StatusFilter,
        "semua"
    >;
    winner_id: number | null;
    waktu_mulai: string | null;
    waktu_selesai: string | null;

    peserta1: ExportPeserta;
    peserta2: ExportPeserta | null;

    juri: ExportJuri[];
    scorePerJuri: ExportScorePerJuri[];
}

export interface ExportPertandinganParams {
    babak?: BabakFilter;
    status?: StatusFilter;
}

export interface ExportBracketPeserta {
    id: number;
    nama: string;
    score: number;
}

export interface ExportBracketMatch {
    id: number;
    babak: Exclude<
        BabakFilter,
        "semua"
    >;
    status: Exclude<
        StatusFilter,
        "semua"
    >;
    winner_id: number | null;

    peserta1: ExportBracketPeserta;
    peserta2: ExportBracketPeserta | null;
}