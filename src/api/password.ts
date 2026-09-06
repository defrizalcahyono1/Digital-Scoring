import API from "./api";

import type {
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
} from "./../types/passwordReset";

export const forgotPassword = async (
    data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
    const response = await API.post<ForgotPasswordResponse>(
        "/auth/forgot-password",
        data
    );

    return response.data;
};

export const resetPassword = async (
    data: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
    const response = await API.post<ResetPasswordResponse>(
        "/auth/reset-password",
        data
    );

    return response.data;
};