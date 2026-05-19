import { createContext, useContext, useState, useEffect } from "react";
import { loginAdmin, getAdminMe } from "../services/adminApi";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(() =>
    localStorage.getItem("cssps_admin_token"),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedAdmin = localStorage.getItem("cssps_admin");
    if (token && savedAdmin) {
      try {
        setAdmin(JSON.parse(savedAdmin));
      } catch (e) {
        console.error("Failed to parse saved admin:", e);
        clearAuth();
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    try {
      const { data: loginData } = await loginAdmin(username, password);
      const newToken = loginData.access_token;

      localStorage.setItem("cssps_admin_token", newToken);
      setToken(newToken);

      const { data: adminResponse } = await getAdminMe();
      const adminData = adminResponse.user || adminResponse;

      localStorage.setItem("cssps_admin", JSON.stringify(adminData));
      setAdmin(adminData);

      return adminData;
    } catch (err) {
      console.error("Login failed:", err);
      clearAuth();
      throw err;
    }
  };

  const logout = () => clearAuth();

  const clearAuth = () => {
    localStorage.removeItem("cssps_admin_token");
    localStorage.removeItem("cssps_admin");
    setToken(null);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        login,
        logout,
        isAuthenticated: Boolean(token && admin),
        isAdmin: admin?.role === "admin",
        isSuperAdmin: admin?.role === "super_admin",
        isStaff: admin?.role === "staff",
        loading,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx)
    throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
};
