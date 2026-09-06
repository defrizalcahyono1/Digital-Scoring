import { create } from "zustand";

import {
  Profile
} from "../types/profile";


interface ProfileState {

  profile: Profile | null;

  loading: boolean;

  updating: boolean;

  error: string | null;

  setProfile: (
    profile: Profile | null
  ) => void;

  setLoading: (
    loading: boolean
  ) => void;

  setUpdating: (
    updating: boolean
  ) => void;

  setError: (
    error: string | null
  ) => void;

  clearProfile: () => void;
}


export const useProfileStore =
  create<ProfileState>((set) => ({

    profile: null,

    loading: false,

    updating: false,

    error: null,


    setProfile: (profile) =>
      set({
        profile,
        error: null
      }),


    setLoading: (loading) =>
      set({
        loading
      }),


    setUpdating: (updating) =>
      set({
        updating
      }),


    setError: (error) =>
      set({
        error
      }),


    clearProfile: () =>
      set({
        profile: null,
        loading: false,
        updating: false,
        error: null
      })

  }));