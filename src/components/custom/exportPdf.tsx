import { useState } from "react";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    Menu,
    MenuItem,
    Select,
    type SelectChangeEvent,
    ListItemIcon,
    ListItemText,
    Divider,
} from "@mui/material";

import {
    PictureAsPdfOutlined,
    EmojiEventsOutlined,
    ExpandMoreOutlined,
} from "@mui/icons-material";

import { useExport } from "../../hooks/useExport";
import { useExportStore } from "../../stores/exportStore";

import type {
    BabakFilter,
    StatusFilter,
} from "../../types/export";

interface ExportPdfProps {
    currentBabak: BabakFilter;
}

const STATUS_LABELS: Record<
    StatusFilter,
    string
> = {
    semua: "Semua Status",
    belum_mulai: "Belum Mulai",
    berlangsung: "Berlangsung",
    pause: "Berlangsung",
    selesai: "Selesai",
};

const STATUS_OPTIONS = [
    {
        value: "semua",
        label: "Semua Status",
    },
    {
        value: "belum_mulai",
        label: "Belum Mulai",
    },
    {
        value: "berlangsung",
        label: "Berlangsung",
    },
    {
        value: "selesai",
        label: "Selesai",
    },
];

const BABAK_LABELS: Record<
    BabakFilter,
    string
> = {
    semua: "Semua Babak",
    penyisihan: "Penyisihan",
    enam_belas_besar: "16 Besar",
    perempat_final: "Perempat Final",
    semi_final: "Semi Final",
    final: "Final",
};

const ExportPdf = ({
    currentBabak,
}: ExportPdfProps) => {
    // =========================================
    // MENU
    // =========================================

    const [anchorEl, setAnchorEl] =
        useState<null | HTMLElement>(null);

    const menuOpen = Boolean(anchorEl);

    // =========================================
    // DIALOG
    // =========================================

    const [dialogOpen, setDialogOpen] =
        useState(false);

    // =========================================
    // STORE
    // =========================================

    const {
        status,
        setStatus,
    } = useExportStore();

    // =========================================
    // EXPORT HOOK
    // =========================================

    const {
        exportingPertandingan,
        exportingBracket,
        exportPertandingan,
        exportBracket,
    } = useExport();

    // =========================================
    // MENU HANDLER
    // =========================================

    const handleOpenMenu = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    // =========================================
    // OPEN PDF DIALOG
    // =========================================

    const handleOpenPdfDialog = () => {
        handleCloseMenu();

        setDialogOpen(true);
    };

    // =========================================
    // CLOSE PDF DIALOG
    // =========================================

    const handleClosePdfDialog = () => {
        if (exportingPertandingan) {
            return;
        }

        setDialogOpen(false);
    };

    // =========================================
    // STATUS
    // =========================================

    const handleStatusChange = (
        event: SelectChangeEvent
    ) => {
        setStatus(
            event.target.value as StatusFilter
        );
    };

    // =========================================
    // EXPORT PDF
    // =========================================

    const handleExportPdf = async () => {
        try {
            /*
             * currentBabak berasal dari halaman
             * tempat component digunakan.
             *
             * Status berasal dari dialog.
             */
            await exportPertandingan(
                currentBabak,
                status
            );

            setDialogOpen(false);
        } catch (error) {
            console.error(
                "Export PDF error:",
                error
            );
        }
    };

    // =========================================
    // EXPORT CLASSEMENT
    // =========================================

    const handleExportClassement =
        async () => {
            handleCloseMenu();

            try {
                /*
                 * Tidak mengirim currentBabak.
                 *
                 * Backend harus mengambil
                 * seluruh babak.
                 */
                await exportBracket();
            } catch (error) {
                console.error(
                    "Export classement error:",
                    error
                );
            }
        };

    return (
        <>
            {/* =========================================
                EXPORT BUTTON
            ========================================= */}

            <Button
                variant="outlined"
                size="small"
                onClick={handleOpenMenu}
                disabled={
                    exportingPertandingan ||
                    exportingBracket
                }
                endIcon={
                    <ExpandMoreOutlined />
                }
                sx={{
                    height: 40,
                    minWidth: 110,
                    textTransform: "none",
                    borderRadius: 1.5,
                }}
            >
                Export
            </Button>

            {/* =========================================
                EXPORT MENU
            ========================================= */}

            <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleCloseMenu}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                slotProps={{
                    paper: {
                        sx: {
                            minWidth: 220,
                            mt: 0.5,
                        },
                    },
                }}
            >
                <MenuItem
                    onClick={
                        handleOpenPdfDialog
                    }
                    disabled={
                        exportingPertandingan
                    }
                >
                    <ListItemIcon>
                        <PictureAsPdfOutlined fontSize="small" />
                    </ListItemIcon>

                    <ListItemText
                        primary="Export PDF"
                        secondary={
                            BABAK_LABELS[
                            currentBabak
                            ]
                        }
                    />
                </MenuItem>

                <Divider />

                <MenuItem
                    onClick={
                        handleExportClassement
                    }
                    disabled={
                        exportingBracket
                    }
                >
                    <ListItemIcon>
                        <EmojiEventsOutlined fontSize="small" />
                    </ListItemIcon>

                    <ListItemText
                        primary="Export Classement"
                        secondary="Semua Babak"
                    />
                </MenuItem>
            </Menu>

            {/* =========================================
                EXPORT PDF DIALOG
            ========================================= */}

            <Dialog
                open={dialogOpen}
                onClose={
                    handleClosePdfDialog
                }
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>
                    Export PDF Pertandingan
                </DialogTitle>

                <DialogContent>
                    {/* =================================
                        BABAK
                    ================================= */}

                    <FormControl
                        fullWidth
                        size="small"
                        sx={{
                            mt: 1,
                            mb: 2,
                        }}
                    >
                        <InputLabel>
                            Babak
                        </InputLabel>

                        <Select
                            value={currentBabak}
                            label="Babak"
                            disabled
                        >
                            <MenuItem
                                value={
                                    currentBabak
                                }
                            >
                                {
                                    BABAK_LABELS[
                                    currentBabak
                                    ]
                                }
                            </MenuItem>
                        </Select>
                    </FormControl>

                    {/* =================================
                        STATUS
                    ================================= */}

                    <FormControl
                        fullWidth
                        size="small"
                    >
                        <InputLabel>
                            Status
                        </InputLabel>

                        <Select
                            value={status}
                            label="Status"
                            onChange={handleStatusChange}
                            renderValue={(value) =>
                                STATUS_LABELS[value as StatusFilter]
                            }
                        >
                            {STATUS_OPTIONS.map((option) => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        pb: 2,
                    }}
                >
                    <Button
                        onClick={
                            handleClosePdfDialog
                        }
                        disabled={
                            exportingPertandingan
                        }
                        sx={{
                            textTransform:
                                "none",
                        }}
                    >
                        Batal
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={
                            <PictureAsPdfOutlined />
                        }
                        onClick={
                            handleExportPdf
                        }
                        disabled={
                            exportingPertandingan
                        }
                        sx={{
                            textTransform:
                                "none",
                        }}
                    >
                        {exportingPertandingan
                            ? "Exporting..."
                            : "Export PDF"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ExportPdf;