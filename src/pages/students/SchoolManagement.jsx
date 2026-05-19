/**
 * SchoolManagement.jsx
 * High-End Administrative Workspace Panel for Campuses & Programs
 */

import { useState, useEffect } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import {
  createSchool,
  listSchools,
  updateSchool,
  createProgram,
  listPrograms,
  deleteProgram,
} from "../../services/adminApi";

export default function SchoolManagement() {
  const { token } = useAdminAuth();
  const [view, setView] = useState("list"); // UI States: list, form, programs
  const [schools, setSchools] = useState([]);
  const [schoolPrograms, setSchoolPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);

  // Structural State Input Parameters Initialization Block
  const [schoolForm, setSchoolForm] = useState({
    school_code: "",
    school_name: "",
    region: "Greater Accra",
    district: "",
    school_type: "SHS",
    total_capacity: "",
    boys_capacity: "",
    girls_capacity: "",
    is_boarding: false,
    is_mixed: true,
    min_aggregate: "6",
    contact_email: "",
    contact_phone: "",
  });

  const [programForm, setProgramForm] = useState({
    program_name: "",
    program_type: "GENERAL_SCIENCE",
    capacity: "",
    min_aggregate: "",
  });

  useEffect(() => {
    fetchSchoolsData();
  }, []);

  const fetchSchoolsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await listSchools(0, 100);
      setSchools(res.data?.schools || res.data || []);
    } catch (err) {
      setError("Failed to retrieve registered school data grids.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPrograms = async (school) => {
    setSelectedSchool(school);
    setView("programs");
    try {
      setLoading(true);
      const res = await listPrograms(school.id);
      setSchoolPrograms(res.data || []);
    } catch (err) {
      setError(
        "Failed to sync academic programmatic listings for selected entity.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchoolSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await createSchool(schoolForm);
      setSuccess(
        "New institutional secondary campus established successfully.",
      );
      setView("list");
      fetchSchoolsData();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to register new institution record.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workspace-inner-container fade-in-entry">
      {/* Structural Segment Filters Workspace Context */}
      <div className="workspace-sub-navigation-header">
        <div className="segment-pill-box">
          <button
            className={`pill-toggle ${view === "list" ? "active" : ""}`}
            onClick={() => setView("list")}
          >
            🏢 Active Registries ({schools.length})
          </button>
          <button
            className={`pill-toggle ${view === "form" ? "active" : ""}`}
            onClick={() => setView("form")}
          >
            ➕ Establish Campus Registry
          </button>
          {view === "programs" && (
            <button className="pill-toggle active">
              🎓 Programs: {selectedSchool?.school_name}
            </button>
          )}
        </div>
      </div>

      {success && (
        <div className="alert-banner text-success">
          <div className="alert-icon">✅</div>
          <div className="alert-text">
            <p>{success}</p>
          </div>
          <button className="alert-close" onClick={() => setSuccess(null)}>
            ×
          </button>
        </div>
      )}

      {/* View Branch Execution Workspace Main Segment Block */}
      {view === "list" && (
        <div className="premium-table-container">
          {loading ? (
            <p className="loading-context">
              Syncing structural institutional registries...
            </p>
          ) : schools.length === 0 ? (
            <div className="empty-workspace-state">
              <p>
                No registered secondary institutions or technical vocational
                campuses present.
              </p>
            </div>
          ) : (
            <div className="responsive-table-scroll-well">
              <table className="premium-data-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Campus Demographics</th>
                    <th>Region / District</th>
                    <th>Facility Configuration</th>
                    <th className="text-right">Operational Desk</th>
                  </tr>
                </thead>
                <tbody>
                  {schools.map((school) => (
                    <tr key={school.id}>
                      <td className="font-monospace text-bold">
                        {school.school_code}
                      </td>
                      <td>
                        <div className="cell-stacked-title">
                          {school.school_name}
                        </div>
                        <div className="cell-stacked-subtext">
                          {school.school_type || "Secondary Campus"}
                        </div>
                      </td>
                      <td>
                        <div className="cell-stacked-title">
                          {school.region}
                        </div>
                        <div className="cell-stacked-subtext">
                          {school.district || "—"}
                        </div>
                      </td>
                      <td>
                        <div className="badge-row-stack">
                          <span
                            className={`badge ${school.is_boarding ? "success" : "neutral"}`}
                          >
                            {school.is_boarding ? "Boarding" : "Day System"}
                          </span>
                          <span className="badge info">
                            {school.is_mixed
                              ? "Co-Ed Mixed"
                              : "Single Gender Allocation"}
                          </span>
                        </div>
                      </td>
                      <td className="text-right">
                        <button
                          className="table-action-btn primary"
                          onClick={() => handleOpenPrograms(school)}
                        >
                          🎓 Manage Offerings
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {view === "form" && (
        <div className="premium-form-layout-card">
          <div className="form-section-headline">
            <h3>Campus Identity & Spatial Metrics</h3>
            <p>
              Ensure administrative information matches regulatory directives
              before confirmation.
            </p>
          </div>
          <form
            onSubmit={handleCreateSchoolSubmit}
            className="premium-grid-form"
          >
            <div className="form-row-grid column-2">
              <div className="form-group-premium">
                <label>Institutional Code</label>
                <input
                  type="text"
                  placeholder="e.g., SHS0021"
                  required
                  value={schoolForm.school_code}
                  onChange={(e) =>
                    setSchoolForm({
                      ...schoolForm,
                      school_code: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group-premium">
                <label>Official School Designation Name</label>
                <input
                  type="text"
                  placeholder="e.g., Accra Academy Secondary School"
                  required
                  value={schoolForm.school_name}
                  onChange={(e) =>
                    setSchoolForm({
                      ...schoolForm,
                      school_name: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="form-row-grid column-2">
              <div className="form-group-premium">
                <label>Regional Core Jurisdiction</label>
                <select
                  value={schoolForm.region}
                  onChange={(e) =>
                    setSchoolForm({ ...schoolForm, region: e.target.value })
                  }
                >
                  <option value="Greater Accra">Greater Accra</option>
                  <option value="Ashanti">Ashanti</option>
                  <option value="Central">Central</option>
                  <option value="Eastern">Eastern</option>
                  <option value="Western">Western</option>
                </select>
              </div>
              <div className="form-group-premium">
                <label>Administrative District Layout</label>
                <input
                  type="text"
                  placeholder="e.g., Ablekuma North District"
                  required
                  value={schoolForm.district}
                  onChange={(e) =>
                    setSchoolForm({ ...schoolForm, district: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-checkbox-row-wrapper">
              <label className="premium-toggle-switch-container">
                <input
                  type="checkbox"
                  checked={schoolForm.is_boarding}
                  onChange={(e) =>
                    setSchoolForm({
                      ...schoolForm,
                      is_boarding: e.target.checked,
                    })
                  }
                />
                <span className="toggle-label-meta">
                  <strong>On-Site Boarding Infrastructure Active</strong>
                  <p>
                    Campus possesses institutional capacity for dormitories and
                    residency assignments.
                  </p>
                </span>
              </label>
            </div>

            <div className="form-actions-submit-well">
              <button
                type="submit"
                className="btn btn-action-primary-large"
                disabled={loading}
              >
                {loading
                  ? "Saving Records..."
                  : "💾 Commit Campus Entity to Database Matrix"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
