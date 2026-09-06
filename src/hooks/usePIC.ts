import { deletePIC, fetchPIC } from "../api/datamaster/pic/pic";
import { usePICStore } from "../stores/PICStore";

export const usePIC = () => {
  const { setPIC, setLoading } = usePICStore();

  const loadPIC = async () => {
    setLoading(true);
    try {
      const data = await fetchPIC();
      setPIC(data);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 4000);
    }
  };

  const removePIC = async (id: number) => {
    try {
      await deletePIC(id);
      await loadPIC();
    } catch (error) {
      console.error(error);
    }
  };

  return { loadPIC, removePIC };
};
