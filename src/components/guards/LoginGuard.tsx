import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../../hooks/useStore';
import { jwtDecode } from "jwt-decode";

interface LoginGuardProps {
    children: React.ReactNode;
}

interface TokenPayload {
    exp: number;
}

const LoginGuard: React.FC<LoginGuardProps> = ({ children }) => {
    const user = useStore((state) => state.user);
    const token = localStorage.getItem('token');

    if (!user || !token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode<TokenPayload>(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return <Navigate to="/login" replace />;
        }
    } catch (error) {
        console.error("Invalid token", error);
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default LoginGuard;
