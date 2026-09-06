import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Divider,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    MenuItem,
    IconButton,
    Tooltip,
} from "@mui/material";

import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Sidebar from "../../bar/Sidebar";
import UserMenu from "../../header/UserMenu";

import { useStore } from "../../../hooks/useStore";

import {
    createPertandingan,
} from "../../../api/turnament/pertandingan/pertandingan";

import { usePesertaStore } from "../../../stores/PesertaStore";
import { usePeserta } from "../../../hooks/usePeserta";

import { useJuriStore } from "../../../stores/JuriStore";
import { useJuri } from "../../../hooks/useJuri";

import {
    CreatePertandinganRequest,
} from "../../../types/pertandingan";

type FormType = {
    pesertaA: number | "";
    pesertaB: number | "";

    juriUtama1: number | "";
    juriUtama2: number | "";
    juriUtama3: number | "";

    juriCadangan1: number | "";
    juriCadangan2: number | "";
    juriCadangan3: number | "";

    durasiRonde: 2 | 3;
};

const MAX_SELIBIH_BERAT = 5;

export default function CreatePenyisihan() {

    const navigate = useNavigate();

    const { t } = useTranslation();

    const {
        sidebarOpen,
        pageTitle,
        setPageTitle,
    } = useStore();

    const drawerWidth =
        sidebarOpen ? 260 : 70;

    const [loading, setLoading] =
        useState(false);

    const [dialog, setDialog] =
        useState({
            open: false,
            status:
                "success" as
                "success" | "error",
            message: "",
        });

    const [form, setForm] =
        useState<FormType>({
            pesertaA: "",
            pesertaB: "",

            juriUtama1: "",
            juriUtama2: "",
            juriUtama3: "",

            juriCadangan1: "",
            juriCadangan2: "",
            juriCadangan3: "",

            durasiRonde: 2,
        });

    const {
        Peserta: pesertaList,
    } = usePesertaStore();

    const {
        Juri: juriList,
    } = useJuriStore();

    const {
        loadPeserta,
    } = usePeserta();

    const {
        loadJuri,
    } = useJuri();

    const [isFullscreen, setIsFullscreen] =
        useState(false);

    // =====================================================
    // FULLSCREEN
    // =====================================================

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

        return () => {

            document.removeEventListener(
                "fullscreenchange",
                handleChange
            );

        };

    }, []);

    // =====================================================
    // TITLE
    // =====================================================

    useEffect(() => {

        setPageTitle(
            `${t("create")} ${t("penyisihan")}`
        );

    }, [
        setPageTitle,
        t,
    ]);

    useEffect(() => {

        document.title =
            `Turnament Pencak Silat${
                pageTitle
                    ? " | " + pageTitle
                    : ""
            }`;

    }, [pageTitle]);

    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        loadPeserta();
        loadJuri();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // =====================================================
    // SELECTED PESERTA 1
    // =====================================================

    const selectedPesertaA =
        useMemo(() => {

            if (
                form.pesertaA === ""
            ) {
                return null;
            }

            return (
                pesertaList.find(
                    (p) =>
                        p.id ===
                        form.pesertaA
                ) ?? null
            );

        }, [
            pesertaList,
            form.pesertaA,
        ]);

    // =====================================================
    // FILTER PESERTA 2
    // SELISIH BERAT MAKSIMAL 5 KG
    // =====================================================

    const pesertaBList =
        useMemo(() => {

            if (
                !selectedPesertaA ||
                selectedPesertaA.weight == null
            ) {

                return pesertaList.filter(
                    (p) =>
                        p.id !==
                        form.pesertaA
                );

            }

            return pesertaList.filter(
                (p) => {

                    if (
                        p.id ===
                        form.pesertaA
                    ) {
                        return false;
                    }

                    if (
                        p.weight == null
                    ) {
                        return false;
                    }

                    const selisih =
                        Math.abs(
                            p.weight -
                            selectedPesertaA.weight
                        );

                    return (
                        selisih <=
                        MAX_SELIBIH_BERAT
                    );

                }
            );

        }, [
            pesertaList,
            selectedPesertaA,
            form.pesertaA,
        ]);

    // =====================================================
    // HANDLE PESERTA 1
    // =====================================================

    const handlePesertaAChange = (
        value: string
    ) => {

        const pesertaId =
            value === ""
                ? ""
                : Number(value);

        setForm((prev) => ({
            ...prev,

            pesertaA:
                pesertaId,

            pesertaB:
                "",
        }));

    };

    // =====================================================
    // HANDLE NUMBER
    // =====================================================

    const handleNumberChange = (
        field: keyof FormType,
        value: string
    ) => {

        setForm((prev) => ({
            ...prev,

            [field]:
                value === ""
                    ? ""
                    : Number(value),
        }));

    };

    // =====================================================
    // ERROR
    // =====================================================

    const showError = (
        message: string
    ) => {

        setDialog({
            open: true,
            status: "error",
            message,
        });

    };

    // =====================================================
    // VALIDATION
    // =====================================================

    const validate = () => {

        // -------------------------------------------------
        // PESERTA
        // -------------------------------------------------

        if (
            form.pesertaA === "" ||
            form.pesertaB === ""
        ) {

            showError(
                t("participantRequired")
            );

            return false;
        }

        if (
            form.pesertaA ===
            form.pesertaB
        ) {

            showError(
                t("participantSame")
            );

            return false;
        }

        const pesertaA =
            pesertaList.find(
                (p) =>
                    p.id ===
                    form.pesertaA
            );

        const pesertaB =
            pesertaList.find(
                (p) =>
                    p.id ===
                    form.pesertaB
            );

        if (
            !pesertaA ||
            !pesertaB
        ) {

            showError(
                t("participantNotFound")
            );

            return false;
        }

        // -------------------------------------------------
        // BERAT BADAN
        // -------------------------------------------------

        if (
            pesertaA.weight == null ||
            pesertaB.weight == null
        ) {

            showError(
                t("participantWeightRequired")
            );

            return false;
        }

        const selisihBerat =
            Math.abs(
                pesertaA.weight -
                pesertaB.weight
            );

        if (
            selisihBerat >
            MAX_SELIBIH_BERAT
        ) {

            showError(
                t(
                    "maximumWeightDifference",
                    {
                        max:
                            MAX_SELIBIH_BERAT,
                    }
                ) +
                ` ${t(
                    "currentWeightDifference",
                    {
                        difference:
                            selisihBerat,
                    }
                )}`
            );

            return false;
        }

        // -------------------------------------------------
        // JURI UTAMA
        // -------------------------------------------------

        const juriUtama = [
            form.juriUtama1,
            form.juriUtama2,
            form.juriUtama3,
        ];

        if (
            juriUtama.some(
                (id) => id === ""
            )
        ) {

            showError(
                t(
                    "threeMainJudgesRequired"
                )
            );

            return false;
        }

        // -------------------------------------------------
        // JURI CADANGAN
        // -------------------------------------------------

        const juriCadangan = [
            form.juriCadangan1,
            form.juriCadangan2,
            form.juriCadangan3,
        ];

        if (
            juriCadangan.some(
                (id) => id === ""
            )
        ) {

            showError(
                t(
                    "threeReserveJudgesRequired"
                )
            );

            return false;
        }

        // -------------------------------------------------
        // UNIQUE JURI
        // -------------------------------------------------

        const allJuri = [
            ...juriUtama,
            ...juriCadangan,
        ];

        const uniqueJuri =
            new Set(allJuri);

        if (
            uniqueJuri.size !==
            allJuri.length
        ) {

            showError(
                t("judgesCannotBeSame")
            );

            return false;
        }

        // -------------------------------------------------
        // DURASI
        // -------------------------------------------------

        if (
            form.durasiRonde !== 2 &&
            form.durasiRonde !== 3
        ) {

            showError(
                t("roundDurationInvalid")
            );

            return false;
        }

        return true;
    };

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async () => {

        if (!validate()) {
            return;
        }

        setLoading(true);

        try {

            const payload:
                CreatePertandinganRequest = {

                babak:
                    "penyisihan",

                peserta1_id:
                    Number(
                        form.pesertaA
                    ),

                peserta2_id:
                    Number(
                        form.pesertaB
                    ),

                juri_utama: [
                    Number(
                        form.juriUtama1
                    ),
                    Number(
                        form.juriUtama2
                    ),
                    Number(
                        form.juriUtama3
                    ),
                ],

                juri_cadangan: [
                    Number(
                        form.juriCadangan1
                    ),
                    Number(
                        form.juriCadangan2
                    ),
                    Number(
                        form.juriCadangan3
                    ),
                ],

                durasi_ronde_menit:
                    form.durasiRonde,
            };

            await createPertandingan(
                payload
            );

            setDialog({
                open: true,
                status: "success",
                message:
                    t("matchCreated"),
            });

            setTimeout(() => {

                navigate(
                    "/pertandingan/penyisihan"
                );

            }, 1500);

        } catch (err: any) {

            console.error(err);

            setDialog({
                open: true,
                status: "error",
                message:
                    err?.response?.data?.message ??
                    t("createMatchError"),
            });

        } finally {

            setLoading(false);

        }
    };

    // =====================================================
    // FULLSCREEN
    // =====================================================

    const toggleFullscreen = () => {

        if (
            !document.fullscreenElement
        ) {

            document.documentElement
                .requestFullscreen();

        } else {

            document.exitFullscreen();

        }

    };

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box
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
                    transition:
                        "width 0.3s",
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
                        {pageTitle}
                    </Typography>

                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                    >

                        <Tooltip
                            title={t("fullscreen")}
                        >

                            <IconButton
                                size="medium"
                                onClick={
                                    toggleFullscreen
                                }
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

                <Card
                    sx={{
                        mt: 4,
                        borderRadius: 3,
                    }}
                >

                    <CardContent>

                        <Box
                            display="flex"
                            flexDirection="column"
                            gap={2}
                            mt={2}
                            ml={4}
                            mr={4}
                        >

                            <Typography
                                variant="body2"
                                color="error"
                            >
                                {t("requiredNote")}
                            </Typography>

                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                }}
                            >
                                {t("participant")}
                            </Typography>

                            <TextField
                                select
                                label={t(
                                    "participant1"
                                )}
                                value={
                                    form.pesertaA
                                }
                                onChange={(e) =>
                                    handlePesertaAChange(
                                        e.target.value
                                    )
                                }
                                fullWidth
                            >

                                {pesertaList.map(
                                    (p) => (

                                        <MenuItem
                                            key={p.id}
                                            value={p.id}
                                        >

                                            {p.name}

                                            {p.weight != null
                                                ? ` - ${p.weight} kg`
                                                : ""}

                                        </MenuItem>

                                    )
                                )}

                            </TextField>

                            <TextField
                                select
                                label={t(
                                    "participant2"
                                )}
                                value={
                                    form.pesertaB
                                }
                                onChange={(e) =>
                                    handleNumberChange(
                                        "pesertaB",
                                        e.target.value
                                    )
                                }
                                fullWidth
                                disabled={
                                    form.pesertaA === ""
                                }
                                helperText={
                                    selectedPesertaA?.weight != null
                                        ? t(
                                            "participantWeightDifference",
                                            {
                                                max:
                                                    MAX_SELIBIH_BERAT,
                                                weight:
                                                    selectedPesertaA.weight,
                                            }
                                        )
                                        : t(
                                            "selectParticipant1"
                                        )
                                }
                            >

                                {pesertaBList.length === 0 ? (

                                    <MenuItem
                                        disabled
                                        value=""
                                    >

                                        {t(
                                            "noParticipantWeightMatch",
                                            {
                                                max:
                                                    MAX_SELIBIH_BERAT,
                                            }
                                        )}

                                    </MenuItem>

                                ) : (

                                    pesertaBList.map(
                                        (p) => {

                                            return (

                                                <MenuItem
                                                    key={p.id}
                                                    value={p.id}
                                                >

                                                    {p.name}

                                                    {p.weight != null
                                                        ? ` - ${p.weight} kg`
                                                        : ""}

                                                </MenuItem>

                                            );

                                        }
                                    )

                                )}

                            </TextField>

                            {selectedPesertaA?.weight != null && (

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >

                                    {t(
                                        "maximumWeightDifference",
                                        {
                                            max:
                                                MAX_SELIBIH_BERAT,
                                        }
                                    )}

                                </Typography>

                            )}

                            <Typography
                                variant="h6"
                                sx={{
                                    mt: 2,
                                    fontWeight: 600,
                                }}
                            >
                                {t("mainJudges")}
                            </Typography>

                            {[1, 2, 3].map(
                                (num) => {

                                    const field =
                                        `juriUtama${num}` as keyof FormType;

                                    return (

                                        <TextField
                                            key={field}
                                            select
                                            label={t(
                                                "mainJudgeNumber",
                                                {
                                                    number:
                                                        num,
                                                }
                                            )}
                                            value={
                                                form[field]
                                            }
                                            onChange={(e) =>
                                                handleNumberChange(
                                                    field,
                                                    e.target.value
                                                )
                                            }
                                            fullWidth
                                        >

                                            {juriList.map(
                                                (j) => (

                                                    <MenuItem
                                                        key={j.id}
                                                        value={j.id}
                                                    >

                                                        {j.name}

                                                    </MenuItem>

                                                )
                                            )}

                                        </TextField>

                                    );

                                }
                            )}

                            <Typography
                                variant="h6"
                                sx={{
                                    mt: 2,
                                    fontWeight: 600,
                                }}
                            >
                                {t(
                                    "reserveJudges"
                                )}
                            </Typography>

                            {[1, 2, 3].map(
                                (num) => {

                                    const field =
                                        `juriCadangan${num}` as keyof FormType;

                                    return (

                                        <TextField
                                            key={field}
                                            select
                                            label={t(
                                                "reserveJudgeNumber",
                                                {
                                                    number:
                                                        num,
                                                }
                                            )}
                                            value={
                                                form[field]
                                            }
                                            onChange={(e) =>
                                                handleNumberChange(
                                                    field,
                                                    e.target.value
                                                )
                                            }
                                            fullWidth
                                        >

                                            {juriList.map(
                                                (j) => (

                                                    <MenuItem
                                                        key={j.id}
                                                        value={j.id}
                                                    >

                                                        {j.name}

                                                    </MenuItem>

                                                )
                                            )}

                                        </TextField>

                                    );

                                }
                            )}

                            <Typography
                                variant="h6"
                                sx={{
                                    mt: 2,
                                    fontWeight: 600,
                                }}
                            >
                                {t(
                                    "roundDuration"
                                )}
                            </Typography>

                            <TextField
                                select
                                label={t(
                                    "roundDurationLabel"
                                )}
                                value={
                                    form.durasiRonde
                                }
                                onChange={(e) =>
                                    handleNumberChange(
                                        "durasiRonde",
                                        e.target.value
                                    )
                                }
                                fullWidth
                            >

                                <MenuItem value={2}>
                                    {t(
                                        "minutes",
                                        {
                                            count: 2,
                                        }
                                    )}
                                </MenuItem>

                                <MenuItem value={3}>
                                    {t(
                                        "minutes",
                                        {
                                            count: 3,
                                        }
                                    )}
                                </MenuItem>

                            </TextField>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    mt: 1,
                                }}
                            >
                                {t(
                                    "roundInformation"
                                )}
                            </Typography>

                            <Box
                                display="flex"
                                justifyContent="flex-end"
                                gap={2}
                                mt={2}
                            >

                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={
                                        handleSubmit
                                    }
                                    disabled={
                                        loading
                                    }
                                >

                                    {loading
                                        ? t(
                                            "saving"
                                        )
                                        : t(
                                            "save"
                                        )}

                                </Button>

                                <Button
                                    variant="contained"
                                    color="warning"
                                    onClick={() =>
                                        navigate(
                                            "/pertandingan/penyisihan"
                                        )
                                    }
                                >
                                    {t("back")}
                                </Button>

                            </Box>

                        </Box>

                    </CardContent>

                </Card>

                <Dialog
                    open={
                        dialog.open
                    }
                    onClose={() => {

                        if (!loading) {

                            setDialog({
                                open: false,
                                status:
                                    "success",
                                message:
                                    "",
                            });

                        }

                    }}
                >

                    <DialogTitle>

                        {dialog.status ===
                            "success"
                            ? t("success")
                            : "Error"}

                    </DialogTitle>

                    <DialogContent>

                        <Typography>
                            {
                                dialog.message
                            }
                        </Typography>

                    </DialogContent>

                    <DialogActions>

                        <Button
                            onClick={() =>
                                setDialog({
                                    open: false,
                                    status:
                                        "success",
                                    message:
                                        "",
                                })
                            }
                        >
                            OK
                        </Button>

                    </DialogActions>

                </Dialog>

            </Box>

        </Box>
    );
}
