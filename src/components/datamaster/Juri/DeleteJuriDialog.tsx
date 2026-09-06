import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

interface DeleteJuriDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  JuriName: string;
}

export default function DeleteJuriDialog({
  open,
  onClose,
  onConfirm,
  JuriName,
}: DeleteJuriDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="success-dialog-title" sx={{ '& .MuiDialog-paper': { borderRadius: '16px', width: 360, minHeight: 300 } }}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <strong>{JuriName}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="error" onClick={onConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
