import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute  from './components/ProtectedRoute'

import LandingPage   from './pages/LandingPage'
import Login         from './pages/Login'
import SelfPlacement from './pages/SelfPlacement'

// Dev 2's pages — swap in after merge
const HubDashboard  = () => <div style={{ padding: 32, color: '#6b7280' }}>Dev 2 – Dashboard (coming)</div>
const PlacementInfo = () => <div style={{ padding: 32, color: '#6b7280' }}>Dev 2 – Placement Info (coming)</div>

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/"      element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          {/* Authenticated */}
          <Route path="/hub" element={<ProtectedRoute><HubDashboard /></ProtectedRoute>} />
          <Route path="/hub/placement"      element={<ProtectedRoute><PlacementInfo /></ProtectedRoute>} />
          <Route path="/hub/self-placement" element={<ProtectedRoute><SelfPlacement /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
