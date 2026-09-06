import { useState, useMemo, useEffect } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Divider,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Tooltip
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../bar/Sidebar";
import UserMenu from "../../header/UserMenu";
import { useStore } from "../../../hooks/useStore";
import { createUser } from "../../../api/datamaster/user/UserManagement";
import { useTranslation } from "react-i18next";

export default function CreateUserModal() {
    const navigate = useNavigate();
    const { sidebarOpen, pageTitle, setPageTitle } = useStore();
    const drawerWidth = sidebarOpen ? 260 : 70;
    const { t } = useTranslation();

    const [showPassword, setShowPassword] = useState(false);
    const [full_name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");

    const [errors, setErrors] = useState({ full_name: "", username: "", email: "", password: "", role: "" });

    useEffect(() => {
        setPageTitle(t("createUser"));
    }, [t]);

    useEffect(() => {
        document.title =
            `${t("turnamentTitle")}${pageTitle
                ? " | " + pageTitle
                : ""
            }`;
    }, [pageTitle, t]);

    const fieldErrors = useMemo(
        () => ({
            full_name: full_name ? "" : t("fullNameRequired"),
            username: username ? "" : t("usernameRequired"),
            email: email ? "" : t("emailRequired"),
            password: password ? "" : t("passwordRequired"),
            role: role ? "" : t("roleRequired"),
        }),
        [full_name, username, email, password, role, t]
    );

    const handleSubmit = async () => {
        setErrors(fieldErrors);
        if (fieldErrors.full_name || fieldErrors.username || fieldErrors.email || fieldErrors.password || fieldErrors.role) {
            return;
        }

        setLoading(true);
        try {
            await createUser({ full_name, username, email, password, role });
            setDialogMessage(t("userCreated"));
            setOpenDialog(true);
            setTimeout(() => {
                navigate("/datamaster/usermanagement");
            }, 2000);
        } catch (error) {
            console.error(error);
            setDialogMessage(t("userError"));
            setOpenDialog(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setDialogMessage("");
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "row", minHeight: "100vh", width: "100vw", overflowX: "hidden" }}>
            <Box sx={{ width: drawerWidth, transition: "width 0.3s", position: "fixed" }}>
                <Sidebar />
            </Box>
            <Box flexGrow={1} ml={`${drawerWidth}px`} padding={3} bgcolor="linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)" fontFamily="Roboto, sans-serif">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h2" fontWeight={600} fontSize={26}>
                        {pageTitle}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Tooltip title={t("fullscreen")}>
                            <IconButton aria-label="Toggle fullscreen" size="medium">
                                <FullscreenIcon fontSize="medium" />
                            </IconButton>
                        </Tooltip>
                        <UserMenu />
                    </Box>
                </Box>
                <Divider />
                <Card sx={{ mt: 4, borderRadius: 3 }}>
                    <CardContent>
                        <Box display="flex" flexDirection="column" gap={2} mt={2} ml={4} mr={4}>
                            <Typography variant="body2" color="error" mb={2}>
                                {t("requiredNote")}
                            </Typography>
                            <Box display="flex" alignItems="center">
                                <TextField
                                    label={t("fullName")}
                                    value={full_name}
                                    onChange={(e) => setName(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.full_name}
                                    helperText={errors.full_name}
                                />
                            </Box>
                            <Box display="flex" alignItems="center">
                                <TextField
                                    label={t("username")}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.username}
                                    helperText={errors.username}
                                />
                            </Box >
                            <Box display="flex" alignItems="center">
                                <TextField
                                    label={t("email")}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.email}
                                    helperText={errors.email}
                                />
                            </Box>
                            <Box display="flex" alignItems="center">
                                <TextField
                                    label={t("password")}
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Box>
                            <Box display="flex" alignItems="center">
                                <TextField
                                    label={t("role")}
                                    select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.role}
                                    helperText={errors.role}
                                >
                                    {/* <MenuItem value="developer">Developer</MenuItem> */}
                                    <MenuItem value="admin">Admin</MenuItem>
                                    <MenuItem value="panitia">Panitia</MenuItem>
                                    <MenuItem value="juri">Juri</MenuItem>
                                </TextField>
                            </Box>
                            <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                                <Button variant="contained" color="error" onClick={handleSubmit} aria-label="Submit User">
                                    {loading ? t("submitting") : t("submit")}
                                </Button>
                                <Button variant="contained" color="warning" onClick={() => navigate("/datamaster/usermanagement")} aria-label="Back to User List">
                                    {t("back")}
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
                <Dialog open={openDialog} onClose={handleCloseDialog} role="dialog" aria-labelledby="success-dialog-title" sx={{ '& .MuiDialog-paper': { borderRadius: '16px', width: 360, minHeight: 300 } }}>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <CheckCircleIcon sx={{ color: "green", fontSize: 100, my: 2 }} />
                        <DialogTitle id="success-dialog-title" sx={{ fontWeight: "bold" }}>
                            {t("success")}
                        </DialogTitle>
                        <Typography variant="body1" sx={{ fontSize: 14, textAlign: "center" }}>
                            {dialogMessage}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary" aria-label="Close success dialog">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}
