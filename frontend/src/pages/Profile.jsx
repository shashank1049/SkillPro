import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Profile() {
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    city: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // GET CURRENT USER
  // ==========================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/auth/me");

        console.log("My Profile:", response.data);

        const userData = response.data?.data;

        setUser(userData);

        setFormData({
          fullName: userData?.fullName || "",
          username: userData?.username || "",
          email: userData?.email || "",
          phone: userData?.phone || "",
          city: userData?.city || "",
        });
      } catch (error) {
        console.error("Profile Error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
  // UPDATE ACCOUNT
  // ==========================================

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await api.patch(
        "/auth/update-account",
        {
          fullName: formData.fullName,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
        }
      );

      console.log("Updated Profile:", response.data);

      const updatedUser = response.data?.data;

      setUser((prev) => ({
        ...prev,
        ...(updatedUser || formData),
      }));

      setFormData((prev) => ({
        ...prev,
        ...(updatedUser || {}),
      }));

      setEditing(false);
      setSuccess("Profile updated successfully.");
    } catch (error) {
      console.error("Update Profile Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // AVATAR UPLOAD
  // ==========================================

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploadingAvatar(true);
      setError("");
      setSuccess("");

      const data = new FormData();

      data.append("avatar", file);

      const response = await api.patch(
        "/auth/avatar",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Updated Avatar:", response.data);

      const updatedUser = response.data?.data;

      setUser((prev) => ({
        ...prev,
        ...(updatedUser || {}),
      }));

      setSuccess("Profile picture updated successfully.");
    } catch (error) {
      console.error("Avatar Upload Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to update profile picture."
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  // ==========================================
  // PASSWORD INPUT
  // ==========================================

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (
      !passwordData.oldPassword ||
      !passwordData.newPassword
    ) {
      setError("Please fill both password fields.");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError(
        "New password must be at least 8 characters."
      );
      return;
    }

    try {
      setChangingPassword(true);
      setError("");
      setSuccess("");

      await api.patch(
        "/auth/change-password",
        passwordData
      );

      setPasswordData({
        oldPassword: "",
        newPassword: "",
      });

      setSuccess("Password changed successfully.");
    } catch (error) {
      console.error(
        "Change Password Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--background)] px-4 py-10 transition-colors duration-300">
        <div className="mx-auto max-w-4xl">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--primary)]"></div>

              <p className="text-sm text-[var(--text-secondary)]">
                Loading your profile...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (!user) {
    return (
      <main className="min-h-screen bg-[var(--background)] px-4 py-10 transition-colors duration-300">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center shadow-sm">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary-light)] text-2xl text-[var(--primary)]">
              !
            </div>

            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Unable to load profile
            </h1>

            <p className="mt-2 text-[var(--text-secondary)]">
              {error || "Something went wrong."}
            </p>

            <Link
              to="/"
              className="mt-6 inline-block rounded-lg bg-[var(--primary)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)]"
            >
              Go Home
            </Link>

          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // PROFILE UI
  // ==========================================

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-8 transition-colors duration-300 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}

        <div className="mb-8">
          <p className="text-sm font-medium text-[var(--primary)]">
            Account
          </p>

          <h1 className="mt-1 text-3xl font-bold text-[var(--text-primary)]">
            My Profile
          </h1>

          <p className="mt-2 text-[var(--text-secondary)]">
            Manage your personal information and account settings.
          </p>
        </div>


        {/* SUCCESS */}

        {success && (
          <div className="mb-6 rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/10 px-4 py-3 text-sm font-medium text-[var(--success)]">
            {success}
          </div>
        )}


        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-[var(--error)]/30 bg-[var(--error)]/10 px-4 py-3 text-sm font-medium text-[var(--error)]">
            {error}
          </div>
        )}


        <div className="grid gap-6 lg:grid-cols-3">

          {/* ======================================
              PROFILE CARD
          ======================================= */}

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition-colors duration-300">

            <div className="flex flex-col items-center text-center">

              {/* AVATAR */}

              <div className="relative">

                <img
                  src={
                    user.avatar ||
                    "https://ui-avatars.com/api/?name=User&background=C06C4E&color=fff"
                  }
                  alt={user.fullName || "Profile"}
                  className="h-32 w-32 rounded-full border-4 border-[var(--surface)] object-cover shadow-lg"
                />

                <label
                  htmlFor="avatar"
                  className="absolute bottom-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-md transition hover:bg-[var(--primary-hover)]"
                  title="Change profile picture"
                >
                  ✎
                </label>

                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />

              </div>

              {uploadingAvatar && (
                <p className="mt-3 text-xs text-[var(--primary)]">
                  Uploading...
                </p>
              )}

              <h2 className="mt-5 text-xl font-bold text-[var(--text-primary)]">
                {user.fullName}
              </h2>

              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                @{user.username}
              </p>

              {/* ROLE */}

              <span className="mt-4 rounded-full bg-[var(--primary-light)] px-4 py-1.5 text-xs font-semibold capitalize text-[var(--primary)]">
                {user.role}
              </span>

              {user.city && (
                <p className="mt-4 text-sm text-[var(--text-secondary)]">
                  📍 {user.city}
                </p>
              )}

            </div>
          </div>


          {/* ======================================
              ACCOUNT DETAILS
          ======================================= */}

          <div className="lg:col-span-2">

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition-colors duration-300">

              <div className="mb-6 flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">
                    Personal Information
                  </h2>

                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    Update your account information.
                  </p>
                </div>

                {!editing && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(true);
                      setError("");
                      setSuccess("");
                    }}
                    className="rounded-lg border border-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary)] transition hover:bg-[var(--primary-light)]"
                  >
                    Edit Profile
                  </button>
                )}

              </div>


              <form onSubmit={handleUpdateProfile}>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* FULL NAME */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      disabled={!editing}
                      className={`w-full rounded-lg border px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition ${
                        editing
                          ? "border-[var(--border)] bg-[var(--surface)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                          : "border-[var(--border)] bg-[var(--background)] text-[var(--text-secondary)]"
                      }`}
                    />
                  </div>


                  {/* USERNAME */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                      Username
                    </label>

                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      disabled={!editing}
                      className={`w-full rounded-lg border px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition ${
                        editing
                          ? "border-[var(--border)] bg-[var(--surface)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                          : "border-[var(--border)] bg-[var(--background)] text-[var(--text-secondary)]"
                      }`}
                    />
                  </div>


                  {/* EMAIL */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!editing}
                      className={`w-full rounded-lg border px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition ${
                        editing
                          ? "border-[var(--border)] bg-[var(--surface)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                          : "border-[var(--border)] bg-[var(--background)] text-[var(--text-secondary)]"
                      }`}
                    />
                  </div>


                  {/* PHONE */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                      Phone
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!editing}
                      className={`w-full rounded-lg border px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition ${
                        editing
                          ? "border-[var(--border)] bg-[var(--surface)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                          : "border-[var(--border)] bg-[var(--background)] text-[var(--text-secondary)]"
                      }`}
                    />
                  </div>


                  {/* CITY */}

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      disabled={!editing}
                      className={`w-full rounded-lg border px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition ${
                        editing
                          ? "border-[var(--border)] bg-[var(--surface)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                          : "border-[var(--border)] bg-[var(--background)] text-[var(--text-secondary)]"
                      }`}
                    />
                  </div>

                </div>


                {/* BUTTONS */}

                {editing && (
                  <div className="mt-6 flex justify-end gap-3">

                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);

                        setFormData({
                          fullName: user.fullName || "",
                          username: user.username || "",
                          email: user.email || "",
                          phone: user.phone || "",
                          city: user.city || "",
                        });

                        setError("");
                      }}
                      className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--background)]"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>

                  </div>
                )}

              </form>
            </div>


            {/* ======================================
                CHANGE PASSWORD
            ======================================= */}

            <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition-colors duration-300">

              <div className="mb-6">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  Change Password
                </h2>

                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Keep your account secure with a strong password.
                </p>
              </div>


              <form onSubmit={handleChangePassword}>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* OLD PASSWORD */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                      Current Password
                    </label>

                    <input
                      type="password"
                      name="oldPassword"
                      value={passwordData.oldPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                    />
                  </div>


                  {/* NEW PASSWORD */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                      New Password
                    </label>

                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                    />
                  </div>

                </div>


                <div className="mt-5 flex justify-end">

                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {changingPassword
                      ? "Changing..."
                      : "Change Password"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}

export default Profile;