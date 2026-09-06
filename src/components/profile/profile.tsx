import { useEffect, useRef, useState } from "react";

import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Slider,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";

import {
    AccountCircle,
    Badge,
    Close,
    Email,
    Edit,
    Fullscreen,
    FullscreenExit,
    Person,
    PhotoCamera,
    Save,
    ZoomIn,
} from "@mui/icons-material";

import Cropper from "react-easy-crop";

import Sidebar from "../bar/Sidebar";
import UserMenu from "../header/UserMenu";

import { useStore } from "../../hooks/useStore";
import { useProfile } from "../../hooks/useProfile";
import { useTranslation } from "react-i18next";
import CustomLoading from "../custom/CustomLoading";

const BACKEND_URL = "http://localhost:5000";

const getPhotoUrl = (
    photo: string | null
) => {
    if (!photo) {
        return undefined;
    }

    return `${BACKEND_URL}/uploads/userphoto/${photo}`;
};

const capitalizeWords = (
    value: string
) => {
    return value.replace(
        /\b\w/g,
        (char) => char.toUpperCase()
    );
};

const createCroppedImage = (
    imageSrc: string,
    pixelCrop: {
        x: number;
        y: number;
        width: number;
        height: number;
    }
): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const image = new Image();

        image.onload = () => {
            const canvas = document.createElement(
                "canvas"
            );

            canvas.width = pixelCrop.width;
            canvas.height = pixelCrop.height;

            const ctx = canvas.getContext("2d");

            if (!ctx) {
                reject(
                    new Error(
                        "Canvas tidak tersedia."
                    )
                );

                return;
            }

            ctx.drawImage(
                image,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                pixelCrop.width,
                pixelCrop.height
            );

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(
                            new Error(
                                "Gagal membuat gambar hasil crop."
                            )
                        );
                    }
                },
                "image/jpeg",
                0.92
            );
        };

        image.onerror = () => {
            reject(
                new Error(
                    "Gagal memuat gambar."
                )
            );
        };

        image.src = imageSrc;
    });
};

const Profile = () => {
    const {
        sidebarOpen,
        pageTitle,
        setPageTitle,
    } = useStore();

    const {
        profile,
        loading,
        updating,
        error,
        loadProfile,
        saveProfile,
    } = useProfile();

    const { t } = useTranslation();

    const drawerWidth =
        sidebarOpen ? 260 : 70;

    const [
        isFullscreen,
        setIsFullscreen
    ] = useState(false);

    const [
        isEditing,
        setIsEditing
    ] = useState(false);

    const [
        fullName,
        setFullName
    ] = useState("");

    const [
        username,
        setUsername
    ] = useState("");

    const [
        email,
        setEmail
    ] = useState("");

    const [
        photoFile,
        setPhotoFile
    ] = useState<File | null>(null);

    const [
        photoPreview,
        setPhotoPreview
    ] = useState<string | null>(null);

    const [
        formError,
        setFormError
    ] = useState("");

    const [
        cropOpen,
        setCropOpen
    ] = useState(false);

    const [
        crop,
        setCrop
    ] = useState({
        x: 0,
        y: 0,
    });

    const [
        zoom,
        setZoom
    ] = useState(1);

    const [
        croppedAreaPixels,
        setCroppedAreaPixels
    ] = useState<{
        x: number;
        y: number;
        width: number;
        height: number;
    } | null>(null);

    const [
        cropImage,
        setCropImage
    ] = useState<string | null>(null);

    const fileInputRef =
        useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        loadProfile().catch(() => {});

        setPageTitle(
            t("profile")
        );
    }, [t]);

    useEffect(() => {
        document.title =
            `Turnament Pencak Silat${
                pageTitle
                    ? " | " + pageTitle
                    : ""
            }`;
    }, [pageTitle]);

    useEffect(() => {
        if (!profile) {
            return;
        }

        setFullName(
            profile.full_name
        );

        setUsername(
            profile.username
        );

        setEmail(
            profile.email
        );

        setPhotoPreview(
            getPhotoUrl(
                profile.photo
            ) || null
        );
    }, [profile]);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    useEffect(() => {
        const handleChange = () => {
            setIsFullscreen(
                !!document.fullscreenElement
            );
        };

        document.addEventListener(
            "fullscreenchange",
            handleChange
        );

        return () => {
            document.removeEventListener(
                "fullscreenchange",
                handleChange
            );
        };
    }, []);

    const handleEdit = () => {
        if (!profile) {
            return;
        }

        setFullName(
            profile.full_name
        );

        setUsername(
            profile.username
        );

        setEmail(
            profile.email
        );

        setPhotoFile(null);

        setPhotoPreview(
            getPhotoUrl(
                profile.photo
            ) || null
        );

        setFormError("");

        setIsEditing(true);
    };

    const handleCancel = () => {
        if (!profile) {
            return;
        }

        setFullName(
            profile.full_name
        );

        setUsername(
            profile.username
        );

        setEmail(
            profile.email
        );

        setPhotoFile(null);

        setPhotoPreview(
            getPhotoUrl(
                profile.photo
            ) || null
        );

        setFormError("");

        setIsEditing(false);

        if (cropImage) {
            URL.revokeObjectURL(cropImage);
        }

        setCropImage(null);
        setCropOpen(false);
        setZoom(1);
        setCrop({
            x: 0,
            y: 0,
        });
        setCroppedAreaPixels(null);
    };

    const handlePhotoChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        const allowedTypes = [
            "image/png",
            "image/jpeg",
        ];

        if (!allowedTypes.includes(file.type)) {
            setFormError(
                "Foto harus berformat PNG, JPG, atau JPEG."
            );

            event.target.value = "";

            return;
        }

        const maxSize =
            5 * 1024 * 1024;

        if (file.size > maxSize) {
            setFormError(
                "Ukuran foto maksimal 5 MB."
            );

            event.target.value = "";

            return;
        }

        setFormError("");

        const previewUrl =
            URL.createObjectURL(file);

        setCropImage(previewUrl);

        setCrop({
            x: 0,
            y: 0,
        });

        setZoom(1);

        setCroppedAreaPixels(null);

        setCropOpen(true);

        event.target.value = "";
    };

    const handleCropComplete = (
        _croppedArea: any,
        croppedAreaPixels: {
            x: number;
            y: number;
            width: number;
            height: number;
        }
    ) => {
        setCroppedAreaPixels(
            croppedAreaPixels
        );
    };

    const handleCropConfirm = async () => {
        if (
            !cropImage ||
            !croppedAreaPixels
        ) {
            return;
        }

        try {
            const croppedBlob =
                await createCroppedImage(
                    cropImage,
                    croppedAreaPixels
                );

            const croppedFile =
                new File(
                    [croppedBlob],
                    "profile.jpg",
                    {
                        type: "image/jpeg",
                    }
                );

            const croppedPreview =
                URL.createObjectURL(
                    croppedBlob
                );

            setPhotoFile(
                croppedFile
            );

            setPhotoPreview(
                croppedPreview
            );

            URL.revokeObjectURL(
                cropImage
            );

            setCropImage(null);
            setCropOpen(false);

            setZoom(1);

            setCrop({
                x: 0,
                y: 0,
            });

            setCroppedAreaPixels(null);
        } catch (error) {
            console.error(error);

            setFormError(
                "Gagal memproses foto."
            );
        }
    };

    const handleCropCancel = () => {
        if (cropImage) {
            URL.revokeObjectURL(
                cropImage
            );
        }

        setCropImage(null);

        setCropOpen(false);

        setZoom(1);

        setCrop({
            x: 0,
            y: 0,
        });

        setCroppedAreaPixels(null);
    };

    const handleSave = async () => {
        setFormError("");

        if (!fullName.trim()) {
            setFormError(
                "Nama lengkap wajib diisi."
            );

            return;
        }

        if (!username.trim()) {
            setFormError(
                "Username wajib diisi."
            );

            return;
        }

        if (!email.trim()) {
            setFormError(
                "Email wajib diisi."
            );

            return;
        }

        try {
            await saveProfile({
                full_name:
                    fullName.trim(),

                username:
                    username.trim(),

                email:
                    email.trim(),

                photo:
                    photoFile,
            });

            setIsEditing(false);

            setPhotoFile(null);
        } catch (error: any) {
            console.error(error);

            setFormError(
                error?.response?.data?.message ||
                "Gagal memperbarui profile."
            );
        }
    };

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
                    transition:
                        "width 0.3s",
                    position: "fixed",
                    height: "100vh",
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
                    transition:
                        "margin-left 0.3s",
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
                        {pageTitle}
                    </Typography>

                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                    >
                        <Tooltip
                            title={t("fullscreen")}
                        >
                            <IconButton
                                size="medium"
                                aria-label="Toggle fullscreen view"
                                onClick={
                                    toggleFullscreen
                                }
                            >
                                {isFullscreen ? (
                                    <FullscreenExit
                                        fontSize="medium"
                                    />
                                ) : (
                                    <Fullscreen
                                        fontSize="medium"
                                    />
                                )}
                            </IconButton>
                        </Tooltip>

                        <UserMenu />
                    </Box>
                </Box>

                <Divider />

                <Box
                    sx={{
                        mt: 10,
                        maxWidth: 1500,
                        mx: "auto",
                    }}
                >
                    <Card
                        elevation={0}
                        sx={{
                            border:
                                "1px solid",
                            borderColor:
                                "divider",
                            borderRadius: 3,
                        }}
                    >
                        <CardContent
                            sx={{
                                p: {
                                    xs: 2,
                                    sm: 3,
                                    md: 4,
                                },
                            }}
                        >
                            <Stack
                                direction={{
                                    xs: "column",
                                    sm: "row",
                                }}
                                alignItems={{
                                    xs: "center",
                                    sm: "flex-start",
                                }}
                                spacing={3}
                            >
                                <Box
                                    sx={{
                                        position:
                                            "relative",
                                    }}
                                >
                                    <Avatar
                                        src={
                                            photoPreview ||
                                            getPhotoUrl(
                                                profile?.photo ||
                                                null
                                            )
                                        }
                                        alt={
                                            profile?.full_name ||
                                            "Profile"
                                        }
                                        sx={{
                                            width: 200,
                                            height: 200,
                                            fontSize: 48,
                                        }}
                                    >
                                        {!photoPreview &&
                                            !profile?.photo && (
                                                <Person
                                                    sx={{
                                                        fontSize: 64,
                                                    }}
                                                />
                                            )}
                                    </Avatar>

                                    {isEditing && (
                                        <>
                                            <IconButton
                                                onClick={() =>
                                                    fileInputRef
                                                        .current
                                                        ?.click()
                                                }
                                                sx={{
                                                    position:
                                                        "absolute",
                                                    right: -5,
                                                    bottom: -5,
                                                    backgroundColor:
                                                        "primary.main",
                                                    color:
                                                        "white",
                                                    "&:hover":
                                                        {
                                                            backgroundColor:
                                                                "primary.dark",
                                                        },
                                                }}
                                            >
                                                <PhotoCamera />
                                            </IconButton>

                                            <input
                                                ref={
                                                    fileInputRef
                                                }
                                                type="file"
                                                hidden
                                                accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                                                onChange={
                                                    handlePhotoChange
                                                }
                                            />
                                        </>
                                    )}
                                </Box>

                                <Box
                                    flex={1}
                                    textAlign={{
                                        xs: "center",
                                        sm: "left",
                                    }}
                                >
                                    <Typography
                                        variant="h5"
                                        fontWeight={700}
                                    >
                                        {
                                            profile?.full_name ||
                                            "Unknown User"
                                        }
                                    </Typography>

                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                        sx={{
                                            mt: 0.5,
                                        }}
                                    >
                                        @
                                        {
                                            profile?.username ||
                                            "username"
                                        }
                                    </Typography>

                                    <Box
                                        sx={{
                                            display:
                                                "inline-flex",
                                            alignItems:
                                                "center",
                                            gap: 0.7,
                                            mt: 1.5,
                                            px: 1.5,
                                            py: 0.6,
                                            borderRadius: 2,
                                            backgroundColor:
                                                "action.hover",
                                        }}
                                    >
                                        <Badge
                                            fontSize="small"
                                            color="action"
                                        />

                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                        >
                                            {capitalizeWords(
                                                profile?.role ||
                                                "unknown"
                                            )}
                                        </Typography>
                                    </Box>
                                </Box>

                                {!isEditing && (
                                    <Button
                                        variant="contained"
                                        startIcon={
                                            <Edit />
                                        }
                                        onClick={
                                            handleEdit
                                        }
                                    >
                                        Edit Profile
                                    </Button>
                                )}
                            </Stack>

                            <Divider
                                sx={{
                                    my: 4,
                                }}
                            />

                            <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{
                                    mb: 2.5,
                                }}
                            >
                                Informasi Profile
                            </Typography>

                            <Stack
                                spacing={2.5}
                            >
                                <TextField
                                    fullWidth
                                    label="Nama Lengkap"
                                    value={
                                        fullName
                                    }
                                    disabled={
                                        !isEditing
                                    }
                                    onChange={(e) =>
                                        setFullName(
                                            e.target.value
                                        )
                                    }
                                    InputProps={{
                                        startAdornment:
                                            (
                                                <Person
                                                    sx={{
                                                        mr: 1,
                                                        color:
                                                            "text.secondary",
                                                    }}
                                                />
                                            ),
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Username"
                                    value={
                                        username
                                    }
                                    disabled={
                                        !isEditing
                                    }
                                    onChange={(e) =>
                                        setUsername(
                                            e.target.value
                                        )
                                    }
                                    InputProps={{
                                        startAdornment:
                                            (
                                                <AccountCircle
                                                    sx={{
                                                        mr: 1,
                                                        color:
                                                            "text.secondary",
                                                    }}
                                                />
                                            ),
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    value={
                                        email
                                    }
                                    disabled={
                                        !isEditing
                                    }
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    InputProps={{
                                        startAdornment:
                                            (
                                                <Email
                                                    sx={{
                                                        mr: 1,
                                                        color:
                                                            "text.secondary",
                                                    }}
                                                />
                                            ),
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Role"
                                    value={
                                        capitalizeWords(
                                            profile?.role ||
                                            "Unknown"
                                        )
                                    }
                                    disabled
                                    InputProps={{
                                        startAdornment:
                                            (
                                                <Badge
                                                    sx={{
                                                        mr: 1,
                                                        color:
                                                            "text.secondary",
                                                    }}
                                                />
                                            ),
                                    }}
                                />
                            </Stack>

                            {(formError ||
                                error) && (
                                <Typography
                                    color="error"
                                    variant="body2"
                                    sx={{
                                        mt: 2,
                                    }}
                                >
                                    {
                                        formError ||
                                        error
                                    }
                                </Typography>
                            )}

                            {isEditing && (
                                <Stack
                                    direction={{
                                        xs: "column-reverse",
                                        sm: "row",
                                    }}
                                    spacing={1.5}
                                    justifyContent="flex-end"
                                    sx={{
                                        mt: 3,
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        startIcon={
                                            <Close />
                                        }
                                        onClick={
                                            handleCancel
                                        }
                                        disabled={
                                            updating
                                        }
                                    >
                                        Batal
                                    </Button>

                                    <Button
                                        variant="contained"
                                        startIcon={
                                            updating ? (
                                                <CircularProgress
                                                    size={18}
                                                    color="inherit"
                                                />
                                            ) : (
                                                <Save />
                                            )
                                        }
                                        onClick={
                                            handleSave
                                        }
                                        disabled={
                                            updating
                                        }
                                    >
                                        {updating
                                            ? "Menyimpan..."
                                            : "Simpan Perubahan"}
                                    </Button>
                                </Stack>
                            )}
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            <Dialog
                open={cropOpen}
                onClose={
                    handleCropCancel
                }
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Sesuaikan Foto Profile
                </DialogTitle>

                <DialogContent>
                    <Box
                        sx={{
                            position:
                                "relative",
                            width: "100%",
                            height: {
                                xs: 320,
                                sm: 400,
                            },
                            backgroundColor:
                                "#111",
                            overflow:
                                "hidden",
                            borderRadius: 2,
                        }}
                    >
                        {cropImage && (
                            <Cropper
                                image={
                                    cropImage
                                }
                                crop={
                                    crop
                                }
                                zoom={
                                    zoom
                                }
                                aspect={1}
                                cropShape="round"
                                showGrid={
                                    false
                                }
                                onCropChange={
                                    setCrop
                                }
                                onZoomChange={
                                    setZoom
                                }
                                onCropComplete={
                                    handleCropComplete
                                }
                            />
                        )}
                    </Box>

                    <Box
                        sx={{
                            mt: 3,
                            px: 2,
                        }}
                    >
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                        >
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Zoom
                            </Typography>

                            <ZoomIn
                                fontSize="small"
                                color="action"
                            />

                            <Slider
                                value={
                                    zoom
                                }
                                min={1}
                                max={3}
                                step={0.1}
                                onChange={(
                                    _event,
                                    value
                                ) =>
                                    setZoom(
                                        value as number
                                    )
                                }
                                sx={{
                                    flex: 1,
                                }}
                            />

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    minWidth: 35,
                                    textAlign:
                                        "right",
                                }}
                            >
                                {zoom.toFixed(
                                    1
                                )}
                                x
                            </Typography>
                        </Stack>
                    </Box>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 2,
                            textAlign:
                                "center",
                        }}
                    >
                        Geser foto untuk
                        menentukan bagian
                        yang ingin digunakan.
                    </Typography>
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        pb: 2,
                    }}
                >
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={
                            handleCropCancel
                        }
                    >
                        Batal
                    </Button>

                    <Button
                        variant="contained"
                        onClick={
                            handleCropConfirm
                        }
                    >
                        Gunakan Foto
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Profile;