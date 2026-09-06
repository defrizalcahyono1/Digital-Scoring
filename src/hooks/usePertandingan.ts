import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    fetchPertandingan,
    fetchPertandinganById,
    deletePertandingan as deletePertandinganApi,
    startPertandingan as startPertandinganApi,
    pausePertandingan as pausePertandinganApi,
    resumePertandingan as resumePertandinganApi,
    finishRonde as finishRondeApi,
    finishPertandingan as finishPertandinganApi,
    replaceJudge as replaceJudgeApi,
    updateTimer as updateTimerApi,
} from "../api/turnament/pertandingan/pertandingan";

import {
    usePertandinganStore,
} from "../stores/pertandinganStore";

import {
    BabakPertandingan,
    FinishRondeRequest,
    ReplaceJudgeRequest,
} from "../types/pertandingan";

export const usePertandingan = (
    babak?: BabakPertandingan
) => {
    const {
        pertandingan,
        selectedPertandingan,
        activePertandingan,

        setPertandingan,
        setActivePertandingan,
        updateActivePertandingan,
    } = usePertandinganStore();

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const loadPertandingan =
        useCallback(async () => {
            try {
                setLoading(true);
                setError(null);

                const data =
                    await fetchPertandingan(
                        babak
                    );

                setPertandingan(data);
            } catch (err: any) {
                setError(
                    err?.response?.data?.message ??
                    "Gagal mengambil data pertandingan."
                );
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 4000);
            }
        }, [
            babak,
            setPertandingan,
        ]);

    const loadDetail =
        useCallback(
            async (id: number) => {
                try {
                    setLoading(true);
                    setError(null);

                    const data =
                        await fetchPertandinganById(
                            id
                        );

                    setActivePertandingan(
                        data
                    );

                    return data;
                } catch (err: any) {
                    setError(
                        err?.response?.data?.message ??
                        "Gagal mengambil detail pertandingan."
                    );

                    throw err;
                } finally {
                    setLoading(false);
                }
            },
            [setActivePertandingan]
        );

    const removePertandingan =
        async (id: number) => {
            try {
                setLoading(true);

                await deletePertandinganApi(
                    id
                );

                await loadPertandingan();
            } finally {
                setLoading(false);
            }
        };

    const startPertandingan =
        async (id: number) => {
            const data =
                await startPertandinganApi(
                    id
                );

            setActivePertandingan(
                data
            );

            return data;
        };

    const pausePertandingan =
        async (
            id: number,
            sisaDetik: number
        ) => {
            const data =
                await pausePertandinganApi(
                    id,
                    sisaDetik
                );

            setActivePertandingan(
                data
            );

            return data;
        };

    const resumePertandingan =
        async (id: number) => {
            const data =
                await resumePertandinganApi(
                    id
                );

            setActivePertandingan(
                data
            );

            return data;
        };

    const finishRonde =
        async (
            id: number,
            data: FinishRondeRequest
        ) => {
            const result =
                await finishRondeApi(
                    id,
                    data
                );

            setActivePertandingan(
                result
            );

            return result;
        };

    const finishPertandingan =
        async (
            id: number,
            alasan:
                | "waktu_habis"
                | "selisih_skor"
                | "KO"
                | "wasit_juri" =
                "waktu_habis"
        ) => {
            const result =
                await finishPertandinganApi(
                    id,
                    alasan
                );

            return result;
        };

    const replaceJudge =
        async (
            pertandinganId: number,
            data: ReplaceJudgeRequest
        ) => {
            const result =
                await replaceJudgeApi(
                    pertandinganId,
                    data
                );

            setActivePertandingan(
                result
            );

            return result;
        };

    const updateTimer =
        async (
            id: number,
            sisaDetik: number
        ) => {
            const data =
                await updateTimerApi(
                    id,
                    {
                        sisa_detik:
                            sisaDetik,
                    }
                );

            updateActivePertandingan(
                data
            );

            return data;
        };

    useEffect(() => {
        loadPertandingan();
    }, [loadPertandingan]);

    return {
        pertandingan,
        selectedPertandingan,
        activePertandingan,
        loading,
        error,
        reload:
            loadPertandingan,

        loadDetail,
        removePertandingan,
        startPertandingan,
        pausePertandingan,
        resumePertandingan,
        finishRonde,
        finishPertandingan,
        replaceJudge,
        updateTimer,
    };
};