import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: false,

    interpolation: {
      escapeValue: false
    },

    resources: {
      en: {
        translation: {
          // GENERAL
          search: "Search...",
          filter: "Filter",
          name: "Name",
          regional: "Regional",
          actions: "Actions",
          create: "Create",
          rows: "Rows",
          weight: "Weight",
          username: "Username",
          email: "Email",
          role: "Role",
          createUser: "Create User",
          createPIC: "Create PIC",
          createJuri: "Create Juri",
          createPeserta: "Create Peserta",
          fullName: "Name",
          password: "Password",
          submit: "Submit",
          submitting: "Submitting...",
          back: "Back",
          requiredNote: "Note: (*) Required fields",
          success: "Success",
          userCreated: "User created successfully.",
          picCreated: "PIC created successfully.",
          juriCreated: "Juri created successfully.",
          userError: "Error creating User.",
          picError: "Error creating PIC.",
          juriError: "Error creating Juri.",
          fullscreen: "Fullscreen",
          editUser: "Edit User",
          editPIC: "Edit PIC",
          editJuri: "Edit Juri",
          userUpdated: "User updated successfully!",
          picUpdated: "PIC updated successfully!",
          juriUpdated: "Juri berhasil diperbarui!",
          save: "Save",
          loading: "Loading...",
          turnamentTitle: "Digital Scoring",
          toggleFullscreen: "Toggle fullscreen view",
          edit: "Edit",

          // DASHBOARD
          totalAllParticipants: "Total All Participants",
          totalParticipantsQualification: "Total Participants in Qualification Round",
          totalParticipantsRound16: "Total Participants in Round of 16",
          totalParticipantsQuarterFinal: "Total Participants in Quarter Final",
          totalParticipantsSemiFinal: "Total Participants in Semi Final",
          totalParticipantsFinal: "Total Participants in Final",
          listCompetition: "List Competition",
          listMatches: "List Matches",
          totalMatches: "Total Matches",
          allRounds: "All Rounds",
          ongoingMatches: "Ongoing Matches",
          currently: "Currently",
          finishedMatches: "Finished Matches",

          loadMatchError: "Failed to load matches.",
          getMatchError: "Failed to retrieve match data.",

          // VALIDATION
          fullNameRequired: "Full Name is required.",
          usernameRequired: "Username is required.",
          emailRequired: "Email is required.",
          passwordRequired: "Password is required.",
          roleRequired: "Role is required.",

          // PESERTA VALIDATION
          pesertaTitle: "Input Participant Data",
          pesertaRequired: "Participant name is required.",
          regionalRequired: "Regional is required.",
          weightRequired: "Weight is required.",
          weightMustBeNumber: "Weight must be a valid number.",
          weightPlaceholder: "Example: 60.70",
          pesertaCreated: "Participant created successfully.",
          pesertaError: "Error creating participant.",
          editPeserta: "Edit Participant",
          pesertaUpdated: "Participant updated successfully.",
          pesertaUpdateError: "Error updating participant.",

          // PERTANDINGAN
          match: "Match",
          status: "Status",
          no: "No",
          vs: "VS",
          belum_mulai: "Not Started",
          berlangsung: "Ongoing",
          pause: "Paused",
          selesai: "Finished",
          durasi: "Duration",
          peserta1: "Participant 1",
          peserta2: "Participant 2",
          round: "Round",
          round1: "Round 1",
          round2: "Round 2",
          round3: "Round 3",
          mainJudge: "Main Judges",
          reserveJudge: "Reserve Judges",
          bye: "BYE",
          semua: "All",
          of: "of",

          // USER MENU
          logout: "Logout",
          confirmLogout: "Confirm Logout",
          confirmQuestion: "Are you sure you want to logout?",
          cancel: "Cancel",
          account: "Account",

          // SCORE
          tournamentTitle: "Pencak Silat Turnament",
          scoreboardTitle: "SCORE BOARD",
          noMatchesFound: "No Matches Yet",
          exitFullscreen: "Exit Fullscreen",
          scorePerJudge: "Score Per Judge",
          noJudgeAssigned: "No judges assigned.",

          // CONTROLLER
          noMatchSelected: "No match selected yet",
          goToMatchDataDescription:
            "Open the Match Data page, then select a match to start scoring.",
          goToMatchData: "Go to Match Data",

          matchNotStarted:
            "The match has not started yet. Press Play to start.",
          matchPaused: "The match is paused.",
          matchFinished:
            "The match is finished. Score input is disabled.",

          roundLabel: "Round",
          roundFinished: "Finish Round",
          finishMatch: "Finish Match",
          finished: "Finished",

          judgeReplacement: "Judge Replacement",
          replace: "Replace",
          replaceJudge: "Replace Judge",
          noActiveMainJudge: "No active main judges.",
          noActiveReserveJudge: "No active reserve judges.",
          undoLastScore: "Undo the last score input from this judge",
          roundNotFinished: "Failed to finish the round.",
          judgeReplacementError: "Failed to replace judge.",
          startMatchError: "Failed to start the match.",
          pauseMatchError: "Failed to pause the match.",
          resumeMatchError: "Failed to resume the match.",
          finishMatchError: "Failed to finish the match.",
          roundStatus: "Round",

          // EDIT PERTANDINGAN
          editQualification: "Edit Qualification Round",
          matchIsNotQualification: "This match is not a qualification round match.",
          matchNotFound: "Match data not found.",
          matchAlreadyStarted: "The match has already started, so the match data cannot be edited.",
          matchDataCannotBeEdited: "A match that has already started cannot be edited.",
          participant: "Participants",
          participant1: "Participant 1",
          participant2: "Participant 2",
          selectParticipant1: "Select Participant 1",
          selectParticipant2: "Select Participant 2",
          participantRequired: "Match participants are required.",
          participantSame: "Participants cannot be the same.",
          participantNotFound: "Participant data not found.",
          participantWeightRequired: "The weight of both participants is required.",
          weightDifference: "Weight difference",
          maximumWeightDifference: "Maximum weight difference between participants is {{max}} Kg.",
          participantWeightDifference: "Participant 2 must have a weight within ±{{max}} Kg of Participant 1 ({{weight}} Kg).",
          noParticipantWeightMatch: "No participant found within the maximum weight difference of {{max}} Kg.",
          currentWeightDifference: "The current weight difference is {{difference}} Kg.",
          mainJudges: "Main Judges",
          reserveJudges: "Reserve Judges",
          mainJudgeNumber: "Main Judge {{number}}",
          reserveJudgeNumber: "Reserve Judge {{number}}",
          threeMainJudgesRequired: "3 main judges are required.",
          threeReserveJudgesRequired: "3 reserve judges are required.",
          judgesCannotBeSame: "Main and reserve judges cannot be the same.",
          roundDuration: "Round Duration",
          roundDurationLabel: "Duration of each round",
          minutes: "{{count}} minutes",
          roundInformation: "Each match consists of a maximum of 3 rounds. Each round lasts 2–3 minutes. The maximum weight difference between participants is 5 Kg.",
          saveChanges: "Save Changes",
          saving: "Saving...",
          matchUpdated: "Match updated successfully.",
          updateMatchError: "Failed to update match.",
          roundDurationInvalid:
            "Round duration can only be 2 or 3 minutes.",
          matchCreated:
            "Match created successfully.",
          createMatchError:
            "Failed to create match.",

          // SIDEBAR
          dashboard: "Dashboard",
          dataMaster: "Data Master",
          userManagement: "User Management",
          pic: "PIC",
          peserta: "Participants",
          juri: "Judges",

          turnamen: "Tournament",
          penyisihan: "Qualification Round",
          enambelasBesar: "Round of 16",
          perempat: "Quarter Final",
          semiFinal: "Semi Final",
          final: "Final",

          hitungTurnamen: "Tournament Calculation",
          controller: "Controller",
          skor: "Score",
          history: "History",

          // Delete
          confirmDelete: "Confirm Delete",
          confirmDeleteMessage: "Are you sure you want to delete this match?",
          delete: "Delete",          
        }
      },

      id: {
        translation: {
          // GENERAL
          search: "Cari...",
          filter: "Filter",
          name: "Nama",
          regional: "Wilayah",
          actions: "Aksi",
          create: "Tambah",
          rows: "Baris",
          weight: "Berat Badan",
          username: "Nama Pengguna",
          email: "Email",
          role: "Peran",
          createUser: "Tambah User",
          createPIC: "Tambah PIC",
          createJuri: "Tambah Juri",
          createPeserta: "Tambah Peserta",
          fullName: "Nama",
          password: "Kata Sandi",
          submit: "Simpan",
          submitting: "Menyimpan...",
          back: "Kembali",
          requiredNote: "Catatan: (*) Wajib diisi",
          success: "Berhasil",
          userCreated: "User berhasil dibuat.",
          picCreated: "PIC berhasil dibuat.",
          juriCreated: "Juri berhasil dibuat.",
          userError: "Gagal membuat User.",
          picError: "Gagal membuat PIC.",
          juriError: "Gagal membuat Juri.",
          fullscreen: "Layar Penuh",
          editUser: "Edit User",
          editPIC: "Edit PIC",
          editJuri: "Edit Juri",
          userUpdated: "User berhasil diperbarui!",
          picUpdated: "PIC berhasil diperbarui!",
          juriUpdated: "Juri berhasil diperbarui!",
          save: "Simpan",
          loading: "Memuat...",
          turnamentTitle: "Digital Scoring",
          toggleFullscreen: "Aktifkan tampilan layar penuh",
          edit: "Edit",

          // DASHBOARD
          totalAllParticipants: "Total Semua Peserta",
          totalParticipantsQualification: "Total Peserta Babak Penyisihan",
          totalParticipantsRound16: "Total Peserta Babak 16 Besar",
          totalParticipantsQuarterFinal: "Total Peserta Babak Perempat Final",
          totalParticipantsSemiFinal: "Total Peserta Babak Semi Final",
          totalParticipantsFinal: "Total Peserta Babak Final",
          listCompetition: "Daftar Kompetisi",
          listMatches: "Daftar Pertandingan",

          totalMatches: "Total Pertandingan",
          allRounds: "Semua Babak",
          ongoingMatches: "Pertandingan Berlangsung",
          currently: "Saat Ini",
          finishedMatches: "Pertandingan Selesai",

          loadMatchError: "Gagal memuat pertandingan.",
          getMatchError: "Gagal mengambil data pertandingan.",

          // VALIDATION
          fullNameRequired: "Nama wajib diisi.",
          usernameRequired: "Username wajib diisi.",
          emailRequired: "Email wajib diisi.",
          passwordRequired: "Password wajib diisi.",
          roleRequired: "Role wajib diisi.",

          // PESERTA VALIDATION
          pesertaTitle: "Masukkan Data Peserta",
          pesertaRequired: "Nama peserta wajib diisi.",
          regionalRequired: "Wilayah wajib diisi.",
          weightRequired: "Berat badan wajib diisi.",
          weightMustBeNumber: "Berat badan harus berupa angka.",
          weightPlaceholder: "Contoh: 60.70",
          pesertaCreated: "Peserta berhasil dibuat.",
          pesertaError: "Gagal membuat peserta.",
          editPeserta: "Edit Peserta",
          pesertaUpdated: "Peserta berhasil diperbarui!",
          pesertaUpdateError: "Peserta gagal diperbarui!",

          // PERTANDINGAN
          match: "Pertandingan",
          status: "Status",
          no: "No",
          vs: "VS",
          belum_mulai: "Belum Mulai",
          berlangsung: "Berlangsung",
          pause: "Dijeda",
          selesai: "Selesai",
          durasi: "Durasi",
          peserta1: "Peserta 1",
          peserta2: "Peserta 2",
          round: "Ronde",
          round1: "Ronde 1",
          round2: "Ronde 2",
          round3: "Ronde 3",
          mainJudge: "Juri Utama",
          reserveJudge: "Juri Cadangan",
          bye: "BYE",
          semua: "Semua",
          of: "dari",

          // USER MENU
          logout: "Keluar",
          confirmLogout: "Konfirmasi Keluar",
          confirmQuestion: "Apakah kamu yakin ingin keluar?",
          cancel: "Batal",
          account: "Akun",

          // SCORE
          tournamentTitle: "Turnamen Pencak Silat",
          scoreboardTitle: "SCORE BOARD",
          noMatchesFound: "Belum ada pertandingan",
          exitFullscreen: "Keluar Layar Penuh",
          scorePerJudge: "Perolehan Skor Juri",
          noJudgeAssigned: "Belum ada juri yang ditunjuk.",

          // CONTROLLER
          noMatchSelected: "Belum ada pertandingan yang dipilih",
          goToMatchDataDescription:
            "Buka halaman Data Pertandingan, lalu pilih salah satu pertandingan untuk mulai menghitung skor.",
          goToMatchData: "Ke Data Pertandingan",
          matchNotStarted:
            "Pertandingan belum dimulai. Tekan tombol Play untuk memulai.",
          matchPaused: "Pertandingan sedang di-pause.",
          matchFinished:
            "Pertandingan sudah selesai. Input skor dinonaktifkan.",
          roundLabel: "Ronde",
          roundFinished: "Selesaikan Ronde",
          finishMatch: "Selesaikan Pertandingan",
          finished: "Selesai",
          judgeReplacement: "Pergantian Juri",
          replace: "Ganti",
          replaceJudge: "Ganti Juri",
          noActiveMainJudge: "Tidak ada juri utama aktif.",
          noActiveReserveJudge: "Tidak ada juri cadangan aktif.",
          undoLastScore: "Undo input terakhir milik juri ini",
          roundNotFinished: "Gagal menyelesaikan ronde.",
          judgeReplacementError: "Gagal melakukan pergantian juri.",
          startMatchError: "Gagal memulai pertandingan.",
          pauseMatchError: "Gagal melakukan pause.",
          resumeMatchError: "Gagal melanjutkan pertandingan.",
          finishMatchError: "Gagal menyelesaikan pertandingan.",
          roundStatus: "Ronde",

          // EDIT PERTANDINGAN
          editQualification: "Edit Babak Penyisihan",
          matchIsNotQualification: "Pertandingan ini bukan pertandingan babak penyisihan.",
          matchNotFound: "Data pertandingan tidak ditemukan.",
          matchAlreadyStarted: "Pertandingan sudah dimulai sehingga data pertandingan tidak dapat diedit.",
          matchDataCannotBeEdited: "Pertandingan yang sudah dimulai tidak dapat diedit.",
          participant: "Peserta", participant1: "Peserta 1", participant2: "Peserta 2",
          selectParticipant1: "Pilih Peserta 1",
          selectParticipant2: "Pilih Peserta 2",
          participantRequired: "Peserta pertandingan wajib dipilih.",
          participantSame: "Peserta tidak boleh sama.",
          participantNotFound: "Data peserta tidak ditemukan.",
          participantWeightRequired: "Berat badan kedua peserta wajib tersedia.",
          weightDifference: "Selisih berat badan",
          maximumWeightDifference: "Selisih berat badan maksimal {{max}} Kg.",
          participantWeightDifference: "Peserta 2 harus memiliki berat maksimal ±{{max}} Kg dari Peserta 1 ({{weight}} Kg).",
          noParticipantWeightMatch: "Tidak ada peserta dengan selisih berat maksimal {{max}} Kg.",
          currentWeightDifference: "Selisih berat saat ini {{difference}} Kg.",
          mainJudges: "Juri Utama",
          reserveJudges: "Juri Cadangan",
          mainJudgeNumber: "Juri Utama {{number}}",
          reserveJudgeNumber: "Juri Cadangan {{number}}",
          threeMainJudgesRequired: "3 juri utama wajib dipilih.",
          threeReserveJudgesRequired: "3 juri cadangan wajib dipilih.",
          judgesCannotBeSame: "Juri utama dan juri cadangan tidak boleh sama.",
          roundDuration: "Durasi Ronde",
          roundDurationLabel: "Durasi setiap ronde",
          minutes: "{{count}} menit",
          roundInformation: "Setiap pertandingan terdiri dari maksimal 3 ronde. Durasi setiap ronde adalah 2–3 menit. Selisih berat badan kedua peserta maksimal 5 Kg.",
          saveChanges: "Simpan Perubahan",
          saving: "Menyimpan...",
          matchUpdated: "Pertandingan berhasil diperbarui.",
          updateMatchError: "Gagal memperbarui pertandingan.",
          roundDurationInvalid:
            "Durasi ronde hanya boleh 2 atau 3 menit.",
          matchCreated:
            "Pertandingan berhasil dibuat.",
          createMatchError:
            "Gagal membuat pertandingan.",

          // SIDEBAR
          dashboard: "Dashboard",
          dataMaster: "Data Master",
          userManagement: "Manajemen User",
          pic: "PIC",
          peserta: "Peserta",
          juri: "Juri",

          turnamen: "Turnamen",
          penyisihan: "Babak Penyisihan",
          enambelasBesar: "Babak 16 Besar",
          perempat: "Perempat Final",
          semiFinal: "Semi Final",
          final: "Final",

          hitungTurnamen: "Hitung Turnamen",
          controller: "Controller",
          skor: "Skor",
          history: "Riwayat",

          // Delete
          confirmDelete: "Konfirmasi Hapus",
          confirmDeleteMessage: "Apakah kamu yakin ingin menghapus pertandingan ini?",
          delete: "Hapus"
        }
      }
    }
  });

export default i18n;