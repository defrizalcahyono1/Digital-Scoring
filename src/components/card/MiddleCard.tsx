import * as React from "react";
import { Paper, Typography } from "@mui/material";

interface MiddleCardProps {
  label: string;
  subLabel: string;
  value: number;
}

const MiddleCard: React.FC<MiddleCardProps> = ({ label, subLabel, value }) => (
  <Paper sx={{ p: 2, borderRadius: 1 }}>
    <Typography fontSize={18} color="text.secondary" mb={0.5}>
      {label}
      <br />
      <Typography component="span" fontSize={12}>
        {subLabel}
      </Typography>
    </Typography>
    <Typography fontWeight={700} fontSize={18}>
      {value}
    </Typography>
  </Paper>
);

export default MiddleCard;
