import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useStore } from "../../hooks/useStore";

interface AuthGuardProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

interface TokenPayload {
    exp: number;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
    children,
    allowedRoles,
}) => {
    const user = useStore((state) => state.user);
    const location = useLocation();

    const token = localStorage.getItem("token");

    // ==========================================
    // 1. BELUM LOGIN
    // ==========================================
    if (!token || !user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    // ==========================================
    // 2. CEK TOKEN
    // ==========================================
    try {
        const decoded = jwtDecode<TokenPayload>(token);

        const currentTime = Date.now() / 1000;

        if (!decoded.exp || decoded.exp <= currentTime) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            return (
                <Navigate
                    to="/login"
                    replace
                />
            );
        }
    } catch (error) {
        console.error("Invalid token:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }
    if (allowedRoles && allowedRoles.length > 0) {
        const userRole = user.role?.toLowerCase();

        const hasAccess = allowedRoles
            .map((role) => role.toLowerCase())
            .includes(userRole);

        if (!hasAccess) {
            return (
                <Navigate
                    to="/dashboard"
                    replace
                />
            );
        }
    }

    return <>{children}</>;
};

export default AuthGuard;