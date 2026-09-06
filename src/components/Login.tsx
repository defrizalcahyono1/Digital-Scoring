import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Box, Button, Checkbox, FormControlLabel, TextField, Typography, IconButton, InputAdornment, Link, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Visibility, VisibilityOff, CheckCircle as CheckCircleIcon, Error as ErrorIcon } from "@mui/icons-material";
import directiveLogo from "../assets/direc.png";
import backgroundImage from "../assets/background.jpg";
import { useLoginForm } from "../hooks/useLoginForm";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const {
        usernameOrEmail,
        setUsernameOrEmail,
        password,
        setPassword,
        state,
        dispatch,
        handleSignIn,
        dialog,
        handleDialogClose,
    } = useLoginForm();

    const passwordVisibilityIcon = useMemo(() => (
        <InputAdornment position="end">
            <IconButton
                onClick={() => dispatch({ type: "TOGGLE_PASSWORD" })}
                edge="end"
                aria-label={state.showPassword ? "Hide password" : "Show password"}
            >
                {state.showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
        </InputAdornment>
    ), [state.showPassword, dispatch]);

    const handleLogoClick = () => window.location.reload();
    const handleForgotPasswordClick = () => navigate("/forgot-password");
    const handleRegisterClick = () => navigate("/register");

    return (
        <Box sx={{ minHeight: "100vh", backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", px: 91, py: 0 }}>
            <Helmet>
                <title>Sign in | Digital Scoring</title>
            </Helmet>

            <Box onClick={handleLogoClick} sx={{ mt: -5, cursor: "pointer" }}>
                <img src={directiveLogo} alt="Directive Logo" style={{ height: 200 }} />
            </Box>

            <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400, borderRadius: 5 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Sign in to account
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Enter your username or email & password to login
                </Typography>
                <form onSubmit={handleSignIn}>
                    <TextField
                        fullWidth
                        label="Username or Email Address"
                        placeholder="Your Account"
                        margin="normal"
                        value={usernameOrEmail}
                        autoComplete="username"
                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type={state.showPassword ? "text" : "password"}
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        InputProps={{ endAdornment: passwordVisibilityIcon }}
                    />
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={state.rememberMe}
                                    onChange={() => dispatch({ type: "TOGGLE_REMEMBER" })}
                                />
                            }
                            label="Remember Me"
                        />
                        <Button
                            variant="text"
                            onClick={handleForgotPasswordClick}
                            sx={{ color: "#d32f2f", fontWeight: "bold" }}
                        >
                            Forgot Password?
                        </Button>
                    </Box>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            borderRadius: 2,
                            backgroundColor: "#d32f2f",
                            py: 1.5,
                            fontWeight: "bold",
                        }}
                    >
                        Sign in
                    </Button>
                </form>
                <Typography mt={3} textAlign="center">
                    Don’t have an account?{" "}
                    <Link
                        component="button"
                        onClick={handleRegisterClick}
                        underline="hover"
                        sx={{ color: "#d32f2f", fontWeight: "bold" }}
                    >
                        Create Account
                    </Link>
                </Typography>
            </Paper>

            <Dialog open={dialog.open} onClose={handleDialogClose} sx={{ '& .MuiDialog-paper': { borderRadius: '16px', width: 360, minHeight: 300 } }}>
                <DialogTitle sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ mb: 1, mt: 2 }}>
                        {dialog.type === "success" ? (
                            <CheckCircleIcon sx={{ color: "green", fontSize: "100px" }} />
                        ) : (
                            <ErrorIcon sx={{ color: "#d32f2f", fontSize: "100px" }} />
                        )}
                    </Box>
                    <Typography variant="h6" component="span" fontWeight="bold">
                        {dialog.type === "success" ? "Successful" : "Error"}
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Typography variant="body1">
                        {dialog.message}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}
