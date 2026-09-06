import API from "../../../api/api.js";
import { User, CreateUserPayload, UpdateUserPayload } from "../../../types/user";

const API_URL = "http://localhost:5000/api/user";

export const fetchUser = async () => {
  try {
    const response = await API.get<User[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching User:", error);
    throw error;
  }
};

export const createUser = async (data: CreateUserPayload) => {
  try {
    const response = await API.post<User>(API_URL, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating User:", error);
    throw error;
  }
};

export const updateUser = async (id: number, data: UpdateUserPayload) => {
  try {
    const response = await API.put<User>(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating User:", error);
    throw error;
  }
};

export const deleteUser = async (id: number) => {
  try {
    await API.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting User:", error);
    throw error;
  }
};