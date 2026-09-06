export interface User {
    id: number;
    full_name: string;
    username: string;
    email: string;
    password: string;
    role: string;
}

export type CreateUserPayload = Omit<User, "id">;

export type UpdateUserPayload = Omit<User, "id" | "password"> & {
  password?: string;
};