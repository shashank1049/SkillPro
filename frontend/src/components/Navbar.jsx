import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun, LogOut, User } from "lucide-react";
import api from "../api/axios";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("HirePro-theme");

    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Invalid user data");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;

    setDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem(
        "HirePro-theme",
        "dark"
      );
    } else {
      document.documentElement.classList.remove(
        "dark"
      );
      localStorage.setItem(
        "HirePro-theme",
        "light"
      );
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      setUser(null);
      setProfileOpen(false);

      navigate("/login");
    }
  };

  const getInitial = () => {
    if (!user?.fullName) return "U";

    return user.fullName
      .charAt(0)
      .toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)] transition-colors duration-300">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* LOGO */}

        <Link
              to="/"
              className="text-2xl font-bold text-[var(--text-primary)]"
            >
              Hire
              <span className="text-[var(--primary)]">
                Pro
              </span>
        </Link>

        {/* NAVIGATION */}

        <div className="hidden items-center gap-8 md:flex">

          <Link
            to="/"
            className="text-[var(--text-primary)] transition hover:text-[var(--primary)]"
          >
            Home
          </Link>

          <Link
            to="/services"
            className="text-[var(--text-primary)] transition hover:text-[var(--primary)]"
          >
            Services
          </Link>

          <Link
            to="/professional-dashboard"
            className="text-[var(--text-primary)] transition hover:text-[var(--primary)]"
          >
            Professionals
          </Link>

          <Link
            to="/my-bookings"
            className="text-[var(--text-primary)] transition hover:text-[var(--primary)]"
          >
            My Bookings
          </Link>

        </div>

        {/* RIGHT SIDE */}

        <div className="flex items-center gap-3">

          {/* THEME BUTTON */}

          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] transition hover:bg-[var(--surface-secondary)]"
            title={
              darkMode
                ? "Light Mode"
                : "Dark Mode"
            }
          >
            {darkMode ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>

          {!user ? (
            <>
              {/* LOGIN */}

              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-[var(--text-primary)] transition hover:bg-[var(--surface-secondary)]"
              >
                Login
              </Link>

              {/* REGISTER */}

              <Link
                to="/register"
                className="rounded-lg bg-[var(--primary)] px-5 py-2 text-white transition hover:bg-[var(--primary-hover)]"
              >
                Register
              </Link>
            </>
          ) : (

            <div className="relative">

              {/* PROFILE BUTTON */}

              <button
                type="button"
                onClick={() =>
                  setProfileOpen(!profileOpen)
                }
                className="flex items-center gap-2 rounded-full transition hover:opacity-80"
              >

                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={
                      user.fullName ||
                      "User"
                    }
                    className="h-10 w-10 rounded-full border-2 border-[var(--primary)] object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] font-bold text-white">
                    {getInitial()}
                  </div>
                )}

              </button>

              {/* PROFILE DROPDOWN */}

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-[var(--text-primary)] shadow-xl">

                  {/* USER INFO */}

                  <div className="mb-3 flex items-center gap-3 border-b border-[var(--border)] pb-3">

                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={
                          user.fullName ||
                          "User"
                        }
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)] font-bold text-white">
                        {getInitial()}
                      </div>
                    )}

                    <div className="min-w-0">

                      <p className="truncate font-semibold text-[var(--text-primary)]">
                        {user.fullName}
                      </p>

                      <p className="truncate text-sm text-[var(--text-secondary)]">
                        @{user.username}
                      </p>

                    </div>

                  </div>

                  {/* PROFILE */}

                  <Link
                    to="/profile"
                    onClick={() =>
                      setProfileOpen(false)
                    }
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-[var(--text-primary)] transition hover:bg-[var(--surface-secondary)]"
                  >
                    <User size={18} />
                    Profile
                  </Link>

                  {/* LOGOUT */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>

                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;