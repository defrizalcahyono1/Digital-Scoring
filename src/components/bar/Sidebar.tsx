import { useEffect, useMemo, useState } from "react";
import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Divider,
    Collapse,
} from "@mui/material";

import {
    Dashboard,
    Group,
    ExpandLess,
    ExpandMore,
    Calculate,
    Person,
    Groups,
    Gavel,
    EmojiEvents,
    SportsScore,
    MilitaryTech,
    ManageAccounts,
    Scoreboard,
} from "@mui/icons-material";

import directiveLogo from "../../assets/direc.png";
import Logo from "../../assets/logo.png";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import { useStore } from "../../hooks/useStore";

import * as React from "react";
import { SvgIconProps } from "@mui/material";

import { useTranslation } from "react-i18next";

const drawerWidthOpen = 260;
const drawerWidthClose = 70;

type UserRole = "admin" | "juri" | "panitia" | "developer";

type MenuItemType = {
    text: string;
    icon?: React.ReactElement<SvgIconProps>;
    path?: string;
    children?: MenuItemType[];
    roles?: UserRole[];
};

const Sidebar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        sidebarOpen,
        toggleSidebar,
        setPageTitle,
        user,
    } = useStore();

    const { t } = useTranslation();

    const [openMenus, setOpenMenus] = useState<
        Record<string, boolean>
    >({});

    const userRole = (
        user?.role?.toLowerCase() || ""
    ) as UserRole;

    const menuItems: MenuItemType[] = useMemo(
        () => [
            {
                text: "dashboard",
                icon: <Dashboard />,
                path: "/dashboard",
                roles: [
                    "admin",
                    "juri",
                    "panitia",
                    "developer",
                ],
            },
            {
                text: "dataMaster",
                icon: <Group />,
                roles: [
                    "admin",
                    "developer",
                ],
                children: [
                    {
                        text: "userManagement",
                        icon: <ManageAccounts />,
                        path: "/datamaster/usermanagement",
                        roles: [
                            "admin",
                            "developer",
                        ],
                    },
                    {
                        text: "pic",
                        icon: <Person />,
                        path: "/datamaster/pic",
                        roles: [
                            "admin",
                            "developer",
                        ],
                    },
                    {
                        text: "peserta",
                        icon: <Groups />,
                        path: "/datamaster/peserta",
                        roles: [
                            "admin",
                            "developer",
                        ],
                    },
                    {
                        text: "juri",
                        icon: <Gavel />,
                        path: "/datamaster/juri",
                        roles: [
                            "admin",
                            "developer",
                        ],
                    },
                ],
            },
            {
                text: "turnamen",
                icon: <EmojiEvents />,
                roles: [
                    "admin",
                    "juri",
                    "developer",
                ],
                children: [
                    {
                        text: "penyisihan",
                        icon: <SportsScore />,
                        path: "/pertandingan/penyisihan",
                        roles: [
                            "admin",
                            "juri",
                            "developer",
                        ],
                    },
                    {
                        text: "enambelasBesar",
                        icon: <EmojiEvents />,
                        path: "/pertandingan/16-besar",
                        roles: [
                            "admin",
                            "juri",
                            "developer",
                        ],
                    },
                    {
                        text: "perempat",
                        icon: <MilitaryTech />,
                        path: "/pertandingan/perempat-final",
                        roles: [
                            "admin",
                            "juri",
                            "developer",
                        ],
                    },
                    {
                        text: "semiFinal",
                        icon: <MilitaryTech />,
                        path: "/pertandingan/semi-final",
                        roles: [
                            "admin",
                            "juri",
                            "developer",
                        ],
                    },
                    {
                        text: "final",
                        icon: <EmojiEvents />,
                        path: "/pertandingan/final",
                        roles: [
                            "admin",
                            "juri",
                            "developer",
                        ],
                    },
                ],
            },
            {
                text: "hitungTurnamen",
                icon: <Calculate />,
                path: "/hitungTurnamen",
                roles: [
                    "admin",
                    "juri",
                    "developer",
                ],
            },
            {
                text: "skor",
                icon: <Scoreboard />,
                roles: [
                    "admin",
                    "juri",
                    "panitia",
                    "developer",
                ],
                children: [
                    {
                        text: "penyisihan",
                        icon: <SportsScore />,
                        path: "/skor/penyisihan",
                        roles: [
                            "admin",
                            "juri",
                            "panitia",
                            "developer",
                        ],
                    },
                    {
                        text: "enambelasBesar",
                        icon: <EmojiEvents />,
                        path: "/skor/enambelasbesar",
                        roles: [
                            "admin",
                            "juri",
                            "panitia",
                            "developer",
                        ],
                    },
                    {
                        text: "perempat",
                        icon: <MilitaryTech />,
                        path: "/skor/perempat-final",
                        roles: [
                            "admin",
                            "juri",
                            "panitia",
                            "developer",
                        ],
                    },
                    {
                        text: "semiFinal",
                        icon: <MilitaryTech />,
                        path: "/skor/semi-final",
                        roles: [
                            "admin",
                            "juri",
                            "panitia",
                            "developer",
                        ],
                    },
                    {
                        text: "final",
                        icon: <EmojiEvents />,
                        path: "/skor/final",
                        roles: [
                            "admin",
                            "juri",
                            "panitia",
                            "developer",
                        ],
                    },
                ],
            },
        ],
        []
    );

    const filteredMenuItems = useMemo(() => {
        const filterItems = (
            items: MenuItemType[]
        ): MenuItemType[] => {
            return items
                .filter(item => {
                    if (!item.roles) {
                        return true;
                    }

                    return item.roles.includes(userRole);
                })
                .map(item => {
                    if (!item.children) {
                        return item;
                    }

                    const filteredChildren = filterItems(
                        item.children
                    );

                    if (filteredChildren.length === 0) {
                        return null;
                    }

                    return {
                        ...item,
                        children: filteredChildren,
                    };
                })
                .filter(
                    (item): item is MenuItemType =>
                        item !== null
                );
        };

        return filterItems(menuItems);
    }, [menuItems, userRole]);

    const handleMenuItemClick = (
        path: string,
        text: string
    ) => {
        setPageTitle(t(text));
        navigate(path);
    };

    const handleToggleMenu = (
        menuText: string
    ) => {
        setOpenMenus(prev => ({
            ...prev,
            [menuText]: !prev[menuText],
        }));
    };

    useEffect(() => {
        filteredMenuItems.forEach(menu => {
            if (menu.children) {
                const hasActiveChild =
                    menu.children.some(
                        child =>
                            child.path &&
                            location.pathname.startsWith(
                                child.path
                            )
                    );

                if (hasActiveChild) {
                    setOpenMenus(prev => ({
                        ...prev,
                        [menu.text]: true,
                    }));
                }
            }
        });
    }, [
        location.pathname,
        filteredMenuItems,
    ]);

    const renderMenuItems = (
        items: MenuItemType[],
        level = 0
    ): React.ReactNode =>
        items.map((item, index) => {
            const isActive =
                !!item.path &&
                location.pathname.startsWith(
                    item.path
                );

            const hasChildren =
                !!item.children?.length;

            const hasActiveChild =
                hasChildren &&
                item.children!.some(
                    child =>
                        child.path &&
                        location.pathname.startsWith(
                            child.path
                        )
                );

            const isOpen =
                openMenus[item.text] || false;

            return (
                <React.Fragment
                    key={`${item.text}-${index}`}
                >
                    <ListItemButton
                        selected={
                            isActive ||
                            hasActiveChild
                        }
                        onClick={() =>
                            hasChildren
                                ? handleToggleMenu(
                                    item.text
                                )
                                : item.path &&
                                handleMenuItemClick(
                                    item.path,
                                    item.text
                                )
                        }
                        sx={{
                            pl:
                                2 +
                                level * 2,
                            py:
                                sidebarOpen
                                    ? 2
                                    : 2.5,
                            justifyContent:
                                sidebarOpen
                                    ? "flex-start"
                                    : "center",
                            transition:
                                "background-color 0.2s ease, color 0.2s ease",
                            ...(level === 0 && {
                                "&.Mui-selected": {
                                    backgroundColor:
                                        "#3876fa",
                                    color:
                                        "#ffffff",
                                    "&:hover": {
                                        backgroundColor:
                                            "#3876fa",
                                    },
                                    "& .MuiListItemIcon-root":
                                        {
                                            color:
                                                "#ffffff",
                                        },
                                },
                            }),
                            ...(level > 0 && {
                                "&.Mui-selected": {
                                    backgroundColor:
                                        "#6ba2fa",
                                    color:
                                        "#ffffff",
                                    "&:hover": {
                                        backgroundColor:
                                            "#6ba2fa",
                                    },
                                    "& .MuiListItemIcon-root":
                                        {
                                            color:
                                                "#ffffff",
                                        },
                                },
                            }),
                        }}
                    >
                        {item.icon && (
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr:
                                        sidebarOpen
                                            ? 2
                                            : "auto",
                                    justifyContent:
                                        "center",
                                    width:
                                        sidebarOpen
                                            ? "auto"
                                            : "100%",
                                    color:
                                        level === 0
                                            ? "inherit"
                                            : "text.secondary",
                                }}
                            >
                                {React.cloneElement(
                                    item.icon,
                                    {
                                        fontSize:
                                            level === 0
                                                ? "medium"
                                                : "small",
                                    }
                                )}
                            </ListItemIcon>
                        )}

                        {sidebarOpen && (
                            <ListItemText
                                primary={t(
                                    item.text
                                )}
                            />
                        )}

                        {hasChildren &&
                            sidebarOpen &&
                            (isOpen ? (
                                <ExpandLess />
                            ) : (
                                <ExpandMore />
                            ))}
                    </ListItemButton>

                    {hasChildren && (
                        <Collapse
                            in={isOpen}
                            timeout={0}
                            unmountOnExit
                        >
                            <List
                                component="div"
                                disablePadding
                            >
                                {renderMenuItems(
                                    item.children!,
                                    level + 1
                                )}
                            </List>
                        </Collapse>
                    )}
                </React.Fragment>
            );
        });

    return (
        <Drawer
            variant="permanent"
            sx={{
                width:
                    sidebarOpen
                        ? drawerWidthOpen
                        : drawerWidthClose,
                flexShrink: 0,
                whiteSpace: "nowrap",
                boxSizing: "border-box",
                "& .MuiDrawer-paper": {
                    width:
                        sidebarOpen
                            ? drawerWidthOpen
                            : drawerWidthClose,
                    transition:
                        "width 0.3s",
                    overflowX:
                        "hidden",
                    backgroundColor:
                        "#f4f4f4",
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent:
                        "center",
                    alignItems:
                        "center",
                    height: 60,
                    cursor:
                        "pointer",
                    p: 2,
                }}
                onClick={
                    toggleSidebar
                }
            >
                <img
                    src={
                        sidebarOpen
                            ? directiveLogo
                            : Logo
                    }
                    alt="Logo"
                    style={{
                        width:
                            sidebarOpen
                                ? 120
                                : 40,
                        transition:
                            "width 0.3s",
                    }}
                />
            </Box>

            <Divider />

            <List>
                {renderMenuItems(
                    filteredMenuItems
                )}
            </List>
        </Drawer>
    );
};

export default Sidebar;
