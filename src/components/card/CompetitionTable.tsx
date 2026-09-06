import * as React from "react";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import type { JuriPertandingan } from "../../types/pertandingan";
import { capitalizeWords } from "../../utils/format";

interface CompetitionTableProps {
    competitionTable: {
        no: number;
        name: string;
        juri: JuriPertandingan[];
    }[];
}

const CompetitionTable: React.FC<CompetitionTableProps> = ({
    competitionTable,
}) => {
    const { t } = useTranslation();

    return (
        <Paper
            sx={{
                p: 2,
                borderRadius: 1,
                overflowX: "auto",
            }}
        >
            <Typography
                fontSize={18}
                color="text.secondary"
                mb={1}
            >
                {t("listMatches")}
            </Typography>

            <TableContainer>
                <Table
                    size="small"
                    sx={{
                        fontSize: 18,
                        border: 1,
                        borderColor: "divider",
                        borderCollapse: "collapse",
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{
                                    fontSize: 15,
                                    width: 40,
                                    border: 1,
                                    borderColor: "divider",
                                }}
                            >
                                {t("no")}
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontSize: 15,
                                    border: 1,
                                    borderColor: "divider",
                                }}
                            >
                                {t("peserta")}
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontSize: 15,
                                    border: 1,
                                    borderColor: "divider",
                                }}
                            >
                                {t("mainJudge")}
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontSize: 15,
                                    border: 1,
                                    borderColor: "divider",
                                }}
                            >
                                {t("reserveJudge")}
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {competitionTable.map(
                            ({ no, name, juri }) => {
                                const juriUtama = juri
                                    .filter(
                                        (j) =>
                                            j.peran === "utama"
                                    )
                                    .map(
                                        (j) => j.full_name
                                    )
                                    .join(", ");

                                const juriCadangan = juri
                                    .filter(
                                        (j) =>
                                            j.peran === "cadangan"
                                    )
                                    .map(
                                        (j) => j.full_name
                                    )
                                    .join(", ");

                                return (
                                    <TableRow key={no}>
                                        <TableCell
                                            sx={{
                                                fontSize: 15,
                                                border: 1,
                                                borderColor:
                                                    "divider",
                                            }}
                                        >
                                            {no}
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontSize: 15,
                                                border: 1,
                                                borderColor:
                                                    "divider",
                                            }}
                                        >
                                            {capitalizeWords(name)}
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontSize: 15,
                                                border: 1,
                                                borderColor:
                                                    "divider",
                                            }}
                                        >
                                            {juriUtama || "-"}
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontSize: 15,
                                                border: 1,
                                                borderColor:
                                                    "divider",
                                            }}
                                        >
                                            {juriCadangan || "-"}
                                        </TableCell>
                                    </TableRow>
                                );
                            }
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default CompetitionTable;