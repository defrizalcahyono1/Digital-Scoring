import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface DeletePenyisihanDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  peserta1_name: string;
  peserta2_name: string;
}

export default function DeletePenyisihanDialog({
  open,
  onClose,
  onConfirm,
  peserta1_name,
  peserta2_name,
}: DeletePenyisihanDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "16px",
          width: 360,
          minHeight: 250,
        },
      }}
    >
      <DialogTitle id="delete-dialog-title">
        {t("confirmDelete")}
      </DialogTitle>

      <DialogContent>
        <Typography>
          {t("confirmDeleteMessage")}
        </Typography>

        {/* Nama peserta di bawah pesan */}
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: "8px",
            backgroundColor: "#f5f5f5",
            textAlign: "center",
          }}
        >
          <Typography fontWeight={600} fontSize={16}>
            {peserta1_name
              .toLowerCase()
              .replace(/\b\w/g, (char) => char.toUpperCase())}

            <Box
              component="span"
              sx={{
                mx: 1,
                color: "error.main",
                fontWeight: 700,
              }}
            >
              vs
            </Box>

            {peserta2_name
              ? peserta2_name
                .toLowerCase()
                .replace(/\b\w/g, (char) => char.toUpperCase())
              : t("bye")}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          {t("cancel")}
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
        >
          {t("delete")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
