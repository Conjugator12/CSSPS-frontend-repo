import { use, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import csspsLogo from "../assets/cssps-logo.png";
import s from "./AuthenticatedNavbar.module.css";

function BellIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
}

export default function AuthenticatedNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  const isActive = (path) => location.pathname === path;

  const UserFullName = `${user.first_name} ${user.middle_name + " " || ""}${user.last_name}`;

  const getInitials = () => {
    if (!UserFullName) return "?";
    return UserFullName.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className={s.nav}>
      <div className={s.inner}>
        {/* Logo + Brand */}
        <button className={s.brand} onClick={() => navigate("/hub")}>
          <img src={csspsLogo} alt="CSSPS Logo" className={s.logo} />
          <span className={s.brandText}>CSSPS Portal</span>
        </button>

        {/* Navigation Links */}
        <div className={s.links}>
          <a
            className={`${s.navLink} ${isActive("/hub") ? s.active : ""}`}
            onClick={() => navigate("/hub")}
          >
            Dashboard
          </a>
          <a
            className={`${s.navLink} ${isActive("/hub/placement") ? s.active : ""}`}
            onClick={() => navigate("/hub/placement")}
          >
            Placement Information
          </a>
          <a
            className={`${s.navLink} ${isActive("/hub/self-placement") ? s.active : ""}`}
            onClick={() => navigate("/hub/self-placement")}
          >
            Self Placement
          </a>
        </div>

        {/* Right Actions */}
        <div className={s.actions}>
          {/* Notification Bell */}
          <button className={s.notificationBtn} aria-label="Notifications">
            <BellIcon />
            <span className={s.notificationDot}></span>
          </button>

          {/* Avatar Dropdown */}
          <div className={s.avatarDropdown}>
            <button
              className={s.avatarBtn}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="User menu"
            >
              <div className={s.avatar}>{getInitials()}</div>
              <ChevronDownIcon />
            </button>

            {dropdownOpen && (
              <div className={s.dropdownMenu}>
                <div className={s.dropdownHeader}>
                  <p className={s.userName}>{user?.name || "User"}</p>
                  <p className={s.userEmail}>{user?.index_number || ""}</p>
                </div>
                <hr className={s.divider} />
                <button className={s.dropdownItem} onClick={handleLogout}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
