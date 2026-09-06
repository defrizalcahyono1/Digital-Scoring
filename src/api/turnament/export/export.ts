import API from "../../api";

import type {
    ExportPertandinganParams,
} from "../../../types/export";

const downloadBlob = (
    blob: Blob,
    filename: string
) => {
    const url =
        window.URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;
    link.download = filename;
    link.style.display = "none";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    setTimeout(() => {
        window.URL.revokeObjectURL(url);
    }, 1000);
};

export const downloadPertandinganPdf =
    async (
        params: ExportPertandinganParams = {}
    ): Promise<void> => {
        const response = await API.get<Blob>(
            "/export/pertandingan",
            {
                params: {
                    babak:
                        params.babak || "semua",

                    status:
                        params.status || "semua",
                },

                responseType: "blob",
            }
        );

        console.log(
            "========== PDF RESPONSE =========="
        );

        console.log(
            "HTTP status:",
            response.status
        );

        console.log(
            "Content-Type:",
            response.headers[
                "content-type"
            ]
        );

        console.log(
            "Blob size:",
            response.data.size
        );

        console.log(
            "Blob type:",
            response.data.type
        );

        // =========================================
        // CEK ISI AWAL FILE
        // =========================================

        const text =
            await response.data.slice(
                0,
                20
            ).text();

        console.log(
            "PDF HEADER:",
            JSON.stringify(text)
        );

        console.log(
            "=================================="
        );

        // =========================================
        // PASTIKAN RESPONSE BENAR-BENAR PDF
        // =========================================

        if (
            !text.startsWith("%PDF")
        ) {
            console.error(
                "Response BE BUKAN PDF!"
            );

            console.error(
                "Isi response:",
                text
            );

            throw new Error(
                "Response export bukan file PDF."
            );
        }

        const blob = new Blob(
            [response.data],
            {
                type: "application/pdf",
            }
        );

        downloadBlob(
            blob,
            "laporan-pertandingan.pdf"
        );
    };

export const downloadBracketPdf =
    async (): Promise<void> => {
        const response = await API.get<Blob>(
            "/export/bracket",
            {
                responseType: "blob",
            }
        );

        console.log(
            "Bracket PDF response:",
            {
                status: response.status,
                contentType:
                    response.headers[
                        "content-type"
                    ],
                blobSize:
                    response.data.size,
                blobType:
                    response.data.type,
            }
        );

        const blob = new Blob(
            [response.data],
            {
                type: "application/pdf",
            }
        );

        downloadBlob(
            blob,
            "tournament-bracket.pdf"
        );
    };