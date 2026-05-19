/**
 * PlacementExecution.jsx
 * Super Admin page for executing placement algorithm and managing placements
 * SUPER ADMIN ONLY - Execute placements, view statistics, manage placements
 */

import { useState, useEffect } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import {
  executePlacement,
  listPlacementBatches,
  getPlacementStats,
  getPlacementsbyYear,
  updatePlacement,
  deletePlacement,
} from "../../services/adminApi";
// import "../styles/PlacementExecution.css";

export default function PlacementExecution() {
  const { isSuperAdmin } = useAdminAuth();
  const [view, setView] = useState("dashboard"); // dashboard, execute, batches, placements, stats
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Execution form
  const [batchYear, setBatchYear] = useState(new Date().getFullYear());
  const [executingPlacement, setExecutingPlacement] = useState(false);

  // Batches view
  const [batches, setBatches] = useState([]);

  // Statistics view
  const [stats, setStats] = useState(null);

  // Placements view
  const [placements, setplacements] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Edit modal
  const [editingPlacement, setEditingPlacement] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (!isSuperAdmin) {
      return;
    }
    loadInitialData();
  }, [isSuperAdmin]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const statsResponse = await getPlacementStats();
      setStats(statsResponse.data);

      const batchesResponse = await listPlacementBatches(0, 20);
      setBatches(batchesResponse.data);
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExecutePlacement = async (e) => {
    e.preventDefault();

    if (
      !window.confirm(
        `⚠️ WARNING: This will execute placement for ${batchYear}.\n\nThis action CANNOT be easily undone.\n\nMake sure:\n- All students are registered\n- All students have scores\n- All students have choices\n\nProceed?`,
      )
    ) {
      return;
    }

    try {
      setExecutingPlacement(true);
      setError(null);
      setSuccess(null);

      const response = await executePlacement(batchYear);

      const { students_placed, students_not_placed, total_students } =
        response.data;

      setSuccess(
        `✅ Placement executed successfully!\n\n` +
          `Total Students: ${total_students}\n` +
          `Placed: ${students_placed}\n` +
          `Not Placed: ${students_not_placed}\n` +
          `Placement Rate: ${((students_placed / total_students) * 100).toFixed(1)}%`,
      );

      // Reload data
      setTimeout(() => {
        loadInitialData();
        setView("batches");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to execute placement");
      console.error(err);
    } finally {
      setExecutingPlacement(false);
    }
  };

  const loadPlacements = async () => {
    try {
      setLoading(true);
      const response = await getPlacementsbyYear(selectedYear, 0, 500);
      setplacements(response.data);
    } catch (err) {
      setError("Failed to load placements");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPlacement = (placement) => {
    setEditingPlacement(placement.id);
    setEditForm({
      school_id: placement.school_id,
      program_type: placement.program_type || "",
      status: placement.status,
    });
  };

  const handleSaveEditPlacement = async (placementId) => {
    try {
      setLoading(true);
      await updatePlacement(placementId, editForm);
      setSuccess("Placement updated successfully!");
      setEditingPlacement(null);
      loadPlacements();
    } catch (err) {
      setError("Failed to update placement");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlacement = async (placementId) => {
    if (!window.confirm("Are you sure you want to delete this placement?"))
      return;

    try {
      setLoading(true);
      await deletePlacement(placementId);
      setSuccess("Placement deleted successfully");
      loadPlacements();
    } catch (err) {
      setError("Failed to delete placement");
    } finally {
      setLoading(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="placement-execution">
        <div className="access-denied">
          <h1>🔒 Access Denied</h1>
          <p>Placement execution is only available to Super Admins.</p>
          <p>
            If you believe this is an error, contact your system administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="placement-execution">
      {/* Header */}
      <header className="section-header">
        <h1>⚡ Placement Execution (Super Admin)</h1>
        <div className="header-actions">
          <button
            onClick={() => setView("dashboard")}
            className={`nav-btn ${view === "dashboard" ? "active" : ""}`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setView("execute")}
            className={`nav-btn ${view === "execute" ? "active" : ""}`}
          >
            🎯 Execute
          </button>
          <button
            onClick={() => {
              setView("batches");
              loadInitialData();
            }}
            className={`nav-btn ${view === "batches" ? "active" : ""}`}
          >
            📋 Batches
          </button>
          <button
            onClick={() => {
              setView("placements");
              loadPlacements();
            }}
            className={`nav-btn ${view === "placements" ? "active" : ""}`}
          >
            ✅ Placements
          </button>
        </div>
      </header>

      {/* Alerts */}
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Dashboard */}
      {view === "dashboard" && (
        <section className="placement-section">
          <h2>Placement Dashboard</h2>
          {stats && (
            <div className="stats-grid">
              <div className="stat-box">
                <h3>Total Students</h3>
                <p className="big-number">{stats.total_students}</p>
              </div>
              <div className="stat-box success">
                <h3>Placed</h3>
                <p className="big-number">{stats.total_placed}</p>
              </div>
              <div className="stat-box danger">
                <h3>Not Placed</h3>
                <p className="big-number">{stats.total_not_placed}</p>
              </div>
              <div className="stat-box info">
                <h3>Placement Rate</h3>
                <p className="big-number">{stats.placement_rate.toFixed(1)}%</p>
              </div>
              <div className="stat-box">
                <h3>Schools Used</h3>
                <p className="big-number">{stats.schools_with_placements}</p>
              </div>
            </div>
          )}

          <div className="quick-actions">
            <button
              onClick={() => setView("execute")}
              className="btn btn-danger btn-large"
            >
              ⚡ EXECUTE PLACEMENT
            </button>
          </div>
        </section>
      )}

      {/* Execute Placement */}
      {view === "execute" && (
        <section className="placement-section">
          <h2>Execute Placement Algorithm</h2>
          <div className="warning-box">
            <h3>⚠️ WARNING</h3>
            <p>This will run the placement algorithm for all students.</p>
            <p>This action CANNOT be easily undone.</p>
            <p>Ensure all student data is correct before proceeding.</p>
          </div>

          <form onSubmit={handleExecutePlacement} className="placement-form">
            <div className="form-group">
              <label>Placement Year</label>
              <input
                type="number"
                value={batchYear}
                onChange={(e) => setBatchYear(parseInt(e.target.value))}
                min="2000"
                max="2100"
              />
            </div>

            <div className="checklist">
              <h3>Pre-Execution Checklist</h3>
              <div className="checklist-items">
                <label>
                  <input type="checkbox" required />
                  All students are registered
                </label>
                <label>
                  <input type="checkbox" required />
                  All students have scores/aggregate
                </label>
                <label>
                  <input type="checkbox" required />
                  All students have choices
                </label>
                <label>
                  <input type="checkbox" required />
                  All schools are configured
                </label>
                <label>
                  <input type="checkbox" required />I have backed up the
                  database
                </label>
                <label>
                  <input type="checkbox" required />I understand this cannot be
                  easily undone
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-danger btn-large"
                disabled={executingPlacement}
              >
                {executingPlacement
                  ? "⏳ Executing..."
                  : "⚡ EXECUTE PLACEMENT"}
              </button>
              <button
                type="button"
                onClick={() => setView("dashboard")}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Batches */}
      {view === "batches" && (
        <section className="placement-section">
          <h2>Placement Batches</h2>
          {loading ? (
            <p className="loading">Loading batches...</p>
          ) : batches.length === 0 ? (
            <div className="empty-state">
              <p>No placement batches found</p>
              <button
                onClick={() => setView("execute")}
                className="btn btn-primary"
              >
                Create First Batch
              </button>
            </div>
          ) : (
            <div className="batches-list">
              {batches.map((batch) => (
                <div key={batch.id} className="batch-card">
                  <div className="batch-info">
                    <h3>Year {batch.batch_year}</h3>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className={`badge badge-${batch.status}`}>
                        {batch.status.toUpperCase()}
                      </span>
                    </p>
                    <p>
                      <strong>Total:</strong> {batch.total_students} students
                    </p>
                    <p>
                      <strong>Placed:</strong> {batch.students_placed} ✅
                      <strong> Not Placed:</strong> {batch.students_not_placed}{" "}
                      ❌
                    </p>
                    <p>
                      <strong>Started:</strong>{" "}
                      {new Date(batch.started_at).toLocaleString()}
                    </p>
                    {batch.completed_at && (
                      <p>
                        <strong>Completed:</strong>{" "}
                        {new Date(batch.completed_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                  {batch.error_log && (
                    <div className="batch-errors">
                      <strong>Errors:</strong>
                      <pre>{batch.error_log}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Placements */}
      {view === "placements" && (
        <section className="placement-section">
          <h2>View Placements</h2>
          <div className="filter-group">
            <label>Select Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {[2024, 2025, 2026, 2027].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <button onClick={loadPlacements} className="btn btn-primary">
              Load Placements
            </button>
          </div>

          {loading ? (
            <p className="loading">Loading placements...</p>
          ) : placements.length === 0 ? (
            <div className="empty-state">
              <p>No placements found for {selectedYear}</p>
            </div>
          ) : (
            <div className="placements-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Status</th>
                    <th>School ID</th>
                    <th>Program</th>
                    <th>Year</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {placements.map((placement) => (
                    <tr key={placement.id}>
                      <td>{placement.id}</td>
                      <td>
                        <span
                          className={`badge badge-${placement.status.toLowerCase()}`}
                        >
                          {placement.status}
                        </span>
                      </td>
                      <td>{placement.school_id}</td>
                      <td>{placement.program_type || "-"}</td>
                      <td>{placement.placement_year}</td>
                      <td>
                        <button
                          onClick={() => handleEditPlacement(placement)}
                          className="action-btn"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeletePlacement(placement.id)}
                          className="action-btn danger"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Edit Modal */}
          {editingPlacement && (
            <div
              className="modal-overlay"
              onClick={() => setEditingPlacement(null)}
            >
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <h2>Edit Placement</h2>
                <div className="form-group">
                  <label>School ID</label>
                  <input
                    type="number"
                    value={editForm.school_id}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        school_id: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Program Type</label>
                  <input
                    type="text"
                    value={editForm.program_type}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        program_type: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                  >
                    <option value="PLACED">Placed</option>
                    <option value="NOT_PLACED">Not Placed</option>
                    <option value="DEFERRED">Deferred</option>
                    <option value="SELF_PLACED">Self Placed</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button
                    onClick={() => handleSaveEditPlacement(editingPlacement)}
                    className="btn btn-primary"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingPlacement(null)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
