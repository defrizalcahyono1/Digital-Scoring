import * as React from "react";
import { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContentText,
  Button,
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LanguageIcon from "@mui/icons-material/Language";

import { useNavigate } from "react-router-dom";

import { useStore } from "../../hooks/useStore";
import { useAuth } from "../../hooks/useAuth";
import { useSessionManager } from "../../hooks/useSessionManager";
import { useTranslation } from "react-i18next";

import ReactCountryFlag from "react-country-flag";

import { useProfile } from "../../hooks/useProfile";
import { useProfileStore } from "../../stores/ProfileStore";


const BACKEND_URL = "http://localhost:5000";


const getPhotoUrl = (photo: string | null) => {
  if (!photo) {
    return undefined;
  }

  return `${BACKEND_URL}/uploads/userphoto/${photo}`;
};


const UserMenu: React.FC = () => {

  useAuth();
  useSessionManager();

  const navigate = useNavigate();

  const { user, clearUser } = useStore();

  const { t, i18n } = useTranslation();

  const {
    loadProfile,
  } = useProfile();

  const {
    profile,
  } = useProfileStore();


  const [
    anchorEl,
    setAnchorEl
  ] = useState<null | HTMLElement>(null);


  const [
    langAnchorEl,
    setLangAnchorEl
  ] = useState<null | HTMLElement>(null);


  const [
    openDialog,
    setOpenDialog
  ] = useState(false);


  const menuOpen =
    Boolean(anchorEl);

  useEffect(() => {

    if (!user?.id) {
      return;
    }

    loadProfile().catch(() => { });

  }, [user?.id]);

  const isSameUser =
    profile?.id === user?.id;

  const displayName =
    isSameUser && profile?.full_name
      ? profile.full_name
      : user?.full_name || "Unknown User";


  const displayRole =
    isSameUser && profile?.role
      ? profile.role
      : user?.role || "Unknown Role";


  const photoUrl =
    isSameUser && profile?.photo
      ? getPhotoUrl(profile.photo)
      : undefined;

  const capitalizeWords = (str: string) =>
    str.replace(
      /\b\w/g,
      (char) => char.toUpperCase()
    );

  const handleAccount = () => {

    setAnchorEl(null);
    setLangAnchorEl(null);

    navigate("/profile");

  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    clearUser();

    setOpenDialog(false);

    navigate("/login");
  };

  return (
    <>
      {/* USER BUTTON */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
        }}
        onClick={(e) =>
          setAnchorEl(e.currentTarget)
        }
      >

        <Avatar
          alt={displayName}
          src={photoUrl}
          sx={{
            width: 45,
            height: 45,
          }}
        >
          {!photoUrl &&
            displayName.charAt(0).toUpperCase()}
        </Avatar>


        <Box>

          <Typography
            fontWeight={600}
            fontSize={16}
          >
            {capitalizeWords(
              displayName
            )}
          </Typography>


          <Typography
            fontSize={12}
            color="gray"
          >
            {capitalizeWords(
              displayRole
            )}
          </Typography>

        </Box>

      </Box>


      {/* MAIN MENU */}

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={() => {
          setAnchorEl(null);
          setLangAnchorEl(null);
        }}
      >

        {/* ACCOUNT */}

        <MenuItem
          onClick={handleAccount}
        >

          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>

          {t("account")}

        </MenuItem>


        {/* LANGUAGE */}

        <MenuItem
          onClick={(e) =>
            setLangAnchorEl(
              e.currentTarget
            )
          }
        >

          <ListItemIcon>
            <LanguageIcon />
          </ListItemIcon>

          Language

        </MenuItem>


        {/* LOGOUT */}

        <MenuItem
          onClick={() => {

            setAnchorEl(null);

            setOpenDialog(true);

          }}
        >

          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>

          {t("logout")}

        </MenuItem>

      </Menu>


      {/* LANGUAGE SUBMENU */}

      <Menu
        anchorEl={langAnchorEl}
        open={Boolean(langAnchorEl)}
        onClose={() =>
          setLangAnchorEl(null)
        }
        anchorOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        transformOrigin={{
          horizontal: "left",
          vertical: "top",
        }}
      >

        <MenuItem
          selected={
            i18n.language === "en"
          }
          onClick={() => {

            i18n.changeLanguage("en");

            setLangAnchorEl(null);
            setAnchorEl(null);

          }}
        >

          <ListItemIcon>

            <ReactCountryFlag
              countryCode="US"
              svg
              style={{
                width: 20,
              }}
            />

          </ListItemIcon>

          English

        </MenuItem>


        <MenuItem
          selected={
            i18n.language === "id"
          }
          onClick={() => {

            i18n.changeLanguage("id");

            setLangAnchorEl(null);
            setAnchorEl(null);

          }}
        >

          <ListItemIcon>

            <ReactCountryFlag
              countryCode="ID"
              svg
              style={{
                width: 20,
              }}
            />

          </ListItemIcon>

          Indonesia

        </MenuItem>

      </Menu>


      {/* LOGOUT DIALOG */}

      <Dialog
        open={openDialog}
        onClose={() =>
          setOpenDialog(false)
        }
      >

        <DialogTitle>
          {t("confirmLogout")}
        </DialogTitle>


        <DialogContentText
          sx={{
            px: 3,
          }}
        >
          {t("confirmQuestion")}
        </DialogContentText>


        <Box
          display="flex"
          justifyContent="flex-end"
          gap={1}
          p={2}
        >

          <Button
            onClick={() =>
              setOpenDialog(false)
            }
          >
            {t("cancel")}
          </Button>


          <Button
            onClick={handleLogout}
            color="error"
          >
            {t("logout")}
          </Button>

        </Box>

      </Dialog>
    </>
  );
};


export default UserMenu;