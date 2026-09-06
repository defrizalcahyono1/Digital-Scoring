import { Box, Typography, Divider, Card, CardContent, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../hooks/useStore";
import Sidebar from "../bar/Sidebar";
import UserMenu from "../header/UserMenu";
import { useEffect, useState } from "react";
import CustomLoading from "../custom/CustomLoading";

const ControllerEmpty = () => {
    const navigate = useNavigate();
    const { sidebarOpen, pageTitle, setPageTitle } = useStore();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);

    const drawerWidth = sidebarOpen ? 260 : 30;

    useEffect(() => {
        setPageTitle(t("hitungTurnamen"));

        const timer = setTimeout(() => {
            setLoading(false);
        }, 4000);

        return () => clearTimeout(timer);
    }, [setPageTitle, t]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                minHeight: "100vh",
                width: "100vw",
                overflowX: "hidden",
            }}
        >
            {loading && <CustomLoading />}
            <Box
                sx={{
                    width: drawerWidth,
                    transition: "width 0.3s",
                    position: "fixed",
                }}
            >
                <Sidebar />
            </Box>

            <Box
                flexGrow={1}
                ml={`${drawerWidth}px`}
                padding={3}
                fontFamily="Roboto, sans-serif"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    background:
                        "linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)",
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                >
                    <Typography
                        variant="h2"
                        fontWeight={600}
                        fontSize={26}
                    >
                        {t(pageTitle)}
                    </Typography>

                    <UserMenu />
                </Box>

                <Divider />

                <Card sx={{ mt: 5, flexGrow: 1, display: "flex", }}>
                    <CardContent
                        sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", }}
                    >
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            py={8}
                            gap={2}
                        >
                            <Typography
                                variant="h6"
                                color="text.secondary"
                            >
                                {t("noMatchSelected")}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                textAlign="center"
                            >
                                {t("goToMatchDataDescription")}
                            </Typography>

                            <Button
                                variant="contained"
                                onClick={() =>
                                    navigate(
                                        "/pertandingan/penyisihan"
                                    )
                                }
                            >
                                {t("goToMatchData")}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default ControllerEmpty;