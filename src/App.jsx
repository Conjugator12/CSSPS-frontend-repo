import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

// Student Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import HubDashboard from "./pages/students/HubDashboard";
import PlacementInfo from "./pages/Placements/PlacementInfo";
import SelfPlacement from "./pages/SelfPlacements/SelfPlacement";

// Admin Pages
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import StudentManagement from "./pages/students/StudentManagement";
import GradeInput from "./pages/Admin/GradeInput";
import SchoolManagement from "./pages/students/SchoolManagement";
import PlacementExecution from "./pages/Placements/PlacementExecution";

export default function App() {
  return (
    <AdminAuthProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Student Routes */}
            <Route
              path="/hub"
              element={
                <ProtectedRoute>
                  <HubDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hub/placement"
              element={
                <ProtectedRoute>
                  <PlacementInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hub/self-placement"
              element={
                <ProtectedRoute>
                  <SelfPlacement />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <AdminProtectedRoute>
                  <StudentManagement />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/grades"
              element={
                <AdminProtectedRoute>
                  <GradeInput />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/schools"
              element={
                <AdminProtectedRoute>
                  <SchoolManagement />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/placements"
              element={
                <AdminProtectedRoute adminOnly>
                  <PlacementExecution />
                </AdminProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </AdminAuthProvider>
  );
}
