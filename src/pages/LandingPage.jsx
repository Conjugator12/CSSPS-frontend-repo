import { useState, useEffect } from "react";
import HelplineBanner from "../components/HelplineBanner";
import PublicNavbar from "../components/PublicNavbar";
import PlacementModal from "../components/PlacementModal";
import Footer from "../components/Footer";
import s from "./LandingPage.module.css";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [showModal, setShowModal] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={s.page}>
      <HelplineBanner />
      <PublicNavbar onCheckPlacement={() => setShowModal(true)} />

      {/* ── Hero ───────────────────────────────────── */}
      <main className={s.hero}>
        <div className={s.dot1} aria-hidden="true" />
        <div className={s.dot2} aria-hidden="true" />

        <div className={s.heroInner}>
          {/* Headline + CTA */}
          <div className={s.heroLeft}>
            <h1 className={s.headline}>CSSPS</h1>
            <div className={s.goldBar} />
            <p className={s.tagline}>
              Smart, Fair &amp; Transparent SHS/TVET Placement
            </p>
            <Link
              to="/login"
              className="btn-primary"
              style={{ fontSize: 15, padding: "12px 32px" }}
              // onClick={() => setShowModal(true)}
            >
              Check Placement
            </Link>
          </div>

          {/* Trust card */}
          <div className={s.trustCard}>
            {[
              {
                title: "Trusted By Parents",
                body: "Parents Across The Country Rely On CSSPS For Accurate And Fair School Placements.",
              },
              {
                title: "Transparent Processes",
                body: "Our Placement System Follows Clear Criteria To Ensure Fairness For All.",
              },
            ].map((item) => (
              <div key={item.title} className={s.trustItem}>
                <svg
                  className={s.trustCheck}
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <p className={s.trustTitle}>{item.title}</p>
                <p className={s.trustBody}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      {showModal && <PlacementModal onClose={() => setShowModal(false)} />}

      {showScrollTop && (
        <button
          className={s.scrollTop}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}
    </div>
  );
}
