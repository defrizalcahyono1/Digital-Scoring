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
    MenuItem
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { TablePagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../bar/Sidebar";
import UserMenu from "../../header/UserMenu";
import DeleteJuriDialog from "./DeleteJuriDialog";
import { useStore } from "../../../hooks/useStore";
import { useJuriStore } from "../../../stores/JuriStore";
import { useJuri } from "../../../hooks/useJuri";
import PaginationActions from "../../custom/PaginationActions";
import { useTranslation } from "react-i18next";
import CustomLoading from "../../custom/CustomLoading";


export default function Juri() {
    const navigate = useNavigate();
    const { sidebarOpen, pageTitle, setPageTitle } = useStore();
    const { Juri, loading, selectedJuri, setSelectedJuri } = useJuriStore();
    const { loadJuri, removeJuri } = useJuri();
    const { t } = useTranslation();

    const drawerWidth = sidebarOpen ? 260 : 70;
    const [openDelete, setOpenDelete] = useState(false);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<"default" | "no" | "name">("default");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    useEffect(() => {
        const handleChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleChange);
        };
    }, []);

    useEffect(() => {
        loadJuri();
        setPageTitle(t("juri"));
    }, [t]);

    useEffect(() => {
        document.title =
            `${t("turnamentTitle")}${pageTitle
                ? " | " + pageTitle
                : ""
            }`;
    }, [pageTitle, t]);

    const memoizedJuri = useMemo(
        () => Array.isArray(Juri) ? Juri : [],
        [Juri]
    );

    const filteredJuri = useMemo(() => {
        let data = [...memoizedJuri];

        if (search) {
            data = data.filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (sortBy === "no") {
            data.sort((a, b) =>
                sortOrder === "asc" ? a.id - b.id : b.id - a.id
            );
        }

        if (sortBy === "name") {
            data.sort((a, b) => {
                if (sortOrder === "asc") {
                    return a.name.localeCompare(b.name);
                }
                return b.name.localeCompare(a.name);
            });
        }

        if (sortBy === "default") {
            return data;
        }

        return data;
    }, [memoizedJuri, search, sortBy, sortOrder]);

    const paginatedJuri = useMemo(() => {
        const start = page * rowsPerPage;
        return filteredJuri.slice(start, start + rowsPerPage);
    }, [filteredJuri, page, rowsPerPage]);

    useEffect(() => {
        setPage(0);
    }, [search, sortBy, sortOrder]);

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
                    <Typography variant="h2" fontWeight={600} fontSize={26}>
                        {pageTitle}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Tooltip title={t("fullscreen")}>
                            <IconButton size="medium" aria-label="Toggle fullscreen view" onClick={toggleFullscreen}>
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
                    alignItems="center"
                    mt={5}
                >
                    <TextField
                        select
                        size="small"
                        value={sortBy}
                        onChange={(e) => {
                            const value = e.target.value as "default" | "no" | "name";

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
                    </TextField>
                    <TextField
                        placeholder={t("search")}
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ width: 250 }}
                    />
                </Box>
                <Card sx={{ mt: 5 }}>
                    <CardContent>
                        <TableContainer>
                            <Table aria-label="Juri List Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No</TableCell>
                                        <TableCell>{t("name")}</TableCell>
                                        <TableCell>{t("actions")}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedJuri.map((Juri, index) => (
                                        <TableRow key={Juri.id}>
                                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                            {/* <TableCell>{index + 1}</TableCell> */}
                                            <TableCell>{Juri.name}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    color="primary"
                                                    size="small"
                                                    aria-label={`Edit ${Juri.name}`}
                                                    onClick={() => navigate(`/datamaster/juri/edit/${Juri.id}`)}
                                                >
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                    aria-label={`Delete ${Juri.name}`}
                                                    onClick={() => {
                                                        setSelectedJuri(Juri);
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
                                count={filteredJuri.length}
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
                                onClick={() => navigate("/datamaster/juri/create-juri")}
                                aria-label="Create New Juri"
                            >
                                {t("create")}
                            </Button>
                        </Box>
                        {/* <Box display="flex" justifyContent="flex-end" mt={5} mb={2}>
                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<Add />}
                                onClick={() => navigate("/datamaster/juri/create-juri")}
                                aria-label="Create New Juri"
                            >
                                Create
                            </Button>
                        </Box> */}
                    </CardContent>
                </Card>
                {selectedJuri && (
                    <DeleteJuriDialog
                        open={openDelete}
                        onClose={() => setOpenDelete(false)}
                        onConfirm={async () => {
                            try {
                                await removeJuri(selectedJuri.id);
                                setOpenDelete(false);
                                setSelectedJuri(null);
                                window.location.reload();
                            } catch (error) {
                                console.error("Gagal menghapus Juri:", error);
                            }
                        }}
                        JuriName={selectedJuri.name}
                    />
                )}
            </Box>
        </Box>
    );
}
