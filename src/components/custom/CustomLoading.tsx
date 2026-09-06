import React from "react";
import { Box } from "@mui/material";

type CustomLoadingProps = {
    fullScreen?: boolean;
};

const CustomLoading: React.FC<CustomLoadingProps> = ({
    fullScreen = false,
}) => {
    return (
        <Box
            sx={{
                position: fullScreen ? "fixed" : "absolute",
                inset: 0,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                backgroundColor: fullScreen
                    ? "rgb(255, 255, 255)"
                    : "rgb(255, 255, 255)",

                backdropFilter: "none",

                zIndex: 9999,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1.5,
                }}
            >
                {[0, 1, 2, 3].map((index) => (
                    <Box
                        key={index}
                        sx={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",

                            // Bola 2 warna dengan transisi halus
                            background: `
                                radial-gradient(
                                    circle at 35% 25%,
                                    rgba(255, 255, 255, 0.95) 0%,
                                    rgba(255, 255, 255, 0.45) 12%,
                                    rgba(255, 255, 255, 0) 30%
                                ),
                                linear-gradient(
                                    145deg,
                                    #6ba2fa 0%,
                                    #3876fa 42%,
                                    #ef5350 75%,
                                    #d9363e 100%
                                )
                            `,

                            animation:
                                "bounceBall 1.2s infinite ease-in-out",

                            animationDelay: `${index * 0.15}s`,

                            "@keyframes bounceBall": {
                                "0%, 60%, 100%": {
                                    transform:
                                        "translateY(0) scale(1)",
                                },

                                "30%": {
                                    transform:
                                        "translateY(-22px) scale(1.08)",
                                },
                            },
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default CustomLoading;
