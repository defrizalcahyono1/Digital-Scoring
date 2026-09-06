import { usePasswordResetStore } from "../stores/passwordResetStore";
import {
    forgotPassword as forgotPasswordApi,
    resetPassword as resetPasswordApi,
} from "../api/password";

import type {
    ForgotPasswordRequest,
    ResetPasswordRequest,
} from "../types/passwordReset";

import axios from "axios";

export const usePasswordReset = () => {
    const {
        loading,
        success,
        error,
        message,

        setLoading,
        setSuccess,
        setError,
        setMessage,

        reset,
    } = usePasswordResetStore();

    const forgotPassword = async (
        data: ForgotPasswordRequest
    ) => {
        try {
            setLoading(true);
            setSuccess(false);
            setError(null);
            setMessage(null);

            const response =
                await forgotPasswordApi(data);

            setSuccess(true);
            setMessage(response.message);

            return response;
        } catch (error: unknown) {
            let message =
                "Terjadi kesalahan. Silakan coba lagi.";

            if (axios.isAxiosError(error)) {
                message =
                    error.response?.data?.message ||
                    message;
            }

            setError(message);

            throw error;
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (
        data: ResetPasswordRequest
    ) => {
        try {
            setLoading(true);
            setSuccess(false);
            setError(null);
            setMessage(null);

            const response =
                await resetPasswordApi(data);

            setSuccess(true);
            setMessage(response.message);

            return response;
        } catch (error: unknown) {
            let message =
                "Terjadi kesalahan. Silakan coba lagi.";

            if (axios.isAxiosError(error)) {
                message =
                    error.response?.data?.message ||
                    message;
            }

            setError(message);

            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        success,
        error,
        message,

        forgotPassword,
        resetPassword,

        reset,
    };
};
