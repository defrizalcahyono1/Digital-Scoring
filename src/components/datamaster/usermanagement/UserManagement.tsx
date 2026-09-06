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
    MenuItem,
    TextField
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../bar/Sidebar";
import UserMenu from "../../header/UserMenu";
import DeleteUserDialog from "./DeleteUserDialog";
import { useStore } from "../../../hooks/useStore";
import { useUserStore } from "../../../stores/UserStore";
import { useUser } from "../../../hooks/useUser";
import { TablePagination } from "@mui/material";
import PaginationActions from "../../custom/PaginationActions";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { capitalizeWords, formatEmail } from "../../../utils/format";
import { useTranslation } from "react-i18next";
import CustomLoading from "../../custom/CustomLoading";

type SortByType = "default" | "name" | "username" | "email" | "role";

export default function UserManagement() {
    const navigate = useNavigate();
    const { sidebarOpen, pageTitle, setPageTitle } = useStore();
    const { User, loading, selectedUser, setSelectedUser } = useUserStore();
    const { t } = useTranslation();

    const { loadUser, removeUser } = useUser();
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

    // const capitalizeWords = (str: string) => str.replace(/\b\w/g, (char) => char.toUpperCase());

    useEffect(() => {
        loadUser();
        setPageTitle(t("userManagement"));
    }, [t]);

    useEffect(() => {
        document.title =
            `${t("turnamentTitle")}${pageTitle
                ? " | " + pageTitle
                : ""
            }`;
    }, [pageTitle, t]);

    const memoizedUser = useMemo(
        () => Array.isArray(User) ? User : [],
        [User]
    );

    const filteredUser = useMemo(() => {
        let data = [...memoizedUser];

        // 🔍 SEARCH
        if (search) {
            data = data.filter((item) =>
                item.username.toLowerCase().includes(search.toLowerCase()) ||
                item.full_name.toLowerCase().includes(search.toLowerCase()) ||
                item.email.toLowerCase().includes(search.toLowerCase())
            );
        }

        // 🔽 SORT
        if (sortBy !== "default") {
            data.sort((a, b) => {
                let fieldA = "";
                let fieldB = "";

                switch (sortBy) {
                    case "name":
                        fieldA = a.full_name || "";
                        fieldB = b.full_name || "";
                        break;
                    case "username":
                        fieldA = a.username || "";
                        fieldB = b.username || "";
                        break;
                    case "email":
                        fieldA = a.email || "";
                        fieldB = b.email || "";
                        break;
                    case "role":
                        fieldA = a.role || "";
                        fieldB = b.role || "";
                        break;
                    default:
                        return 0;
                }

                if (sortOrder === "asc") {
                    return fieldA.localeCompare(fieldB);
                }
                return fieldB.localeCompare(fieldA);
            });
        }

        return data;
    }, [memoizedUser, search, sortBy, sortOrder]);

    const paginatedUser = useMemo(() => {
        const start = page * rowsPerPage;
        return filteredUser.slice(start, start + rowsPerPage);
    }, [filteredUser, page, rowsPerPage]);

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
                    sx={{
                        flexWrap: "wrap",
                    }}
                >
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
                        <MenuItem value="name">{t("name")}</MenuItem>
                        <MenuItem value="username">{t("username")}</MenuItem>
                        <MenuItem value="email">{t("email")}</MenuItem>
                        <MenuItem value="role">{t("role")}</MenuItem>
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
                            <Table aria-label="User List Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No</TableCell>
                                        <TableCell>{t("name")}</TableCell>
                                        <TableCell>{t("username")}</TableCell>
                                        <TableCell>{t("email")}</TableCell>
                                        <TableCell>{t("role")}</TableCell>
                                        <TableCell>{t("actions")}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedUser.map((User, index) => (
                                        <TableRow key={User.id}>
                                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                            <TableCell>{User.full_name ? capitalizeWords(User.full_name) : "Unknown User"}</TableCell>
                                            <TableCell>{User.username ? capitalizeWords(User.username) : "Unknown User"}</TableCell>
                                            <TableCell>{User.email ? formatEmail(User.email) : "Unknown Email"}</TableCell>
                                            <TableCell>{User.role ? capitalizeWords(User.role) : "Unknown role"}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    color="primary"
                                                    size="small"
                                                    aria-label={`Edit ${User.full_name}`}
                                                    onClick={() => navigate(`/datamaster/usermanagement/edit/${User.id}`)}
                                                >
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                    aria-label={`Delete ${User.full_name}`}
                                                    onClick={() => {
                                                        setSelectedUser(User);
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
                                count={filteredUser.length}
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
                                onClick={() => navigate("/datamaster/usermanagement/create-user")}
                                aria-label="Create New User"
                            >
                                {t("create")}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
                {
                    selectedUser && (
                        <DeleteUserDialog
                            open={openDelete}
                            onClose={() => setOpenDelete(false)}
                            onConfirm={async () => {
                                try {
                                    await removeUser(selectedUser.id);
                                    setOpenDelete(false);
                                    setSelectedUser(null);
                                    window.location.reload();
                                } catch (error) {
                                    console.error("Gagal menghapus User:", error);
                                }
                            }}
                            UserName={selectedUser.full_name}
                        />
                    )
                }
            </Box >
        </Box >
    );
}
