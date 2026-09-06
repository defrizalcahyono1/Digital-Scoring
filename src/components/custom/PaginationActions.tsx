import { Box, IconButton, Typography } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

export default function PaginationActions({ count, page, rowsPerPage, onPageChange }: any) {
    const totalPages = Math.ceil(count / rowsPerPage);

    return (
        <Box display="flex" alignItems="center" gap={1}>
            <IconButton
                onClick={(e) => onPageChange(e, page - 1)}
                disabled={page === 0}
            >
                <KeyboardArrowLeft />
            </IconButton>

            <Typography fontSize={14}>{page + 1}</Typography>

            <IconButton
                onClick={(e) => onPageChange(e, page + 1)}
                disabled={page >= totalPages - 1}
            >
                <KeyboardArrowRight />
            </IconButton>
        </Box>
    );
}