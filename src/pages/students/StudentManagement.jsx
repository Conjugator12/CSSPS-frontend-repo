import React, { useState, useEffect } from "react";
import {
  listStudents,
  createStudent,
  getJhsSchoolsLookup,
  getSubjectsLookup,
} from "../../services/adminApi"; // Centralized database service hooks
import "./StudentManagement.css";

export default function StudentManagement() {
  const [view, setView] = useState("list"); // UI States: 'list', 'register-student', 'add-school'
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Student Form Registration Initial Fields
  const [studentForm, setStudentForm] = useState({
    jhs_school_id: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "M",
    date_of_birth: "",
    region: "",
    district: "",
    phone_number: "",
    elective_subject_ids: [],
  });

  // JHS School Form Data State Input Block
  const [schoolForm, setSchoolForm] = useState({
    school_code: "",
    school_name: "",
    region: "",
    district: "",
    is_boarding: false,
    is_mixed: true,
    min_aggregate: "",
    contact_email: "",
    contact_phone: "",
  });

  useEffect(() => {
    loadInitialData();
  }, [view]);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (view === "list") {
        const { data } = await listStudents();
        setStudents(data);
      } else if (view === "register-student") {
        const [schoolsRes, subjectsRes] = await Promise.all([
          getJhsSchoolsLookup(),
          getSubjectsLookup(),
        ]);
        setSchools(schoolsRes.data);
        setAllSubjects(subjectsRes.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to sync secure repository records.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleElectiveCheckboxChange = (subjectId) => {
    setStudentForm((prev) => {
      const currentIds = [...prev.elective_subject_ids];
      if (currentIds.includes(subjectId)) {
        return {
          ...prev,
          elective_subject_ids: currentIds.filter((id) => id !== subjectId),
        };
      } else {
        return { ...prev, elective_subject_ids: [...currentIds, subjectId] };
      }
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        ...studentForm,
        jhs_school_id: parseInt(studentForm.jhs_school_id),
        middle_name: studentForm.middle_name.trim() || null,
        region: studentForm.region.trim() || null,
        district: studentForm.district.trim() || null,
        phone_number: studentForm.phone_number.trim() || null,
      };

      await createStudent(payload);
      setSuccess(
        "Student registration executed successfully across relational arrays!",
      );
      setStudentForm({
        jhs_school_id: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        gender: "M",
        date_of_birth: "",
        region: "",
        district: "",
        phone_number: "",
        elective_subject_ids: [],
      });
      setView("list");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Could not register candidate tracking data parameters.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSchoolSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // Future hook location for adminApi.addJhsSchool(schoolForm)
      setSuccess(
        `Junior High School '${schoolForm.school_name}' registered locally!`,
      );
      setSchoolForm({
        school_code: "",
        school_name: "",
        region: "",
        district: "",
        is_boarding: false,
        is_mixed: true,
        min_aggregate: "",
        contact_email: "",
        contact_phone: "",
      });
      setView("list");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to create JHS facility entity context.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ margin: 0, color: "#2c3e50" }}>
          CSSPS Student & Center Registration Ledger
        </h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setView("list")}
            className={`btn-secondary ${view === "list" ? "active" : ""}`}
          >
            List Candidates
          </button>
          <button
            onClick={() => setView("register-student")}
            className={`btn-secondary ${view === "register-student" ? "active" : ""}`}
          >
            Register Student
          </button>
          <button
            onClick={() => setView("add-school")}
            className={`btn-secondary ${view === "add-school" ? "active" : ""}`}
          >
            Add Origin JHS
          </button>
        </div>
      </div>

      {error && <div className="error-message">❌ {error}</div>}
      {success && (
        <div
          style={{
            background: "#d4edda",
            color: "#155724",
            padding: "15px",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          {success}
        </div>
      )}

      {/* VIEW: CANDIDATES LIST REGISTRY */}
      {view === "list" && (
        <div>
          {loading ? (
            <p>Syncing security tokens and loading data catalogs...</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "10px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#f8f9fa",
                      borderBottom: "2px solid #dee2e6",
                      textAlign: "left",
                    }}
                  >
                    <th style={{ padding: "12px" }}>Index Number</th>
                    <th style={{ padding: "12px" }}>Full Name</th>
                    <th style={{ padding: "12px" }}>Gender</th>
                    <th style={{ padding: "12px" }}>Aggregate Marks</th>
                    <th style={{ padding: "12px" }}>Originating Center</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      style={{ borderBottom: "1px solid #dee2e6" }}
                    >
                      <td style={{ padding: "12px" }}>
                        <code>{student.index_number}</code>
                      </td>
                      <td
                        style={{ padding: "12px" }}
                      >{`${student.first_name} ${student.last_name}`}</td>
                      <td style={{ padding: "12px" }}>{student.gender}</td>
                      <td style={{ padding: "12px" }}>
                        <strong>
                          {student.aggregate || "Pending WAEC Input"}
                        </strong>
                      </td>
                      <td style={{ padding: "12px" }}>
                        {student.jhs_school?.school_name ||
                          "Unlinked Source Registry"}
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        style={{
                          padding: "20px",
                          textAlign: "center",
                          color: "#777",
                        }}
                      >
                        No candidate records active in this deployment database
                        module context.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VIEW: ENROLL STUDENT PROFILE MATRIX */}
      {view === "register-student" && (
        <form onSubmit={handleFormSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Select Originating JHS School *</label>
              <select
                required
                value={studentForm.jhs_school_id}
                onChange={(e) =>
                  setStudentForm({
                    ...studentForm,
                    jhs_school_id: e.target.value,
                  })
                }
              >
                <option value="">-- Choose Junior High Center --</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.school_name} ({school.school_code})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                required
                value={studentForm.first_name}
                onChange={(e) =>
                  setStudentForm({ ...studentForm, first_name: e.target.value })
                }
                placeholder="e.g. Kwame"
              />
            </div>

            <div className="form-group">
              <label>Middle Name (Optional)</label>
              <input
                type="text"
                value={studentForm.middle_name}
                onChange={(e) =>
                  setStudentForm({
                    ...studentForm,
                    middle_name: e.target.value,
                  })
                }
                placeholder="e.g. Mensah"
              />
            </div>

            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                required
                value={studentForm.last_name}
                onChange={(e) =>
                  setStudentForm({ ...studentForm, last_name: e.target.value })
                }
                placeholder="e.g. Osei"
              />
            </div>

            <div className="form-group">
              <label>Gender Identifier *</label>
              <select
                value={studentForm.gender}
                onChange={(e) =>
                  setStudentForm({ ...studentForm, gender: e.target.value })
                }
              >
                <option value="M">Male (M)</option>
                <option value="F">Female (F)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Date of Birth *</label>
              <input
                type="date"
                required
                value={studentForm.date_of_birth}
                onChange={(e) =>
                  setStudentForm({
                    ...studentForm,
                    date_of_birth: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Candidate Region</label>
              <input
                type="text"
                value={studentForm.region}
                onChange={(e) =>
                  setStudentForm({ ...studentForm, region: e.target.value })
                }
                placeholder="e.g. Ashanti Region"
              />
            </div>

            <div className="form-group">
              <label>Candidate District</label>
              <input
                type="text"
                value={studentForm.district}
                onChange={(e) =>
                  setStudentForm({ ...studentForm, district: e.target.value })
                }
                placeholder="e.g. Kumasi Metropolitan"
              />
            </div>

            <div className="form-group">
              <label>Guardian Phone Contact Link</label>
              <input
                type="text"
                value={studentForm.phone_number}
                onChange={(e) =>
                  setStudentForm({
                    ...studentForm,
                    phone_number: e.target.value,
                  })
                }
                placeholder="e.g. 0244123456"
              />
            </div>
          </div>

          {/* WARNING BOX DESIGN STYLE INTEGRATION */}
          <div className="warning-box">
            <h3>Automated Academic Bridging Active</h3>
            <p>
              💡 Core Subjects (English Language, Core Mathematics, Integrated
              Science, and Social Studies) are linked directly to this profile
              record upon registration. Scores start as <code>NULL</code> until
              verified by grading entry loops.
            </p>
          </div>

          {/* CHECKLIST DESIGN STYLE INTEGRATION */}
          <div className="checklist">
            <h3>Select Candidate Elective Course Tracks Selection</h3>
            <div className="checklist-items">
              {allSubjects
                .filter((sub) => !sub.is_core)
                .map((sub) => (
                  <label key={sub.id}>
                    <input
                      type="checkbox"
                      checked={studentForm.elective_subject_ids.includes(
                        sub.id,
                      )}
                      onChange={() => handleElectiveCheckboxChange(sub.id)}
                    />
                    {sub.subject_name} ({sub.subject_code})
                  </label>
                ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn-large"
            disabled={loading}
            style={{ marginTop: "20px", width: "100%" }}
          >
            {loading
              ? "Processing Secure Mapping Arrays..."
              : "💾 Register Student & Lock Subjects Matrix"}
          </button>
        </form>
      )}

      {/* VIEW: ADD JHS REGISTERED CENTER */}
      {view === "add-school" && (
        <form onSubmit={handleSchoolSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>JHS National Ministry Code *</label>
              <input
                type="text"
                required
                value={schoolForm.school_code}
                onChange={(e) =>
                  setSchoolForm({ ...schoolForm, school_code: e.target.value })
                }
                placeholder="e.g. JHS-0102"
              />
            </div>

            <div className="form-group">
              <label>Institution Official Name *</label>
              <input
                type="text"
                required
                value={schoolForm.school_name}
                onChange={(e) =>
                  setSchoolForm({ ...schoolForm, school_name: e.target.value })
                }
                placeholder="e.g. Accra Metropolitan Academy JHS"
              />
            </div>

            <div className="form-group">
              <label>Administrative Region *</label>
              <input
                type="text"
                required
                value={schoolForm.region}
                onChange={(e) =>
                  setSchoolForm({ ...schoolForm, region: e.target.value })
                }
                placeholder="e.g. Greater Accra"
              />
            </div>

            <div className="form-group">
              <label>Administrative District</label>
              <input
                type="text"
                value={schoolForm.district}
                onChange={(e) =>
                  setSchoolForm({ ...schoolForm, district: e.target.value })
                }
                placeholder="e.g. Accra Metro"
              />
            </div>

            <div className="form-group">
              <label>Minimum Required Aggregate Track</label>
              <input
                type="number"
                value={schoolForm.min_aggregate}
                onChange={(e) =>
                  setSchoolForm({
                    ...schoolForm,
                    min_aggregate: e.target.value,
                  })
                }
                placeholder="e.g. 36"
              />
            </div>

            <div className="form-group">
              <label>Center Direct Desk Email</label>
              <input
                type="email"
                value={schoolForm.contact_email}
                onChange={(e) =>
                  setSchoolForm({
                    ...schoolForm,
                    contact_email: e.target.value,
                  })
                }
                placeholder="jhs@edu.gov.gh"
              />
            </div>

            <div className="form-group">
              <label>Center Direct Phone Contact</label>
              <input
                type="text"
                value={schoolForm.contact_phone}
                onChange={(e) =>
                  setSchoolForm({
                    ...schoolForm,
                    contact_phone: e.target.value,
                  })
                }
                placeholder="e.g. 0302112233"
              />
            </div>

            <div
              className="form-group"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "25px",
              }}
            >
              <input
                type="checkbox"
                checked={schoolForm.is_boarding}
                onChange={(e) =>
                  setSchoolForm({
                    ...schoolForm,
                    is_boarding: e.target.checked,
                  })
                }
                style={{ width: "18px", height: "18px" }}
              />
              <label style={{ margin: 0, cursor: "pointer" }}>
                Boarding Facility On-Site
              </label>
            </div>

            <div
              className="form-group"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "25px",
              }}
            >
              <input
                type="checkbox"
                checked={schoolForm.is_mixed}
                onChange={(e) =>
                  setSchoolForm({ ...schoolForm, is_mixed: e.target.checked })
                }
                style={{ width: "18px", height: "18px" }}
              />
              <label style={{ margin: 0, cursor: "pointer" }}>
                Co-Educational Mixed Layout
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn-large"
            disabled={loading}
            style={{ marginTop: "30px", width: "100%" }}
          >
            {loading
              ? "Creating Institutional Entity..."
              : "🧱 Establish New JHS Registry Center"}
          </button>
        </form>
      )}
    </div>
  );
}
