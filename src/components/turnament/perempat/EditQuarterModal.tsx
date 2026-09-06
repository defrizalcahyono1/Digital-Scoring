import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";

import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { useTranslation } from "react-i18next";

import Sidebar from "../../bar/Sidebar";
import UserMenu from "../../header/UserMenu";

import { useStore } from "../../../hooks/useStore";

import {
  fetchPertandinganById,
  updatePertandingan,
} from "../../../api/turnament/pertandingan/pertandingan";

import { usePesertaStore } from "../../../stores/PesertaStore";
import { usePeserta } from "../../../hooks/usePeserta";

import { useJuriStore } from "../../../stores/JuriStore";
import { useJuri } from "../../../hooks/useJuri";

import {
  UpdatePertandinganRequest,
  Pertandingan,
} from "../../../types/pertandingan";
import CustomLoading from "../../custom/CustomLoading";

type FormType = {
  pesertaA: number | "";
  pesertaB: number | "";

  juriUtama1: number | "";
  juriUtama2: number | "";
  juriUtama3: number | "";

  juriCadangan1: number | "";
  juriCadangan2: number | "";
  juriCadangan3: number | "";

  durasiRonde: 2 | 3;
};

const MAX_SELIBIH_BERAT = 5;

export default function EditQuarter() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const { t } = useTranslation();

  const {
    sidebarOpen,
    pageTitle,
    setPageTitle,
  } = useStore();

  const drawerWidth =
    sidebarOpen ? 260 : 70;

  const pertandinganId =
    Number(id);

  const [loading, setLoading] =
    useState(false);

  const [initialLoading, setInitialLoading] =
    useState(true);

  const [pertandingan, setPertandingan] =
    useState<Pertandingan | null>(null);

  const [dialog, setDialog] =
    useState({
      open: false,
      status:
        "success" as
        "success" | "error",
      message: "",
    });

  const [form, setForm] =
    useState<FormType>({
      pesertaA: "",
      pesertaB: "",

      juriUtama1: "",
      juriUtama2: "",
      juriUtama3: "",

      juriCadangan1: "",
      juriCadangan2: "",
      juriCadangan3: "",

      durasiRonde: 2,
    });

  const {
    Peserta: pesertaList,
  } = usePesertaStore();

  const {
    Juri: juriList,
  } = useJuriStore();

  const {
    loadPeserta,
  } = usePeserta();

  const {
    loadJuri,
  } = useJuri();

  const [
    isFullscreen,
    setIsFullscreen,
  ] = useState(false);

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

  useEffect(() => {
    setPageTitle(
      `${t("edit")} ${t("perempat")}`
    );
  }, [
    setPageTitle,
    t,
  ]);

  useEffect(() => {
    document.title =
      `Turnament Pencak Silat${pageTitle
        ? " | " + pageTitle
        : ""
      }`;
  }, [
    pageTitle,
  ]);

  useEffect(() => {
    const loadData = async () => {
      // const startTime = Date.now();

      try {
        setInitialLoading(true);

        if (
          !Number.isInteger(pertandinganId) ||
          pertandinganId <= 0
        ) {
          setDialog({
            open: true,
            status: "error",
            message: t("matchNotFound"),
          });

          return;
        }

        const [_, __, data] = await Promise.all([
          loadPeserta(),
          loadJuri(),
          fetchPertandinganById(pertandinganId),
        ]);

        if (data.babak !== "perempat_final") {
          setDialog({
            open: true,
            status: "error",
            message: t("matchIsNotQualification"),
          });

          return;
        }

        setPertandingan(data);

        const juriUtama = data.juri.filter(
          (juri) =>
            juri.peran === "utama" &&
            Boolean(juri.aktif)
        );

        const juriCadangan = data.juri.filter(
          (juri) =>
            juri.peran === "cadangan" &&
            Boolean(juri.aktif)
        );

        setForm({
          pesertaA: data.peserta1_id ?? "",
          pesertaB: data.peserta2_id ?? "",

          juriUtama1: juriUtama[0]?.id ?? "",
          juriUtama2: juriUtama[1]?.id ?? "",
          juriUtama3: juriUtama[2]?.id ?? "",

          juriCadangan1: juriCadangan[0]?.id ?? "",
          juriCadangan2: juriCadangan[1]?.id ?? "",
          juriCadangan3: juriCadangan[2]?.id ?? "",

          durasiRonde:
            data.durasi_ronde_menit === 3
              ? 3
              : 2,
        });
      } catch (err: any) {
        console.error(err);

        setDialog({
          open: true,
          status: "error",
          message:
            err?.response?.data?.message ??
            t("getMatchError"),
        });
      } finally {
        setTimeout(() => {
          setInitialLoading(false);
        }, 4000);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedPesertaA =
    useMemo(() => {
      if (
        form.pesertaA === ""
      ) {
        return null;
      }

      return (
        pesertaList.find(
          (p) =>
            p.id ===
            form.pesertaA
        ) ?? null
      );
    }, [
      pesertaList,
      form.pesertaA,
    ]);

  const pesertaBList =
    useMemo(() => {
      if (
        !selectedPesertaA ||
        selectedPesertaA.weight ==
        null
      ) {
        return pesertaList.filter(
          (p) =>
            p.id !==
            form.pesertaA
        );
      }

      return pesertaList.filter(
        (p) => {
          if (
            p.id ===
            form.pesertaA
          ) {
            return false;
          }

          if (
            p.weight == null
          ) {
            return false;
          }

          const selisih =
            Math.abs(
              p.weight -
              selectedPesertaA.weight
            );

          return (
            selisih <=
            MAX_SELIBIH_BERAT
          );
        }
      );
    }, [
      pesertaList,
      selectedPesertaA,
      form.pesertaA,
    ]);

  const handlePesertaAChange = (
    value: string
  ) => {
    const pesertaId =
      value === ""
        ? ""
        : Number(value);

    setForm((prev) => ({
      ...prev,
      pesertaA:
        pesertaId,
      pesertaB:
        "",
    }));
  };

  const handleNumberChange = (
    field: keyof FormType,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]:
        value === ""
          ? ""
          : Number(value),
    }));
  };

  const showError = (
    message: string
  ) => {
    setDialog({
      open: true,
      status: "error",
      message,
    });
  };

  const validate = () => {
    if (
      form.pesertaA === "" ||
      form.pesertaB === ""
    ) {
      showError(
        t("participantRequired")
      );

      return false;
    }

    if (
      form.pesertaA ===
      form.pesertaB
    ) {
      showError(
        t("participantSame")
      );

      return false;
    }

    const pesertaA =
      pesertaList.find(
        (p) =>
          p.id ===
          form.pesertaA
      );

    const pesertaB =
      pesertaList.find(
        (p) =>
          p.id ===
          form.pesertaB
      );

    if (
      !pesertaA ||
      !pesertaB
    ) {
      showError(
        t("participantNotFound")
      );

      return false;
    }

    if (
      pesertaA.weight == null ||
      pesertaB.weight == null
    ) {
      showError(
        t("participantWeightRequired")
      );

      return false;
    }

    const selisihBerat =
      Math.abs(
        pesertaA.weight -
        pesertaB.weight
      );

    if (
      selisihBerat >
      MAX_SELIBIH_BERAT
    ) {
      showError(
        t(
          "maximumWeightDifference",
          {
            max:
              MAX_SELIBIH_BERAT,
          }
        )
      );

      return false;
    }

    const juriUtama = [
      form.juriUtama1,
      form.juriUtama2,
      form.juriUtama3,
    ];

    if (
      juriUtama.some(
        (id) => id === ""
      )
    ) {
      showError(
        t("threeMainJudgesRequired")
      );

      return false;
    }

    const juriCadangan = [
      form.juriCadangan1,
      form.juriCadangan2,
      form.juriCadangan3,
    ];

    if (
      juriCadangan.some(
        (id) => id === ""
      )
    ) {
      showError(
        t("threeReserveJudgesRequired")
      );

      return false;
    }

    const allJuri = [
      ...juriUtama,
      ...juriCadangan,
    ];

    const uniqueJuri =
      new Set(allJuri);

    if (
      uniqueJuri.size !==
      allJuri.length
    ) {
      showError(
        t("judgesCannotBeSame")
      );

      return false;
    }

    if (
      form.durasiRonde !== 2 &&
      form.durasiRonde !== 3
    ) {
      showError(
        t("roundDuration")
      );

      return false;
    }

    if (
      pertandingan &&
      pertandingan.status !==
      "belum_mulai"
    ) {
      showError(
        t("matchDataCannotBeEdited")
      );

      return false;
    }

    return true;
  };

  const handleSubmit =
    async () => {
      if (!validate()) {
        return;
      }

      setLoading(true);

      try {
        const payload:
          UpdatePertandinganRequest =
        {
          babak:
            "perempat_final",

          peserta1_id:
            Number(
              form.pesertaA
            ),

          peserta2_id:
            Number(
              form.pesertaB
            ),

          juri_utama: [
            Number(
              form.juriUtama1
            ),
            Number(
              form.juriUtama2
            ),
            Number(
              form.juriUtama3
            ),
          ],

          juri_cadangan: [
            Number(
              form.juriCadangan1
            ),
            Number(
              form.juriCadangan2
            ),
            Number(
              form.juriCadangan3
            ),
          ],

          durasi_ronde_menit:
            form.durasiRonde,
        };

        await updatePertandingan(
          pertandinganId,
          payload
        );

        setDialog({
          open: true,
          status: "success",
          message:
            t("matchUpdated"),
        });

        setTimeout(() => {
          navigate(
            "/pertandingan/perempat-final"
          );
        }, 1500);
      } catch (err: any) {
        console.error(err);

        setDialog({
          open: true,
          status: "error",
          message:
            err?.response?.data?.message ??
            t("updateMatchError"),
        });
      } finally {
        setLoading(false);
      }
    };

  const toggleFullscreen =
    () => {
      if (
        !document.fullscreenElement
      ) {
        document.documentElement
          .requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    };

  if (
    !Number.isInteger(
      pertandinganId
    ) ||
    pertandinganId <= 0 ||
    !pertandingan
  ) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Alert severity="error">
          {t("matchNotFound")}
        </Alert>
      </Box>
    );
  }

  const isReadOnly =
    pertandingan.status !==
    "belum_mulai";

  return (
    <Box
      sx={{
        display:
          "flex",
        width: "100%",
        minHeight:
          "100vh",
      }}
    >
      {initialLoading && <CustomLoading />}
      <Box
        sx={{
          position:
            "fixed",
          top: 0,
          left: 0,
          width:
            drawerWidth,
          height:
            "100vh",
          zIndex: 1200,
        }}
      >
        <Sidebar />
      </Box>

      <Box
        sx={{
          position:
            "absolute",
          top: 0,
          left:
            `${drawerWidth}px`,
          right: 0,
          minHeight:
            "100vh",
          boxSizing:
            "border-box",
          p: 3,

          fontFamily:
            "Roboto, sans-serif",

          transition:
            "margin-left 0.3s, width 0.3s",

          background:
            "linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)",

          color:
            "black",

          overflowX:
            "hidden",
          overflowY:
            "hidden",
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
                onClick={
                  toggleFullscreen
                }
              >
                {isFullscreen ? (
                  <FullscreenExitIcon />
                ) : (
                  <FullscreenIcon />
                )}
              </IconButton>
            </Tooltip>

            <UserMenu />
          </Box>
        </Box>

        <Divider />

        {isReadOnly && (
          <Alert
            severity="warning"
            sx={{
              mt: 3,
            }}
          >
            {t("matchAlreadyStarted")}
          </Alert>
        )}

        <Card
          sx={{
            mt: 4,
            borderRadius: 3,
          }}
        >
          <CardContent>
            <Box
              display="flex"
              flexDirection="column"
              gap={2}
              mt={2}
              ml={4}
              mr={4}
            >
              <Typography
                variant="body2"
                color="error"
              >
                {t("requiredNote")}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                }}
              >
                {t("participant")}
              </Typography>

              <TextField
                select
                label={t("participant1")}
                value={
                  form.pesertaA
                }
                onChange={(e) =>
                  handlePesertaAChange(
                    e.target.value
                  )
                }
                fullWidth
                disabled={isReadOnly}
              >
                {pesertaList.map(
                  (p) => (
                    <MenuItem
                      key={p.id}
                      value={p.id}
                    >
                      {p.name}
                      {p.weight != null
                        ? ` - ${p.weight} kg`
                        : ""}
                    </MenuItem>
                  )
                )}
              </TextField>

              <TextField
                select
                label={t("participant2")}
                value={
                  form.pesertaB
                }
                onChange={(e) =>
                  handleNumberChange(
                    "pesertaB",
                    e.target.value
                  )
                }
                fullWidth
                disabled={
                  form.pesertaA === "" ||
                  isReadOnly
                }
                helperText={
                  selectedPesertaA?.weight != null
                    ? t(
                      "participantWeightDifference",
                      {
                        max:
                          MAX_SELIBIH_BERAT,
                        weight:
                          selectedPesertaA.weight,
                      }
                    )
                    : t(
                      "selectParticipant1"
                    )
                }
              >
                {pesertaBList.length === 0 ? (
                  <MenuItem
                    disabled
                    value=""
                  >
                    {t(
                      "noParticipantWeightMatch",
                      {
                        max:
                          MAX_SELIBIH_BERAT,
                      }
                    )}
                  </MenuItem>
                ) : (
                  pesertaBList.map(
                    (p) => (
                      <MenuItem
                        key={p.id}
                        value={p.id}
                      >
                        {p.name}
                        {p.weight != null
                          ? ` - ${p.weight} kg`
                          : ""}
                      </MenuItem>
                    )
                  )
                )}
              </TextField>

              {selectedPesertaA?.weight !=
                null && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {t(
                      "maximumWeightDifference",
                      {
                        max:
                          MAX_SELIBIH_BERAT,
                      }
                    )}
                  </Typography>
                )}

              <Typography
                variant="h6"
                sx={{
                  mt: 2,
                  fontWeight: 600,
                }}
              >
                {t("mainJudges")}
              </Typography>

              {[1, 2, 3].map(
                (num) => {
                  const field =
                    `juriUtama${num}` as keyof FormType;

                  return (
                    <TextField
                      key={field}
                      select
                      label={t(
                        "mainJudgeNumber",
                        {
                          number: num,
                        }
                      )}
                      value={
                        form[field]
                      }
                      onChange={(e) =>
                        handleNumberChange(
                          field,
                          e.target.value
                        )
                      }
                      fullWidth
                      disabled={isReadOnly}
                    >
                      {juriList.map(
                        (j) => (
                          <MenuItem
                            key={j.id}
                            value={j.id}
                          >
                            {j.name}
                          </MenuItem>
                        )
                      )}
                    </TextField>
                  );
                }
              )}

              <Typography
                variant="h6"
                sx={{
                  mt: 2,
                  fontWeight: 600,
                }}
              >
                {t("reserveJudges")}
              </Typography>

              {[1, 2, 3].map(
                (num) => {
                  const field =
                    `juriCadangan${num}` as keyof FormType;

                  return (
                    <TextField
                      key={field}
                      select
                      label={t(
                        "reserveJudgeNumber",
                        {
                          number: num,
                        }
                      )}
                      value={
                        form[field]
                      }
                      onChange={(e) =>
                        handleNumberChange(
                          field,
                          e.target.value
                        )
                      }
                      fullWidth
                      disabled={isReadOnly}
                    >
                      {juriList.map(
                        (j) => (
                          <MenuItem
                            key={j.id}
                            value={j.id}
                          >
                            {j.name}
                          </MenuItem>
                        )
                      )}
                    </TextField>
                  );
                }
              )}

              <Typography
                variant="h6"
                sx={{
                  mt: 2,
                  fontWeight: 600,
                }}
              >
                {t("roundDuration")}
              </Typography>

              <TextField
                select
                label={t(
                  "roundDurationLabel"
                )}
                value={
                  form.durasiRonde
                }
                onChange={(e) =>
                  handleNumberChange(
                    "durasiRonde",
                    e.target.value
                  )
                }
                fullWidth
                disabled={isReadOnly}
              >
                <MenuItem value={2}>
                  {t("minutes", {
                    count: 2,
                  })}
                </MenuItem>

                <MenuItem value={3}>
                  {t("minutes", {
                    count: 3,
                  })}
                </MenuItem>
              </TextField>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1,
                }}
              >
                {t("roundInformation")}
              </Typography>

              <Box
                display="flex"
                justifyContent="flex-end"
                gap={2}
                mt={2}
              >
                <Button
                  variant="contained"
                  color="error"
                  onClick={
                    handleSubmit
                  }
                  disabled={
                    loading ||
                    isReadOnly
                  }
                >
                  {loading
                    ? t("saving")
                    : t("saveChanges")}
                </Button>

                <Button
                  variant="contained"
                  color="warning"
                  onClick={() =>
                    navigate(
                      "/pertandingan/perempat-final"
                    )
                  }
                >
                  {t("back")}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Dialog
          open={
            dialog.open
          }
          onClose={() => {
            if (!loading) {
              setDialog({
                open: false,
                status:
                  "success",
                message:
                  "",
              });
            }
          }}
        >
          <DialogTitle>
            {dialog.status ===
              "success"
              ? t("success")
              : "Error"}
          </DialogTitle>

          <DialogContent>
            <Typography>
              {dialog.message}
            </Typography>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() =>
                setDialog({
                  open: false,
                  status:
                    "success",
                  message:
                    "",
                })
              }
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
