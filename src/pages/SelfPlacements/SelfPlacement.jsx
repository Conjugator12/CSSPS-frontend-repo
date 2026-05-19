import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSelfPlacementStatus,
  searchSchools,
  getProgrammes,
  submitSelfPlacement,
} from "../../services/api";
import s from "./SelfPlacement.module.css";

/* Temporary minimal auth nav — swap with Dev 2's AuthNavbar after merge */
function TempAuthNav() {
  const navigate = useNavigate();
  return (
    <nav className={s.authNav}>
      <div className={s.navInner}>
        <button className={s.navLink} onClick={() => navigate("/hub")}>
          Dashboard
        </button>
        <button
          className={s.navLink}
          onClick={() => navigate("/hub/placement")}
        >
          Placement Information
        </button>
        <button className={`${s.navLink} ${s.navLinkActive}`}>
          Self Placement
        </button>
      </div>
    </nav>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function SelfPlacement() {
  const navigate = useNavigate();

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [programmes, setProgrammes] = useState([]);
  const [selectedProg, setSelectedProg] = useState("");
  const [residency, setResidency] = useState("Day");
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    // 1. Fetch module eligibility window

    getSelfPlacementStatus()
      .then(({ data }) => {
        // Force incoming text to lowercase to seamlessly match "eligible" / "placed" UI conditions
        setStatus(data.status ? data.status.toLowerCase() : "ineligible");
      })
      .catch(() => setError("Failed to load self-placement status."))
      .finally(() => setLoading(false));

    // 2. Fetch distinct academic programs
    getProgrammes()
      .then((response) => {
        // Unpack data layers gracefully
        const rawData = response.data;
        const arrayTarget = Array.isArray(rawData)
          ? rawData
          : rawData?.programmes || rawData?.data || [];

        console.log("📋 Found Programmes for Dropdown:", arrayTarget);
        setProgrammes(arrayTarget);
      })
      .catch((err) => console.error("Failed to parse programmes:", err));
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setSchools([]);
      return;
    }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const { data } = await searchSchools(query, selectedProg);
        setSchools(data.schools || []);
      } catch {
        setSchools([]);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [query, selectedProg]);

  const handleSubmit = async () => {
    if (!selectedSchool || !selectedProg) return;
    setSubmitting(true);
    try {
      await submitSelfPlacement({
        school_id: selectedSchool.id,
        programme_code: selectedProg,
        residency,
      });
      setSubmitSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Submission failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const selectSchool = (school) => {
    setSelectedSchool(school);
    setQuery(school.name);
    setSchools([]);
  };

  return (
    <div className={s.page}>
      <TempAuthNav />

      <main className={s.main}>
        <div className="card">
          <h1 className={s.pageTitle}>Self Placement</h1>
          <p className={s.pageSub}>
            For candidates who are not placed after auto placement
          </p>

          {/* Loading */}
          {loading && (
            <div className={s.stateCenter}>
              <div className="spinner" style={{ width: 28, height: 28 }} />
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="alert alert-error">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ flexShrink: 0, marginTop: 1 }}
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {/* Already placed */}
          {!loading && status === "placed" && (
            <div className={s.stateCenter}>
              <p>You have already been placed in a school.</p>
              <button
                className="btn-gold"
                onClick={() => navigate("/hub/placement")}
              >
                <ArrowRightIcon /> View Placement Information
              </button>
            </div>
          )}

          {/* Ineligible */}
          {!loading && status === "ineligible" && (
            <div className="alert alert-warn">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ flexShrink: 0, marginTop: 1 }}
                aria-hidden="true"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Self placement is not currently available. Please contact GES for
              assistance.
            </div>
          )}

          {/* Self-placement form */}
          {!loading && status === "eligible" && !submitSuccess && (
            <div className={s.form}>
              {/* Programme */}
              <div className={s.field}>
                <label className={s.label} htmlFor="programme">
                  Programme
                </label>
                <select
                  id="programme"
                  value={selectedProg}
                  onChange={(e) => {
                    setSelectedProg(e.target.value);
                    setSelectedSchool(null);
                    setQuery("");
                  }}
                  className="input-field"
                >
                  <option value="">All Programmes</option>
                  {programmes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* School search */}
              <div className={s.field}>
                <label className={s.label} htmlFor="school-search">
                  Search School
                </label>
                <div className={s.searchWrap}>
                  <input
                    id="school-search"
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSelectedSchool(null);
                    }}
                    placeholder="Type school name…"
                    className="input-field"
                    style={{ paddingRight: 36 }}
                  />
                  <span className={s.searchIcon}>
                    {searching ? (
                      <span
                        className="spinner"
                        style={{ width: 14, height: 14 }}
                      />
                    ) : (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        aria-hidden="true"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    )}
                  </span>
                </div>

                {schools.length > 0 && !selectedSchool && (
                  <div className={s.dropdown}>
                    {schools.map((sc) => (
                      <button
                        key={sc.id}
                        type="button"
                        className={s.dropdownItem}
                        onClick={() => selectSchool(sc)}
                      >
                        <strong>{sc.name}</strong>
                        <span className={s.schoolMeta}>
                          {sc.district}, {sc.region}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Residency */}
              <div className={s.field}>
                <label className={s.label}>Residency</label>
                <div className={s.residencyRow}>
                  {["Day", "Boarding"].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setResidency(r)}
                      className={`${s.residencyBtn} ${residency === r ? s.residencyBtnActive : ""}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected school banner */}
              {selectedSchool && (
                <div className={s.confirmBanner}>
                  <p>Selected: {selectedSchool.name}</p>
                  <span>
                    {selectedSchool.district} · {selectedSchool.region}
                  </span>
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={submitting || !selectedSchool || !selectedProg}
                className={`btn-primary ${s.submitBtn}`}
              >
                {submitting && (
                  <span
                    className="spinner"
                    style={{
                      width: 14,
                      height: 14,
                      borderTopColor: "#fff",
                      borderColor: "rgba(255,255,255,0.3)",
                    }}
                  />
                )}
                {submitting ? "Submitting…" : "Submit Self Placement"}
              </button>
            </div>
          )}

          {/* Success */}
          {submitSuccess && (
            <div className={s.stateCenter}>
              <svg
                className={s.successIcon}
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <p>Placement Submitted!</p>
              <p className="note">
                Your self-placement request has been received. You will be
                notified once it is processed.
              </p>
              <button className="btn-gold" onClick={() => navigate("/hub")}>
                <ArrowRightIcon /> Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </main>

      <p className={s.footnote}>© 2026 – Powered by COLDSIS</p>
    </div>
  );
}
