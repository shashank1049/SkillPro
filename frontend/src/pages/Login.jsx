import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const identifier = formData.identifier.trim();

    if (!identifier) {
      setError("Please enter your email or username.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      // Check whether user entered email or username
      const isEmail = identifier.includes("@");

      const loginData = {
        password: formData.password,
        ...(isEmail
          ? {
              email: identifier.toLowerCase(),
            }
          : {
              username: identifier.toLowerCase(),
            }),
      };

      console.log("Login Data:", loginData);

      const response = await api.post(
        "/auth/login",
        loginData
      );

      console.log(
        "Login Response:",
        response.data
      );

      // ========================================
      // SAVE LOGIN DATA
      // ========================================

      const data = response.data?.data;

      if (data?.accessToken) {
        localStorage.setItem(
          "accessToken",
          data.accessToken
        );
      }

      if (data?.refreshToken) {
        localStorage.setItem(
          "refreshToken",
          data.refreshToken
        );
      }

      if (data?.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      // ========================================
      // REDIRECT
      // ========================================

      navigate("/");

      // Refresh so Navbar immediately detects user
      window.location.reload();

    } catch (error) {
      console.error(
        "Login Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Login failed. Please check your email/username and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-12 transition-colors duration-300">

      <div className="mx-auto max-w-md">

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-lg">

          {/* =====================================
              HEADING
          ====================================== */}

          <h1 className="text-center text-3xl font-bold text-[var(--text-primary)]">
            Welcome Back
          </h1>

          <p className="mt-2 text-center text-[var(--text-secondary)]">
            Login to continue using HirePro
          </p>

          {/* =====================================
              ERROR
          ====================================== */}

          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30">
              {error}
            </div>
          )}

          {/* =====================================
              FORM
          ====================================== */}

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            {/* EMAIL / USERNAME */}

            <div>

              <label className="mb-2 block font-medium text-[var(--text-primary)]">
                Email or Username
              </label>

              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="Enter email or username"
                required
                autoComplete="username"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
              />

            </div>

            {/* PASSWORD */}

            <div>

              <label className="mb-2 block font-medium text-[var(--text-primary)]">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
              />

            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[var(--primary)] py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

          </form>

          {/* =====================================
              REGISTER
          ====================================== */}

          <p className="mt-6 text-center text-[var(--text-secondary)]">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="font-semibold text-[var(--primary)] transition hover:text-[var(--primary-hover)]"
            >
              Register
            </Link>

          </p>

        </div>

      </div>

    </main>
  );
}

export default Login;