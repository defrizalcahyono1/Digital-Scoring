// src/hooks/useLoginForm.ts
import { useState, useReducer, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../hooks/useStore"; // <--- ini gunakan hook useStore kamu

const initialState = {
    showPassword: false,
    rememberMe: false,
};

function reducer(state: typeof initialState, action: { type: string }) {
    switch (action.type) {
        case "TOGGLE_PASSWORD":
            return { ...state, showPassword: !state.showPassword };
        case "TOGGLE_REMEMBER":
            return { ...state, rememberMe: !state.rememberMe };
        default:
            return state;
    }
}

export function useLoginForm() {
    const [usernameOrEmail, setUsernameOrEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dialog, setDialog] = useState({ open: false, type: "error" as "success" | "error", message: "" });

    const [state, dispatch] = useReducer(reducer, initialState);
    const navigate = useNavigate();
    const { setUser } = useStore();

    const handleSignIn = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usernameOrEmail, password }),
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);

                if (data.user) {
                    localStorage.setItem("user", JSON.stringify(data.user));
                    setUser(data.user);
                }

                if (state.rememberMe) {
                    localStorage.setItem("remembered", "true");
                    localStorage.setItem("rememberedUsername", usernameOrEmail);
                    localStorage.setItem("rememberedPassword", password);
                } else {
                    localStorage.removeItem("remembered");
                    localStorage.removeItem("rememberedUsername");
                    localStorage.removeItem("rememberedPassword");
                }

                setDialog({ open: false, type: "success", message: "You are logged in successfully!" });

                setTimeout(() => {
                    navigate("/dashboard");
                }, 2000);

            } else {
                setDialog({ open: true, type: "error", message: data.error || "Login failed" });
            }
        } catch (err) {
            console.error(err);
            setDialog({ open: true, type: "error", message: "Server error. Please try again later." });
        }
    }, [usernameOrEmail, password, state.rememberMe, navigate, setUser]);

    const handleDialogClose = useCallback(() => {
        setDialog((prev) => ({ ...prev, open: false }));
    }, []);

    useEffect(() => {
        const remembered = localStorage.getItem("remembered") === "true";
        if (remembered) {
            const savedUsername = localStorage.getItem("rememberedUsername") || "";
            const savedPassword = localStorage.getItem("rememberedPassword") || "";
            setUsernameOrEmail(savedUsername);
            setPassword(savedPassword);
            if (!state.rememberMe) {
                dispatch({ type: "TOGGLE_REMEMBER" });
            }
        }
    }, []);

    return {
        usernameOrEmail,
        setUsernameOrEmail,
        password,
        setPassword,
        state,
        dispatch,
        handleSignIn,
        dialog,
        handleDialogClose,
    };
}
