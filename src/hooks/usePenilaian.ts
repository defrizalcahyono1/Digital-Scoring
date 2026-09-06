import { useCallback, useEffect, useState } from "react";

import {
  createPenilaian as createPenilaianApi,
  fetchHistoryPenilaian,
  fetchScoreboard,
  fetchScorePerJuri,
  undoPenilaian as undoPenilaianApi,
  resetPenilaian as resetPenilaianApi,
} from "../api/turnament/penilaian/penilaian";

import { usePenilaianStore } from "../stores/penilaianStore";

import { JenisPenilaian, CreatePenilaianRequest } from "../types/penilaian";

export const usePenilaian = (pertandinganId: number) => {
  const {
    history,
    scoreboard,
    scorePerJuri,

    setHistory,
    setScoreboard,
    setScorePerJuri,
  } = usePenilaianStore();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [historyData, scoreboardData, scoreJuriData] = await Promise.all([
        fetchHistoryPenilaian(pertandinganId),

        fetchScoreboard(pertandinganId),

        fetchScorePerJuri(pertandinganId),
      ]);

      setHistory(historyData);

      setScoreboard(scoreboardData);

      setScorePerJuri(scoreJuriData);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Gagal mengambil data penilaian.",
      );
    } finally {
      setLoading(false);
    }
  }, [pertandinganId, setHistory, setScoreboard, setScorePerJuri]);

  const submit = async (
    pesertaId: number,
    jenis: JenisPenilaian,
    keterangan?: string,
  ) => {
    try {
      setError(null);

      const payload: CreatePenilaianRequest = {
        pertandingan_id: pertandinganId,

        peserta_id: pesertaId,

        jenis,

        keterangan,
      };

      await createPenilaianApi(payload);

      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Gagal menyimpan penilaian.");

      throw err;
    }
  };

  const undo = async () => {
    try {
      setError(null);

      await undoPenilaianApi(pertandinganId);

      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Gagal melakukan undo.");

      throw err;
    }
  };

  const reset = async () => {
    try {
      setError(null);

      await resetPenilaianApi(pertandinganId);

      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Gagal mereset penilaian.");

      throw err;
    }
  };

  useEffect(() => {
    load();
  }, [load]);

  return {
    history,
    scoreboard,
    scorePerJuri,
    loading,
    error,
    reload: load,
    submit,
    undo,
    reset,
  };
};
