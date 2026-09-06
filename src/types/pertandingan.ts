export type BabakPertandingan =
    | "penyisihan"
    | "enam_belas_besar"
    | "perempat_final"
    | "semi_final"
    | "final";

export type StatusPertandingan =
    | "belum_mulai"
    | "berlangsung"
    | "pause"
    | "selesai";

export type PeranJuri =
    | "utama"
    | "cadangan";

export type AlasanSelesai =
    | "waktu_habis"
    | "selisih_skor"
    | "KO"
    | "wasit_juri"
    | "bye";

export type Ronde = 1 | 2 | 3;

export interface PesertaPertandingan {
    id: number;
    name: string;
    weight?: number;
    regional?: string;
}

export interface JuriPertandingan {
    id: number;
    full_name: string;
    peran: PeranJuri;
    aktif: boolean;
}

export interface Pertandingan {
    id: number;
    babak: BabakPertandingan;
    durasi_ronde_menit: 2 | 3;
    peserta1_id: number;
    peserta2_id: number;
    peserta1_name: string;
    peserta2_name: string | null;
    peserta1_weight?: number;
    peserta2_weight?: number;
    peserta1_regional?: string;
    peserta2_regional?: string;
    peserta1?: PesertaPertandingan;
    peserta2?: PesertaPertandingan | null;
    winner_id: number | null;
    status: StatusPertandingan;
    ronde_aktif: Ronde;
    total_ronde: 3;
    sisa_detik: number | null;
    alasan_selesai: AlasanSelesai | null;
    waktu_mulai: string | null;
    ronde_mulai_at: string | null;
    waktu_selesai: string | null;
    created_at: string;
    updated_at: string;
    juri: JuriPertandingan[];
}

export interface CreatePertandinganRequest {
    babak: BabakPertandingan;
    peserta1_id: number;
    peserta2_id: number;

    juri_utama: [
        number,
        number,
        number
    ];

    juri_cadangan: [
        number,
        number,
        number
    ];

    durasi_ronde_menit: 2 | 3;
}

export interface UpdatePertandinganRequest {
    babak?: BabakPertandingan;
    durasi_ronde_menit?: 2 | 3;
    peserta1_id?: number;
    peserta2_id?: number;

    juri_utama?: [
        number,
        number,
        number
    ];

    juri_cadangan?: [
        number,
        number,
        number
    ];

    status?: StatusPertandingan;
    winner_id?: number | null;
    waktu_mulai?: string | null;
    waktu_selesai?: string | null;
    sisa_detik?: number | null;
    ronde_aktif?: Ronde;
    alasan_selesai?: AlasanSelesai | null;
}

export interface FinishRondeRequest {
    alasan:
    | "waktu_habis"
    | "selisih_skor"
    | "KO"
    | "wasit_juri";

    sisa_detik?: number;
    winner_id?: number;
}

export interface ReplaceJudgeRequest {
    juri_utama_id: number;
    juri_cadangan_id: number;
}

export interface FinishRondeResponse extends Pertandingan { }

export interface FinishPertandinganResponse {
    winner_id: number;
    total1: number;
    total2: number;
}

export interface UpdateTimerRequest {
    sisa_detik: number;
}