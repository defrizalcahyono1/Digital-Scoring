import { deleteJuri, fetchJuri } from "../api/datamaster/juri/juri";
import { useJuriStore } from "../stores/JuriStore";

export const useJuri = () => {
  const { setJuri, setLoading } = useJuriStore();

  const loadJuri = async () => {
    setLoading(true);
    try {
      const data = await fetchJuri();
      setJuri(data);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 4000);
    }
  };

  const removeJuri = async (id: number) => {
    try {
      await deleteJuri(id);
      await loadJuri();
    } catch (error) {
      console.error(error);
    }
  };

  return { loadJuri, removeJuri };
};
