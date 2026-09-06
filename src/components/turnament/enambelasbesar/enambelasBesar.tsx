import { useEffect, useState, useMemo } from "react";

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
} from "@mui/material";

import { Edit, Delete } from "@mui/icons-material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

import { useNavigate } from "react-router-dom";
import Sidebar from "../../bar/Sidebar";
import UserMenu from "../../header/UserMenu";
import DeletePesertaDialog from "./DeleteEnambelasDialog";
import PertandinganDetailDialog from "./PertandinganDetailDialog";

import { useStore } from "../../../hooks/useStore";
import { usePertandinganStore } from "../../../stores/pertandinganStore";
import { usePertandingan } from "../../../hooks/usePertandingan";
import { fetchScoreboard } from "../../../api/turnament/penilaian/penilaian";
import type { Scoreboard } from "../../../types/penilaian";

import PaginationActions from "../../custom/PaginationActions";
import { useTranslation } from "react-i18next";
import CustomLoading from "../../custom/CustomLoading";

export default function EnambelasBesar() {
    const navigate = useNavigate();

    const {
        sidebarOpen,
        pageTitle,
        setPageTitle,
        user,
    } = useStore();

    const isAdmin = user?.role === "admin";

    const {
        pertandingan,
        selectedPertandingan,
        setSelectedPertandingan,
    } = usePertandinganStore();

    const {
        loading,
        removePertandingan,
    } = usePertandingan("enam_belas_besar");

    const drawerWidth = sidebarOpen ? 260 : 70;

    const { t } = useTranslation();

    const [openDelete, setOpenDelete] =
        useState(false);

    const [detailId, setDetailId] =
        useState<number | null>(null);

    const [openDetail, setOpenDetail] =
        useState(false);

    const [search, setSearch] =
        useState("");

    const [sortBy, setSortBy] =
        useState<
            "default" | "no" | "name"
        >("default");

    const [sortOrder, setSortOrder] =
        useState<"asc" | "desc">("asc");

    const [page, setPage] =
        useState(0);

    const [rowsPerPage, setRowsPerPage] =
        useState(5);

    const [isFullscreen, setIsFullscreen] =
        useState(false);

    const [liveScores, setLiveScores] =
        useState<Record<number, Scoreboard>>({});

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handleChange = () => {
            setIsFullscreen(
                !!document.fullscreenElement
            );
        };

        document.addEventListener(
            "fullscreenchange",
            handleChange
        );

        return () =>
            document.removeEventListener(
                "fullscreenchange",
                handleChange
            );
    }, []);

    useEffect(() => {
        setPageTitle(
            t("enambelasBesar")
        );
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
    }, [pageTitle, t]);

    useEffect(() => {
        if (
            !pertandingan ||
            pertandingan.length === 0
        ) {
            setLiveScores({});
            return;
        }

        let cancelled = false;

        const loadLiveScores = async () => {
            try {
                const results =
                    await Promise.all(
                        pertandingan.map(
                            async (match) => {
                                try {
                                    const scoreboard =
                                        await fetchScoreboard(
                                            match.id
                                        );

                                    return {
                                        id: match.id,
                                        scoreboard,
                                    };
                                } catch (error) {
                                    console.error(
                                        `Gagal mengambil scoreboard pertandingan ${match.id}:`,
                                        error
                                    );

                                    return {
                                        id: match.id,
                                        scoreboard: null,
                                    };
                                }
                            }
                        )
                    );

                if (cancelled) return;

                setLiveScores((prev) => {
                    const next = {
                        ...prev,
                    };

                    results.forEach(
                        ({
                            id,
                            scoreboard,
                        }) => {
                            if (scoreboard) {
                                next[id] =
                                    scoreboard;
                            }
                        }
                    );

                    return next;
                });
            } catch (error) {
                console.error(
                    "Gagal mengambil live scoreboard:",
                    error
                );
            }
        };

        // Ambil langsung saat halaman dibuka
        loadLiveScores();

        // Update setiap 1 detik
        const interval =
            setInterval(
                loadLiveScores,
                1000
            );

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [pertandingan]);

    const formatText = (
        text?: string | null
    ) => {
        if (!text) return "";

        return text
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(
                /\b\w/g,
                (char) =>
                    char.toUpperCase()
            );
    };

    const formatWeight = (
        weight?: number | string | null
    ) => {
        if (
            weight === null ||
            weight === undefined ||
            weight === ""
        ) {
            return "-";
        }

        return `${weight} kg`;
    };

    const getRoundScores = (
        matchId: number,
        round: 1 | 2 | 3
    ) => {
        const scoreboard =
            liveScores[matchId];

        if (!scoreboard) {
            return {
                peserta1: 0,
                peserta2: 0,
            };
        }

        const peserta1 =
            scoreboard.peserta1.per_ronde.find(
                (item) =>
                    item.ronde === round
            );

        const peserta2 =
            scoreboard.peserta2.per_ronde.find(
                (item) =>
                    item.ronde === round
            );

        return {
            peserta1:
                peserta1?.total ?? 0,

            peserta2:
                peserta2?.total ?? 0,
        };
    };

    const RoundScore = ({
        matchId,
        round,
    }: {
        matchId: number;
        round: 1 | 2 | 3;
    }) => {
        const score =
            getRoundScores(
                matchId,
                round
            );

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

    const getJudges = (
        match: any,
        role:
            | "utama"
            | "cadangan"
    ) => {
        if (
            !Array.isArray(
                match.juri
            )
        ) {
            return [];
        }

        return match.juri
            .filter(
                (j: any) =>
                    j.peran === role
            )
            .slice(0, 3);
    };

    const getJudgeNames = (
        match: any,
        role:
            | "utama"
            | "cadangan"
    ) => {
        const judges =
            getJudges(
                match,
                role
            );

        const names = [
            judges[0]?.full_name,
            judges[1]?.full_name,
            judges[2]?.full_name,
        ];

        return names.map(
            (name) =>
                name
                    ? formatText(name)
                    : "-"
        );
    };

    const filteredMatches =
        useMemo(() => {
            let data = [
                ...(pertandingan || []),
            ];

            if (search) {
                const q =
                    search.toLowerCase();

                data =
                    data.filter(
                        (item) =>
                            item.peserta1_name
                                ?.toLowerCase()
                                .includes(q) ||

                            (
                                item.peserta2_name ??
                                ""
                            )
                                .toLowerCase()
                                .includes(q)
                    );
            }

            if (
                sortBy === "no"
            ) {
                data.sort(
                    (a, b) =>
                        sortOrder ===
                            "asc"
                            ? a.id - b.id
                            : b.id - a.id
                );
            }

            if (
                sortBy === "name"
            ) {
                data.sort(
                    (a, b) => {
                        const nameA =
                            `${a.peserta1_name} ${a.peserta2_name ??
                            ""
                            }`;

                        const nameB =
                            `${b.peserta1_name} ${b.peserta2_name ??
                            ""
                            }`;

                        return sortOrder ===
                            "asc"
                            ? nameA.localeCompare(
                                nameB
                            )
                            : nameB.localeCompare(
                                nameA
                            );
                    }
                );
            }

            return data;
        }, [
            pertandingan,
            search,
            sortBy,
            sortOrder,
        ]);

    const paginatedMatches =
        useMemo(() => {
            const start =
                page *
                rowsPerPage;

            return filteredMatches.slice(
                start,
                start + rowsPerPage
            );
        }, [
            filteredMatches,
            page,
            rowsPerPage,
        ]);

    const handleOpenDetail = (
        id: number
    ) => {
        setDetailId(id);
        setOpenDetail(true);
    };

    const handleCloseDetail = () => {
        setOpenDetail(false);
        setDetailId(null);
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
                return t("pause");

            case "selesai":
                return t("selesai");

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

            case "pause":
                return "info";

            case "selesai":
                return "success";

            default:
                return "default";
        }
    };

    return (
        <Box
            sx={{
                display:
                    "flex",
                width: "100%",
                minHeight:
                    "100vh",
            }}
        >
            {loading && <CustomLoading />}
            <Box
                sx={{
                    position:
                        "fixed",
                    top: 0,
                    left: 0,
                    width:
                        drawerWidth,
                    height:
                        "100vh",
                    zIndex: 1200,
                }}
            >
                <Sidebar />
            </Box>

            <Box
                sx={{
                    position:
                        "absolute",
                    top: 0,
                    left:
                        `${drawerWidth}px`,
                    right: 0,
                    minHeight:
                        "100vh",
                    boxSizing:
                        "border-box",
                    p: 3,

                    fontFamily:
                        "Roboto, sans-serif",

                    transition:
                        "margin-left 0.3s, width 0.3s",

                    background:
                        "linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)",

                    color:
                        "black",

                    overflowX:
                        "hidden",
                    overflowY:
                        "hidden",
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
                            title={t(
                                "fullscreen"
                            )}
                        >
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

                <Box
                    display="flex"
                    justifyContent="space-between"
                    mt={3}
                >
                    <TextField
                        select
                        size="small"
                        value={
                            sortBy
                        }
                        onChange={(e) => {
                            const value =
                                e.target
                                    .value as
                                | "default"
                                | "no"
                                | "name";

                            if (
                                value ===
                                sortBy
                            ) {
                                setSortOrder(
                                    (prev) =>
                                        prev ===
                                            "asc"
                                            ? "desc"
                                            : "asc"
                                );
                            } else {
                                setSortBy(
                                    value
                                );

                                setSortOrder(
                                    "asc"
                                );
                            }
                        }}
                    >
                        <MenuItem value="default">
                            {t("filter")}
                        </MenuItem>

                        <MenuItem value="no">
                            {t("no")}
                        </MenuItem>

                        <MenuItem value="name">
                            {t("match")}
                        </MenuItem>
                    </TextField>

                    <TextField
                        placeholder={t(
                            "search"
                        )}
                        size="small"
                        value={
                            search
                        }
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />
                </Box>

                <Card
                    sx={{
                        mt: 3,
                    }}
                >
                    <CardContent
                        sx={{
                            p: 0,
                        }}
                    >
                        <TableContainer
                            sx={{
                                overflowX:
                                    "auto",
                            }}
                        >
                            <Table
                                size="small"
                                sx={{
                                    minWidth: 1000,
                                    tableLayout: "auto",
                                    mt: 2,
                                }}
                            >
                                <TableHead>
                                    <TableRow>

                                        <TableCell
                                            align="center"
                                            sx={{
                                                maxWidth:
                                                    20,
                                            }}
                                        >
                                            {t(
                                                "no"
                                            )}
                                        </TableCell>

                                        <TableCell
                                            align="center"
                                            sx={{
                                                maxWidth:
                                                    30,
                                            }}
                                        >
                                            {t("peserta")}
                                        </TableCell>

                                        <TableCell
                                            align="center"
                                            sx={{
                                                maxWidth:
                                                    20,
                                            }}
                                        >
                                            {t("round1")}
                                        </TableCell>

                                        <TableCell
                                            align="center"
                                            sx={{
                                                maxWidth:
                                                    20,
                                            }}
                                        >
                                            {t("round2")}
                                        </TableCell>

                                        <TableCell
                                            align="center"
                                            sx={{
                                                maxWidth:
                                                    20,
                                            }}
                                        >
                                            {t("round3")}
                                        </TableCell>

                                        <TableCell
                                            align="center"
                                            sx={{
                                                maxWidth: 30,
                                            }}
                                        >
                                            {t("mainJudge")}
                                        </TableCell>

                                        <TableCell
                                            align="center"
                                            sx={{
                                                maxWidth: 30,
                                            }}
                                        >
                                            {t("reserveJudge")}
                                        </TableCell>

                                        <TableCell
                                            align="center"
                                            sx={{
                                                maxWidth:
                                                    20,
                                            }}
                                        >
                                            {t(
                                                "status"
                                            )}
                                        </TableCell>

                                        {isAdmin && (
                                            <TableCell
                                                align="center"
                                                sx={{
                                                    maxWidth: 20,
                                                }}
                                            >
                                                {t("actions")}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                </TableHead>

                                <TableBody>

                                    {paginatedMatches.map(
                                        (
                                            match,
                                            index
                                        ) => {

                                            const mainJudges =
                                                getJudgeNames(
                                                    match,
                                                    "utama"
                                                );

                                            const reserveJudges =
                                                getJudgeNames(
                                                    match,
                                                    "cadangan"
                                                );

                                            return (
                                                <TableRow
                                                    key={
                                                        match.id
                                                    }
                                                    hover
                                                    onClick={() =>
                                                        handleOpenDetail(
                                                            match.id
                                                        )
                                                    }
                                                    sx={{
                                                        cursor:
                                                            "pointer",
                                                    }}
                                                >

                                                    <TableCell align="center">
                                                        {
                                                            page *
                                                            rowsPerPage +
                                                            index +
                                                            1
                                                        }
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        <Box
                                                            display="flex"
                                                            flexDirection="row"
                                                            alignItems="center"
                                                            justifyContent="center"
                                                            gap={1}
                                                            sx={{
                                                                whiteSpace: "nowrap",
                                                            }}
                                                        >
                                                            <Typography fontWeight={600}>
                                                                {formatText(match.peserta1_name)}
                                                            </Typography>

                                                            <Typography
                                                                sx={{
                                                                    fontWeight: 700,
                                                                    color: "error.main",
                                                                    fontSize: 12,
                                                                    flexShrink: 0,
                                                                }}
                                                            >
                                                                {t("vs")}
                                                            </Typography>

                                                            <Typography fontWeight={600}>
                                                                {match.peserta2_name
                                                                    ? formatText(match.peserta2_name)
                                                                    : t("bye")}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        <RoundScore
                                                            matchId={match.id}
                                                            round={1}
                                                        />
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        <RoundScore
                                                            matchId={match.id}
                                                            round={2}
                                                        />
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        <RoundScore
                                                            matchId={match.id}
                                                            round={3}
                                                        />
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        <Box
                                                            display="flex"
                                                            flexDirection="column"
                                                            gap={0.3}
                                                        >
                                                            {mainJudges.map(
                                                                (
                                                                    name,
                                                                    i
                                                                ) => (
                                                                    <Typography
                                                                        key={
                                                                            i
                                                                        }
                                                                        variant="body2"
                                                                    >
                                                                        {i +
                                                                            1}
                                                                        .{" "}
                                                                        {
                                                                            name
                                                                        }
                                                                    </Typography>
                                                                )
                                                            )}
                                                        </Box>
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        <Box
                                                            display="flex"
                                                            flexDirection="column"
                                                            gap={0.3}
                                                        >
                                                            {reserveJudges.map(
                                                                (
                                                                    name,
                                                                    i
                                                                ) => (
                                                                    <Typography
                                                                        key={
                                                                            i
                                                                        }
                                                                        variant="body2"
                                                                    >
                                                                        {i +
                                                                            1}
                                                                        .{" "}
                                                                        {
                                                                            name
                                                                        }
                                                                    </Typography>
                                                                )
                                                            )}
                                                        </Box>
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

                                                    {isAdmin && (
                                                        <TableCell align="center">
                                                            <IconButton
                                                                color="primary"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();

                                                                    navigate(
                                                                        `edit-16-besar/${match.id}`
                                                                    );
                                                                }}
                                                            >
                                                                <Edit fontSize="small" />
                                                            </IconButton>

                                                            <IconButton
                                                                color="error"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();

                                                                    setSelectedPertandingan(match);

                                                                    setOpenDelete(true);
                                                                }}
                                                            >
                                                                <Delete fontSize="small" />
                                                            </IconButton>
                                                        </TableCell>
                                                    )}

                                                </TableRow>
                                            );
                                        }
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
                            px={2}
                        >
                            <TablePagination
                                component="div"
                                count={
                                    filteredMatches.length
                                }
                                page={
                                    page
                                }
                                onPageChange={(
                                    event,
                                    newPage
                                ) =>
                                    setPage(
                                        newPage
                                    )
                                }
                                rowsPerPage={
                                    rowsPerPage
                                }
                                onRowsPerPageChange={(
                                    event
                                ) => {
                                    setRowsPerPage(
                                        parseInt(
                                            event
                                                .target
                                                .value,
                                            10
                                        )
                                    );

                                    setPage(
                                        0
                                    );
                                }}
                                rowsPerPageOptions={[
                                    5,
                                    10,
                                    25,
                                    50,
                                    100,
                                ]}
                                labelDisplayedRows={({
                                    from,
                                    to,
                                    count,
                                }) =>
                                    `${from}-${to} of ${count}`
                                }
                                labelRowsPerPage={t(
                                    "rows"
                                )}
                                ActionsComponent={
                                    PaginationActions
                                }
                                sx={{
                                    "& .MuiTablePagination-select":
                                    {
                                        border:
                                            "1px solid #ccc",
                                    },
                                }}
                            />
                        </Box>
                    </CardContent>
                </Card>

                {selectedPertandingan && (
                    <DeletePesertaDialog
                        open={
                            openDelete
                        }
                        onClose={() =>
                            setOpenDelete(
                                false
                            )
                        }
                        onConfirm={async () => {
                            try {
                                await removePertandingan(selectedPertandingan.id);
                                setOpenDelete(false);
                                setSelectedPertandingan(null);
                                window.location.reload();
                            } catch (error) {
                                console.error("Gagal menghapus pertandingan:", error);
                            }
                        }}
                        peserta1_name={selectedPertandingan.peserta1_name} peserta2_name={selectedPertandingan.peserta2_name ?? t("bye")}
                    />
                )}

                <PertandinganDetailDialog
                    open={
                        openDetail
                    }
                    pertandinganId={
                        detailId
                    }
                    onClose={
                        handleCloseDetail
                    }
                />
            </Box>
        </Box>
    );
}