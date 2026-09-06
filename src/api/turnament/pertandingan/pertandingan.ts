import API from "../../../api/api";

import {
    Pertandingan,
    CreatePertandinganRequest,
    UpdatePertandinganRequest,
    FinishRondeRequest,
    FinishRondeResponse,
    FinishPertandinganResponse,
    ReplaceJudgeRequest,
    UpdateTimerRequest,
} from "../../../types/pertandingan";

const API_URL = "/pertandingan";

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export const fetchPertandingan = async (
    babak?: string
): Promise<Pertandingan[]> => {
    const response =
        await API.get<ApiResponse<Pertandingan[]>>(
            babak
                ? `${API_URL}?babak=${babak}`
                : API_URL
        );

    return response.data.data;
};

export const fetchRiwayatPertandingan = async (
    babak?: string
): Promise<Pertandingan[]> => {
    const response =
        await API.get<ApiResponse<Pertandingan[]>>(
            babak
                ? `${API_URL}/riwayat?babak=${babak}`
                : `${API_URL}/riwayat`
        );

    return response.data.data;
};

export const fetchPertandinganById = async (
    id: number
): Promise<Pertandingan> => {
    const response =
        await API.get<ApiResponse<Pertandingan>>(
            `${API_URL}/${id}`
        );

    return response.data.data;
};

export const createPertandingan = async (
    data: CreatePertandinganRequest
): Promise<Pertandingan> => {
    const response =
        await API.post<ApiResponse<Pertandingan>>(
            API_URL,
            data
        );

    return response.data.data;
};

export const updatePertandingan = async (
    id: number,
    data: UpdatePertandinganRequest
): Promise<Pertandingan> => {

    const response =
        await API.put<ApiResponse<Pertandingan>>(
            `${API_URL}/${id}`,
            data
        );
    return response.data.data;
};

export const deletePertandingan = async (
    id: number
): Promise<void> => {
    await API.delete(`${API_URL}/${id}`);
};

export const startPertandingan = async (
    id: number
): Promise<Pertandingan> => {
    const response =
        await API.post<ApiResponse<Pertandingan>>(
            `${API_URL}/${id}/start`
        );

    return response.data.data;
};

export const pausePertandingan = async (
    id: number,
    sisa_detik: number
): Promise<Pertandingan> => {
    const response =
        await API.put<ApiResponse<Pertandingan>>(
            `${API_URL}/${id}/pause`,
            {
                sisa_detik,
            }
        );

    return response.data.data;
};

export const resumePertandingan = async (
    id: number
): Promise<Pertandingan> => {
    const response =
        await API.put<ApiResponse<Pertandingan>>(
            `${API_URL}/${id}/resume`
        );

    return response.data.data;
};

export const finishRonde = async (
    id: number,
    data: FinishRondeRequest
): Promise<FinishRondeResponse> => {
    const response =
        await API.post<ApiResponse<FinishRondeResponse>>(
            `${API_URL}/${id}/ronde/finish`,
            data
        );

    return response.data.data;
};

export const finishPertandingan = async (
    id: number,
    alasan:
        | "waktu_habis"
        | "selisih_skor"
        | "KO"
        | "wasit_juri" = "waktu_habis"
): Promise<FinishPertandinganResponse> => {
    const response =
        await API.post<ApiResponse<FinishPertandinganResponse>>(
            `${API_URL}/${id}/finish`,
            {
                alasan,
            }
        );

    return response.data.data;
};

export const replaceJudge = async (
    pertandinganId: number,
    data: ReplaceJudgeRequest
): Promise<Pertandingan> => {
    const response =
        await API.post<ApiResponse<Pertandingan>>(
            `${API_URL}/${pertandinganId}/juri/replace`,
            data
        );

    return response.data.data;
};

export const updateTimer = async (
    id: number,
    data: UpdateTimerRequest
): Promise<Pertandingan> => {
    const response =
        await API.put<ApiResponse<Pertandingan>>(
            `${API_URL}/${id}/timer`,
            data
        );

    return response.data.data;
};

export const fetchScoreboard = async (
    id: number
) => {
    const response =
        await API.get<ApiResponse<any>>(
            `${API_URL}/${id}/scoreboard`
        );

    return response.data.data;
};