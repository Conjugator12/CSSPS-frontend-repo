import { createContext, useContext, useState, useEffect } from "react";
import { loginStudent, getStudentMe } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("cssps_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("cssps_user");
    // Restore user if we have both token and saved user data
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user:", e);
        clearAuth();
      }
    } else if (!token) {
      // No token, clear auth state
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  // Backend response shape for login: { access_token, token_type, expires_in }
  // Student data comes from /api/auth/student/me endpoint
  const login = async (index_number, date_of_birth) => {
    try {
      // Step 1: Login and get token
      console.log("🔐 Step 1: Logging in with index_number...");
      const { data: loginData } = await loginStudent(
        index_number,
        date_of_birth,
      );
      const newToken = loginData.access_token;

      console.log("✅ Login successful, token received");

      // Step 2: Store token in localStorage and state
      localStorage.setItem("cssps_token", newToken);
      setToken(newToken);

      // Step 3: Fetch student data with the new token
      console.log("📊 Step 2: Fetching student data...");
      const { data: studentResponse } = await getStudentMe();

      // Handle different response formats
      const studentData =
        studentResponse.student || studentResponse.data || studentResponse;
      console.log("✅ Student data received:", studentData);

      // Step 4: Store student data
      localStorage.setItem("cssps_user", JSON.stringify(studentData));
      setUser(studentData);

      return studentData;
    } catch (err) {
      console.error("❌ Login failed:", err);
      // Clear auth on failure
      clearAuth();
      throw err;
    }
  };

  const logout = () => clearAuth();

  const clearAuth = () => {
    localStorage.removeItem("cssps_token");
    localStorage.removeItem("cssps_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: Boolean(token && user),
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
