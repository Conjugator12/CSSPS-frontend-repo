/**
 * GradeInput.jsx
 * Admin page for entering and managing student grades
 */

import { useState, useEffect } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import {
  addGrade,
  getStudentGrades,
  updateGrade,
  deleteGrade,
  listStudents,
} from "../../services/adminApi";
import "../students/StudentManagement.css";

export default function GradeInput() {
  const { token } = useAdminAuth();
  const [view, setView] = useState("entry"); // entry or view
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Grade entry form
  const [gradeForm, setGradeForm] = useState({
    student_id: "",
    subject: "",
    score: "",
    grade: "A",
    raw_score: "",
    term: "BECE 2024",
    academic_year: new Date().getFullYear(),
    notes: "",
  });

  // Student grades view
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentGrades, setStudentGrades] = useState([]);

  // Edit grade modal
  const [editingGrade, setEditingGrade] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await listStudents(0, 100);
      setStudents(response.data);
    } catch (err) {
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleGradeFormChange = (e) => {
    const { name, value } = e.target;
    setGradeForm((prev) => ({
      ...prev,
      [name]:
        name === "academic_year" || name === "score" || name === "raw_score"
          ? value === ""
            ? ""
            : parseInt(value)
          : value,
    }));
  };

  const handleSubmitGrade = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (!gradeForm.student_id || !gradeForm.subject) {
        setError("Please select student and subject");
        setLoading(false);
        return;
      }

      const gradeData = {
        ...gradeForm,
        student_id: parseInt(gradeForm.student_id),
      };

      await addGrade(gradeData);
      setSuccess(`Grade for ${gradeForm.subject} recorded successfully!`);

      // Reset form
      setGradeForm({
        student_id: "",
        subject: "",
        score: "",
        grade: "A",
        raw_score: "",
        term: "BECE 2024",
        academic_year: new Date().getFullYear(),
        notes: "",
      });

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add grade");
    } finally {
      setLoading(false);
    }
  };

  const handleViewStudentGrades = async (studentId) => {
    try {
      setLoading(true);
      setError(null);
      const student = students.find((s) => s.id === studentId);
      const response = await getStudentGrades(studentId);
      setSelectedStudent(student);
      setStudentGrades(response.data.grades || []);
      setView("view");
    } catch (err) {
      setError("Failed to load student grades");
    } finally {
      setLoading(false);
    }
  };

  const handleEditGrade = (grade) => {
    setEditingGrade(grade.id);
    setEditForm({
      subject: grade.subject,
      score: grade.score || "",
      grade: grade.grade || "A",
      raw_score: grade.raw_score || "",
      notes: grade.notes || "",
    });
  };

  const handleSaveEditGrade = async (gradeId) => {
    try {
      setLoading(true);
      await updateGrade(gradeId, editForm);
      setSuccess("Grade updated successfully!");
      setEditingGrade(null);
      setEditForm({});

      // Reload grades
      if (selectedStudent) {
        handleViewStudentGrades(selectedStudent.id);
      }
    } catch (err) {
      setError("Failed to update grade");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGrade = async (gradeId) => {
    if (!window.confirm("Are you sure you want to delete this grade?")) return;

    try {
      setLoading(true);
      await deleteGrade(gradeId);
      setSuccess("Grade deleted successfully");

      // Reload grades
      if (selectedStudent) {
        handleViewStudentGrades(selectedStudent.id);
      }
    } catch (err) {
      setError("Failed to delete grade");
    } finally {
      setLoading(false);
    }
  };

  // Entry View
  if (view === "entry") {
    return (
      <div className="grade-input">
        <header className="section-header">
          <h1>Grade Entry</h1>
          <button onClick={() => setView("view")} className="btn btn-secondary">
            👁️ View Grades
          </button>
        </header>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmitGrade} className="grade-form">
          <div className="form-section">
            <h2>Enter Student Grade</h2>

            <div className="form-grid">
              <div className="form-group required">
                <label>Select Student</label>
                <select
                  name="student_id"
                  value={gradeForm.student_id}
                  onChange={handleGradeFormChange}
                  required
                >
                  <option value="">Choose student...</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.index_number} - {student.first_name}{" "}
                      {student.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group required">
                <label>Subject</label>
                <select
                  name="subject"
                  value={gradeForm.subject}
                  onChange={handleGradeFormChange}
                  required
                >
                  <option value="">Select subject...</option>
                  <option value="English Language">English Language</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Integrated Science">Integrated Science</option>
                  <option value="Social Studies">Social Studies</option>
                  <option value="Religious and Moral Education">
                    Religious and Moral Education
                  </option>
                  <option value="Physical Education">Physical Education</option>
                  <option value="Information and Communication Technology">
                    ICT
                  </option>
                  <option value="French">French</option>
                  <option value="Akan">Akan</option>
                </select>
              </div>

              <div className="form-group">
                <label>Score (0-100)</label>
                <input
                  type="number"
                  name="score"
                  value={gradeForm.score}
                  onChange={handleGradeFormChange}
                  min="0"
                  max="100"
                  placeholder="85"
                />
              </div>

              <div className="form-group">
                <label>Grade</label>
                <select
                  name="grade"
                  value={gradeForm.grade}
                  onChange={handleGradeFormChange}
                >
                  <option value="A">A (Excellent)</option>
                  <option value="B">B (Very Good)</option>
                  <option value="C">C (Good)</option>
                  <option value="D">D (Fair)</option>
                  <option value="E">E (Poor)</option>
                  <option value="F">F (Very Poor)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Raw Score</label>
                <input
                  type="number"
                  name="raw_score"
                  value={gradeForm.raw_score}
                  onChange={handleGradeFormChange}
                  placeholder="510"
                />
              </div>

              <div className="form-group">
                <label>Term/Exam</label>
                <input
                  type="text"
                  name="term"
                  value={gradeForm.term}
                  onChange={handleGradeFormChange}
                  placeholder="BECE 2024"
                />
              </div>

              <div className="form-group">
                <label>Academic Year</label>
                <input
                  type="number"
                  name="academic_year"
                  value={gradeForm.academic_year}
                  onChange={handleGradeFormChange}
                  min="2000"
                  max="2100"
                />
              </div>

              <div className="form-group full-width">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={gradeForm.notes}
                  onChange={handleGradeFormChange}
                  placeholder="Additional notes (optional)"
                  rows="3"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Record Grade"}
            </button>
            <button
              type="button"
              onClick={() =>
                setGradeForm({
                  student_id: "",
                  subject: "",
                  score: "",
                  grade: "A",
                  raw_score: "",
                  term: "BECE 2024",
                  academic_year: new Date().getFullYear(),
                  notes: "",
                })
              }
              className="btn btn-secondary"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    );
  }

  // View Grades
  return (
    <div className="grade-input">
      <header className="section-header">
        <button onClick={() => setView("entry")} className="btn btn-secondary">
          ← Back to Entry
        </button>
        <h1>View Student Grades</h1>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {!selectedStudent ? (
        <div className="student-selector">
          <h2>Select a Student</h2>
          <div className="student-list">
            {loading ? (
              <p className="loading">Loading students...</p>
            ) : students.length === 0 ? (
              <p className="empty">No students found</p>
            ) : (
              students.map((student) => (
                <div key={student.id} className="student-item">
                  <div className="student-info">
                    <strong>{student.index_number}</strong>
                    <p>
                      {student.first_name} {student.last_name}
                    </p>
                  </div>
                  <button
                    onClick={() => handleViewStudentGrades(student.id)}
                    className="btn btn-small"
                  >
                    View Grades
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="grades-view">
          <div className="student-header">
            <h2>
              {selectedStudent.first_name} {selectedStudent.last_name}
            </h2>
            <p>{selectedStudent.index_number}</p>
            <button
              onClick={() => {
                setSelectedStudent(null);
                setStudentGrades([]);
              }}
              className="btn btn-secondary"
            >
              Select Different Student
            </button>
          </div>

          {loading ? (
            <p className="loading">Loading grades...</p>
          ) : studentGrades.length === 0 ? (
            <div className="empty-state">
              <p>No grades recorded for this student</p>
              <button
                onClick={() => setView("entry")}
                className="btn btn-primary"
              >
                Add Grades
              </button>
            </div>
          ) : (
            <div className="grades-table">
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Score</th>
                    <th>Grade</th>
                    <th>Term</th>
                    <th>Year</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {studentGrades.map((grade) => (
                    <tr key={grade.id}>
                      <td>{grade.subject}</td>
                      <td>{grade.score || "-"}</td>
                      <td>{grade.grade || "-"}</td>
                      <td>{grade.term || "-"}</td>
                      <td>{grade.academic_year || "-"}</td>
                      <td>
                        <button
                          onClick={() => handleEditGrade(grade)}
                          className="action-btn"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteGrade(grade.id)}
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
          {editingGrade && (
            <div
              className="modal-overlay"
              onClick={() => setEditingGrade(null)}
            >
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <h2>Edit Grade</h2>
                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    value={editForm.subject}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label>Score</label>
                  <input
                    type="number"
                    value={editForm.score}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        score:
                          e.target.value === "" ? "" : parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Grade</label>
                  <select
                    value={editForm.grade}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        grade: e.target.value,
                      }))
                    }
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={editForm.notes}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="modal-actions">
                  <button
                    onClick={() => handleSaveEditGrade(editingGrade)}
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingGrade(null)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
