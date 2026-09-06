import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    Alert,
    Box,
    Card,
    CircularProgress,
    Divider,
    IconButton,
    Tooltip,
    Typography,
} from "@mui/material";

import {
    Fullscreen,
    FullscreenExit,
} from "@mui/icons-material";

import {
    useParams,
    useSearchParams,
} from "react-router-dom";

import { useTranslation } from "react-i18next";

import {
    fetchPertandinganById,
} from "../../api/turnament/pertandingan/pertandingan";

import {
    fetchScoreboard,
    fetchScorePerJuri,
} from "../../api/turnament/penilaian/penilaian";

import { Pertandingan } from "../../types/pertandingan";

import {
    Scoreboard,
    ScorePerJuri,
} from "../../types/penilaian";
import LanguageMenu from "../header/LanguageMenu";
import { useStore } from "../../hooks/useStore";

const POLL_INTERVAL_MS = 1000;

export default function ScoreDetail() {
    const { id } = useParams<{ id: string }>();

    const {
        pageTitle,
    } = useStore();

    const [searchParams] =
        useSearchParams();

    const { t } =
        useTranslation();

    const isMonitor =
        searchParams.get("monitor") === "true";

    const pertandinganId = id
        ? Number(id)
        : null;

    const [pertandingan, setPertandingan] =
        useState<Pertandingan | null>(null);

    const [scoreboard, setScoreboard] =
        useState<Scoreboard | null>(null);

    const [scorePerJuri, setScorePerJuri] =
        useState<ScorePerJuri[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [isFullscreen, setIsFullscreen] =
        useState(false);

    const loadData = useCallback(
        async () => {
            if (!pertandinganId) {
                setError(
                    "ID pertandingan tidak valid."
                );

                setLoading(false);

                return;
            }

            try {
                const [
                    detail,
                    board,
                    perJuri,
                ] = await Promise.all([
                    fetchPertandinganById(
                        pertandinganId
                    ),

                    fetchScoreboard(
                        pertandinganId
                    ),

                    fetchScorePerJuri(
                        pertandinganId
                    ),
                ]);

                setPertandingan(detail);

                setScoreboard(
                    board ?? null
                );

                setScorePerJuri(
                    perJuri ?? []
                );

                setError(null);

                setLoading(false);
            } catch (err) {
                console.error(err);

                setError(
                    "Gagal memuat data scoreboard."
                );

                setLoading(false);
            }
        },
        [pertandinganId]
    );

    const getBabakLabel = (babak: string) => {
        const labels: Record<string, string> = {
            penyisihan: t("penyisihan"),
            enam_belas_besar: t("enambelasBesar"),
            perempat_final: t("perempat"),
            semi_final: t("semiFinal"),
            final: t("final"),
        };

        return labels[babak] ?? babak;
    };

    useEffect(() => {
        document.title =
            `${t("turnamentTitle")}${pageTitle
                ? " | " + pageTitle
                : ""
            }`;
    }, [
        pageTitle,
        t,
    ]);

    useEffect(() => {
        if (!pertandinganId) {
            return;
        }

        loadData();

        const interval =
            setInterval(
                loadData,
                POLL_INTERVAL_MS
            );

        return () =>
            clearInterval(interval);
    }, [
        pertandinganId,
        loadData,
    ]);

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (error) {
            console.error(
                "Fullscreen error:",
                error
            );
        }
    };

    useEffect(() => {
        const handleFullscreen =
            () => {
                setIsFullscreen(
                    !!document.fullscreenElement
                );
            };

        document.addEventListener(
            "fullscreenchange",
            handleFullscreen
        );

        return () => {
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreen
            );
        };
    }, []);

    useEffect(() => {
        if (!isMonitor) {
            return;
        }

        const enterFullscreen =
            async () => {
                try {
                    if (
                        !document.fullscreenElement
                    ) {
                        await document.documentElement.requestFullscreen();
                    }
                } catch {
                    // Browser dapat menolak fullscreen
                    // karena membutuhkan user gesture.
                }
            };

        enterFullscreen();
    }, [isMonitor]);

    const getJuriScore = (
        juriId: number,
        pesertaId: number | null
    ) => {
        if (!pesertaId) {
            return 0;
        }

        const found =
            scorePerJuri.find(
                (score) =>
                    score.juri_id ===
                    juriId &&
                    score.peserta_id ===
                    pesertaId
            );

        return found
            ? Number(found.total)
            : 0;
    };

    const getStatusText = () => {
        switch (
        pertandingan?.status
        ) {
            case "belum_mulai":
                return t(
                    "belum_mulai"
                );

            case "berlangsung":
                return t(
                    "berlangsung"
                );

            case "pause":
                return t("pause");

            case "selesai":
                return t("selesai");

            default:
                return "";
        }
    };

    const getStatusColor = () => {
        switch (
        pertandingan?.status
        ) {
            case "berlangsung":
                return "#22c55e";

            case "pause":
                return "#f59e0b";

            case "selesai":
                return "#3b82f6";

            default:
                return "#94a3b8";
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (
        error ||
        !pertandingan
    ) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    background: "#0f172a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 3,
                }}
            >
                <Alert severity="error">
                    {error ??
                        "Pertandingan tidak ditemukan."}
                </Alert>
            </Box>
        );
    }

    const peserta1Name =
        pertandingan.peserta1_name ??
        "Peserta 1";

    const peserta2Name =
        pertandingan.peserta2_name ??
        "Peserta 2";

    const peserta1Score =
        scoreboard?.peserta1.total ??
        0;

    const peserta2Score =
        scoreboard?.peserta2.total ??
        0;

    const daftarJuri = (pertandingan.juri ?? []).filter(
        (juri) =>
            juri.peran === "utama" &&
            Boolean(juri.aktif)
    );

    return (
        <Box
            sx={{
                width: "100vw",
                height: "100vh",
                maxWidth: "100vw",
                maxHeight: "100vh",
                overflow: "hidden",
                background:
                    "linear-gradient(135deg, #0f172a 0%, #111827 50%, #020617 100%)",
                color: "#fff",
                position: "relative",
            }}
        >
            {/* HEADER */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 10,
                    display: "grid",
                    gridTemplateColumns: "1fr auto 1fr",
                    alignItems: "center",
                    px: {
                        xs: 2,
                        sm: 3,
                        md: 5,
                    },
                    py: 2,
                }}
            >
                <Box />

                <Box
                    textAlign="center"
                    sx={{
                        minWidth: 0,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: {
                                xs: 18,
                                sm: 24,
                                md: 32,
                            },
                            fontWeight: 700,
                            letterSpacing: {
                                xs: 1,
                                sm: 2,
                                md: 3,
                            },
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {t("tournamentTitle")}
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.5,
                            color: "#94a3b8",
                            fontSize: {
                                xs: 12,
                                sm: 14,
                                md: 18,
                            },
                            letterSpacing: 1,
                        }}
                    >
                        {t("scoreboardTitle")}
                    </Typography>
                </Box>

                <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                    gap={0.5}
                >
                    <LanguageMenu />

                    <Tooltip
                        title={
                            isFullscreen
                                ? t("exitFullscreen")
                                : t("fullscreen")
                        }
                    >
                        <IconButton
                            onClick={toggleFullscreen}
                            sx={{
                                color: "#fff",
                                width: {
                                    xs: 42,
                                    md: 48,
                                },
                                height: {
                                    xs: 42,
                                    md: 48,
                                },
                                borderRadius: 2,
                                "&:hover": {
                                    background:
                                        "rgba(255,255,255,0.1)",
                                },
                            }}
                        >
                            {isFullscreen ? (
                                <FullscreenExit
                                    sx={{
                                        fontSize: {
                                            xs: 22,
                                            md: 26,
                                        },
                                    }}
                                />
                            ) : (
                                <Fullscreen
                                    sx={{
                                        fontSize: {
                                            xs: 22,
                                            md: 26,
                                        },
                                    }}
                                />
                            )}
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* CONTENT */}
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    px: {
                        xs: 20,
                        sm: 26,
                        md: 46,
                    },
                    py: {
                        xs: 10,
                        sm: 12,
                        md: 13,
                    },
                    transform: {
                        xs: "translateY(-75px)",
                        sm: "translateY(-85px)",
                        md: "translateY(-90px)",
                    },
                }}
            >
                {/* NAMA PESERTA + VS */}
                <Box
                    textAlign="center"
                    mb={{
                        xs: 4,
                        md: 6,
                    }}
                    sx={{
                        background:
                            "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 4,
                        px: {
                            xs: 6,
                            sm: 8,
                            md: 10,
                        },
                        py: {
                            xs: 2,
                            sm: 3,
                            md: 4,
                        },
                        backdropFilter: "blur(10px)",
                        boxShadow:
                            "0 8px 32px rgba(0,0,0,0.25)",
                    }}
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap={{
                            xs: 1.5,
                            sm: 3,
                            md: 5,
                        }}
                        flexWrap="wrap"
                    >
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 18,
                                    sm: 26,
                                    md: 36,
                                },
                                fontWeight: 800,
                                textTransform: "uppercase",
                                textAlign: "center",
                            }}
                        >
                            {peserta1Name}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 18,
                                    sm: 24,
                                    md: 32,
                                },
                                fontWeight: 900,
                                color: "#f87171",
                            }}
                        >
                            VS
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 18,
                                    sm: 26,
                                    md: 36,
                                },
                                fontWeight: 800,
                                textTransform: "uppercase",
                                textAlign: "center",
                            }}
                        >
                            {peserta2Name}
                        </Typography>
                    </Box>

                    <Typography
                        sx={{
                            mt: 1.5,
                            color: "#94a3b8",
                            fontSize: {
                                xs: 12,
                                sm: 14,
                                md: 18,
                            },
                            fontWeight: 500,
                        }}
                    >
                        {t("round")}:{" "}
                        {getBabakLabel(pertandingan.babak)}
                        {" • "}
                        {t("roundLabel")}{" "}
                        {pertandingan.ronde_aktif ?? 1}
                        {" / "}
                        {pertandingan.total_ronde ?? 3}
                    </Typography>
                </Box>

                {/* SCORE */}
                <Box
                    display="flex"
                    gap={{
                        xs: 2,
                        md: 5,
                    }}
                    alignItems="stretch"
                    justifyContent="center"
                >
                    {/* PESERTA 1 */}
                    <Card
                        sx={{
                            flex: 1,
                            maxWidth: 550,
                            background:
                                "linear-gradient(145deg, #991b1b, #450a0a)",
                            color: "#fff",
                            borderRadius: 4,
                            overflow: "hidden",
                            border:
                                "2px solid rgba(255,255,255,0.15)",
                        }}
                    >
                        <Box
                            sx={{
                                px: {
                                    xs: 2,
                                    md: 4,
                                },
                                py: {
                                    xs: 2,
                                    md: 3,
                                },
                                textAlign: "center",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: 16,
                                        md: 26,
                                    },
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    wordBreak: "break-word",
                                }}
                            >
                                {peserta1Name}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: 70,
                                        sm: 100,
                                        md: 150,
                                    },
                                    lineHeight: 1,
                                    fontWeight: 900,
                                    mt: 2,
                                }}
                            >
                                {peserta1Score}
                            </Typography>
                        </Box>
                    </Card>

                    {/* VS */}
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 18,
                                    md: 32,
                                },
                                fontWeight: 900,
                                color: "#f8fafc",
                            }}
                        >
                            VS
                        </Typography>
                    </Box>

                    {/* PESERTA 2 */}
                    <Card
                        sx={{
                            flex: 1,
                            maxWidth: 550,
                            background:
                                "linear-gradient(145deg, #1d4ed8, #172554)",
                            color: "#fff",
                            borderRadius: 4,
                            overflow: "hidden",
                            border:
                                "2px solid rgba(255,255,255,0.15)",
                        }}
                    >
                        <Box
                            sx={{
                                px: {
                                    xs: 2,
                                    md: 4,
                                },
                                py: {
                                    xs: 2,
                                    md: 3,
                                },
                                textAlign: "center",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: 16,
                                        md: 26,
                                    },
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    wordBreak: "break-word",
                                }}
                            >
                                {peserta2Name}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: 70,
                                        sm: 100,
                                        md: 150,
                                    },
                                    lineHeight: 1,
                                    fontWeight: 900,
                                    mt: 2,
                                }}
                            >
                                {peserta2Score}
                            </Typography>
                        </Box>
                    </Card>
                </Box>

                {/* STATUS */}
                <Box
                    textAlign="center"
                    mt={4}
                    mb={4}
                >
                    <Box
                        display="inline-flex"
                        alignItems="center"
                        gap={1}
                    >
                        <Box
                            sx={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                background: getStatusColor(),
                                boxShadow:
                                    `0 0 12px ${getStatusColor()}`,
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 12,
                                    md: 18,
                                },
                                fontWeight: 700,
                                letterSpacing: 1,
                                color: getStatusColor(),
                            }}
                        >
                            {getStatusText()}
                        </Typography>
                    </Box>
                </Box>

                {/* SKOR PER JURI */}
                {daftarJuri.length > 0 && (
                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: 1100,
                            mx: "auto",
                        }}
                    >
                        <Divider
                            sx={{
                                borderColor:
                                    "rgba(255,255,255,0.15)",
                                mb: 3,
                            }}
                        />

                        <Typography
                            textAlign="center"
                            sx={{
                                fontSize: {
                                    xs: 14,
                                    md: 20,
                                },
                                fontWeight: 700,
                                mb: 2,
                                color: "#cbd5e1",
                                textTransform: "uppercase",
                                letterSpacing: 2,
                            }}
                        >
                            {t("scorePerJudge")}
                        </Typography>

                        <Box
                            display="grid"
                            gridTemplateColumns={{
                                xs: "1fr",
                                sm: `repeat(${Math.min(
                                    daftarJuri.length,
                                    3
                                )}, 1fr)`,
                            }}
                            gap={2}
                        >
                            {daftarJuri.map((juri, index) => {
                                const score1 =
                                    getJuriScore(
                                        juri.id,
                                        pertandingan.peserta1_id
                                    );

                                const score2 =
                                    getJuriScore(
                                        juri.id,
                                        pertandingan.peserta2_id
                                    );

                                return (
                                    <Card
                                        key={juri.id}
                                        sx={{
                                            background:
                                                "rgba(255,255,255,0.06)",
                                            color: "#fff",
                                            border:
                                                "1px solid rgba(255,255,255,0.1)",
                                            borderRadius: 3,
                                            backdropFilter:
                                                "blur(10px)",
                                        }}
                                    >
                                        <Box sx={{ p: 2 }}>
                                            <Typography
                                                textAlign="center"
                                                fontWeight={700}
                                                sx={{
                                                    fontSize: {
                                                        xs: 13,
                                                        md: 16,
                                                    },
                                                    mb: 1.5,
                                                }}
                                            >
                                                {juri.full_name ||
                                                    `Juri ${index + 1}`}
                                            </Typography>

                                            <Box
                                                display="flex"
                                                justifyContent="center"
                                                alignItems="center"
                                                gap={3}
                                            >
                                                <Box textAlign="center">
                                                    <Typography
                                                        sx={{
                                                            color: "#fca5a5",
                                                            fontSize: 11,
                                                        }}
                                                    >
                                                        {peserta1Name}
                                                    </Typography>

                                                    <Typography
                                                        fontSize={28}
                                                        fontWeight={900}
                                                    >
                                                        {score1}
                                                    </Typography>
                                                </Box>

                                                <Typography color="text.secondary">
                                                    -
                                                </Typography>

                                                <Box textAlign="center">
                                                    <Typography
                                                        sx={{
                                                            color: "#93c5fd",
                                                            fontSize: 11,
                                                        }}
                                                    >
                                                        {peserta2Name}
                                                    </Typography>

                                                    <Typography
                                                        fontSize={28}
                                                        fontWeight={900}
                                                    >
                                                        {score2}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Card>
                                );
                            })}
                        </Box>
                    </Box>
                )}

                {daftarJuri.length === 0 && (
                    <Typography
                        textAlign="center"
                        color="#64748b"
                        mt={3}
                    >
                        {t("noJudgeAssigned")}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}