import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tooltip,
    Divider,
    TextField,
    MenuItem,
    TablePagination,
    Chip,
    Button,
} from "@mui/material";

import {
    Fullscreen,
    FullscreenExit,
    Monitor,
    Add,
} from "@mui/icons-material";

import { useTranslation } from "react-i18next";

import Sidebar from "../bar/Sidebar";
import UserMenu from "../header/UserMenu";

import { useStore } from "../../hooks/useStore";
import { usePertandingan } from "../../hooks/usePertandingan";

import {
    fetchScoreboard,
} from "../../api/turnament/penilaian/penilaian";

import PaginationActions from "../custom/PaginationActions";
import ExportPdf from "../custom/exportPdf";
import CustomLoading from "../custom/CustomLoading";

const POLL_INTERVAL_MS = 1000;

type MatchScore = {
    peserta1: number;
    peserta2: number;

    ronde1: {
        peserta1: number;
        peserta2: number;
    };

    ronde2: {
        peserta1: number;
        peserta2: number;
    };

    ronde3: {
        peserta1: number;
        peserta2: number;
    };
};

export default function Score() {

    const { t } = useTranslation();
    const navigate = useNavigate();

    const {
        sidebarOpen,
        pageTitle,
        setPageTitle,
    } = useStore();

    const drawerWidth =
        sidebarOpen ? 260 : 70;

    const {
        pertandingan,
        loading,
    } = usePertandingan("perempat_final");

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState<
            | "semua"
            | "belum_mulai"
            | "berlangsung"
            | "pause"
            | "selesai"
        >("semua");

    const [page, setPage] =
        useState(0);

    const [rowsPerPage, setRowsPerPage] =
        useState(5);

    const [isFullscreen, setIsFullscreen] =
        useState(false);

    const [scores, setScores] =
        useState<
            Record<number, MatchScore>
        >({});

    useEffect(() => {
        setPageTitle(`${t("skor")} ${t("perempat")}`);
    }, [
        setPageTitle,
        t,
    ]);

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
        const loadScores = async () => {
            if (
                !pertandingan ||
                pertandingan.length === 0
            ) {
                setScores({});
                return;
            }

            const results = await Promise.all(
                pertandingan.map(
                    async (match) => {
                        try {
                            const scoreboard =
                                await fetchScoreboard(
                                    match.id
                                );

                            const getRoundScore = (
                                peserta: {
                                    per_ronde: {
                                        ronde: 1 | 2 | 3;
                                        total: number;
                                    }[];
                                },
                                ronde: 1 | 2 | 3
                            ) => {
                                return Number(
                                    peserta.per_ronde.find(
                                        (item) =>
                                            item.ronde === ronde
                                    )?.total ?? 0
                                );
                            };

                            return {
                                id: match.id,

                                peserta1:
                                    Number(
                                        scoreboard
                                            ?.peserta1
                                            ?.total ?? 0
                                    ),

                                peserta2:
                                    Number(
                                        scoreboard
                                            ?.peserta2
                                            ?.total ?? 0
                                    ),

                                ronde1: {
                                    peserta1:
                                        scoreboard
                                            ? getRoundScore(
                                                scoreboard.peserta1,
                                                1
                                            )
                                            : 0,

                                    peserta2:
                                        scoreboard
                                            ? getRoundScore(
                                                scoreboard.peserta2,
                                                1
                                            )
                                            : 0,
                                },

                                ronde2: {
                                    peserta1:
                                        scoreboard
                                            ? getRoundScore(
                                                scoreboard.peserta1,
                                                2
                                            )
                                            : 0,

                                    peserta2:
                                        scoreboard
                                            ? getRoundScore(
                                                scoreboard.peserta2,
                                                2
                                            )
                                            : 0,
                                },

                                ronde3: {
                                    peserta1:
                                        scoreboard
                                            ? getRoundScore(
                                                scoreboard.peserta1,
                                                3
                                            )
                                            : 0,

                                    peserta2:
                                        scoreboard
                                            ? getRoundScore(
                                                scoreboard.peserta2,
                                                3
                                            )
                                            : 0,
                                },
                            };
                        } catch {
                            return {
                                id: match.id,

                                peserta1: 0,
                                peserta2: 0,

                                ronde1: {
                                    peserta1: 0,
                                    peserta2: 0,
                                },

                                ronde2: {
                                    peserta1: 0,
                                    peserta2: 0,
                                },

                                ronde3: {
                                    peserta1: 0,
                                    peserta2: 0,
                                },
                            };
                        }
                    }
                )
            );

            const scoreMap: Record<
                number,
                MatchScore
            > = {};

            results.forEach((item) => {
                scoreMap[item.id] = {
                    peserta1: item.peserta1,
                    peserta2: item.peserta2,

                    ronde1: item.ronde1,
                    ronde2: item.ronde2,
                    ronde3: item.ronde3,
                };
            });

            setScores(scoreMap);
        };

        loadScores();

        const interval = setInterval(
            loadScores,
            POLL_INTERVAL_MS
        );

        return () => clearInterval(interval);
    }, [pertandingan]);

    const toggleFullscreen =
        async () => {
            try {
                if (
                    !document.fullscreenElement
                ) {
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
        const handleFullscreenChange =
            () => {
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

    const formatText = (
        text?: string | null
    ) => {
        if (!text) {
            return "";
        }

        return text
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(
                /\b\w/g,
                (char) =>
                    char.toUpperCase()
            );
    };

    const getStatusText = (
        status?: string
    ) => {
        switch (status) {
            case "belum_mulai":
                return t(
                    "belum_mulai"
                );

            case "berlangsung":
                return t(
                    "berlangsung"
                );

            case "pause":
                return t(
                    "pause"
                );

            case "selesai":
                return t(
                    "selesai"
                );

            default:
                return t("semua");
        }
    };

    const getStatusColor = (
        status?: string
    ):
        | "default"
        | "warning"
        | "success"
        | "info" => {
        switch (status) {
            case "berlangsung":
                return "warning";

            case "selesai":
                return "success";

            case "pause":
                return "info";

            default:
                return "default";
        }
    };

    const filteredMatches =
        useMemo(() => {
            let data = [
                ...(pertandingan || []),
            ];

            if (search.trim()) {
                const query =
                    search
                        .trim()
                        .toLowerCase();

                data =
                    data.filter(
                        (item) => {
                            const peserta1 =
                                item
                                    .peserta1_name
                                    ?.toLowerCase() ??
                                "";

                            const peserta2 =
                                item
                                    .peserta2_name
                                    ?.toLowerCase() ??
                                "";

                            return (
                                peserta1.includes(
                                    query
                                ) ||
                                peserta2.includes(
                                    query
                                )
                            );
                        }
                    );
            }

            if (
                statusFilter !==
                "semua"
            ) {
                data =
                    data.filter(
                        (item) =>
                            item.status ===
                            statusFilter
                    );
            }

            return data;
        }, [
            pertandingan,
            search,
            statusFilter,
        ]);

    const paginatedMatches =
        useMemo(() => {
            const start =
                page *
                rowsPerPage;

            return filteredMatches.slice(
                start,
                start +
                rowsPerPage
            );
        }, [
            filteredMatches,
            page,
            rowsPerPage,
        ]);

    useEffect(() => {
        setPage(0);
    }, [
        search,
        statusFilter,
    ]);

    const RoundScore = ({
        score,
    }: {
        score: {
            peserta1: number;
            peserta2: number;
        };
    }) => {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <Chip
                    label={`${score.peserta1} - ${score.peserta2}`}
                    size="small"
                    sx={{
                        minWidth: 65,
                        height: 28,
                        fontWeight: 700,
                        fontSize: 13,
                        "& .MuiChip-label": {
                            px: 1.5,
                        },
                    }}
                />
            </Box>
        );
    };

    return (
        <Box
            sx={{
                display: "flex",
                width: "100%",
                minHeight: "100vh",
            }}
        >
            {loading && <CustomLoading />}
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: drawerWidth,
                    height: "100vh",
                    zIndex: 1200,
                }}
            >
                <Sidebar />
            </Box>

            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: `${drawerWidth}px`,
                    right: 0,
                    minHeight: "100vh",
                    boxSizing: "border-box",
                    p: 3,

                    fontFamily: "Roboto, sans-serif",
                    transition: "margin-left 0.3s, width 0.3s",
                    background:
                        "linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)",
                    color: "black",

                    // HILANGKAN SCROLL X & Y
                    overflowX: "hidden",
                    overflowY: "hidden",
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
                        {pageTitle}
                    </Typography>

                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                    >
                        <Tooltip
                            title={
                                isFullscreen
                                    ? t(
                                        "exitFullscreen"
                                    )
                                    : t(
                                        "fullscreen"
                                    )
                            }
                        >
                            <IconButton
                                size="medium"
                                aria-label={
                                    isFullscreen
                                        ? t(
                                            "exitFullscreen"
                                        )
                                        : t(
                                            "fullscreen"
                                        )
                                }
                                onClick={
                                    toggleFullscreen
                                }
                                sx={{
                                    "&:hover":
                                    {
                                        backgroundColor:
                                            "transparent",
                                    },
                                }}
                            >
                                {isFullscreen ? (
                                    <FullscreenExit />
                                ) : (
                                    <Fullscreen />
                                )}
                            </IconButton>
                        </Tooltip>

                        <UserMenu />
                    </Box>
                </Box>

                <Divider />

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={3}
                    gap={2}
                    flexWrap="wrap"
                >
                    <TextField
                        select
                        size="small"
                        value={
                            statusFilter
                        }
                        onChange={(
                            e
                        ) =>
                            setStatusFilter(
                                e.target
                                    .value as
                                | "semua"
                                | "belum_mulai"
                                | "berlangsung"
                                | "pause"
                                | "selesai"
                            )
                        }
                        sx={{
                            minWidth: 180,
                        }}
                    >
                        <MenuItem value="semua">
                            {t("semua")}
                        </MenuItem>

                        <MenuItem value="belum_mulai">
                            {t(
                                "belum_mulai"
                            )}
                        </MenuItem>

                        <MenuItem value="berlangsung">
                            {t(
                                "berlangsung"
                            )}
                        </MenuItem>

                        <MenuItem value="pause">
                            {t("pause")}
                        </MenuItem>

                        <MenuItem value="selesai">
                            {t(
                                "selesai"
                            )}
                        </MenuItem>
                    </TextField>

                    <Box display="flex" alignItems="center" gap={1}>
                        <ExportPdf currentBabak="perempat_final" />

                        <TextField
                            placeholder={t("search")}
                            size="small"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </Box>
                </Box>

                <Card
                    sx={{
                        mt: 3,
                    }}
                >
                    <CardContent>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">
                                            {t(
                                                "no"
                                            )}
                                        </TableCell>

                                        <TableCell align="center">
                                            {t(
                                                "match"
                                            )}
                                        </TableCell>

                                        <TableCell align="center">
                                            {t("round1")}
                                        </TableCell>

                                        <TableCell align="center">
                                            {t("round2")}
                                        </TableCell>

                                        <TableCell align="center">
                                            {t("round3")}
                                        </TableCell>

                                        <TableCell align="center">
                                            {t(
                                                "status"
                                            )}
                                        </TableCell>

                                        <TableCell align="center">
                                            {t(
                                                "actions"
                                            )}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {paginatedMatches.length ===
                                        0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={
                                                    7
                                                }
                                                align="center"
                                            >
                                                <Box
                                                    py={
                                                        6
                                                    }
                                                >
                                                    <Typography
                                                        color="text.secondary"
                                                    >
                                                        {t(
                                                            "noMatchesFound"
                                                        )}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedMatches.map(
                                            (
                                                match,
                                                index
                                            ) => {                                                
                                                return (
                                                    <TableRow
                                                        key={
                                                            match.id
                                                        }
                                                        hover
                                                    >
                                                        <TableCell align="center">
                                                            {page *
                                                                rowsPerPage +
                                                                index +
                                                                1}
                                                        </TableCell>

                                                        <TableCell align="center">
                                                            <Box
                                                                display="flex"
                                                                justifyContent="center"
                                                                alignItems="center"
                                                                gap={1}
                                                            >
                                                                <Typography
                                                                    fontWeight={
                                                                        600
                                                                    }
                                                                >
                                                                    {formatText(
                                                                        match.peserta1_name
                                                                    )}
                                                                </Typography>

                                                                <Typography
                                                                    fontWeight={
                                                                        700
                                                                    }
                                                                    color="error.main"
                                                                    fontSize={
                                                                        12
                                                                    }
                                                                >
                                                                    VS
                                                                </Typography>

                                                                <Typography
                                                                    fontWeight={
                                                                        600
                                                                    }
                                                                >
                                                                    {match.peserta2_name
                                                                        ? formatText(
                                                                            match.peserta2_name
                                                                        )
                                                                        : t(
                                                                            "bye"
                                                                        )}
                                                                </Typography>
                                                            </Box>
                                                        </TableCell>

                                                        <TableCell align="center">
                                                            <RoundScore
                                                                score={
                                                                    scores[match.id]?.ronde1 ?? {
                                                                        peserta1: 0,
                                                                        peserta2: 0,
                                                                    }
                                                                }
                                                            />
                                                        </TableCell>

                                                        <TableCell align="center">
                                                            <RoundScore
                                                                score={
                                                                    scores[match.id]?.ronde2 ?? {
                                                                        peserta1: 0,
                                                                        peserta2: 0,
                                                                    }
                                                                }
                                                            />
                                                        </TableCell>

                                                        <TableCell align="center">
                                                            <RoundScore
                                                                score={
                                                                    scores[match.id]?.ronde3 ?? {
                                                                        peserta1: 0,
                                                                        peserta2: 0,
                                                                    }
                                                                }
                                                            />
                                                        </TableCell>

                                                        <TableCell align="center">
                                                            <Chip
                                                                label={getStatusText(
                                                                    match.status
                                                                )}
                                                                color={getStatusColor(
                                                                    match.status
                                                                )}
                                                                size="medium"
                                                            />
                                                        </TableCell>

                                                        <TableCell align="center">
                                                            <Tooltip
                                                                title={t(
                                                                    "openMonitor"
                                                                )}
                                                            >
                                                                <IconButton
                                                                    color="success"
                                                                    onClick={() =>
                                                                        window.open(
                                                                            `/skor/${match.id}?monitor=true`,
                                                                            "_blank",
                                                                            "noopener,noreferrer"
                                                                        )
                                                                    }
                                                                    sx={{
                                                                        "&:hover":
                                                                        {
                                                                            backgroundColor:
                                                                                "transparent",
                                                                        },
                                                                    }}
                                                                >
                                                                    <Monitor />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mt={5}
                            mb={2}
                        >
                            <TablePagination
                                component="div"
                                count={filteredMatches.length}
                                page={page}
                                onPageChange={(_, newPage) => setPage(newPage)}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={(event) => {
                                    setRowsPerPage(
                                        parseInt(event.target.value, 10)
                                    );
                                    setPage(0);
                                }}
                                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                                labelDisplayedRows={({ from, to, count }) =>
                                    `${from}-${to} of ${count}`
                                }
                                labelRowsPerPage={t("rows")}
                                ActionsComponent={PaginationActions}
                                sx={{
                                    "& .MuiTablePagination-select": {
                                        border: "1px solid #ccc",
                                    },
                                }}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}