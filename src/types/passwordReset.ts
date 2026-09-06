export interface ForgotPasswordRequest {
    email: string;
}

export interface ForgotPasswordResponse {
    message: string;
}

export interface ResetPasswordRequest {
    token: string;
    password: string;
    confirmPassword: string;
}

export interface ResetPasswordResponse {
    message: string;
}

export interface PasswordResetState {
    loading: boolean;
    success: boolean;
    error: string | null;
    message: string | null;
}
