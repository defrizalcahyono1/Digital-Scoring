export type Ronde = 1 | 2 | 3;

export type JenisPenilaian =
    | "PUKULAN"
    | "TENDANGAN"
    | "JATUHAN"
    | "TEGURAN1"
    | "TEGURAN2"
    | "PERINGATAN1"
    | "PERINGATAN2";

export const POINT: Record<JenisPenilaian, number> = {
    PUKULAN: 1,
    TENDANGAN: 2,
    JATUHAN: 3,
    TEGURAN1: -1,
    TEGURAN2: -2,
    PERINGATAN1: -5,
    PERINGATAN2: -10,
};

export interface PenilaianHistoryItem {
    id: number;
    ronde: Ronde;
    jenis: JenisPenilaian;
    poin: number;
    keterangan: string | null;
    created_at: string;

    juri_id: number;
    juri: string;
    peran_juri?: "utama" | "cadangan";

    peserta_id: number;
    peserta: string;
}

export interface CreatePenilaianRequest {
    pertandingan_id: number;
    peserta_id: number;
    jenis: JenisPenilaian;
    keterangan?: string;
}

export interface ScoreboardJuriDetail {
    id: number;
    nama: string;
    peran: "utama" | "cadangan";
    aktif: boolean;
    total: number;
}

export interface ScoreboardRonde {
    ronde: Ronde;
    total: number;
}

export interface ScoreboardPeserta {
    id: number;
    nama: string;
    regional: string;

    total: number;

    per_ronde: ScoreboardRonde[];

    juri: ScoreboardJuriDetail[];
}

export interface ScoreboardJuri {
    id: number;
    full_name: string;
    peran: "utama" | "cadangan";
    aktif: boolean;
}

export interface Scoreboard {
    id: number;

    babak: string;

    status:
        | "belum_mulai"
        | "berlangsung"
        | "pause"
        | "selesai";

    ronde_aktif: Ronde;
    total_ronde: number;

    durasi_ronde_menit: 2 | 3;

    sisa_detik: number | null;

    alasan_selesai:
        | "waktu_habis"
        | "selisih_skor"
        | "KO"
        | "wasit_juri"
        | "bye"
        | null;

    winner_id: number | null;

    peserta1: ScoreboardPeserta;
    peserta2: ScoreboardPeserta;

    juri: ScoreboardJuri[];
}

export interface ScorePerJuri {
    juri_id: number;
    full_name: string;
    peran: "utama" | "cadangan";
    aktif: boolean;

    ronde: Ronde;
    peserta_id: number;
    total: number;
}