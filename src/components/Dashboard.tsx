// import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Typography,
    IconButton,
    Tooltip,
    Divider,
} from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

import { useTranslation } from "react-i18next";

import TopCard from "../components/card/TopCard";
import MiddleCard from "../components/card/MiddleCard";
import CompetitionListDropdown from "../components/card/CompetitionListDropdown";
import TotalCompetitionApril from "../components/card/TotalCompetitionApril";
import CompetitionTable from "../components/card/CompetitionTable";
import Sidebar from "../components/bar/Sidebar";
import UserMenu from "../components/header/UserMenu";
import { useStore } from "../hooks/useStore";

import { fetchPertandingan } from "../api/turnament/pertandingan/pertandingan";
import type { Pertandingan } from "../types/pertandingan";
import CustomLoading from "./custom/CustomLoading";

type CompetitionKey =
    | "Semua"
    | "Penyisihan"
    | "16 Besar"
    | "Perempat Final"
    | "Semi Final"
    | "Final";

type CardData = {
    label: string;
    value: number;
};

type MiddleCardData = CardData & {
    subLabel: string;
};

type CompetitionTableData = {
    no: number;
    name: string;
    juri: Pertandingan["juri"];
};

const COMPETITIONS: CompetitionKey[] = [
    "Semua",
    "Penyisihan",
    "16 Besar",
    "Perempat Final",
    "Semi Final",
    "Final",
];

const BABAK_MAP: Record<
    Exclude<CompetitionKey, "Semua">,
    Pertandingan["babak"]
> = {
    Penyisihan: "penyisihan",
    "16 Besar": "enam_belas_besar",
    "Perempat Final": "perempat_final",
    "Semi Final": "semi_final",
    Final: "final",
};

const getPeserta = (data: Pertandingan[]) =>
    new Set(
        data.flatMap(({ peserta1_id, peserta2_id }) =>
            [peserta1_id, peserta2_id].filter(
                (id): id is number => Boolean(id)
            )
        )
    );

const Dashboard: React.FC = () => {
    const { t } = useTranslation();

    const { sidebarOpen, pageTitle, setPageTitle } = useStore();

    const [competition, setCompetition] =
        useState<CompetitionKey>("Semua");

    const [pertandingan, setPertandingan] =
        useState<Pertandingan[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isFullscreen, setIsFullscreen] = useState(false);

    const drawerWidth = sidebarOpen ? 260 : 70;

    /*
     * PAGE TITLE
     */
    useEffect(() => {
        setPageTitle(t("dashboard"));
    }, [setPageTitle, t]);

    /*
     * DOCUMENT TITLE
     */
    useEffect(() => {
        document.title = `${t("turnamentTitle")}${pageTitle ? ` | ${pageTitle}` : ""
            }`;
    }, [pageTitle, t]);

    /*
     * FULLSCREEN
     */
    useEffect(() => {
        const handleFullscreen = () =>
            setIsFullscreen(Boolean(document.fullscreenElement));

        document.addEventListener(
            "fullscreenchange",
            handleFullscreen
        );

        return () =>
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreen
            );
    }, []);

    /*
     * LOAD DATA
     */
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await fetchPertandingan();

                setPertandingan(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Gagal load pertandingan:", err);

                setError(t("getMatchError"));
                setPertandingan([]);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 4000);
            }
        };

        loadData();
    }, [t]);

    /*
     * STATISTICS
     */
    const stats = useMemo(() => {
        const pesertaSemua = getPeserta(pertandingan);

        const pesertaByBabak = Object.entries(BABAK_MAP).reduce(
            (result, [label, babak]) => {
                result[
                    label as Exclude<CompetitionKey, "Semua">
                ] = getPeserta(
                    pertandingan.filter(
                        (item) => item.babak === babak
                    )
                ).size;

                return result;
            },
            {} as Record<
                Exclude<CompetitionKey, "Semua">,
                number
            >
        );

        const totalCompetition: Record<CompetitionKey, number> = {
            Semua: pertandingan.length,
            Penyisihan: 0,
            "16 Besar": 0,
            "Perempat Final": 0,
            "Semi Final": 0,
            Final: 0,
        };

        pertandingan.forEach(({ babak }) => {
            const competition = (
                Object.entries(BABAK_MAP).find(
                    ([, value]) => value === babak
                )?.[0] ?? null
            ) as Exclude<CompetitionKey, "Semua"> | null;

            if (competition) {
                totalCompetition[competition]++;
            }
        });

        return {
            pesertaSemua: pesertaSemua.size,
            pesertaByBabak,
            totalCompetition,
            totalPertandingan: pertandingan.length,

            totalBerlangsung: pertandingan.filter(
                ({ status }) =>
                    status === "berlangsung" ||
                    status === "pause"
            ).length,

            totalSelesai: pertandingan.filter(
                ({ status }) => status === "selesai"
            ).length,
        };
    }, [pertandingan]);

    /*
     * TOP CARDS
     */
    const topCards = useMemo<CardData[]>(
        () => [
            {
                label: t("totalAllParticipants"),
                value: stats.pesertaSemua,
            },
            {
                label: t("totalParticipantsQualification"),
                value: stats.pesertaByBabak.Penyisihan,
            },
            {
                label: t("totalParticipantsRound16"),
                value: stats.pesertaByBabak["16 Besar"],
            },
            {
                label: t("totalParticipantsQuarterFinal"),
                value: stats.pesertaByBabak["Perempat Final"],
            },
            {
                label: t("totalParticipantsSemiFinal"),
                value: stats.pesertaByBabak["Semi Final"],
            },
            {
                label: t("totalParticipantsFinal"),
                value: stats.pesertaByBabak.Final,
            },
        ],
        [stats, t]
    );

    /*
     * MIDDLE CARDS
     */
    const middleCards = useMemo<MiddleCardData[]>(
        () => [
            {
                label: t("totalMatches"),
                subLabel: t("allRounds"),
                value: stats.totalPertandingan,
            },
            {
                label: t("ongoingMatches"),
                subLabel: t("currently"),
                value: stats.totalBerlangsung,
            },
            {
                label: t("finishedMatches"),
                subLabel: t("allRounds"),
                value: stats.totalSelesai,
            },
        ],
        [stats, t]
    );

    /*
     * COMPETITION TABLE
     */
    const competitionTable = useMemo<CompetitionTableData[]>(
        () => {
            const selectedBabak =
                competition === "Semua"
                    ? null
                    : BABAK_MAP[competition];

            return pertandingan
                .filter(
                    (item) =>
                        !selectedBabak ||
                        item.babak === selectedBabak
                )
                .slice(0, 5)
                .map((item, index) => ({
                    no: index + 1,

                    name: `${item.peserta1_name} ${t("vs")
                        } ${item.peserta2_name ?? t("bye")
                        }`,

                    juri: item.juri ?? [],
                }));
        },
        [pertandingan, competition, t]
    );

    /*
     * TRANSLATED COMPETITION LIST
     *
     * Nilai asli tetap CompetitionKey,
     * yang berubah hanya teks tampilannya.
     */
    const translatedCompetitions = useMemo(
        () =>
            COMPETITIONS.map((item) => {
                switch (item) {
                    case "Semua":
                        return t("semua");

                    case "Penyisihan":
                        return t("penyisihan");

                    case "16 Besar":
                        return t("enambelasBesar");

                    case "Perempat Final":
                        return t("perempat");

                    case "Semi Final":
                        return t("semiFinal");

                    case "Final":
                        return t("final");

                    default:
                        return item;
                }
            }),
        [t]
    );

    /*
     * CURRENT TRANSLATED COMPETITION
     */
    const selectedCompetitionLabel = useMemo(() => {
        switch (competition) {
            case "Semua":
                return t("semua");

            case "Penyisihan":
                return t("penyisihan");

            case "16 Besar":
                return t("enambelasBesar");

            case "Perempat Final":
                return t("perempat");

            case "Semi Final":
                return t("semiFinal");

            case "Final":
                return t("final");

            default:
                return competition;
        }
    }, [competition, t]);

    /*
     * FULLSCREEN
     */
    const toggleFullscreen = async () => {
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            } else {
                await document.documentElement.requestFullscreen();
            }
        } catch (err) {
            console.error("Fullscreen error:", err);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                width: "100%",
                minHeight: "100vh",
                overflow: "hidden",
            }}
        >
            {/* SIDEBAR */}
            <Box
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    transition: "width 0.3s",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    height: "100vh",
                    zIndex: 1200,
                }}
            >
                <Sidebar />
            </Box>

            {/* MAIN CONTENT */}
            <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
                    ml: `${drawerWidth}px`,
                    width: `calc(100% - ${drawerWidth}px)`,
                    maxWidth: `calc(100% - ${drawerWidth}px)`,
                    boxSizing: "border-box",
                    transition:
                        "margin-left 0.3s, width 0.3s",
                    fontFamily: "Roboto, sans-serif",
                    background:
                        "linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)",
                    color: "black",

                    overflowX: "hidden",
                    overflowY: "hidden",

                    p: 3,
                }}
            >
                {/* HEADER */}
                {loading && <CustomLoading />}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                    }}
                >
                    <Typography
                        variant="h2"
                        fontWeight={600}
                        fontSize={26}
                    >
                        {pageTitle}
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "#666",
                        }}
                    >
                        <Tooltip title={t("fullscreen")}>
                            <IconButton
                                size="medium"
                                sx={{ color: "#666" }}
                                onClick={toggleFullscreen}
                            >
                                {isFullscreen ? (
                                    <FullscreenExitIcon />
                                ) : (
                                    <FullscreenIcon />
                                )}
                            </IconButton>
                        </Tooltip>

                        <UserMenu />
                    </Box>
                </Box>

                <Divider />

                {/* ERROR */}
                {error && (
                    <Box
                        sx={{
                            mt: 3,
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: "#ffebee",
                            color: "#c62828",
                        }}
                    >
                        <Typography variant="body2">
                            {error}
                        </Typography>
                    </Box>
                )}

                {/* TOP CARDS */}
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 3,
                        mt: 5,
                        mb: 6,
                    }}
                >
                    {topCards.map((card) => (
                        <Box
                            key={card.label}
                            sx={{
                                width: {
                                    xs: "100%",
                                    sm: "31.5%",
                                    md: "41.5%",
                                    lg: "30.4%",
                                },
                                minWidth: { lg: 150 },
                            }}
                        >
                            <TopCard {...card} />
                        </Box>
                    ))}
                </Box>

                {/* MIDDLE CARDS */}
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 3,
                        mb: 6,
                    }}
                >
                    {middleCards.map((card) => (
                        <Box
                            key={card.label}
                            sx={{
                                width: {
                                    xs: "100%",
                                    sm: "31.5%",
                                    md: "41.5%",
                                    lg: "30.4%",
                                },
                            }}
                        >
                            <MiddleCard {...card} />
                        </Box>
                    ))}
                </Box>

                {/* COMPETITION FILTER */}
                <Box
                    sx={{
                        mb: 6,
                        width: {
                            xs: "100%",
                            sm: "90%",
                            md: "87%",
                            lg: "94.2%",
                        },
                    }}
                >
                    <CompetitionListDropdown
                        competitionList={translatedCompetitions}
                        selectedCompetition={
                            selectedCompetitionLabel
                        }
                        onChange={(event) => {
                            const selectedLabel =
                                event.target.value;

                            const index =
                                translatedCompetitions.indexOf(
                                    selectedLabel
                                );

                            if (index !== -1) {
                                setCompetition(
                                    COMPETITIONS[index]
                                );
                            }
                        }}
                    />
                </Box>

                {/* BOTTOM SECTION */}
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 4,
                    }}
                >
                    {/* TOTAL COMPETITION */}
                    <Box
                        sx={{
                            width: {
                                xs: "100%",
                                md: "40.5%",
                            },
                        }}
                    >
                        <TotalCompetitionApril
                            totalCompetitionApril={
                                stats.totalCompetition[
                                competition
                                ]
                            }
                        />
                    </Box>

                    {/* COMPETITION TABLE */}
                    <Box
                        sx={{
                            width: {
                                xs: "100%",
                                md: "51.8%",
                            },
                        }}
                    >
                        <CompetitionTable
                            competitionTable={competitionTable}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;