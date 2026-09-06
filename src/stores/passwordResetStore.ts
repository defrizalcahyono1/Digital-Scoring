import { create } from "zustand";

interface PasswordResetStore {
    loading: boolean;
    success: boolean;
    error: string | null;
    message: string | null;

    setLoading: (loading: boolean) => void;
    setSuccess: (success: boolean) => void;
    setError: (error: string | null) => void;
    setMessage: (message: string | null) => void;

    reset: () => void;
}

export const usePasswordResetStore =
    create<PasswordResetStore>((set) => ({
        loading: false,
        success: false,
        error: null,
        message: null,

        setLoading: (loading) =>
            set({ loading }),

        setSuccess: (success) =>
            set({ success }),

        setError: (error) =>
            set({ error }),

        setMessage: (message) =>
            set({ message }),

        reset: () =>
            set({
                loading: false,
                success: false,
                error: null,
                message: null,
            }),
    }));
