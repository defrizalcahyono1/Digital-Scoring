import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Tooltip,
    Typography,
} from "@mui/material";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

import { capitalizeWords } from "../../utils/format";

import {
    useParams,
} from "react-router-dom";

import { usePertandingan } from "../../hooks/usePertandingan";
import { usePenilaian } from "../../hooks/usePenilaian";
import { usePertandinganTimer } from "../../hooks/usePertandinganTimer";

import {
    JenisPenilaian,
} from "../../types/penilaian";

import {
    AlasanSelesai,
} from "../../types/pertandingan";

import Sidebar from "../bar/Sidebar";
import UserMenu from "../header/UserMenu";
import { useStore } from "../../hooks/useStore";
import { useAuthStore } from "../../stores/authStore";
import { useTranslation } from "react-i18next";

const PLUS_JENIS: {
    label: string;
    jenis: JenisPenilaian;
}[] = [
        {
            label: "1",
            jenis: "PUKULAN",
        },
        {
            label: "2",
            jenis: "TENDANGAN",
        },
        {
            label: "3",
            jenis: "JATUHAN",
        },
    ];

const MINUS_JENIS: {
    label: string;
    jenis: JenisPenilaian;
}[] = [
        {
            label: "-1",
            jenis: "TEGURAN1",
        },
        {
            label: "-2",
            jenis: "TEGURAN2",
        },
        {
            label: "-5",
            jenis: "PERINGATAN1",
        },
        {
            label: "-10",
            jenis: "PERINGATAN2",
        },
    ];

const ControllerMatch = () => {
    const { id } = useParams<{ id?: string }>();
    const { t } = useTranslation();

    const pertandinganId = Number(id);

    const hasMatch =
        pertandinganId !== null &&
        Number.isInteger(pertandinganId) &&
        pertandinganId > 0;

    const {
        sidebarOpen,
        pageTitle,
        setPageTitle
    } = useStore();

    const {
        user,
    } = useAuthStore();

    const drawerWidth = sidebarOpen ? 260 : 30;

    const myJuriId = user?.id;

    const {
        activePertandingan,
        loading: pertandinganLoading,

        loadDetail,

        startPertandingan,
        pausePertandingan,
        resumePertandingan,

        finishRonde,
        finishPertandingan,
        replaceJudge,
    } = usePertandingan();

    const {
        scoreboard,
        history,
        scorePerJuri,

        loading: penilaianLoading,
        error: penilaianError,

        reload: reloadPenilaian,

        submit,
        undo,
    } = usePenilaian(pertandinganId);

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
        if (!activePertandingan) return;

        setPageTitle(
            getBabakLabel(activePertandingan.babak)
        );
    }, [
        activePertandingan,
        setPageTitle,
        t,
    ]);

    const [actionLoading, setActionLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const [
        isFullscreen,
        setIsFullscreen,
    ] = useState(false);

    const [
        controllerElement,
        setControllerElement,
    ] = useState<HTMLDivElement | null>(null);

    const isNewRound =
        activePertandingan != null &&
        activePertandingan.status === "pause" &&
        activePertandingan.ronde_mulai_at === null;

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                if (controllerElement) {
                    await controllerElement.requestFullscreen();
                }
            } else {
                await document.exitFullscreen();
            }
        } catch (err) {
            console.error(
                "Fullscreen error:",
                err
            );
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(
                !!document.fullscreenElement
            );
        };

        document.addEventListener(
            "fullscreenchange",
            handleFullscreenChange
        );

        return () => {
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange
            );
        };
    }, []);

    const handleTimeUp = useCallback(async () => {
        try {
            setActionLoading(true);
            setError(null);
            await finishRonde(
                pertandinganId,
                {
                    alasan: "waktu_habis",
                    sisa_detik: 0,
                }
            );
            await Promise.all([
                loadDetail(pertandinganId),
                reloadPenilaian(),
            ]);
        } catch (err: unknown) {
            console.error(err);
            setError(
                t("roundNotFinished")
            );
        } finally {
            setActionLoading(false);
        }

    }, [
        pertandinganId,
        finishRonde,
        loadDetail,
        reloadPenilaian,
        t,
    ]);

    const {
        timeLeft,
        formattedTime,
        setTimer,
        startTimer,
        stopTimer,
        syncTimer,
    } = usePertandinganTimer({
        pertandinganId,
        isController: true,
        autoSync: true,
        onTimeUp: handleTimeUp,
    });

    useEffect(() => {
        if (!hasMatch) return;

        loadDetail(pertandinganId);
    }, [
        pertandinganId,
        hasMatch,
        loadDetail,
    ]);

    const status =
        activePertandingan?.status ??
        "belum_mulai";

    const pertandinganSelesai =
        status === "selesai";

    const pertandinganBerlangsung =
        status === "berlangsung";

    const pertandinganPause =
        status === "pause";

    const peserta1 =
        scoreboard?.peserta1;

    const peserta2 =
        scoreboard?.peserta2;

    const peserta1Id =
        activePertandingan?.peserta1_id;

    const peserta2Id =
        activePertandingan?.peserta2_id;

    const rondeAktif =
        activePertandingan?.ronde_aktif ??
        1;

    const totalRonde =
        activePertandingan?.total_ronde ??
        3;

    const daftarJuri =
        activePertandingan?.juri ?? [];

    const juriUtamaAktif = useMemo(() => {
        return daftarJuri.filter(
            (juri) =>
                juri.peran === "utama" &&
                Boolean(juri.aktif)
        );
    }, [daftarJuri]);

    const juriCadanganAktif = useMemo(() => {
        return daftarJuri.filter(
            (juri) =>
                juri.peran === "cadangan" &&
                Boolean(juri.aktif)
        );
    }, [daftarJuri]);

    const [judgeMenuAnchor, setJudgeMenuAnchor] =
        useState<null | HTMLElement>(null);

    const judgeMenuOpen =
        Boolean(judgeMenuAnchor);

    const handleOpenJudgeMenu = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        setJudgeMenuAnchor(event.currentTarget);
    };

    const handleCloseJudgeMenu = () => {
        setJudgeMenuAnchor(null);
    };

    const handleReplaceJudge = async (
        juriUtamaId: number,
        juriCadanganId: number
    ) => {
        try {
            setActionLoading(true);
            setError(null);

            await replaceJudge(
                pertandinganId,
                {
                    juri_utama_id: juriUtamaId,
                    juri_cadangan_id: juriCadanganId,
                }
            );

            handleCloseJudgeMenu();

            await Promise.all([
                loadDetail(pertandinganId),
                reloadPenilaian(),
            ]);
        } catch (err: unknown) {
            console.error(
                "Gagal mengganti juri:",
                err
            );

            setError(t("judgeReplacementError"));
        } finally {
            setActionLoading(false);
        }
    };

    const getJuriScore = (
        juriId: number,
        pesertaId: number | null | undefined
    ) => {

        if (!pesertaId) {
            return 0;
        }

        const found =
            scorePerJuri.find(
                (score) =>
                    Number(score.juri_id) ===
                    Number(juriId) &&

                    Number(score.peserta_id) ===
                    Number(pesertaId) &&

                    Number(score.ronde) ===
                    Number(rondeAktif)
            );

        return found
            ? Number(found.total)
            : 0;
    };

    const myScorePeserta1 =
        scoreboard?.peserta1?.juri?.find(
            (juri) =>
                juri.id === myJuriId
        )?.total ?? 0;

    const myScorePeserta2 =
        scoreboard?.peserta2?.juri?.find(
            (juri) =>
                juri.id === myJuriId
        )?.total ?? 0;

    const durasiRondeDetik =
        Number(activePertandingan?.durasi_ronde_menit ?? 2) * 60;

    const formatDurasiRonde = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secondsRemaining = seconds % 60;

        return `${String(minutes).padStart(2, "0")}:${String(
            secondsRemaining
        ).padStart(2, "0")}`;
    };

    const handleStart = async () => {
        try {
            setActionLoading(true);
            setError(null);

            const result =
                await startPertandingan(
                    pertandinganId
                );

            setTimer(
                result.sisa_detik ??
                Number(
                    result.durasi_ronde_menit
                ) * 60
            );

            startTimer();

            await Promise.all([
                loadDetail(
                    pertandinganId
                ),
                reloadPenilaian(),
            ]);
        } catch (err: unknown) {
            console.error(err);

            setError(t("startMatchError"));
        } finally {
            setActionLoading(false);
        }
    };

    const handlePause = async () => {
        try {
            setActionLoading(true);
            setError(null);

            stopTimer();

            await syncTimer();

            await pausePertandingan(
                pertandinganId,
                timeLeft
            );

            await loadDetail(
                pertandinganId
            );
        } catch (err: unknown) {
            console.error(err);

            setError(t("pauseMatchError"));
        } finally {
            setActionLoading(false);
        }
    };

    const handleResume = async () => {
        try {
            setActionLoading(true);
            setError(null);

            const result =
                await resumePertandingan(
                    pertandinganId
                );

            setTimer(
                result.sisa_detik ??
                timeLeft
            );

            startTimer();

            await Promise.all([
                loadDetail(
                    pertandinganId
                ),
                reloadPenilaian(),
            ]);
        } catch (err: unknown) {
            console.error(err);

            setError(t("resumeMatchError"));
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleTimer = () => {
        if (status === "belum_mulai") {
            handleStart();
            return;
        }

        if (status === "berlangsung") {
            handlePause();
            return;
        }

        if (status === "pause") {
            handleResume();
        }
    };

    const handleScore = async (
        pesertaId: number | undefined,
        jenis: JenisPenilaian
    ) => {
        if (!pesertaId) {
            return;
        }

        if (
            !pertandinganBerlangsung ||
            penilaianLoading ||
            actionLoading
        ) {
            return;
        }

        try {
            await submit(
                pesertaId,
                jenis
            );
        } catch (err) {
            console.error(err);
        }
    };

    const handleUndo = async () => {
        if (
            !pertandinganBerlangsung ||
            history.length === 0
        ) {
            return;
        }

        try {
            setActionLoading(true);

            await undo();
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleFinishRonde = async (
        alasan: Exclude<
            AlasanSelesai,
            "bye"
        >
    ) => {
        try {
            setActionLoading(true);
            setError(null);

            stopTimer();

            await syncTimer();

            await finishRonde(
                pertandinganId,
                {
                    alasan,
                    sisa_detik: timeLeft,
                }
            );

            await Promise.all([
                loadDetail(
                    pertandinganId
                ),
                reloadPenilaian(),
            ]);
        } catch (err) {
            console.error(err);

            setError(t("roundNotFinished"));
        } finally {
            setActionLoading(false);
        }
    };

    const handleFinishPertandingan =
        async () => {
            try {
                setActionLoading(true);
                setError(null);

                stopTimer();

                await syncTimer();

                await finishPertandingan(
                    pertandinganId,
                    "waktu_habis"
                );

                await Promise.all([
                    loadDetail(
                        pertandinganId
                    ),
                    reloadPenilaian(),
                ]);
            } catch (err) {
                console.error(err);

                setError(t("finishMatchError"));
            } finally {
                setActionLoading(false);
            }
        };

    if (
        pertandinganLoading &&
        !activePertandingan
    ) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent:
                        "center",
                    alignItems:
                        "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!activePertandingan) {
        return (
            <Alert severity="warning">
                Data pertandingan tidak ditemukan.
            </Alert>
        );
    }

    return (
        <Box
            ref={setControllerElement}
            sx={{
                display: "flex",
                flexDirection: "row",
                minHeight: "100vh",
                width: "100vw",
                overflowX: "hidden",
            }}
        >
            <Box
                sx={{
                    width: drawerWidth,
                    transition: "width 0.3s",
                    position: "fixed",
                }}
            >
                <Sidebar />
            </Box>

            <Box
                flexGrow={1}
                ml={`${drawerWidth}px`}
                padding={3}
                fontFamily="Roboto, sans-serif"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    background:
                        "linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)",
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                >
                    <Typography
                        variant="h2"
                        fontWeight={600}
                        fontSize={26}
                    >
                        {t(pageTitle)}
                    </Typography>

                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                    >
                        <Tooltip title={t("fullscreen")}>
                            <IconButton
                                size="medium"
                                aria-label={t("toggleFullscreen")}
                                onClick={
                                    toggleFullscreen
                                }
                            >
                                {isFullscreen ? (
                                    <FullscreenExitIcon fontSize="medium" />
                                ) : (
                                    <FullscreenIcon fontSize="medium" />
                                )}
                            </IconButton>
                        </Tooltip>

                        <UserMenu />
                    </Box>
                </Box>

                <Divider />

                {(error ||
                    penilaianError) && (
                        <Alert
                            severity="error"
                            sx={{ mt: 2 }}
                        >
                            {error ??
                                penilaianError}
                        </Alert>
                    )}

                {status === "belum_mulai" && (
                    <Alert
                        severity="info"
                        sx={{ mt: 2 }}
                    >
                        {t("matchNotStarted")}
                    </Alert>
                )}

                {status === "pause" && (
                    <Alert
                        severity="warning"
                        sx={{ mt: 2 }}
                    >
                        {t("matchPaused")}
                    </Alert>
                )}

                {status === "selesai" && (
                    <Alert
                        severity="success"
                        sx={{ mt: 2 }}
                    >
                        {t("matchFinished")}
                    </Alert>
                )}

                <Card
                    sx={{
                        mt: 4,
                        flexGrow: 1,
                    }}
                >
                    <CardContent>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={3}
                        >
                            <Box>
                                <Box
                                    display="flex"
                                    alignItems="start"
                                    justifyContent="start"
                                    gap={1}
                                >
                                    <Typography
                                        variant="h5"
                                        fontWeight={700}
                                    >
                                        {capitalizeWords(activePertandingan.peserta1_name ?? "-")}
                                    </Typography>

                                    <Typography
                                        fontWeight={700}
                                        color="error.main"
                                        variant="h5"
                                    >
                                        VS
                                    </Typography>

                                    <Typography
                                        variant="h5"
                                        fontWeight={700}
                                    >
                                        {capitalizeWords(activePertandingan.peserta2_name ?? "-")}
                                    </Typography>
                                </Box>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    mt={0.5}
                                >
                                    {t("round")}:{" "}
                                    {getBabakLabel(activePertandingan.babak)}
                                    {" • "}
                                    {t("roundLabel")}{" "}
                                    {rondeAktif}
                                    {" / "}
                                    {totalRonde}
                                </Typography>
                            </Box>

                            <Box
                                display="flex"
                                alignItems="center"
                                gap={1}
                            >
                                <Chip
                                    label={
                                        status === "belum_mulai"
                                            ? t("belum_mulai")
                                            : status === "berlangsung"
                                                ? t("berlangsung")
                                                : status === "pause"
                                                    ? t("pause")
                                                    : t("selesai")
                                    }
                                    color={
                                        status === "selesai"
                                            ? "success"
                                            : status === "berlangsung"
                                                ? "primary"
                                                : status === "pause"
                                                    ? "warning"
                                                    : "default"
                                    }
                                />

                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={
                                        handleOpenJudgeMenu
                                    }
                                    disabled={
                                        actionLoading ||
                                        juriCadanganAktif.length === 0
                                    }
                                >
                                    {t("judgeReplacement")}
                                </Button>

                                <Menu
                                    anchorEl={judgeMenuAnchor}
                                    open={judgeMenuOpen}
                                    onClose={handleCloseJudgeMenu}
                                >
                                    {juriUtamaAktif.map(
                                        (juri, index) => (
                                            <Box key={juri.id}>
                                                <MenuItem
                                                    disabled
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: "text.primary",
                                                    }}
                                                >
                                                    {t("replace")}{" "}
                                                    {capitalizeWords(
                                                        juri.full_name ??
                                                        `${t("juri")} ${index + 1}`
                                                    )}
                                                </MenuItem>

                                                {juriCadanganAktif.map(
                                                    (cadangan) => (
                                                        <MenuItem
                                                            key={`${juri.id}-${cadangan.id}`}
                                                            onClick={() =>
                                                                handleReplaceJudge(
                                                                    juri.id,
                                                                    cadangan.id
                                                                )
                                                            }
                                                            disabled={actionLoading}
                                                            sx={{
                                                                pl: 4,
                                                            }}
                                                        >
                                                            ↳{" "}
                                                            {capitalizeWords(
                                                                cadangan.full_name ??
                                                                `${t("reserveJudge")} ${cadangan.id}`
                                                            )}
                                                        </MenuItem>
                                                    )
                                                )}

                                                <Divider />
                                            </Box>
                                        )
                                    )}

                                    {juriUtamaAktif.length === 0 && (
                                        <MenuItem disabled>
                                            {t("noActiveMainJudge")}
                                        </MenuItem>
                                    )}

                                    {juriCadanganAktif.length === 0 && (
                                        <MenuItem disabled>
                                            {t("noActiveReserveJudge")}
                                        </MenuItem>
                                    )}
                                </Menu>
                            </Box>
                        </Box>

                        <Box
                            display="flex"
                            flexDirection="column"
                            gap={2}
                            mb={3}
                        >
                            <Box
                                display="flex"
                                gap={2}
                            >
                                <Box
                                    flex={1}
                                    bgcolor="#e0e0e0"
                                    p={3}
                                    borderRadius={2}
                                    textAlign="center"
                                >
                                    <Typography
                                        fontWeight={600}
                                    >
                                        {
                                            activePertandingan.peserta1_name
                                        }
                                    </Typography>

                                    <Typography
                                        fontSize={48}
                                        fontWeight="bold"
                                    >
                                        {
                                            peserta1?.total ??
                                            0
                                        }
                                    </Typography>
                                </Box>

                                <Box
                                    flex={1}
                                    bgcolor="#e0e0e0"
                                    p={3}
                                    borderRadius={2}
                                    textAlign="center"
                                >
                                    <Typography
                                        fontWeight={600}
                                    >
                                        {
                                            activePertandingan.peserta2_name
                                        }
                                    </Typography>

                                    <Typography
                                        fontSize={48}
                                        fontWeight="bold"
                                    >
                                        {
                                            peserta2?.total ??
                                            0
                                        }
                                    </Typography>
                                </Box>
                            </Box>

                            <Box
                                display="flex"
                                gap={2}
                            >
                                {juriUtamaAktif.length === 0 && (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {t("noActiveMainJudge")}
                                    </Typography>
                                )}

                                {juriUtamaAktif.map(
                                    (
                                        juri,
                                        index
                                    ) => (
                                        <Box
                                            key={
                                                juri.id
                                            }
                                            flex={1}
                                            bgcolor="#eeeeee"
                                            p={2}
                                            borderRadius={2}
                                        >
                                            <Typography
                                                textAlign="center"
                                                fontWeight={600}
                                                mb={1}
                                            >
                                                {capitalizeWords(juri.full_name ||
                                                    `Juri ${index + 1}`)}
                                            </Typography>

                                            <Box
                                                display="flex"
                                                justifyContent="center"
                                                alignItems="center"
                                                gap={3}
                                            >
                                                <Typography
                                                    fontSize={
                                                        28
                                                    }
                                                    fontWeight="bold"
                                                >
                                                    {getJuriScore(
                                                        juri.id,
                                                        peserta1Id
                                                    )}
                                                </Typography>

                                                <Typography
                                                    color="text.secondary"
                                                >
                                                    -
                                                </Typography>

                                                <Typography
                                                    fontSize={
                                                        28
                                                    }
                                                    fontWeight="bold"
                                                >
                                                    {getJuriScore(
                                                        juri.id,
                                                        peserta2Id
                                                    )}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )
                                )}
                            </Box>
                        </Box>

                        <Box
                            bgcolor="black"
                            p={2}
                            borderRadius={2}
                            mt={3}
                        >
                            <Box
                                display="grid"
                                gridTemplateColumns={{
                                    xs: "repeat(2, 1fr)",
                                    sm: "repeat(6, 1fr)",
                                }}
                                gap={1}
                                mb={1}
                            >
                                {PLUS_JENIS.map(
                                    ({
                                        label,
                                        jenis,
                                    }) => (
                                        <Button
                                            key={`left-${jenis}`}
                                            disabled={
                                                !pertandinganBerlangsung ||
                                                penilaianLoading ||
                                                actionLoading
                                            }
                                            onClick={() =>
                                                handleScore(
                                                    peserta1Id,
                                                    jenis
                                                )
                                            }
                                            sx={{
                                                bgcolor:
                                                    "#f44336",
                                                color:
                                                    "#fff",
                                                fontSize: 20,
                                                fontWeight: 700,
                                                minHeight: 52,
                                                "&:hover": {
                                                    bgcolor:
                                                        "#d32f2f",
                                                },
                                            }}
                                        >
                                            {label}
                                        </Button>
                                    )
                                )}

                                {PLUS_JENIS.map(
                                    ({
                                        label,
                                        jenis,
                                    }) => (
                                        <Button
                                            key={`right-${jenis}`}
                                            disabled={
                                                !pertandinganBerlangsung ||
                                                penilaianLoading ||
                                                actionLoading
                                            }
                                            onClick={() =>
                                                handleScore(
                                                    peserta2Id,
                                                    jenis
                                                )
                                            }
                                            sx={{
                                                bgcolor:
                                                    "#2196f3",
                                                color:
                                                    "#fff",
                                                fontSize: 20,
                                                fontWeight: 700,
                                                minHeight: 52,
                                                "&:hover": {
                                                    bgcolor:
                                                        "#1976d2",
                                                },
                                            }}
                                        >
                                            {label}
                                        </Button>
                                    )
                                )}
                            </Box>

                            <Box
                                display="grid"
                                gridTemplateColumns={{
                                    xs: "repeat(2, 1fr)",
                                    sm: "repeat(8, 1fr)",
                                }}
                                gap={1}
                                mb={2}
                            >
                                {MINUS_JENIS.map(
                                    ({
                                        label,
                                        jenis,
                                    }) => (
                                        <Button
                                            key={`left-${jenis}`}
                                            disabled={
                                                !pertandinganBerlangsung ||
                                                penilaianLoading ||
                                                actionLoading
                                            }
                                            onClick={() =>
                                                handleScore(
                                                    peserta1Id,
                                                    jenis
                                                )
                                            }
                                            sx={{
                                                bgcolor:
                                                    "#ef5350",
                                                color:
                                                    "#fff",
                                                fontWeight: 700,
                                                minHeight: 45,
                                            }}
                                        >
                                            {label}
                                        </Button>
                                    )
                                )}

                                {MINUS_JENIS.map(
                                    ({
                                        label,
                                        jenis,
                                    }) => (
                                        <Button
                                            key={`right-${jenis}`}
                                            disabled={
                                                !pertandinganBerlangsung ||
                                                penilaianLoading ||
                                                actionLoading
                                            }
                                            onClick={() =>
                                                handleScore(
                                                    peserta2Id,
                                                    jenis
                                                )
                                            }
                                            sx={{
                                                bgcolor:
                                                    "#42a5f5",
                                                color:
                                                    "#fff",
                                                fontWeight: 700,
                                                minHeight: 45,
                                            }}
                                        >
                                            {label}
                                        </Button>
                                    )
                                )}
                            </Box>

                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                flexWrap="wrap"
                                gap={2}
                            >
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                >
                                    <Tooltip title={t("undoLastScore")}>
                                        <span>
                                            <Button
                                                onClick={
                                                    handleUndo
                                                }
                                                disabled={
                                                    !pertandinganBerlangsung ||
                                                    penilaianLoading ||
                                                    actionLoading ||
                                                    history.length === 0
                                                }
                                                sx={{
                                                    bgcolor:
                                                        "red",
                                                    color:
                                                        "#fff",
                                                    minWidth: 50,
                                                    minHeight: 45,
                                                    fontWeight: 700,
                                                }}
                                            >
                                                X
                                            </Button>
                                        </span>
                                    </Tooltip>

                                    <Box
                                        sx={{
                                            border:
                                                "2px solid red",
                                            color:
                                                "#fff",
                                            px: 4,
                                            py: 1,
                                            fontSize: 20,
                                            borderRadius: 1,
                                            minWidth: 75,
                                            textAlign:
                                                "center",
                                        }}
                                    >
                                        {
                                            myScorePeserta1
                                        }
                                    </Box>
                                </Box>

                                <Box
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                >
                                    {!pertandinganSelesai ? (
                                        <Button
                                            onClick={handleToggleTimer}
                                            disabled={actionLoading}
                                            startIcon={
                                                status === "berlangsung" ? (
                                                    <PauseIcon />
                                                ) : (
                                                    <PlayArrowIcon />
                                                )
                                            }
                                            sx={{
                                                bgcolor:
                                                    status === "berlangsung"
                                                        ? "orange"
                                                        : "green",
                                                color: "#fff",
                                                px: 4,
                                                fontSize: 18,
                                                minWidth: 180,
                                                minHeight: 50,
                                                fontWeight: 700,
                                                "&:hover": {
                                                    bgcolor:
                                                        status === "berlangsung"
                                                            ? "#ef6c00"
                                                            : "#2e7d32",
                                                },
                                            }}
                                        >
                                            {isNewRound
                                                ? `Mulai Ronde ${rondeAktif + 1} • ${formatDurasiRonde(
                                                    durasiRondeDetik
                                                )}`
                                                : formattedTime}
                                        </Button>
                                    ) : (
                                        <Button
                                            disabled
                                            sx={{
                                                bgcolor:
                                                    "grey.700",
                                                color:
                                                    "#fff",
                                                px: 4,
                                                fontSize: 18,
                                                minWidth: 150,
                                                minHeight: 50,
                                            }}
                                        >
                                            {t("finished")}
                                        </Button>
                                    )}

                                    {pertandinganBerlangsung && (
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() =>
                                                handleFinishRonde(
                                                    "waktu_habis"
                                                )
                                            }
                                            disabled={
                                                actionLoading
                                            }
                                            sx={{
                                                minHeight: 50,
                                            }}
                                        >
                                            {t("roundFinished")}
                                        </Button>
                                    )}

                                    {(
                                        pertandinganBerlangsung ||
                                        pertandinganPause
                                    ) && (
                                            <Button
                                                variant="contained"
                                                color="error"
                                                startIcon={
                                                    <StopIcon />
                                                }
                                                onClick={
                                                    handleFinishPertandingan
                                                }
                                                disabled={
                                                    actionLoading
                                                }
                                                sx={{
                                                    minHeight: 50,
                                                }}
                                            >
                                                {actionLoading ? (
                                                    <CircularProgress
                                                        size={22}
                                                        color="inherit"
                                                    />
                                                ) : (
                                                    t("finishMatch")
                                                )}
                                            </Button>
                                        )}
                                </Box>

                                <Box
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                >
                                    <Box
                                        sx={{
                                            border:
                                                "2px solid #2196f3",
                                            color:
                                                "#fff",
                                            px: 4,
                                            py: 1,
                                            fontSize: 20,
                                            borderRadius: 1,
                                            minWidth: 75,
                                            textAlign:
                                                "center",
                                        }}
                                    >
                                        {
                                            myScorePeserta2
                                        }
                                    </Box>

                                    <Tooltip title="Undo input terakhir milik juri ini">
                                        <span>
                                            <Button
                                                onClick={
                                                    handleUndo
                                                }
                                                disabled={
                                                    !pertandinganBerlangsung ||
                                                    penilaianLoading ||
                                                    actionLoading ||
                                                    history.length === 0
                                                }
                                                sx={{
                                                    bgcolor:
                                                        "#2196f3",
                                                    color:
                                                        "#fff",
                                                    minWidth: 50,
                                                    minHeight: 45,
                                                    fontWeight: 700,
                                                }}
                                            >
                                                X
                                            </Button>
                                        </span>
                                    </Tooltip>
                                </Box>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default ControllerMatch;