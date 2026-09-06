import { deleteUser, fetchUser } from "../api/datamaster/user/UserManagement";
import { useUserStore } from "../stores/UserStore";

export const useUser = () => {
  const { setUser, setLoading } = useUserStore();

  const loadUser = async () => {
    setLoading(true);
    try {
      const data = await fetchUser();
      setUser(data);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 4000);
    }
  };

  const removeUser = async (id: number) => {
    try {
      await deleteUser(id);
      await loadUser();
    } catch (error) {
      console.error(error);
    }
  };

  return { loadUser, removeUser };
};
