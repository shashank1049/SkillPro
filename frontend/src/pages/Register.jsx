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
      setFormData((prev) => ({
        ...prev,
        portfolioImages: Array.from(files),
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

    // Basic validation
    if (
      !formData.fullName ||
      !formData.username ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (!formData.avatar) {
      setError("Please select a profile picture.");
      return;
    }

    // Professional validation
    if (formData.role === "professional") {
      if (
        !formData.profession ||
        !formData.pricing
      ) {
        setError(
          "Profession and pricing are required for professionals."
        );

        return;
      }
    }

    try {
      setLoading(true);

      // ========================================
      // STEP 1: CREATE USER
      // ========================================

      const userData = new FormData();

      userData.append(
        "fullName",
        formData.fullName
      );

      userData.append(
        "username",
        formData.username
      );

      userData.append(
        "email",
        formData.email
      );

      userData.append(
        "password",
        formData.password
      );

      userData.append(
        "phone",
        formData.phone
      );

      userData.append(
        "city",
        formData.city
      );

      userData.append(
        "role",
        formData.role
      );

      userData.append(
        "avatar",
        formData.avatar
      );

      console.log(
        "Registering user..."
      );

      const registerResponse =
        await api.post(
          "/auth/register",
          userData
        );

      console.log(
        "Register Response:",
        registerResponse.data
      );

      // ========================================
      // CUSTOMER
      // ========================================

      if (formData.role === "customer") {
        alert(
          "Registration successful! Please login."
        );

        navigate("/login");

        return;
      }

      // ========================================
      // PROFESSIONAL
      // ========================================

      const professionalData = {
        profession:
          formData.profession,

        bio:
          formData.bio,

        experience:
          Number(formData.experience) || 0,

        skills:
          formData.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),

        pricing:
          Number(formData.pricing),

        serviceAreas:
          formData.serviceAreas
            .split(",")
            .map((area) => area.trim())
            .filter(Boolean),
      };

      console.log(
        "Creating Professional Profile:",
        professionalData
      );

      const professionalResponse =
        await api.post(
          "/professional/create-profile",
          professionalData
        );

      console.log(
        "Professional Profile:",
        professionalResponse.data
      );

      alert(
        "Professional account created successfully!"
      );

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
    <main className="min-h-screen bg-slate-50 px-4 py-12">

      <div className="mx-auto max-w-3xl">

        <div className="rounded-2xl bg-white p-8 shadow-lg">

          {/* =====================================
              HEADER
          ====================================== */}

          <div className="mb-8 text-center">

            <h1 className="text-3xl font-bold text-slate-900">
              Create Your SkillPro Account
            </h1>

            <p className="mt-2 text-gray-500">
              Join SkillPro and get started.
            </p>

          </div>


          {/* =====================================
              ERROR
          ====================================== */}

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}


          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* =====================================
                BASIC INFORMATION
            ====================================== */}

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Tell us a little about yourself.
              </p>

            </div>


            {/* FULL NAME */}

            <div>

              <label className="mb-2 block font-medium text-gray-700">
                Full Name *
              </label>

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>


            {/* USERNAME + EMAIL */}

            <div className="grid gap-5 md:grid-cols-2">

              <div>

                <label className="mb-2 block font-medium text-gray-700">
                  Username *
                </label>

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>


              <div>

                <label className="mb-2 block font-medium text-gray-700">
                  Email *
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>

            </div>


            {/* PASSWORD + PHONE */}

            <div className="grid gap-5 md:grid-cols-2">

              <div>

                <label className="mb-2 block font-medium text-gray-700">
                  Password *
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>


              <div>

                <label className="mb-2 block font-medium text-gray-700">
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>

            </div>


            {/* CITY */}

            <div>

              <label className="mb-2 block font-medium text-gray-700">
                City
              </label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Noida"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>


            {/* AVATAR */}

            <div>

              <label className="mb-2 block font-medium text-gray-700">
                Profile Picture *
              </label>

              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 p-3"
              />

            </div>


            {/* =====================================
                ROLE
            ====================================== */}

            <div className="border-t pt-6">

              <label className="mb-3 block font-medium text-gray-700">
                Register As *
              </label>

              <div className="grid gap-4 md:grid-cols-2">

                {/* CUSTOMER */}

                <label
                  className={`cursor-pointer rounded-xl border p-5 transition ${
                    formData.role === "customer"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400"
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
                    className="mr-2"
                  />

                  <span className="font-semibold text-slate-900">
                    Customer
                  </span>

                  <p className="mt-2 text-sm text-gray-500">
                    Find and hire trusted professionals.
                  </p>

                </label>


                {/* PROFESSIONAL */}

                <label
                  className={`cursor-pointer rounded-xl border p-5 transition ${
                    formData.role === "professional"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400"
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
                    className="mr-2"
                  />

                  <span className="font-semibold text-slate-900">
                    Professional
                  </span>

                  <p className="mt-2 text-sm text-gray-500">
                    Offer your skills and get hired.
                  </p>

                </label>

              </div>

            </div>


            {/* =====================================
                PROFESSIONAL INFORMATION
            ====================================== */}

            {formData.role === "professional" && (
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6">

                <div className="mb-6">

                  <h2 className="text-xl font-bold text-slate-900">
                    Professional Information
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Add information about the services
                    you provide.
                  </p>

                </div>


                {/* PROFESSION */}

                <div>

                  <label className="mb-2 block font-medium text-gray-700">
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
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                  />

                </div>


                {/* BIO */}

                <div className="mt-5">

                  <label className="mb-2 block font-medium text-gray-700">
                    Professional Bio
                  </label>

                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell customers about your experience and services..."
                    rows="4"
                    className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                  />

                </div>


                {/* EXPERIENCE + PRICING */}

                <div className="mt-5 grid gap-5 md:grid-cols-2">

                  <div>

                    <label className="mb-2 block font-medium text-gray-700">
                      Experience (Years)
                    </label>

                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      min="0"
                      placeholder="e.g. 5"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                    />

                  </div>


                  <div>

                    <label className="mb-2 block font-medium text-gray-700">
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
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                    />

                  </div>

                </div>


                {/* SKILLS */}

                <div className="mt-5">

                  <label className="mb-2 block font-medium text-gray-700">
                    Skills
                  </label>

                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="e.g. SUV, Sedan, Luxury Cars"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    Separate multiple skills with commas.
                  </p>

                </div>


                {/* SERVICE AREAS */}

                <div className="mt-5">

                  <label className="mb-2 block font-medium text-gray-700">
                    Service Areas
                  </label>

                  <input
                    type="text"
                    name="serviceAreas"
                    value={formData.serviceAreas}
                    onChange={handleChange}
                    placeholder="e.g. Noida, Delhi, Gurugram"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    Separate multiple areas with commas.
                  </p>

                </div>


                {/* PORTFOLIO */}

                <div className="mt-5">

                  <label className="mb-2 block font-medium text-gray-700">
                    Portfolio Images
                  </label>

                  <input
                    type="file"
                    name="portfolioImages"
                    accept="image/*"
                    multiple
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white p-3"
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    Add images that showcase your work.
                  </p>

                </div>

              </div>
            )}


            {/* =====================================
                SUBMIT
            ====================================== */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating Account..."
                : formData.role === "professional"
                ? "Create Professional Account"
                : "Create Account"}
            </button>

          </form>


          {/* LOGIN */}

          <p className="mt-6 text-center text-gray-600">

            Already have an account?{" "}

            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:underline"
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