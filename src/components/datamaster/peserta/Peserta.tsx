import { useEffect, useState, useMemo } from "react";
import {
    Box,
    Button,
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
    TablePagination
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../bar/Sidebar";
import UserMenu from "../../header/UserMenu";
import DeletePesertaDialog from "./DeletePesertaDialog";
import { useStore } from "../../../hooks/useStore";
import { usePesertaStore } from "../../../stores/PesertaStore";
import { usePeserta } from "../../../hooks/usePeserta";
import PaginationActions from "../../custom/PaginationActions";
import { useTranslation } from "react-i18next";
import CustomLoading from "../../custom/CustomLoading";

type SortByType = "default" | "no" | "name" | "regional" | "weight";

export default function Peserta() {
    const navigate = useNavigate();
    const { sidebarOpen, pageTitle, setPageTitle } = useStore();
    const { Peserta, loading, selectedPeserta, setSelectedPeserta } = usePesertaStore();
    const { loadPeserta, removePeserta } = usePeserta();
    const { t } = useTranslation();

    const drawerWidth = sidebarOpen ? 260 : 70;

    const [openDelete, setOpenDelete] = useState(false);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<SortByType>("default");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen?.();
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        const handleChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleChange);
        return () => document.removeEventListener("fullscreenchange", handleChange);
    }, []);

    useEffect(() => {
        loadPeserta();
        setPageTitle(t("peserta"));
    }, [t]);

    useEffect(() => {
        document.title =
            `${t("turnamentTitle")}${pageTitle
                ? " | " + pageTitle
                : ""
            }`;
    }, [pageTitle, t]);

    const memoizedPeserta = useMemo(
        () => (Array.isArray(Peserta) ? Peserta : []),
        [Peserta]
    );

    const filteredPeserta = useMemo(() => {
        let data = [...memoizedPeserta];

        if (search) {
            data = data.filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.weight.toString().includes(search)
            );
        }

        if (sortBy === "no") {
            data.sort((a, b) =>
                sortOrder === "asc" ? a.id - b.id : b.id - a.id
            );
        }

        if (sortBy === "name") {
            data.sort((a, b) =>
                sortOrder === "asc"
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name)
            );
        }

        if (sortBy === "regional") {
            data.sort((a, b) =>
                sortOrder === "asc"
                    ? a.regional.localeCompare(b.regional)
                    : b.regional.localeCompare(a.regional)
            );
        }

        if (sortBy === "weight") {
            data.sort((a, b) =>
                sortOrder === "asc" ? a.weight - b.weight : b.weight - a.weight
            );
        }

        return data;
    }, [memoizedPeserta, search, sortBy, sortOrder]);

    const paginatedPeserta = useMemo(() => {
        const start = page * rowsPerPage;
        return filteredPeserta.slice(start, start + rowsPerPage);
    }, [filteredPeserta, page, rowsPerPage]);

    useEffect(() => {
        setPage(0);
    }, [search, sortBy, sortOrder]);

    const formatText = (text: string) => {
        if (!text) return "";
        return text
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase());
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
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography fontSize={26} fontWeight={600}>
                        {pageTitle}
                    </Typography>

                    <Box display="flex" alignItems="center" gap={1}>
                        <Tooltip title="Fullscreen">
                            <IconButton onClick={toggleFullscreen}>
                                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                            </IconButton>
                        </Tooltip>
                        <UserMenu />
                    </Box>
                </Box>

                <Divider />

                {/* FILTER */}
                <Box display="flex" justifyContent="space-between" mt={4}>
                    <TextField
                        select
                        size="small"
                        value={sortBy}
                        onChange={(e) => {
                            const value = e.target.value as SortByType;

                            if (value === sortBy) {
                                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                            } else {
                                setSortBy(value);
                                setSortOrder("asc");
                            }
                        }}
                        sx={{ width: 150 }}
                    >
                        <MenuItem value="default">{t("filter")}</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                        <MenuItem value="name">{t("name")}</MenuItem>
                        <MenuItem value="weight">{t("weight")}</MenuItem>
                        <MenuItem value="regional">{t("regional")}</MenuItem>
                    </TextField>

                    <TextField
                        placeholder={t("search")}
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ width: 250 }}
                    />
                </Box>

                {/* TABLE */}
                <Card sx={{ mt: 4 }}>
                    <CardContent>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No</TableCell>
                                        <TableCell>{t("name")}</TableCell>
                                        <TableCell>{t("weight")}</TableCell>
                                        <TableCell>{t("regional")}</TableCell>
                                        <TableCell>{t("actions")}</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {paginatedPeserta.map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                            <TableCell>{formatText(item.name)}</TableCell>
                                            <TableCell>{item.weight} Kg</TableCell>
                                            <TableCell>{formatText(item.regional)}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() =>
                                                        navigate(`/datamaster/peserta/edit/${item.id}`)
                                                    }
                                                >
                                                    <Edit fontSize="small" />
                                                </IconButton>

                                                <IconButton
                                                    color="error"
                                                    onClick={() => {
                                                        setSelectedPeserta(item);
                                                        setOpenDelete(true);
                                                    }}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
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
                                count={filteredPeserta.length}
                                page={page}
                                onPageChange={(_, newPage) => setPage(newPage)}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={(event) => {
                                    setRowsPerPage(parseInt(event.target.value, 10));
                                    setPage(0);
                                }}
                                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                                labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
                                labelRowsPerPage={t("rows")}
                                ActionsComponent={PaginationActions}
                                sx={{
                                    "& .MuiTablePagination-select": {
                                        border: "1px solid #ccc",
                                    }
                                }}
                            />

                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<Add />}
                                onClick={() => navigate("/datamaster/peserta/create-peserta")}
                                aria-label="Create Peserta"
                            >
                                {t("create")}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                {/* DELETE DIALOG */}
                {selectedPeserta && (
                    <DeletePesertaDialog
                        open={openDelete}
                        onClose={() => setOpenDelete(false)}
                        onConfirm={async () => {
                            try {
                                await removePeserta(selectedPeserta.id);
                                setOpenDelete(false);
                                setSelectedPeserta(null);
                                window.location.reload();
                            } catch (error) {
                                console.error("Gagal menghapus Peserta:", error);
                            }
                        }}
                        PesertaName={selectedPeserta.name}
                    />
                )}
            </Box>
        </Box>
    );
}