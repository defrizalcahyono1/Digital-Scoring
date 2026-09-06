import API from "../../../api/api.js";
import { Peserta } from "../../../types/peserta";

const API_URL = "http://localhost:5000/api/peserta";

export const fetchPeserta = async () => {
  try {
    const response = await API.get<Peserta[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching Peserta:", error);
    throw error;
  }
};

export const createPeserta = async (data: Omit<Peserta, "id">) => {
  try {
    const response = await API.post<Peserta>(API_URL, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log("Peserta created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating Peserta:", error);
    throw error;
  }
};

export const updatePeserta = async (id: number, data: Omit<Peserta, "id">) => {
  try {
    const response = await API.put<Peserta>(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating Peserta:", error);
    throw error;
  }
};

export const deletePeserta = async (id: number) => {
  try {
    await API.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting peserta:", error);
    throw error;
  }
};
