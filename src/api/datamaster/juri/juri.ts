import API from "../../../api/api.js";
import { Juri } from "../../../types/juri";
import { CreateUserPayload, UpdateUserPayload } from "../../../types/user";

const API_URL = "http://localhost:5000/api/juri";

export const fetchJuri = async () => {
  try {
    const response = await API.get<Juri[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching Juri:", error);
    throw error;
  }
};

export const createJuri = async (data: CreateUserPayload) => {
  try {
    const response = await API.post<Juri>(API_URL, data, {
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

export const updateJuri = async (id: number, data: UpdateUserPayload) => {
  try {
    const response = await API.put<Juri>(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating User:", error);
    throw error;
  }
};

export const deleteJuri= async (id: number) => {
  try {
    await API.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting Juri:", error);
    throw error;
  }
};
