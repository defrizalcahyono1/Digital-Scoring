import api from "../api/api.js";

import {
  Profile,
  UpdateProfilePayload
} from "../types/profile";


export const fetchProfile = async (): Promise<Profile> => {
  const response = await api.get("/profile");

  return response.data;
};


export const updateProfile = async (
  payload: UpdateProfilePayload
): Promise<Profile> => {

  const formData = new FormData();

  formData.append(
    "full_name",
    payload.full_name
  );

  formData.append(
    "username",
    payload.username
  );

  formData.append(
    "email",
    payload.email
  );

  if (payload.photo) {
    formData.append(
      "photo",
      payload.photo
    );
  }

  const response = await api.put(
    "/profile",
    formData
  );

  return response.data.user;
};