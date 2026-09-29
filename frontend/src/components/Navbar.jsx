import { Link, useLocation } from "react-router";
import { useNavigate } from "react-router";
import { LogOutIcon } from "lucide-react";
import { useAuth } from "../auth/useAuth";
import toast from "react-hot-toast";
import { useState } from "react";
import "../styles/components.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const initials = user?.name?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "U";

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      toast.error("Unable to sign out. Please try again.");
    }
  };

  return (
    <nav className="app-navbar">
      <div className="app-navbar__inner">
        <Link to="/" className="brand-link">
          <span className="brand-link__name">Interview Craft</span>
        </Link>

        <div className="app-navbar__links">
          <Link
            to="/problems"
            className={`app-navbar__link ${
              isActive("/problems")
                ? "app-navbar__link--active"
                : "app-navbar__link--inactive"
            }`}
          >
            <span className="app-navbar__link-label">Problems</span>
          </Link>

          <Link
            to="/dashboard"
            className={`app-navbar__link ${
              isActive("/dashboard")
                ? "app-navbar__link--active"
                : "app-navbar__link--inactive"
            }`}
          >
            <span className="app-navbar__link-label">Dashboard</span>
          </Link>

          <div className="app-navbar__user">
            <button
              className="app-navbar__avatar"
              type="button"
              aria-label="Open account menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {user?.profileImage ? <img src={user.profileImage} alt="" /> : initials}
            </button>
            {isMenuOpen && (
              <div className="app-navbar__menu">
                <div className="app-navbar__identity">
                  <strong>{user?.name}</strong>
                  <span>{user?.email}</span>
                </div>
                <button className="app-navbar__logout" type="button" onClick={handleLogout}>
                  <LogOutIcon aria-hidden="true" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;