import { useState } from "react";

import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Link,
    Alert,
    CircularProgress,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import directiveLogo from "../assets/direc.png";
import backgroundImage from "../assets/background.jpg";

import { usePasswordReset } from "../hooks/usePasswordReset";

export default function ForgotPasswordPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const {
        loading,
        success,
        error,
        message,
        forgotPassword,
    } = usePasswordReset();

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        try {
            await forgotPassword({
                email,
            });
        } catch {
            // Error sudah ditangani oleh hook
        }
    };

    const handleCreateAccount = () => {
        navigate("/register");
    };

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
                        cursor: "pointer",
                    }}
                    onClick={() =>
                        window.location.reload()
                    }
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
                    Reset Password
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={2}
                >
                    Masukkan email yang terdaftar.
                    Kami akan mengirimkan link untuk
                    membuat password baru.
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
                            label="Email Address"
                            type="email"
                            margin="normal"
                            required
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            disabled={loading}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
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
                                "Send Reset Password"
                            )}
                        </Button>
                    </form>
                )}

                <Typography
                    mt={3}
                    textAlign="center"
                >
                    Don’t have account?{" "}

                    <Link
                        component="button"
                        onClick={
                            handleCreateAccount
                        }
                        underline="hover"
                        sx={{
                            color: "#d32f2f",
                            fontWeight: "bold",
                        }}
                    >
                        Create Account
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
}
