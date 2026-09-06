import * as React from "react";
import { Paper, Typography } from "@mui/material";
import { t } from "i18next";

interface TotalCompetitionAprilProps {
  totalCompetitionApril: number;
}

const TotalCompetitionApril: React.FC<TotalCompetitionAprilProps> = ({
  totalCompetitionApril,
}) => (
  <Paper sx={{ p: 2, borderRadius: 1 }}>
    <Typography fontSize={18} color="text.secondary" mb={0.5}>
      {t("totalMatches")}
    </Typography>
    <Typography fontWeight={700} fontSize={18}>
      {totalCompetitionApril}
    </Typography>
  </Paper>
);

export default TotalCompetitionApril;
