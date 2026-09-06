import * as React from "react";
import { useState } from "react";

import {
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    Tooltip,
} from "@mui/material";

import LanguageIcon from "@mui/icons-material/Language";

import ReactCountryFlag from "react-country-flag";

import { useTranslation } from "react-i18next";

const LanguageMenu: React.FC = () => {
    const { i18n } = useTranslation();

    const [anchorEl, setAnchorEl] =
        useState<null | HTMLElement>(null);

    const menuOpen = Boolean(anchorEl);

    const handleOpen = (
        event: React.MouseEvent<HTMLElement>
    ) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const changeLanguage = (
        language: "en" | "id"
    ) => {
        i18n.changeLanguage(language);
        handleClose();
    };

    return (
        <>
            {/* LANGUAGE BUTTON */}
            <Tooltip title="Language">
                <IconButton
                    onClick={handleOpen}
                    sx={{
                        color: "#fff",
                    }}
                >
                    <LanguageIcon />
                </IconButton>
            </Tooltip>

            {/* LANGUAGE MENU */}
            <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                {/* ENGLISH */}
                <MenuItem
                    selected={
                        i18n.language === "en"
                    }
                    onClick={() =>
                        changeLanguage("en")
                    }
                >
                    <ListItemIcon>
                        <ReactCountryFlag
                            countryCode="US"
                            svg
                            style={{
                                width: 20,
                                height: 20,
                            }}
                        />
                    </ListItemIcon>

                    English
                </MenuItem>

                {/* INDONESIA */}
                <MenuItem
                    selected={
                        i18n.language === "id"
                    }
                    onClick={() =>
                        changeLanguage("id")
                    }
                >
                    <ListItemIcon>
                        <ReactCountryFlag
                            countryCode="ID"
                            svg
                            style={{
                                width: 20,
                                height: 20,
                            }}
                        />
                    </ListItemIcon>

                    Indonesia
                </MenuItem>
            </Menu>
        </>
    );
};

export default LanguageMenu;