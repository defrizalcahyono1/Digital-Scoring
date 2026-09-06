import API from "../../../api/api";

import {
    CreatePenilaianRequest,
    PenilaianHistoryItem,
    Scoreboard,
    ScorePerJuri,
} from "../../../types/penilaian";

const API_URL = "/penilaian";

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}

export const createPenilaian = async (
    data: CreatePenilaianRequest
) => {
    const response =
        await API.post<ApiResponse<{ id: number }>>(
            API_URL,
            data
        );

    return response.data;
};

export const fetchHistoryPenilaian = async (
    pertandinganId: number
): Promise<PenilaianHistoryItem[]> => {
    const response =
        await API.get<ApiResponse<PenilaianHistoryItem[]>>(
            `${API_URL}/${pertandinganId}/history`
        );

    return response.data.data ?? [];
};

export const undoPenilaian = async (
    pertandinganId: number
) => {
    const response =
        await API.delete<ApiResponse<null>>(
            `${API_URL}/undo/${pertandinganId}`
        );

    return response.data;
};

export const resetPenilaian = async (
    pertandinganId: number
) => {
    const response =
        await API.delete<ApiResponse<null>>(
            `${API_URL}/${pertandinganId}/reset`
        );

    return response.data;
};

export const fetchScoreboard = async (
    pertandinganId: number
): Promise<Scoreboard | null> => {
    const response =
        await API.get<ApiResponse<Scoreboard>>(
            `${API_URL}/${pertandinganId}/scoreboard`
        );

    return response.data.data ?? null;
};

export const fetchTotalScore = async (
    pertandinganId: number
) => {
    const response =
        await API.get<ApiResponse<
            {
                peserta_id: number;
                total: number;
            }[]
        >>(
            `${API_URL}/${pertandinganId}/total`
        );

    return response.data.data ?? [];
};

export const fetchScorePerJuri = async (
    pertandinganId: number
): Promise<ScorePerJuri[]> => {
    const response =
        await API.get<ApiResponse<ScorePerJuri[]>>(
            `${API_URL}/${pertandinganId}/juri`
        );

    return response.data.data ?? [];
};