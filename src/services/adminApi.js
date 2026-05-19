import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const adminApi = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach admin JWT token to requests
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("cssps_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Admin Auth ──────────────────────────────────────────
export const loginAdmin = (username, password) =>
  adminApi.post("/api/admin/auth/login", { username, password });

export const getAdminMe = () => adminApi.get("/api/admin/auth/me");

export const logoutAdmin = () => {
  localStorage.removeItem("cssps_admin_token");
  localStorage.removeItem("cssps_admin");
};

// ── Student Management ──────────────────────────────────
export const createStudent = (studentData) =>
  adminApi.post("/api/admin/students", studentData);

export const listStudents = (skip = 0, limit = 100) =>
  adminApi.get("/api/admin/students", { params: { skip, limit } });

export const getStudent = (studentId) =>
  adminApi.get(`/api/admin/students/${studentId}`);

export const updateStudent = (studentId, data) =>
  adminApi.put(`/api/admin/students/${studentId}`, data);

export const updateStudentScores = (studentId, scores) =>
  adminApi.put(`/api/admin/students/${studentId}/scores`, scores);

export const deactivateStudent = (studentId) =>
  adminApi.delete(`/api/admin/students/${studentId}`);

// ── School Management ───────────────────────────────────
export const createSchool = (schoolData) =>
  adminApi.post("/api/admin/schools", schoolData);

export const listSchools = (skip = 0, limit = 100) =>
  adminApi.get("/api/admin/schools", { params: { skip, limit } });

export const getSchool = (schoolId) =>
  adminApi.get(`/api/admin/schools/${schoolId}`);

export const updateSchool = (schoolId, data) =>
  adminApi.put(`/api/admin/schools/${schoolId}`, data);

export const createProgram = (schoolId, programData) =>
  adminApi.post(`/api/admin/schools/${schoolId}/programs`, programData);

export const listPrograms = (schoolId) =>
  adminApi.get(`/api/admin/schools/${schoolId}/programs`);

export const updateProgram = (programId, data) =>
  adminApi.put(`/api/admin/programs/${programId}`, data);

export const deleteProgram = (programId) =>
  adminApi.delete(`/api/admin/programs/${programId}`);

// ── Grade Management ────────────────────────────────────
export const addGrade = (gradeData) =>
  adminApi.post("/api/admin/grades", gradeData);

export const getStudentGrades = (studentId) =>
  adminApi.get(`/api/admin/grades/student/${studentId}`);

export const updateGrade = (gradeId, data) =>
  adminApi.put(`/api/admin/grades/${gradeId}`, data);

export const listGrades = (skip = 0, limit = 100) =>
  adminApi.get("/api/admin/grades", { params: { skip, limit } });

export const deleteGrade = (gradeId) =>
  adminApi.delete(`/api/admin/grades/${gradeId}`);

// ── Placement Execution (Super Admin Only) ──────────────
export const executePlacement = (batchYear) =>
  adminApi.post("/api/admin/placements/execute", { batch_year: batchYear });

export const listPlacementBatches = (skip = 0, limit = 100) =>
  adminApi.get("/api/admin/placements/batches", { params: { skip, limit } });

export const getPlacementStats = () =>
  adminApi.get("/api/admin/placements/stats/summary");

export const updatePlacement = (placementId, data) =>
  adminApi.put(`/api/admin/placements/${placementId}`, data);

export const approvePlacement = (placementId) =>
  adminApi.post(`/api/admin/placements/${placementId}/approve`);

export const deletePlacement = (placementId) =>
  adminApi.delete(`/api/admin/placements/${placementId}`);

export const getPlacementDetails = (placementId) =>
  adminApi.get(`/api/admin/placements/${placementId}`);

export const getPlacementResults = (batchYear) =>
  adminApi.get(`/api/admin/placements/results/${batchYear}`);

export const getPlacementHistory = (studentId) =>
  adminApi.get(`/api/admin/placements/history/${studentId}`);

export const getPlacementsbyYear = () => {};

// ── Student Management Lookup Extensions ──────────────────
export const getJhsSchoolsLookup = () =>
  adminApi.get("/api/admin/students/lookup/schools");

export const getSubjectsLookup = () =>
  adminApi.get("/api/admin/students/lookup/subjects");

export default adminApi;
