import { useCallback } from "react";

import {
    downloadBracketPdf,
    downloadPertandinganPdf,
} from "../api/turnament/export/export";

import {
    useExportStore,
} from "../stores/exportStore";

export const useExport = () => {
    const {
        babak,
        status,
        exportingPertandingan,
        exportingBracket,
        error,

        setExportingPertandingan,
        setExportingBracket,
        setError,
    } = useExportStore();

    const exportPertandingan =
        useCallback(
            async (
                customBabak = babak,
                customStatus = status
            ) => {
                setError(null);
                setExportingPertandingan(
                    true
                );

                try {
                    await downloadPertandinganPdf(
                        {
                            babak:
                                customBabak,

                            status:
                                customStatus,
                        }
                    );
                } catch (error) {
                    console.error(
                        "Export pertandingan PDF error:",
                        error
                    );

                    setError(
                        "Gagal mengexport PDF pertandingan."
                    );

                    throw error;
                } finally {
                    setExportingPertandingan(
                        false
                    );
                }
            },
            [
                babak,
                status,
                setError,
                setExportingPertandingan,
            ]
        );

    const exportBracket =
        useCallback(async () => {
            setError(null);
            setExportingBracket(true);

            try {
                await downloadBracketPdf();
            } catch (error) {
                console.error(
                    "Export bracket PDF error:",
                    error
                );

                setError(
                    "Gagal mengexport PDF bracket."
                );

                throw error;
            } finally {
                setExportingBracket(false);
            }
        }, [
            setError,
            setExportingBracket,
        ]);

    return {
        babak,
        status,

        exportingPertandingan,
        exportingBracket,

        error,

        exportPertandingan,
        exportBracket,
    };
};