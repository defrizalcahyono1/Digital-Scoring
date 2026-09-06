import * as React from "react";
import { Box, Paper, Typography } from "@mui/material";

interface TopCardProps {
  label: string;
  value: number;
}

const Ribbon = ({ children }: { children: React.ReactNode }) => (
  <Box
    component="span"
    sx={{
      position: "relative",
      backgroundColor: "#d32f2f",
      color: "white",
      fontWeight: 600,
      fontSize: 16,
      px: 1.55,
      py: 0.25,
      borderRadius: "0 4px 4px 0",
      display: "inline-block",
      wordBreak: "normal",
      overflowWrap: "break-word",
      maxWidth: "100%",
      "&::before": {
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        borderTop: "12px solid transparent",
        borderLeft: "12px solid #b71c1c",
        borderBottom: "12px solid transparent",
        zIndex: 1,
      },
    }}
  >
    {children}
  </Box>
);

const TopCard: React.FC<TopCardProps> = ({ label, value }) => (
  <Paper sx={{ p: 2, borderRadius: 1 }}>
    <Ribbon>{label}</Ribbon>
    <Typography textAlign="center" fontSize={18} mt={1} fontWeight="bold">
      {value}
    </Typography>
  </Paper>
);

export default TopCard;
