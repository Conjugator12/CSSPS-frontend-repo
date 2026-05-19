import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthenticatedNavbar from "../../components/AuthenticatedNavbar";
import { getStudentMe } from "../../services/api";
import { getErrorMessage } from "../../services/errorHandler";
import s from "./HubDashboard.module.css";
import { formatDate } from "../../services/main";

export default function HubDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(user || {});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Only fetch if we have user index_number
    if (!user?.index_number) {
      console.warn("⚠️ No user index_number in auth context");
      setLoading(false);
      return;
    }

    // Don't fetch if already loaded (prevents duplicate requests)
    if (profileData?.index_number) {
      console.log("✅ Profile already loaded, skipping fetch");
      setLoading(false);
      return;
    }

    let isMounted = true; // Prevent state updates if component unmounts

    const fetchProfile = async () => {
      try {
        console.log("🔄 Fetching student profile from API...");
        console.log("Token exists:", !!localStorage.getItem("cssps_token"));

        const { data } = await getStudentMe();
        console.log("✅ Profile response:", data);

        if (!isMounted) return; // Component unmounted, don't update state

        // Handle different response formats
        const studentData =
          data.student || data.data?.student || data.data || data;
        console.log("📊 Extracted student data:", studentData);

        setProfileData(studentData);
        setError("");
      } catch (err) {
        if (!isMounted) return; // Component unmounted, don't update state

        console.error("❌ Failed to fetch profile:", err);
        console.error("Error response:", err.response?.data);

        // Ignore rate limit errors silently on retry
        if (err.response?.status === 429) {
          console.warn("⚠️ Rate limited, will retry in 2 seconds");
          setTimeout(() => {
            if (isMounted) fetchProfile();
          }, 2000);
          return;
        }

        // Use cached user data as fallback
        console.log("📦 Using cached user data:", user);
        setProfileData(user || {});

        // Only show error if we have no fallback data
        if (!user) {
          const errorMessage = getErrorMessage(err);
          setError(errorMessage);
        } else {
          // Use cached data silently
          setError("");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Fetch profile
    fetchProfile();

    // Cleanup: set isMounted to false when component unmounts
    return () => {
      isMounted = false;
    };
  }, [user?.index_number]);

  const handleSignOut = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const getInitials = () => {
    // Build name from first_name and last_name
    let name = "";
    if (profileData?.first_name) name += profileData.first_name[0];
    if (profileData?.last_name) name += profileData.last_name[0];
    return name.toUpperCase() || "?";
  };

  const getFullName = () => {
    const parts = [];
    if (profileData?.first_name) parts.push(profileData.first_name);
    if (profileData?.middle_name) parts.push(profileData.middle_name);
    if (profileData?.last_name) parts.push(profileData.last_name);
    return parts.join(" ") || "Student";
  };

  return (
    <div className={s.page}>
      <AuthenticatedNavbar />

      <main className={s.main}>
        <div className={s.container}>
          {/* Welcome Card */}
          <div className={`${s.card} ${s.welcomeCard}`}>
            <div className={s.welcomeContent}>
              <div className={s.avatarLarge}>{getInitials()}</div>
              <div>
                <h1 className={s.welcomeTitle}>Welcome, {getFullName()}!</h1>
                <p className={s.welcomeText}>
                  Your placement information is ready. Review your details
                  below.
                </p>
              </div>
            </div>
            <button onClick={handleSignOut} className="btn-outline">
              Sign Out
            </button>
          </div>

          {/* Profile Card */}
          <div className={`${s.card} ${s.profileCard}`}>
            <h2 className={s.cardTitle}>Profile Information</h2>

            {error && (
              <div
                className="alert alert-error"
                style={{ marginBottom: "20px" }}
              >
                {error}
              </div>
            )}

            {loading ? (
              <div className={s.loading}>
                <span className="spinner" style={{ width: 20, height: 20 }} />
                Loading profile...
              </div>
            ) : (
              <div className={s.profileGrid}>
                <div className={s.profileField}>
                  <label className={s.fieldLabel}>Full Name</label>
                  <p className={s.fieldValue}>{getFullName() || "—"}</p>
                </div>

                <div className={s.profileField}>
                  <label className={s.fieldLabel}>Index Number</label>
                  <p className={s.fieldValue}>
                    {profileData?.index_number || "—"}
                  </p>
                </div>

                <div className={s.profileField}>
                  <label className={s.fieldLabel}>Date of Birth</label>
                  <p className={s.fieldValue}>
                    {formatDate(profileData?.date_of_birth) || "—"}
                  </p>
                </div>

                <div className={s.profileField}>
                  <label className={s.fieldLabel}>Region</label>
                  <p className={s.fieldValue}>{profileData?.region || "—"}</p>
                </div>

                <div className={s.profileField}>
                  <label className={s.fieldLabel}>District</label>
                  <p className={s.fieldValue}>{profileData?.district || "—"}</p>
                </div>

                {/* Academic Track Profile Summary Card Block */}
                <div className={s.card}>
                  <h2 className={s.cardTitle}>
                    📊 Registered Course Performance Track
                  </h2>
                  {profileData.scores &&
                  Object.keys(profileData.scores).length > 0 ? (
                    <div className={s.scoresGrid}>
                      {Object.entries(profileData.scores).map(
                        ([subject, score]) => (
                          <div key={subject} className={s.scoreItem}>
                            {/* Converts "core_mathematics" to capitalized text "Core Mathematics" */}
                            <span className={s.scoreLabel}>
                              {subject
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (c) => c.toUpperCase())}
                            </span>
                            <span
                              className={`${s.scoreValue} ${score === null ? s.scorePending : ""}`}
                            >
                              {score !== null
                                ? `${score} / 100`
                                : "Pending Mark Input"}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <p className={s.emptyText}>
                      No registered subject links established for this user
                      profile configuration.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className={s.quickActions}>
            <div className={s.actionCard}>
              <h3 className={s.actionTitle}>📋 View Placement</h3>
              <p className={s.actionDesc}>
                Check your placement details, school, and programme
              </p>
              <button
                onClick={() => navigate("/hub/placement")}
                className="btn-primary"
              >
                Go to Placement Info
              </button>
            </div>

            <div className={s.actionCard}>
              <h3 className={s.actionTitle}>🎓 Self Placement</h3>
              <p className={s.actionDesc}>
                Submit your school choices and preferences
              </p>
              <button
                onClick={() => navigate("/hub/self-placement")}
                className="btn-primary"
              >
                Go to Self Placement
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
