// import * as React from "react";
import { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Link,
    Checkbox,
    FormControlLabel,
    InputAdornment,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import directiveLogo from "../assets/direc.png";
import backgroundImage from "../assets/background.jpg";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { CheckCircle as CheckCircleIcon, Error as ErrorIcon, Warning as WarningIcon } from '@mui/icons-material';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({
        username: false,
        full_name: false,
        email: false,
        password: false,
        confirmPassword: false,
    });

    const [formData, setFormData] = useState({
        username: "",
        full_name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [agreed, setAgreed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [dialogType, setDialogType] = useState<"success" | "error" | "warning">("success");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "username" || name === "email") {
            setFormData({ ...formData, [name]: value.toLowerCase() });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validatePassword = (password: string) => {
        const minLength = password.length >= 6;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSymbol = /[^A-Za-z0-9]/.test(password);

        return minLength && hasUpperCase && hasNumber && hasSymbol;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!agreed) {
            setDialogMessage("You must agree with the Privacy Policy to register.");
            setDialogType("warning");
            setOpenDialog(true);
            return;
        }

        const newErrors = {
            username: !formData.username,
            full_name: !formData.full_name,
            email: !formData.email,
            password: !formData.password,
            confirmPassword: !formData.confirmPassword,
        };

        setErrors(newErrors);

        const hasError = Object.values(newErrors).some((err) => err);
        if (hasError) return;

        if (!validatePassword(formData.password)) {
            setErrors((prev) => ({ ...prev, password: true }));
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrors((prev) => ({ ...prev, confirmPassword: true }));
            return;
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { confirmPassword, ...dataToSend } = formData;
            const response = await axios.post("http://localhost:5000/api/register", dataToSend);

            if (response.status === 201) {
                setDialogMessage("Your account has been successfully created. Please log in to continue.");
                setDialogType("success");
                setOpenDialog(true);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || "Registration failed. Please try again.";
            console.error("Registration failed:", errorMessage);

            if (errorMessage.toLowerCase().includes("username")) {
                setDialogMessage("Username is already taken. Please choose a different one.");
                setDialogType("error");
            } else if (errorMessage.toLowerCase().includes("email")) {
                setDialogMessage("Email is already registered. Please use a different email.");
                setDialogType("error");
            } else if (errorMessage.toLowerCase().includes("full name")) {
                setDialogMessage("Full Name is already in use. Please choose a different full name.");
                setDialogType("error");
            } else {
                setDialogMessage("Registration failed. Please try again.");
                setDialogType("error");
            }

            setOpenDialog(true);
        }
    };


    const handleLoginClick = () => navigate("/login");

    const handleDialogClose = () => {
        setOpenDialog(false);
        if (dialogType === "success") navigate("/login");
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
            }}
        >
            <Box mb={2}>
                <img
                    src={directiveLogo}
                    alt="Directive Logo"
                    style={{ height: 150, cursor: "pointer" }}
                    onClick={() => window.location.reload()}
                />
            </Box>
            <Paper
                elevation={8}
                sx={{
                    p: 4,
                    width: "100%",
                    maxWidth: 420,
                    borderRadius: 5,
                    backgroundColor: "white",
                }}
            >
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Create your account
                </Typography>
                <Typography variant="body2" gutterBottom>
                    Enter your personal details to create account
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        error={errors.username}
                        helperText={errors.username ? "Username is required" : ""}
                        InputProps={{ sx: { borderRadius: 2 } }}
                    />
                    <TextField
                        fullWidth
                        label="Full Name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        error={errors.full_name}
                        helperText={errors.full_name ? "Full Name is required" : ""}
                        InputProps={{ sx: { borderRadius: 2 } }}
                    />
                    <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        error={errors.email}
                        helperText={errors.email ? "Email is required" : ""}
                        InputProps={{ sx: { borderRadius: 2 } }}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        margin="normal"
                        error={errors.password}
                        helperText={errors.password ? "Password must be at least 6 characters, include 1 uppercase letter, 1 number, and 1 symbol" : ""}
                        InputProps={{
                            sx: { borderRadius: 2 },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        type={showConfirmPassword ? "text" : "password"}
                        variant="outlined"
                        margin="normal"
                        error={errors.confirmPassword}
                        helperText={errors.confirmPassword ? "Passwords do not match" : ""}
                        InputProps={{
                            sx: { borderRadius: 2 },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                            />
                        }
                        label={(
                            <Typography variant="body2">
                                Agree with{" "}
                                <Link
                                    href="#"
                                    underline="hover"
                                    sx={{ color: "#d32f2f", fontWeight: "bold" }}
                                >
                                    Privacy Policy
                                </Link>
                            </Typography>
                        )}
                        sx={{ mt: 1 }}
                    />
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
                        Create Account
                    </Button>
                </form>
                <Typography mt={3} textAlign="center" color="text.secondary">
                    Already have an account?{" "}
                    <Link
                        component="button"
                        onClick={handleLoginClick}
                        underline="hover"
                        sx={{ color: "#d32f2f", fontWeight: "bold" }}
                    >
                        Login
                    </Link>
                </Typography>
            </Paper>
            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: '16px',
                        width: 360,
                        minHeight: 300,
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Box sx={{ mb: 1, mt: 2 }}>
                        {dialogType === "success" ? (
                            <CheckCircleIcon sx={{ color: "green", fontSize: "100px" }} />
                        ) : dialogType === "warning" ? (
                            <WarningIcon sx={{ color: "#fbc02d", fontSize: "100px" }} />
                        ) : (
                            <ErrorIcon sx={{ color: "#d32f2f", fontSize: "100px" }} />
                        )}
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
                        {dialogType === "success" ? "Registration Successful" :
                            dialogType === "warning" ? "Warning" : "Error"}
                    </Typography>
                </DialogTitle>
                <DialogContent
                    sx={{
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Typography variant="body1" fontWeight="reguler">
                        {dialogMessage}
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
