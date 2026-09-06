import { useState } from "react";

import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Alert,
    CircularProgress,
} from "@mui/material";

import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import directiveLogo from "../assets/direc.png";
import backgroundImage from "../assets/background.jpg";

import { usePasswordReset } from "../hooks/usePasswordReset";

export default function ResetPasswordPage() {
    const navigate = useNavigate();

    const [searchParams] =
        useSearchParams();

    const token =
        searchParams.get("token");

    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const {
        loading,
        success,
        error,
        message,
        resetPassword,
    } = usePasswordReset();

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        if (!token) {
            return;
        }

        if (password !== confirmPassword) {
            return;
        }

        try {
            await resetPassword({
                token,
                password,
                confirmPassword,
            });
        } catch {
            // Error sudah ditangani hook
        }
    };

    const handleLogin = () => {
        navigate("/login");
    };

    if (!token) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Alert severity="error">
                    Link reset password tidak valid.
                </Alert>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                px: 91,
                py: 0,
            }}
        >
            <Box mb={2}>
                <img
                    src={directiveLogo}
                    alt="Directive Logo"
                    style={{
                        height: 200,
                    }}
                />
            </Box>

            <Paper
                elevation={6}
                sx={{
                    p: 4,
                    width: "100%",
                    maxWidth: 400,
                    borderRadius: 5,
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                >
                    Create New Password
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={2}
                >
                    Masukkan password baru untuk
                    akun Anda.
                </Typography>

                {success && (
                    <Alert
                        severity="success"
                        sx={{ mb: 2 }}
                    >
                        {message}
                    </Alert>
                )}

                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Alert>
                )}

                {!success && (
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="New Password"
                            type="password"
                            margin="normal"
                            required
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            disabled={loading}
                        />

                        <TextField
                            fullWidth
                            label="Confirm Password"
                            type="password"
                            margin="normal"
                            required
                            value={
                                confirmPassword
                            }
                            onChange={(event) =>
                                setConfirmPassword(
                                    event.target.value
                                )
                            }
                            error={
                                confirmPassword
                                    .length > 0 &&
                                password !==
                                    confirmPassword
                            }
                            helperText={
                                confirmPassword
                                    .length > 0 &&
                                password !==
                                    confirmPassword
                                    ? "Password tidak sama"
                                    : ""
                            }
                            disabled={loading}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={
                                loading ||
                                !password ||
                                !confirmPassword ||
                                password !==
                                    confirmPassword
                            }
                            sx={{
                                mt: 3,
                                borderRadius: 2,
                                backgroundColor:
                                    "#d32f2f",
                                py: 1.5,
                                fontWeight: "bold",
                            }}
                        >
                            {loading ? (
                                <CircularProgress
                                    size={24}
                                    color="inherit"
                                />
                            ) : (
                                "Reset Password"
                            )}
                        </Button>
                    </form>
                )}

                {success && (
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleLogin}
                        sx={{
                            mt: 2,
                            borderRadius: 2,
                        }}
                    >
                        Go to Login
                    </Button>
                )}
            </Paper>
        </Box>
    );
}
