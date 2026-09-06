//{*/hooks/useSessionManager.ts*}
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API from "../api/api";
import { useStore } from "./useStore";

interface TokenPayload {
    iat: number;
    exp: number;
}

const REFRESH_WINDOW_START = 12 * 60 * 60 * 1000; // 12 jam (ms)
const REFRESH_WINDOW_END = 14 * 60 * 60 * 1000;    // 14 jam (ms)

export const useSessionManager = () => {
    const navigate = useNavigate();
    const { clearUser } = useStore();

    const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
    const logoutTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

    const clearTimers = () => {
        if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
        if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
    };

    const logout = () => {
        clearTimers();

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        clearUser();

        navigate("/login");
    };

    const doRefresh = async () => {
        try {
            const response = await API.post("/auth/refresh");
            const newToken = response.data.token;
            localStorage.setItem("token", newToken);
            schedule(newToken); // reschedule pakai token baru (exp baru 16 jam)
        } catch (err) {
            // Refresh gagal (network error / sudah lewat jam ke-14).
            // Sengaja TIDAK langsung logout di sini — biarkan logoutTimeout
            // di bawah (yang mengacu ke exp token ASLI) yang jadi fallback,
            // supaya gangguan jaringan sesaat tidak langsung nendang user.
            console.warn("Auto-refresh token gagal:", err);
        }
    };

    const schedule = (token: string) => {
        clearTimers();

        let decoded: TokenPayload;
        try {
            decoded = jwtDecode<TokenPayload>(token);
        } catch {
            return logout();
        }

        const now = Date.now();
        const issuedAt = decoded.iat * 1000;
        const expiresAt = decoded.exp * 1000;
        const msUntilExpire = expiresAt - now;

        if (msUntilExpire <= 0) {
            return logout();
        }

        // Hard cutoff: logout pas token expired (± jam ke-16 dari login/refresh terakhir)
        logoutTimeoutRef.current = setTimeout(logout, msUntilExpire);

        // Window refresh: jam ke-12 s.d. ke-14 sejak token ini diterbitkan
        const msUntilWindowStart = issuedAt + REFRESH_WINDOW_START - now;
        const msUntilWindowEnd = issuedAt + REFRESH_WINDOW_END - now;

        if (msUntilWindowEnd > 0) {
            const delay = Math.max(msUntilWindowStart, 0);
            refreshTimeoutRef.current = setTimeout(doRefresh, delay);
        }
        // kalau msUntilWindowEnd <= 0 → window refresh sudah lewat,
        // tinggal nunggu logoutTimeout di atas yang jalan pas expired.
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) schedule(token);

        // Penting: setTimeout berjam-jam bisa "meleset" kalau tab
        // di-background lama / laptop sleep / mobile browser throttling.
        // Re-check begitu tab aktif lagi supaya jadwal tetap akurat.
        const handleVisibility = () => {
            if (document.visibilityState === "visible") {
                const t = localStorage.getItem("token");
                if (t) schedule(t);
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            clearTimers();
            document.removeEventListener("visibilitychange", handleVisibility);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};