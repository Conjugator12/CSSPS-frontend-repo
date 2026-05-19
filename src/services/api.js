import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cssps_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalise error messages from the backend's ErrorResponse shape:
// { error, message, status_code, timestamp, request_id }
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const data = err.response?.data;
    // Backend returns { message: "..." } — surface it as a readable string
    if (data?.message) {
      err.userMessage = data.message;
    } else if (data?.detail) {
      err.userMessage = Array.isArray(data.detail)
        ? data.detail.map((d) => d.msg).join(", ")
        : data.detail;
    } else {
      err.userMessage = "Something went wrong. Please try again.";
    }
    return Promise.reject(err);
  },
);

// ── Auth ──────────────────────────────────────────────────────────────────────
// POST /api/auth/student/login  →  { index_number, date_of_birth }
// Response: { access_token, token_type, student: { ... } }
export const loginStudent = (index_number, date_of_birth) =>
  api.post("/api/auth/student/login", { index_number, date_of_birth });

// GET /api/auth/student/me
export const getStudentMe = () => api.get("/api/students/profile");

// ── Student Profile ───────────────────────────────────────────────────────────
// GET /api/students/profile — Get authenticated student's full profile
export const getStudentProfile = () => api.get("/api/students/profile");

// ── Public placement check ────────────────────────────────────────────────────
// POST /check-placement  — no auth needed, full candidate request body
// Minimal public lookup only needs index_number; we fill dummy required fields
// so the service can still look up by index_number against the DB.
// If your backend adds a lighter GET lookup later, swap this out.
export const checkPlacementPublic = (index_number) =>
  api.get(`/api/placements/check-placement/${index_number}`);

// ── Authenticated placement endpoints ─────────────────────────────────────────
// GET /api/placements/check-placement/{index_number}
// export const getMyPlacement = (index_number) =>
//   api.get(`/api/placements/check-placement/${index_number}`);

// // GET /api/placements/my-placement — Get authenticated user's placement
// export const getMyPlacementDetails = () =>
//   api.get("/api/placements/my-placement");

// ── Authenticated placement endpoints ─────────────────────────────────────────
// GET /api/placements/check-placement/{index_number}
export const getMyPlacement = (index_number) =>
  api.get(`/api/placements/check-placement/${index_number}`);

// GET /api/placements/my-placement — Get authenticated user's placement
export const getMyPlacementDetails = () =>
  api.get("/api/placements/my-placement");

// ── Self-placement (endpoints not yet implemented in backend) ────────────────────────────────────────
// These endpoints are for future use when self-placement is implemented
export const getSelfPlacementStatus = () =>
  api.get("/api/placements/self-placement/status");

export const searchSchools = (query, programme) =>
  api.get("/api/placements/schools/search", {
    params: { q: query, programme },
  });

// ── Authenticated Student Profiles ───────────────────────────
// 🌟 Matches the updated endpoint perfectly

export const submitSelfPlacement = (payload) =>
  api.post("/api/placements/self-placement/submit", payload);

export const getProgrammes = () => api.get("/api/placements/programmes");

export const getSchoolsChoices = () => api.get("/api/students/school_choices");

export default api;
