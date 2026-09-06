import API from "../../../api/api.js";
import { PIC } from "../../../types/pic";
import { CreateUserPayload, UpdateUserPayload } from "../../../types/user";

const API_URL = "http://localhost:5000/api/pic";

export const fetchPIC = async () => {
  try {
    const response = await API.get<PIC[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching PIC:", error);
    throw error;
  }
};

export const createPIC = async (data: CreateUserPayload) => {
  try {
    const response = await API.post<PIC>(API_URL, data, {
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

export const updatePIC = async (id: number, data: UpdateUserPayload) => {
  try {
    const response = await API.put<PIC>(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating User:", error);
    throw error;
  }
};

export const deletePIC= async (id: number) => {
  try {
    await API.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting PIC:", error);
    throw error;
  }
};
