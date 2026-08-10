import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    city: "",

    role: "customer",

    // Professional fields
    profession: "",
    bio: "",
    experience: "",
    skills: "",
    pricing: "",
    serviceAreas: "",

    avatar: null,
    portfolioImages: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "portfolioImages") {
      const selectedFiles = Array.from(files || []);

      if (selectedFiles.length > 5) {
        setError(
          "You can upload maximum 5 portfolio images."
        );

        setFormData((prev) => ({
          ...prev,
          portfolioImages: selectedFiles.slice(0, 5),
        }));

        return;
      }

      setError("");

      setFormData((prev) => ({
        ...prev,
        portfolioImages: selectedFiles,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // ==========================================
  // REGISTER
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // ========================================
    // BASIC VALIDATION
    // ========================================

    if (
      !formData.fullName.trim() ||
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.password
    ) {
      setError(
        "Please fill all required fields."
      );
      return;
    }

    // ========================================
    // AVATAR
    // ========================================

    if (!formData.avatar) {
      setError(
        "Please select a profile picture."
      );
      return;
    }

    // ========================================
    // PASSWORD
    // ========================================

    if (formData.password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    // ========================================
    // PROFESSIONAL VALIDATION
    // ========================================

    if (
      formData.role === "professional"
    ) {
      if (!formData.profession.trim()) {
        setError(
          "Profession is required for professionals."
        );
        return;
      }

      if (
        formData.pricing === "" ||
        Number(formData.pricing) < 0
      ) {
        setError(
          "Valid pricing is required for professionals."
        );
        return;
      }
    }

    try {
      setLoading(true);

      // ========================================
      // CREATE FORM DATA
      // ========================================

      const userData = new FormData();

      // ========================================
      // BASIC USER DATA
      // ========================================

      userData.append(
        "fullName",
        formData.fullName.trim()
      );

      userData.append(
        "username",
        formData.username.trim()
      );

      userData.append(
        "email",
        formData.email.trim()
      );

      userData.append(
        "password",
        formData.password
      );

      userData.append(
        "phone",
        formData.phone.trim()
      );

      userData.append(
        "city",
        formData.city.trim()
      );

      userData.append(
        "role",
        formData.role
      );

      // ========================================
      // AVATAR
      // ========================================

      userData.append(
        "avatar",
        formData.avatar
      );

      // ========================================
      // PROFESSIONAL DATA
      // ========================================

      if (
        formData.role === "professional"
      ) {
        userData.append(
          "profession",
          formData.profession.trim()
        );

        userData.append(
          "bio",
          formData.bio.trim()
        );

        userData.append(
          "experience",
          formData.experience || "0"
        );

        userData.append(
          "skills",
          formData.skills.trim()
        );

        userData.append(
          "pricing",
          formData.pricing
        );

        userData.append(
          "serviceAreas",
          formData.serviceAreas.trim()
        );

        // Portfolio images
        formData.portfolioImages.forEach(
          (file) => {
            userData.append(
              "portfolioImages",
              file
            );
          }
        );
      }

      // ========================================
      // DEBUG
      // ========================================

      console.log(
        "Registering user..."
      );

      console.log(
        "Role:",
        formData.role
      );

      if (
        formData.role === "professional"
      ) {
        console.log(
          "Professional details:",
          {
            profession:
              formData.profession,
            bio: formData.bio,
            experience:
              formData.experience,
            skills:
              formData.skills,
            pricing:
              formData.pricing,
            serviceAreas:
              formData.serviceAreas,
            portfolioImages:
              formData.portfolioImages.length,
          }
        );
      }

      // ========================================
      // SINGLE REGISTER REQUEST
      // ========================================

      const response = await api.post(
        "/auth/register",
        userData
      );

      console.log(
        "Register Response:",
        response.data
      );

      // ========================================
      // SUCCESS
      // ========================================

      if (
        formData.role === "professional"
      ) {
        alert(
          "Professional account created successfully! Please login."
        );
      } else {
        alert(
          "Registration successful! Please login."
        );
      }

      navigate("/login");

    } catch (error) {
      console.error(
        "Registration Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-12 transition-colors duration-300">

      <div className="mx-auto max-w-3xl">

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-lg">

          {/* =====================================
              HEADER
          ====================================== */}

          <div className="mb-8 text-center">

            <h1 className="text-3xl font-bold text-[var(--text-primary)]">
              Create Your Account
            </h1>

            <p className="mt-2 text-[var(--text-secondary)]">
              Join HirePro and get started.
            </p>

          </div>


          {/* =====================================
              ERROR
          ====================================== */}

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30">
              {error}
            </div>
          )}


          {/* =====================================
              FORM
          ====================================== */}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* =====================================
                BASIC INFORMATION
            ====================================== */}

            <div>

              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Tell us a little about yourself.
              </p>

            </div>


            {/* FULL NAME */}

            <div>

              <label className="mb-2 block font-medium text-[var(--text-primary)]">
                Full Name *
              </label>

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
              />

            </div>


            {/* USERNAME + EMAIL */}

            <div className="grid gap-5 md:grid-cols-2">

              <div>

                <label className="mb-2 block font-medium text-[var(--text-primary)]">
                  Username *
                </label>

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  required
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                />

              </div>


              <div>

                <label className="mb-2 block font-medium text-[var(--text-primary)]">
                  Email *
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                />

              </div>

            </div>


            {/* PASSWORD + CONFIRM PASSWORD */}

            <div className="grid gap-5 md:grid-cols-2">

              <div>

                <label className="mb-2 block font-medium text-[var(--text-primary)]">
                  Password *
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  required
                  minLength={8}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                />

              </div>


              <div>

                <label className="mb-2 block font-medium text-[var(--text-primary)]">
                  Confirm Password *
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  required
                  minLength={8}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                />

              </div>

            </div>


            {/* PHONE */}

            <div>

              <label className="mb-2 block font-medium text-[var(--text-primary)]">
                Phone
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
              />

            </div>


            {/* CITY */}

            <div>

              <label className="mb-2 block font-medium text-[var(--text-primary)]">
                City
              </label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Noida"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
              />

            </div>


            {/* AVATAR */}

            <div>

              <label className="mb-2 block font-medium text-[var(--text-primary)]">
                Profile Picture *
              </label>

              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-[var(--text-primary)] file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--primary-light)] file:px-4 file:py-2 file:font-medium file:text-[var(--primary)]"
              />

            </div>


            {/* =====================================
                ROLE
            ====================================== */}

            <div className="border-t border-[var(--border)] pt-6">

              <label className="mb-3 block font-medium text-[var(--text-primary)]">
                Register As *
              </label>

              <div className="grid gap-4 md:grid-cols-2">

                {/* CUSTOMER */}

                <label
                  className={`cursor-pointer rounded-xl border p-5 transition ${
                    formData.role === "customer"
                      ? "border-[var(--primary)] bg-[var(--primary-light)]"
                      : "border-[var(--border)] hover:border-[var(--primary)]"
                  }`}
                >

                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    checked={
                      formData.role ===
                      "customer"
                    }
                    onChange={handleChange}
                    className="mr-2 accent-[var(--primary)]"
                  />

                  <span className="font-semibold text-[var(--text-primary)]">
                    Customer
                  </span>

                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    Find and hire trusted professionals.
                  </p>

                </label>


                {/* PROFESSIONAL */}

                <label
                  className={`cursor-pointer rounded-xl border p-5 transition ${
                    formData.role === "professional"
                      ? "border-[var(--primary)] bg-[var(--primary-light)]"
                      : "border-[var(--border)] hover:border-[var(--primary)]"
                  }`}
                >

                  <input
                    type="radio"
                    name="role"
                    value="professional"
                    checked={
                      formData.role ===
                      "professional"
                    }
                    onChange={handleChange}
                    className="mr-2 accent-[var(--primary)]"
                  />

                  <span className="font-semibold text-[var(--text-primary)]">
                    Professional
                  </span>

                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    Offer your skills and get hired.
                  </p>

                </label>

              </div>

            </div>


            {/* =====================================
                PROFESSIONAL INFORMATION
            ====================================== */}

            {formData.role === "professional" && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--primary-light)] p-6">

                <div className="mb-6">

                  <h2 className="text-xl font-bold text-[var(--text-primary)]">
                    Professional Information
                  </h2>

                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    Add information about the services you provide.
                  </p>

                </div>


                {/* PROFESSION */}

                <div>

                  <label className="mb-2 block font-medium text-[var(--text-primary)]">
                    Profession *
                  </label>

                  <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    placeholder="e.g. Driver, Plumber, Web Developer"
                    required={
                      formData.role ===
                      "professional"
                    }
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                  />

                </div>


                {/* BIO */}

                <div className="mt-5">

                  <label className="mb-2 block font-medium text-[var(--text-primary)]">
                    Professional Bio
                  </label>

                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell customers about your experience and services..."
                    rows="4"
                    className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                  />

                </div>


                {/* EXPERIENCE + PRICING */}

                <div className="mt-5 grid gap-5 md:grid-cols-2">

                  <div>

                    <label className="mb-2 block font-medium text-[var(--text-primary)]">
                      Experience (Years)
                    </label>

                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      min="0"
                      placeholder="e.g. 5"
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                    />

                  </div>


                  <div>

                    <label className="mb-2 block font-medium text-[var(--text-primary)]">
                      Pricing *
                    </label>

                    <input
                      type="number"
                      name="pricing"
                      value={formData.pricing}
                      onChange={handleChange}
                      min="0"
                      placeholder="e.g. 500"
                      required={
                        formData.role ===
                        "professional"
                      }
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                    />

                  </div>

                </div>


                {/* SKILLS */}

                <div className="mt-5">

                  <label className="mb-2 block font-medium text-[var(--text-primary)]">
                    Skills
                  </label>

                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="e.g. React, Node.js, MongoDB"
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                  />

                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    Separate multiple skills with commas.
                  </p>

                </div>


                {/* SERVICE AREAS */}

                <div className="mt-5">

                  <label className="mb-2 block font-medium text-[var(--text-primary)]">
                    Service Areas
                  </label>

                  <input
                    type="text"
                    name="serviceAreas"
                    value={formData.serviceAreas}
                    onChange={handleChange}
                    placeholder="e.g. Noida, Delhi, Gurugram"
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                  />

                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    Separate multiple areas with commas.
                  </p>

                </div>


                {/* PORTFOLIO */}

                <div className="mt-5">

                  <label className="mb-2 block font-medium text-[var(--text-primary)]">
                    Portfolio Images
                  </label>

                  <input
                    type="file"
                    name="portfolioImages"
                    accept="image/*"
                    multiple
                    onChange={handleChange}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-[var(--text-primary)] file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--primary-light)] file:px-4 file:py-2 file:font-medium file:text-[var(--primary)]"
                  />

                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    You can upload up to 5 images.
                  </p>

                  {formData.portfolioImages.length >
                    0 && (
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">
                      {
                        formData
                          .portfolioImages
                          .length
                      }{" "}
                      image
                      {formData.portfolioImages
                        .length > 1
                        ? "s"
                        : ""}{" "}
                      selected
                    </p>
                  )}

                </div>

              </div>
            )}


            {/* =====================================
                SUBMIT
            ====================================== */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[var(--primary)] py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating Account..."
                : formData.role === "professional"
                ? "Create Professional Account"
                : "Create Account"}
            </button>

          </form>


          {/* LOGIN */}

          <p className="mt-6 text-center text-[var(--text-secondary)]">

            Already have an account?{" "}

            <Link
              to="/login"
              className="font-semibold text-[var(--primary)] transition hover:text-[var(--primary-hover)]"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </main>
  );
}

export default Register;