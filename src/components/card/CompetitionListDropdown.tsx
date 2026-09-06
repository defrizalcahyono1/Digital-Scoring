import * as React from "react";
import { Paper, Select, MenuItem, Typography, SelectChangeEvent } from "@mui/material";
import { t } from "i18next";

interface CompetitionListDropdownProps {
  competitionList: string[];
  selectedCompetition: string;
  onChange: (event: SelectChangeEvent<string>) => void;
}

const CompetitionListDropdown: React.FC<CompetitionListDropdownProps> = ({
  competitionList,
  selectedCompetition,
  onChange,
}) => (
  <Paper sx={{ p: 2, borderRadius: 1 }}>
    <Typography fontSize={18} color="text.secondary" mb={1}>
      {t("listCompetition")}
    </Typography>
    <Select
      fullWidth
      size="small"
      value={selectedCompetition}
      onChange={onChange}
      sx={{ fontSize: 15 }}
    >
      {competitionList.map((comp, i) => (
        <MenuItem key={i} value={comp} sx={{ fontSize: 12 }}>
          {comp}
        </MenuItem>
      ))}
    </Select>
  </Paper>
);

export default CompetitionListDropdown;
