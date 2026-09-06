//{*/pages/pertandingan/penyisihan/PertandinganDetailDialog.tsx*}
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Divider,
    Chip,
    CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SportsScoreIcon from "@mui/icons-material/SportsScore";

import { fetchPertandinganById } from "../../../api/turnament/pertandingan/pertandingan";
import { Pertandingan } from "../../../types/pertandingan";

interface Props {
    open: boolean;
    pertandinganId: number | null;
    onClose: () => void;
}

const STATUS_COLOR: Record<string, "default" | "warning" | "success" | "info"> = {
    belum_mulai: "default",
    berlangsung: "warning",
    pause: "info",
    selesai: "success",
};

const formatText = (text?: string | null) => {
    if (!text) return "-";
    return text
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDate = (value?: string | null) => {
    if (!value) return "-";
    try {
        return new Date(value).toLocaleString();
    } catch {
        return value;
    }
};

export default function PertandinganDetailDialog({
    open,
    pertandinganId,
    onClose,
}: Props) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [detail, setDetail] = useState<Pertandingan | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open || !pertandinganId) return;

        let active = true;

        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchPertandinganById(pertandinganId);
                if (active) setDetail(data);
            } catch (err) {
                console.error(err);
                if (active) setError(t("userError") ?? "Gagal memuat detail.");
            } finally {
                if (active) setLoading(false);
            }
        };

        load();

        return () => {
            active = false;
        };
    }, [open, pertandinganId, t]);

    const handleClose = () => {
        onClose();
        // reset supaya dialog berikutnya tidak sempat kelihatan data lama
        setDetail(null);
        setError(null);
    };

    // Halaman Hitung (controller skor) memang dirancang untuk
    // pertandingan yang sedang berlangsung — lihat catatan di
    // HitungTurnamen.tsx. Di luar status itu, tombol dinonaktifkan
    // supaya tidak membuka layar input skor pada match yang belum
    // dimulai / sudah selesai.
    const handleGoToController = () => {
        if (!detail) return;
        handleClose();
        navigate(`/hitungTurnamen/controller/${detail.id}`);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{t("detail")}</DialogTitle>

            <DialogContent dividers>
                {loading && (
                    <Box display="flex" justifyContent="center" py={4}>
                        <CircularProgress size={28} />
                    </Box>
                )}

                {!loading && error && (
                    <Typography color="error">{error}</Typography>
                )}

                {!loading && !error && detail && (
                    <Box display="flex" flexDirection="column" gap={2}>

                        {/* MATCH */}
                        <Box textAlign="center">
                            <Typography variant="h6" fontWeight={700}>
                                {formatText(detail.peserta1_name)}
                                <Typography
                                    component="span"
                                    color="error.main"
                                    fontWeight={700}
                                    sx={{ mx: 1 }}
                                >
                                    {t("vs")}
                                </Typography>
                                {formatText(detail.peserta2_name) || t("bye")}
                            </Typography>
                            <Chip
                                label={formatText(t(detail.status))}
                                color={STATUS_COLOR[detail.status] ?? "default"}
                                size="small"
                                sx={{ mt: 1 }}
                            />
                        </Box>

                        <Divider />

                        {/* INFO GRID */}
                        <Box display="grid" gridTemplateColumns="1fr 1fr" rowGap={1.5} columnGap={2}>
                            <Typography variant="body2" color="text.secondary">
                                {t("babak")}
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                                {formatText(detail.babak)}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                {t("durasi")}
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                                {detail.durasi_ronde_menit} {t("menit")}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                {t("sisaWaktu")}
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                                {detail.sisa_detik !== null
                                    ? `${Math.floor(detail.sisa_detik / 60)}:${(detail.sisa_detik % 60)
                                        .toString()
                                        .padStart(2, "0")}`
                                    : "-"}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                {t("waktuMulai")}
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                                {formatDate(detail.waktu_mulai)}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                {t("waktuSelesai")}
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                                {formatDate(detail.waktu_selesai)}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                {t("winner")}
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                                {detail.winner_id
                                    ? detail.winner_id === detail.peserta1_id
                                        ? formatText(detail.peserta1_name)
                                        : formatText(detail.peserta2_name)
                                    : "-"}
                            </Typography>
                        </Box>

                        <Divider />

                        {/* JURI */}
                        <Box>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                mb={2}
                            >
                                {t("juri")}
                            </Typography>

                            {detail.juri && detail.juri.length > 0 ? (
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    gap={2}
                                >

                                    {/* JURI UTAMA */}
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                            mb={1}
                                        >
                                            Juri Utama
                                        </Typography>

                                        <Box
                                            display="flex"
                                            flexWrap="wrap"
                                            gap={1}
                                        >
                                            {detail.juri
                                                .filter(
                                                    (j) =>
                                                        j.peran === "utama"
                                                )
                                                .map((j) => (
                                                    <Chip
                                                        key={j.id}
                                                        label={j.full_name}
                                                        size="small"
                                                    />
                                                ))}
                                        </Box>
                                    </Box>

                                    {/* JURI CADANGAN */}
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                            mb={1}
                                        >
                                            Juri Cadangan
                                        </Typography>

                                        <Box
                                            display="flex"
                                            flexWrap="wrap"
                                            gap={1}
                                        >
                                            {detail.juri
                                                .filter(
                                                    (j) =>
                                                        j.peran === "cadangan"
                                                )
                                                .map((j) => (
                                                    <Chip
                                                        key={j.id}
                                                        label={j.full_name}
                                                        size="small"
                                                    />
                                                ))}
                                        </Box>
                                    </Box>

                                </Box>
                            ) : (
                                <Typography variant="body2">
                                    -
                                </Typography>
                            )}
                        </Box>
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                <Button
                    variant="contained"
                    color="warning"
                    startIcon={<SportsScoreIcon />}
                    onClick={handleGoToController}
                    disabled={!detail}
                >
                    {t("kePengaturSkor") ?? "Ke Halaman Hitung"}
                </Button>

                <Button onClick={handleClose}>{t("close")}</Button>
            </DialogActions>
        </Dialog>
    );
}