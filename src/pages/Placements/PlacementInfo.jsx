import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AuthenticatedNavbar from "../../components/AuthenticatedNavbar";
import { getMyPlacement, getSchoolsChoices } from "../../services/api";
import { getErrorMessage } from "../../services/errorHandler";
import {
  generatePlacementSlipPDF,
  generateEnrolmentFormPDF,
} from "../../services/printUtils";
import s from "./PlacementInfo.module.css";
import { formatDateAndTime } from "../../services/main";

export default function PlacementInfo() {
  const { user } = useAuth();
  const [placement, setPlacement] = useState(null);
  const [choices, setChoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [printLoading, setPrintLoading] = useState(null);

  useEffect(() => {
    // 1. Guard against uninitialized auth profiles
    if (!user?.index_number) {
      return;
    }

    let isMounted = true;

    const loadDashboardData = async () => {
      setLoading(true);
      setError("");

      try {
        // Fetch both routes in parallel using the valid 200 URLs
        const [choicesResponse, placementResponse] = await Promise.all([
          getSchoolsChoices(),
          getMyPlacement(user.index_number),
        ]);

        if (!isMounted) return;

        // 2. Safely capture School Choices array payload
        if (choicesResponse?.data) {
          console.log("📋 Processing choices payload:", choicesResponse.data);
          setChoices(choicesResponse.data);
        }

        // 3. Safely map Placement object variants
        if (placementResponse?.data) {
          const rawData = placementResponse.data;
          console.log("📊 Processing placement payload:", rawData);

          const placementData =
            rawData && rawData.status == "PLACED" ? rawData : null;

          setPlacement(rawData);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("❌ Dashboard parser exception:", err);
        setError(getErrorMessage(err));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false; // Graceful teardown flag
    };
  }, [user?.index_number]); // Depend strictly on the candidate identifier mutation

  const handlePrintPlacementSlip = async () => {
    try {
      setPrintLoading("slip");
      const fullName = [user?.first_name, user?.middle_name, user?.last_name]
        .filter(Boolean)
        .join(" ");

      const printUser = { ...user, name: fullName };
      await generatePlacementSlipPDF(placement, printUser);
    } catch (err) {
      console.error("Failed to generate placement slip:", err);
      alert("Failed to generate placement slip. Please try again.");
    } finally {
      setPrintLoading(null);
    }
  };

  const handlePrintEnrolmentForm = async () => {
    try {
      setPrintLoading("enrolment");
      const fullName = [user?.first_name, user?.middle_name, user?.last_name]
        .filter(Boolean)
        .join(" ");

      console.log("Generating enrolment form for user:", {
        ...user,
        name: fullName,
      });
      const printUser = { ...user, name: fullName };
      await generateEnrolmentFormPDF(placement, printUser);
    } catch (err) {
      console.error("Failed to generate enrolment form:", err);
      alert("Failed to generate enrolment form. Please try again.");
    } finally {
      setPrintLoading(null);
    }
  };

  const GetSchoolGrade = (rank) => {
    if (!rank) return "—";
    const numRank = Number(rank);
    if (numRank === 1) return "A";
    if (numRank === 2) return "B";
    if (numRank === 3) return "C";
    if (numRank === 4) return "D";
    if (numRank === 5) return "E";
    if (numRank === 6) return "F";
    return "—";
  };

  return (
    <div className={s.page}>
      <AuthenticatedNavbar />

      <main className={s.main}>
        <div className={s.container}>
          <h1 className={s.pageTitle}>Placement Information</h1>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: "24px" }}>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ flexShrink: 0 }}
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {loading ? (
            <div className={s.loading}>
              <span className="spinner" style={{ width: 24, height: 24 }} />
              Loading placement information...
            </div>
          ) : (
            <>
              {/* Choices Table */}
              <div className={s.card}>
                <h2 className={s.sectionTitle}>Your School Choices</h2>
                <div className={s.tableWrapper}>
                  <table className={s.table}>
                    <thead>
                      <tr style={{ fontWeight: "bolder" }}>
                        <th>#</th>
                        <th>School Name</th>
                        <th>Programme</th>
                        <th>School Type</th>
                        <th>District</th>
                        <th>Region</th>
                        <th>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {choices && choices.length > 0 ? (
                        choices.map((choice, idx) => (
                          <tr key={choice.choice_id || idx}>
                            <td className={s.rowNumber}>{idx + 1}</td>
                            <td className={s.schoolName}>
                              {choice.school_name || "—"}
                            </td>
                            <td>
                              {choice.program_type || choice.programme || "—"}
                            </td>
                            <td>{choice.school_type || "—"}</td>
                            <td>{choice.district || "—"}</td>
                            <td>{choice.region || "—"}</td>
                            <td>{GetSchoolGrade(choice.rank)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className={s.noData}>
                            No school choices found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Placed School Section */}
              {placement && (
                <div className={s.card} style={{ marginTop: "24px" }}>
                  <div className={s.placedHeaderWrapper}>
                    <div className={s.placedIndicator}>✓</div>
                    <h2 className={s.sectionTitle}>Your Placement</h2>
                  </div>

                  <div className={s.placedGrid}>
                    <div className={s.placedField}>
                      <label className={s.fieldLabel}>Candidate Name</label>
                      <p className={s.fieldValue}>
                        {user?.first_name && user?.last_name
                          ? `${user.first_name} ${user.middle_name || ""} ${user.last_name}`.trim()
                          : "—"}
                      </p>
                    </div>

                    <div className={s.placedField}>
                      <label className={s.fieldLabel}>Index Number</label>
                      <p className={s.fieldValue}>
                        {user?.index_number || "—"}
                      </p>
                    </div>

                    <div className={s.placedField}>
                      <label className={s.fieldLabel}>SHS Placed</label>
                      <p className={s.fieldValue}>
                        {placement.school_name || "—"}
                      </p>
                    </div>

                    <div className={s.placedField}>
                      <label className={s.fieldLabel}>Programme</label>
                      <p className={s.fieldValue}>{placement.program || "—"}</p>
                    </div>

                    <div className={s.placedField}>
                      <label className={s.fieldLabel}>Residency</label>
                      <p className={s.fieldValue}>
                        {placement.school_residency ||
                          placement.boarding_status ||
                          "—"}
                      </p>
                    </div>

                    <div className={s.placedField}>
                      <label className={s.fieldLabel}>SHS District</label>
                      <p className={s.fieldValue}>
                        {placement.school_district || "—"}
                      </p>
                    </div>

                    <div className={s.placedField}>
                      <label className={s.fieldLabel}>SHS Region</label>
                      <p className={s.fieldValue}>
                        {placement.school_region || "—"}
                      </p>
                    </div>

                    {placement.placement_date && (
                      <div className={s.placedField}>
                        <label className={s.fieldLabel}>Placement Date</label>
                        <p className={s.fieldValue}>
                          {formatDateAndTime(
                            new Date(
                              placement.placement_date,
                            ).toLocaleDateString(),
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Print Actions */}
                  <div className={s.printActions}>
                    <button
                      onClick={handlePrintPlacementSlip}
                      disabled={printLoading === "slip"}
                      className="btn-primary"
                    >
                      {printLoading === "slip"
                        ? "Generating..."
                        : "🖨️ Print Placement Slip"}
                    </button>

                    <button
                      onClick={handlePrintEnrolmentForm}
                      disabled={printLoading === "enrolment"}
                      className="btn-primary"
                    >
                      {printLoading === "enrolment"
                        ? "Generating..."
                        : "📝 Print Enrolment Form"}
                    </button>
                  </div>
                </div>
              )}

              {!placement && !loading && (
                <div className="alert alert-info" style={{ marginTop: "24px" }}>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{ flexShrink: 0 }}
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  Your placement information is not yet available. Please check
                  back later or contact the helpline.
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
