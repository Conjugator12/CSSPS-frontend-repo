/**
 * AdminDashboard.jsx
 * Premium, Production-Grade Administration Panel Shell
 */

import { useState, useEffect } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import {
  getPlacementStats,
  listStudents,
  listSchools,
} from "../../services/adminApi";
import "./AdminDashboard.css";

// Premium Icon Asset Set (SVGs)
const Icons = {
  overview: () => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"
      />
    </svg>
  ),
  students: () => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 14l9-5-9-5-9 5 9 5z"
      />
      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0-6L3 9m9 5l9-5M9 21h6"
      />
    </svg>
  ),
  schools: () => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  ),
  grades: () => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  placements: () => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
      />
    </svg>
  ),
  logout: () => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  ),
};

export default function AdminDashboard() {
  const { admin, isSuperAdmin, logout } = useAdminAuth();
  const [stats, setStats] = useState(null);
  const [studentCount, setStudentCount] = useState(0);
  const [schoolCount, setSchoolCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (isSuperAdmin) {
        const statsResponse = await getPlacementStats();
        setStats(statsResponse?.data || null);
      }

      const studentsResponse = await listStudents(0, 200);
      console.log("Students API response:", studentsResponse);
      // Safe Extraction: Check object schemas, direct arrays, or fallback to 0
      const totalStudents =
        studentsResponse?.data?.total ??
        studentsResponse?.data?.length ??
        studentsResponse?.length ??
        0;
      setStudentCount(totalStudents);

      const schoolsResponse = await listSchools(0, 200);
      console.log("Schools API response:", schoolsResponse);
      // Safe Extraction: Check object schemas, direct arrays, or fallback to 0
      const totalSchools =
        schoolsResponse?.data?.total ??
        schoolsResponse?.data?.length ??
        schoolsResponse?.length ??
        0;
      setSchoolCount(totalSchools);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError(
        "Unable to refresh administration matrices. Verify service availability.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-shell">
      {/* Sidebar Command Module */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">⚡</div>
          <div className="brand-meta">
            <span className="brand-title">CSSPS Core</span>
            <span className="brand-badge">Enterprise v2.0</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeSection === "overview" ? "active" : ""}`}
            onClick={() => setActiveSection("overview")}
          >
            <Icons.overview /> Overview Core
          </button>

          <button
            className={`nav-item ${activeSection === "students" ? "active" : ""}`}
            onClick={() => setActiveSection("students")}
          >
            <Icons.students /> Register & Students
          </button>

          <button
            className={`nav-item ${activeSection === "schools" ? "active" : ""}`}
            onClick={() => setActiveSection("schools")}
          >
            <Icons.schools /> Schools & Offerings
          </button>

          <button
            className={`nav-item ${activeSection === "grades" ? "active" : ""}`}
            onClick={() => setActiveSection("grades")}
          >
            <Icons.grades /> Grade Matrix
          </button>

          {isSuperAdmin && (
            <button
              className={`nav-item ${activeSection === "placements" ? "active" : ""}`}
              onClick={() => setActiveSection("placements")}
            >
              <Icons.placements /> Placement Systems
            </button>
          )}
        </nav>

        <div className="sidebar-footer-profile">
          <div className="profile-avatar">
            {admin?.username?.substring(0, 2).toUpperCase() || "AD"}
          </div>
          <div className="profile-info">
            <p className="profile-name">
              @{admin?.username || "administrator"}
            </p>
            <span className="profile-role">
              {admin?.role?.replace("_", " ").toUpperCase() ||
                "STAFF OPERATIONS"}
            </span>
          </div>
          <button
            className="logout-trigger"
            onClick={logout}
            title="Terminate Admin Session"
          >
            <Icons.logout />
          </button>
        </div>
      </aside>

      {/* Main Execution Viewports */}
      <div className="dashboard-workspace">
        <header className="workspace-topbar">
          <div className="topbar-context">
            <span className="context-path">System / Dashboard</span>
            <h1 className="context-headline">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}{" "}
              Management
            </h1>
          </div>
          <div className="topbar-actions">
            <button
              className="btn btn-secondary-icon"
              onClick={loadDashboardData}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "🔄 Sync Data"}
            </button>
          </div>
        </header>

        <main className="workspace-content">
          {error && (
            <div className="alert-banner text-danger">
              <div className="alert-icon">⚠️</div>
              <div className="alert-text">
                <p>{error}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="shimmer-skeleton-loader">
              <div className="shimmer-line header-shimmer"></div>
              <div className="shimmer-grid">
                <div className="shimmer-box"></div>
                <div className="shimmer-box"></div>
                <div className="shimmer-box"></div>
              </div>
            </div>
          ) : (
            <>
              {activeSection === "overview" && (
                <div className="fade-in-entry">
                  {/* Premium Metrics Cards Layout */}
                  <div className="metrics-grid-system">
                    <div className="stat-card-premium">
                      <div className="stat-icon-wrapper blue">
                        <Icons.students />
                      </div>
                      <div className="stat-data-column">
                        <span className="stat-label">Enrolled Candidates</span>
                        <h2 className="stat-value">
                          {studentCount?.toLocaleString() || "0"}
                        </h2>
                        <p className="stat-subtext">
                          Total system verified students
                        </p>
                      </div>
                    </div>

                    <div className="stat-card-premium">
                      <div className="stat-icon-wrapper green">
                        <Icons.schools />
                      </div>
                      <div className="stat-data-column">
                        <span className="stat-label">
                          Registered Institutions
                        </span>
                        <h2 className="stat-value">
                          {schoolCount?.toLocaleString() || "0"}
                        </h2>
                        <p className="stat-subtext">
                          Active secondary campuses
                        </p>
                      </div>
                    </div>

                    {isSuperAdmin && stats && (
                      <div className="stat-card-premium-highlight">
                        <div className="stat-icon-wrapper gold">
                          <Icons.placements />
                        </div>
                        <div className="stat-data-column">
                          <span className="stat-label">
                            Batch Execution Success Rate
                          </span>
                          <h2 className="stat-value">
                            {stats?.total_students > 0 &&
                            stats?.students_placed > 0
                              ? `${((stats?.students_placed / stats?.total_students) * 100).toFixed(1)}%`
                              : "0.0%"}
                          </h2>
                          <p className="stat-subtext">
                            {stats?.students_placed?.toLocaleString() || "0"} /{" "}
                            {stats?.total_students?.toLocaleString() || "0"}{" "}
                            Allocated
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* System Context Message */}
                  <div className="premium-hero-panel">
                    <h3>Welcome back, Administrator</h3>
                    <p>
                      All standard CSSPS administrative actions taken are
                      securely tracked and written to structural logs for
                      compliance reviews. Use the navigational sidebar command
                      module to operate live records.
                    </p>
                  </div>
                </div>
              )}

              {/* Direct sections rendering links/placeholders fallback */}
              {activeSection === "students" && (
                <div className="embedded-view-card fade-in-entry">
                  <div className="view-card-header">
                    <h3>Candidate Database & Enrollment Forms</h3>
                    <p>
                      Process live structural models, assign parameters, and
                      configure institutional indices.
                    </p>
                  </div>
                  <div className="view-card-action-well">
                    <a
                      href="/admin/students"
                      className="btn btn-action-primary"
                    >
                      Launch Student Command Workspace →
                    </a>
                  </div>
                </div>
              )}

              {activeSection === "schools" && (
                <div className="embedded-view-card fade-in-entry">
                  <div className="view-card-header">
                    <h3>Institutional Capacity Matrix</h3>
                    <p>
                      Configure boarding allocations, multi-track capacities,
                      and institutional programmatic lines.
                    </p>
                  </div>
                  <div className="view-card-action-well">
                    <a href="/admin/schools" className="btn btn-action-primary">
                      Launch School Offerings Manager →
                    </a>
                  </div>
                </div>
              )}

              {activeSection === "grades" && (
                <div className="embedded-view-card fade-in-entry">
                  <div className="view-card-header">
                    <h3>Academic Performance & Transcripts Dashboard</h3>
                    <p>
                      Audit subject performance grades, record scaling profiles,
                      and adjust qualification matrices.
                    </p>
                  </div>
                  <div className="view-card-action-well">
                    <a href="/admin/grades" className="btn btn-action-primary">
                      Launch Grade Allocation Desk →
                    </a>
                  </div>
                </div>
              )}

              {activeSection === "placements" && isSuperAdmin && (
                <div className="embedded-view-card fade-in-entry">
                  <div className="view-card-header">
                    <h3>Deterministic Placement Engine Control</h3>
                    <p>
                      Execute automated school choice distribution matches,
                      process edge constraints, and verify logs.
                    </p>
                  </div>
                  <div className="view-card-action-well">
                    <a
                      href="/admin/placements"
                      className="btn btn-action-primary"
                    >
                      Initialize Batch Placement Optimization →
                    </a>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
