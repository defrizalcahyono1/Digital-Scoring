import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Login from "./components/Login";
import ResetPasswordPage from "./components/ResetPassword";
import Register from "./components/Register";
import ForgotPasswordPage from "./components/ForgotPasswordPage";

import AuthGuard from "./components/guards/AuthGuard";
import Dashboard from "./components/Dashboard";

import Peserta from "./components/datamaster/peserta/Peserta";
import CreatePeserta from "./components/datamaster/peserta/CreatePesertaModal";
import EditPeserta from "./components/datamaster/peserta/EditPesertaModal";

import PIC from "./components/datamaster/PIC/PIC";
import CreatePIC from "./components/datamaster/PIC/CreatePICModal";
import EditPIC from "./components/datamaster/PIC/EditPICModal";

import Juri from "./components/datamaster/Juri/Juri";
import CreateJuri from "./components/datamaster/Juri/CreateJuriModal";
import EditJuri from "./components/datamaster/Juri/EditJuriModal";

import UserManagement from "./components/datamaster/usermanagement/UserManagement";
import CreateUser from "./components/datamaster/usermanagement/CreateUserModal";
import EditUser from "./components/datamaster/usermanagement/EditUserModal";

import ControllerMatch from "./components/hitungTurnamen/Controller";
import ControllerEmpty from "./components/hitungTurnamen/ControllerEmpty";

import Penyisihan from "./components/turnament/penyisihan/Penyisihan";
import CreatePenyisihan from "./components/turnament/penyisihan/CreatePenyisihanModal";
import EditPenyisihan from "./components/turnament/penyisihan/EditPenyisihanModal";

import Quarter from "./components/turnament/perempat/quarter";
import Semi from "./components/turnament/semi/Semi";
import Final from "./components/turnament/final/Final";
import EnambelasBesar from "./components/turnament/enambelasbesar/enambelasBesar";

import ScoreDetail from "./components/score/ScoreDetail";
import Scorepenyisihan from "./components/score/Scorepenyisihan";
import Score16Besar from "./components/score/Score16Besar";
import Scorefinal from "./components/score/Scorefinal";
import Scoreperempat from "./components/score/Scoreperempat";
import ScoresemiFinal from "./components/score/ScoresemiFinal";

import Profile from "./components/profile/profile";

import BlankPage from "./pages/BlankPage";
import EditEnamBelasBesar from "./components/turnament/enambelasbesar/EditEnambelasModal";
import EditQuarter from "./components/turnament/perempat/EditQuarterModal";
import EditSemi from "./components/turnament/semi/EditSemiModal";
import EditFinal from "./components/turnament/final/EditFinalModal";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <AuthGuard allowedRoles={["admin", "juri", "panitia", "developer"]}>
              <Dashboard />
            </AuthGuard>
          }
        />

        {/* DATA MASTER - USER MANAGEMENT */}
        <Route
          path="/datamaster/usermanagement"
          element={
            <AuthGuard allowedRoles={["admin", "developer"]}>
              <UserManagement />
            </AuthGuard>
          }
        />
        <Route
          path="/datamaster/usermanagement/create-user"
          element={
            <AuthGuard allowedRoles={["admin", "developer"]}>
              <CreateUser />
            </AuthGuard>
          }
        />
        <Route
          path="/datamaster/usermanagement/edit/:id"
          element={
            <AuthGuard allowedRoles={["admin", "developer"]}>
              <EditUser />
            </AuthGuard>
          }
        />

        {/* DATA MASTER - PIC */}
        <Route
          path="/datamaster/pic"
          element={
            <AuthGuard allowedRoles={["admin", "developer"]}>
              <PIC />
            </AuthGuard>
          }
        />
        <Route
          path="/datamaster/pic/create-pic"
          element={
            <AuthGuard allowedRoles={["admin", "developer"]}>
              <CreatePIC />
            </AuthGuard>
          }
        />
        <Route
          path="/datamaster/pic/edit/:id"
          element={
            <AuthGuard allowedRoles={["admin", "developer"]}>
              <EditPIC />
            </AuthGuard>
          }
        />

        {/* DATA MASTER - PESERTA */}
        <Route
          path="/datamaster/peserta"
          element={
            <AuthGuard allowedRoles={["admin", "developer"]}>
              <Peserta />
            </AuthGuard>
          }
        />
        <Route
          path="/datamaster/peserta/create-peserta"
          element={
            <AuthGuard allowedRoles={["admin", "developer"]}>
              <CreatePeserta />
            </AuthGuard>
          }
        />
        <Route
          path="/datamaster/peserta/edit/:id"
          element={
            <AuthGuard allowedRoles={["admin", "developer"]}>
              <EditPeserta />
            </AuthGuard>
          }
        />

        {/* DATA MASTER - JURI */}
        <Route
          path="/datamaster/juri"
          element={
            <AuthGuard allowedRoles={["admin", "developer"]}>
              <Juri />
            </AuthGuard>
          }
        />
        <Route
          path="/datamaster/juri/create-juri"
          element={
            <AuthGuard allowedRoles={["admin", "developer"]}>
              <CreateJuri />
            </AuthGuard>
          }
        />
        <Route
          path="/datamaster/juri/edit/:id"
          element={
            <AuthGuard allowedRoles={["admin", "developer"]}>
              <EditJuri />
            </AuthGuard>
          }
        />

        {/* TURNAMEN - PENYISIHAN */}
        <Route
          path="/pertandingan/penyisihan"
          element={
            <AuthGuard allowedRoles={["admin", "juri", "developer"]}>
              <Penyisihan />
            </AuthGuard>
          }
        />
        <Route
          path="/pertandingan/penyisihan/create-penyisihan"
          element={
            <AuthGuard allowedRoles={["admin", "developer"]}>
              <CreatePenyisihan />
            </AuthGuard>
          }
        />
        <Route
          path="/pertandingan/penyisihan/edit-penyisihan/:id"
          element={
            <AuthGuard allowedRoles={["admin", "developer"]}>
              <EditPenyisihan />
            </AuthGuard>
          }
        />

        {/* TURNAMEN - 16 BESAR */}
        <Route
          path="/pertandingan/16-besar"
          element={
            <AuthGuard allowedRoles={["admin", "juri", "developer"]}>
              <EnambelasBesar />
            </AuthGuard>
          }
        />
        <Route
          path="/pertandingan/16-besar/edit-16-besar/:id"
          element={
            <AuthGuard allowedRoles={["admin", "developer"]}>
              <EditEnamBelasBesar />
            </AuthGuard>
          }
        />

        {/* TURNAMEN - PEREMPAT FINAL */}
        <Route
          path="/pertandingan/perempat-final"
          element={
            <AuthGuard allowedRoles={["admin", "juri", "developer"]}>
              <Quarter />
            </AuthGuard>
          }
        />
        <Route
          path="/pertandingan/perempat-final/edit-perempat-final/:id"
          element={
            <AuthGuard allowedRoles={["admin", "developer"]}>
              <EditQuarter />
            </AuthGuard>
          }
        />

        {/* TURNAMEN - SEMI FINAL */}
        <Route
          path="/pertandingan/semi-final"
          element={
            <AuthGuard allowedRoles={["admin", "juri", "developer"]}>
              <Semi />
            </AuthGuard>
          }
        />
        <Route
          path="/pertandingan/semi-final/edit-semi-final/:id"
          element={
            <AuthGuard allowedRoles={["admin", "developer"]}>
              <EditSemi />
            </AuthGuard>
          }
        />

        {/* TURNAMEN - FINAL */}
        <Route
          path="/pertandingan/final"
          element={
            <AuthGuard allowedRoles={["admin", "juri", "developer"]}>
              <Final />
            </AuthGuard>
          }
        />
        <Route
          path="/pertandingan/final/edit-final/:id"
          element={
            <AuthGuard allowedRoles={["admin", "developer"]}>
              <EditFinal />
            </AuthGuard>
          }
        />

        {/* HITUNG TURNAMEN */}
        <Route
          path="/hitungTurnamen"
          element={
            <AuthGuard allowedRoles={["admin", "juri", "developer"]}>
              <ControllerEmpty />
            </AuthGuard>
          }
        />
        <Route
          path="/hitungTurnamen/controller/:id"
          element={
            <AuthGuard allowedRoles={["admin", "juri", "developer"]}>
              <ControllerMatch />
            </AuthGuard>
          }
        />

        {/* SKOR - PENYISIHAN */}
        <Route
          path="/skor/penyisihan"
          element={
            <AuthGuard allowedRoles={["admin", "juri", "panitia", "developer"]}>
              <Scorepenyisihan />
            </AuthGuard>
          }
        />

        {/* SKOR - 16 BESAR */}
        <Route
          path="/skor/enambelasBesar"
          element={
            <AuthGuard allowedRoles={["admin", "juri", "panitia", "developer"]}>
              <Score16Besar />
            </AuthGuard>
          }
        />

        {/* SKOR - PEREMPAT FINAL */}
        <Route
          path="/skor/perempat-final"
          element={
            <AuthGuard allowedRoles={["admin", "juri", "panitia", "developer"]}>
              <Scoreperempat />
            </AuthGuard>
          }
        />

        {/* SKOR - SEMI FINAL */}
        <Route
          path="/skor/semi-final"
          element={
            <AuthGuard allowedRoles={["admin", "juri", "panitia", "developer"]}>
              <ScoresemiFinal />
            </AuthGuard>
          }
        />

        {/* SKOR - FINAL */}
        <Route
          path="/skor/final"
          element={
            <AuthGuard allowedRoles={["admin", "juri", "panitia", "developer"]}>
              <Scorefinal />
            </AuthGuard>
          }
        />

        {/* SKOR - DETAIL */}
        <Route
          path="/skor/:id"
          element={
            <AuthGuard allowedRoles={["admin", "juri", "panitia", "developer"]}>
              <ScoreDetail />
            </AuthGuard>
          }
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={
            <AuthGuard allowedRoles={["admin", "juri", "panitia", "developer"]}>
              <Profile />
            </AuthGuard>
          }
        />

        {/* MENU SEDANG PROSES */}
        <Route
          path="/datamaster/category-discipline"
          element={
            <AuthGuard allowedRoles={["admin"]}>
              <BlankPage />
            </AuthGuard>
          }
        />
        <Route
          path="/datamaster/sub-category-discipline"
          element={
            <AuthGuard allowedRoles={["admin"]}>
              <BlankPage />
            </AuthGuard>
          }
        />

        {/* URL TIDAK DITEMUKAN */}
        <Route
          path="*"
          element={
            <AuthGuard>
              <Navigate to="/dashboard" replace />
            </AuthGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
