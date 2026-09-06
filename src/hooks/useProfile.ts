import {
    fetchProfile,
    updateProfile
} from "../api/profile";

import {
    UpdateProfilePayload
} from "../types/profile";

import {
    useProfileStore
} from "../stores/ProfileStore";


export const useProfile = () => {

    const {
        profile,
        loading,
        updating,
        error,

        setProfile,
        setLoading,
        setUpdating,
        setError
    } = useProfileStore();


    const loadProfile = async () => {

        setLoading(true);
        setError(null);

        try {

            const data =
                await fetchProfile();

            setProfile(data);

            return data;

        } catch (error) {

            console.error(
                "Failed to load profile:",
                error
            );

            setError(
                "Failed to load profile"
            );

            throw error;

        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 4000);
        }
    };


    const saveProfile = async (
        payload: UpdateProfilePayload
    ) => {

        setUpdating(true);
        setError(null);

        try {

            const data =
                await updateProfile(payload);

            setProfile(data);

            return data;

        } catch (error) {

            console.error(
                "Failed to update profile:",
                error
            );

            setError(
                "Failed to update profile"
            );

            throw error;

        } finally {

            setUpdating(false);

        }
    };


    return {
        profile,
        loading,
        updating,
        error,

        loadProfile,
        saveProfile
    };
};