import { usePesertaStore } from '../stores/PesertaStore';
import { fetchPeserta, deletePeserta } from '../api/datamaster/peserta/peserta';

export const usePeserta = () => {
  const { setPeserta, setLoading } = usePesertaStore();

  const loadPeserta = async () => {
    setLoading(true);
    try {
      const data = await fetchPeserta();
      setPeserta(data);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 4000);
    }
  };

  const removePeserta = async (id: number) => {
    try {
      await deletePeserta(id);
      await loadPeserta();
    } catch (error) {
      console.error(error);
    }
  };

  return { loadPeserta, removePeserta };
};
