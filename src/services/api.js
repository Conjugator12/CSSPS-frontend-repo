import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cssps_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Auth ──────────────────────────────────────────────
export const loginStudent  = (index_number, pin) => api.post('/auth/login', { index_number, pin })
export const logoutStudent = ()                  => api.post('/auth/logout')

// ── Public placement checker (no auth needed) ─────────
export const checkPlacementPublic = (index_number) => api.get(`/placement/check/${index_number}`)

// ── Self-placement ────────────────────────────────────
export const getSelfPlacementStatus = ()        => api.get('/self-placement/status')
export const searchSchools          = (q, prog) => api.get('/schools/search', { params: { q, programme: prog } })
export const submitSelfPlacement    = (payload) => api.post('/self-placement/submit', payload)
export const getProgrammes          = ()        => api.get('/programmes')

export default api
