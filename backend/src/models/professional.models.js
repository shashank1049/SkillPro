import { useEffect, useState } from "react";
import api from "../api/axios";

function ProfessionalDashboard() {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [creatingProfile, setCreatingProfile] = useState(false);
  const [actionLoading, setActionLoading] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // CREATE PROFILE FORM
  // ==========================================

  const [profileForm, setProfileForm] = useState({
    profession: "",
    bio: "",
    experience: "",
    skills: "",
    pricing: "",
    serviceAreas: "",
  });

  const [portfolioImages, setPortfolioImages] = useState([]);

  // ==========================================
  // FETCH DASHBOARD
  // ==========================================

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // ----------------------------------------
      // FIRST GET PROFESSIONAL PROFILE
      // ----------------------------------------

      let profileData = null;

      try {
        const profileResponse = await api.get(
          "/professional/me"
        );

        console.log(
          "Professional Profile:",
          profileResponse.data
        );

        profileData =
          profileResponse.data?.data || null;

        setProfile(profileData);
      } catch (profileError) {
        console.error(
          "Professional Profile Error:",
          profileError
        );

        // Profile does not exist yet
        if (
          profileError.response?.status === 404
        ) {
          setProfile(null);
          setLoading(false);
          return;
        }

        throw profileError;
      }

      // ----------------------------------------
      // ONLY FETCH BOOKINGS IF PROFILE EXISTS
      // ----------------------------------------

      if (profileData) {
        try {
          const bookingsResponse =
            await api.get(
              "/booking/professional-bookings"
            );

          console.log(
            "Professional Bookings:",
            bookingsResponse.data
          );

          setBookings(
            bookingsResponse.data?.data || []
          );
        } catch (bookingError) {
          console.error(
            "Professional Bookings Error:",
            bookingError
          );

          setBookings([]);

          setError(
            bookingError.response?.data?.message ||
              "Unable to load bookings."
          );
        }
      }
    } catch (error) {
      console.error(
        "Dashboard Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load professional dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ==========================================
  // HANDLE PROFILE INPUT
  // ==========================================

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // HANDLE PORTFOLIO IMAGES
  // ==========================================

  const handlePortfolioImages = (e) => {
    const files = Array.from(
      e.target.files || []
    );

    if (files.length > 5) {
      setError(
        "You can upload maximum 5 portfolio images."
      );

      setPortfolioImages(files.slice(0, 5));
      return;
    }

    setError("");
    setPortfolioImages(files);
  };

  // ==========================================
  // CREATE PROFESSIONAL PROFILE
  // ==========================================

  const handleCreateProfile = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!profileForm.profession.trim()) {
      setError("Profession is required.");
      return;
    }

    if (
      profileForm.pricing === "" ||
      Number(profileForm.pricing) < 0
    ) {
      setError("Please enter a valid pricing.");
      return;
    }

    try {
      setCreatingProfile(true);

      const formData = new FormData();

      formData.append(
        "profession",
        profileForm.profession.trim()
      );

      formData.append(
        "bio",
        profileForm.bio.trim()
      );

      formData.append(
        "experience",
        profileForm.experience || "0"
      );

      formData.append(
        "skills",
        profileForm.skills.trim()
      );

      formData.append(
        "pricing",
        profileForm.pricing
      );

      formData.append(
        "serviceAreas",
        profileForm.serviceAreas.trim()
      );

      portfolioImages.forEach((file) => {
        formData.append(
          "portfolioImages",
          file
        );
      });

      const response = await api.post(
        "/professional/create-profile",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      console.log(
        "Professional Profile Created:",
        response.data
      );

      const createdProfile =
        response.data?.data;

      if (createdProfile) {
        setProfile(createdProfile);
      }

      setSuccess(
        "Professional profile created successfully!"
      );

      setProfileForm({
        profession: "",
        bio: "",
        experience: "",
        skills: "",
        pricing: "",
        serviceAreas: "",
      });

      setPortfolioImages([]);

      // Fetch fresh profile + bookings
      await fetchDashboard();
    } catch (error) {
      console.error(
        "Create Professional Profile Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to create professional profile."
      );
    } finally {
      setCreatingProfile(false);
    }
  };

  // ==========================================
  // UPDATE BOOKING STATUS
  // ==========================================

  const handleStatusUpdate = async (
    bookingId,
    status
  ) => {
    try {
      setActionLoading(bookingId);
      setError("");
      setSuccess("");

      const response = await api.patch(
        `/booking/${bookingId}/status`,
        {
          bookingStatus: status,
        }
      );

      console.log(
        "Booking Status Updated:",
        response.data
      );

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                bookingStatus: status,
              }
            : booking
        )
      );

      setSuccess(
        `Booking ${status.toLowerCase()} successfully.`
      );
    } catch (error) {
      console.error(
        "Status Update Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to update booking status."
      );
    } finally {
      setActionLoading("");
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] transition-colors duration-300">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--primary)]" />

          <p className="text-lg text-[var(--text-secondary)]">
            Loading dashboard...
          </p>
        </div>
      </main>
    );
  }

  // ==========================================
  // NO PROFESSIONAL PROFILE
  // ==========================================

  if (!profile) {
    return (
      <main className="min-h-screen bg-[var(--background)] px-4 py-10 transition-colors duration-300 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">

          <div className="mb-8 text-center">
            <p className="text-sm font-medium text-[var(--primary)]">
              Professional Account
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[var(--text-primary)]">
              Complete Your Professional Profile
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-[var(--text-secondary)]">
              You're registered as a professional.
              Complete your profile so customers can
              discover and book your services.
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-6 rounded-xl border border-[var(--error)]/30 bg-[var(--error)]/10 p-4 text-sm font-medium text-[var(--error)]">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="mb-6 rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/10 p-4 text-sm font-medium text-[var(--success)]">
              {success}
            </div>
          )}

          {/* FORM */}

          <form
            onSubmit={handleCreateProfile}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg sm:p-8"
          >

            {/* BASIC INFORMATION */}

            <div className="mb-8">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                Professional Information
              </h2>

              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Tell customers what service you provide.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              {/* PROFESSION */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                  Profession *
                </label>

                <input
                  type="text"
                  name="profession"
                  value={profileForm.profession}
                  onChange={handleProfileChange}
                  placeholder="e.g. Plumber, Web Developer"
                  required
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                />
              </div>

              {/* EXPERIENCE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                  Experience (Years)
                </label>

                <input
                  type="number"
                  name="experience"
                  value={profileForm.experience}
                  onChange={handleProfileChange}
                  placeholder="e.g. 3"
                  min="0"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                />
              </div>

              {/* PRICING */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                  Starting Price (₹) *
                </label>

                <input
                  type="number"
                  name="pricing"
                  value={profileForm.pricing}
                  onChange={handleProfileChange}
                  placeholder="e.g. 500"
                  min="0"
                  required
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                />
              </div>

              {/* SERVICE AREAS */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                  Service Areas
                </label>

                <input
                  type="text"
                  name="serviceAreas"
                  value={profileForm.serviceAreas}
                  onChange={handleProfileChange}
                  placeholder="e.g. Noida, Delhi, Ghaziabad"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                />

                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  Separate multiple areas with commas.
                </p>
              </div>

            </div>

            {/* BIO */}

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                Bio
              </label>

              <textarea
                name="bio"
                value={profileForm.bio}
                onChange={handleProfileChange}
                placeholder="Tell customers about your experience and services..."
                rows="5"
                className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
              />
            </div>

            {/* SKILLS */}

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                Skills
              </label>

              <input
                type="text"
                name="skills"
                value={profileForm.skills}
                onChange={handleProfileChange}
                placeholder="e.g. React, Node.js, MongoDB"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
              />

              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Separate multiple skills with commas.
              </p>
            </div>

            {/* PORTFOLIO */}

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                Portfolio Images
              </label>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePortfolioImages}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-primary)] file:mr-4 file:rounded-md file:border-0 file:bg-[var(--primary-light)] file:px-4 file:py-2 file:font-medium file:text-[var(--primary)]"
              />

              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                You can upload up to 5 images.
              </p>

              {portfolioImages.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-[var(--text-secondary)]">
                    {portfolioImages.length} image
                    {portfolioImages.length > 1
                      ? "s"
                      : ""}{" "}
                    selected
                  </p>
                </div>
              )}
            </div>

            {/* SUBMIT */}

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={creatingProfile}
                className="w-full rounded-lg bg-[var(--primary)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {creatingProfile
                  ? "Creating Profile..."
                  : "Create Professional Profile"}
              </button>
            </div>

          </form>
        </div>
      </main>
    );
  }

  // ==========================================
  // BOOKING COUNTS
  // ==========================================

  const pendingBookings = bookings.filter(
    (booking) =>
      booking.bookingStatus === "Pending"
  ).length;

  const acceptedBookings = bookings.filter(
    (booking) =>
      booking.bookingStatus === "Accepted"
  ).length;

  const completedBookings = bookings.filter(
    (booking) =>
      booking.bookingStatus === "Completed"
  ).length;

  const rejectedBookings = bookings.filter(
    (booking) =>
      booking.bookingStatus === "Rejected"
  ).length;

  // ==========================================
  // MAIN DASHBOARD
  // ==========================================

  return (
    <main className="min-h-screen bg-[var(--background)] py-12 transition-colors duration-300">

      <div className="mx-auto max-w-7xl px-6">

        {/* ======================================
            HEADER
        ======================================= */}

        <div className="mb-10">

          <p className="text-sm font-medium text-[var(--primary)]">
            Professional Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[var(--text-primary)]">
            Welcome,{" "}
            {profile?.owner?.fullName ||
              "Professional"}{" "}
            👋
          </h1>

          <p className="mt-2 text-[var(--text-secondary)]">
            Manage your bookings and services from here.
          </p>

        </div>


        {/* ======================================
            SUCCESS
        ======================================= */}

        {success && (
          <div className="mb-6 rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/10 p-4 text-sm font-medium text-[var(--success)]">
            {success}
          </div>
        )}


        {/* ======================================
            ERROR
        ======================================= */}

        {error && (
          <div className="mb-6 rounded-xl border border-[var(--error)]/30 bg-[var(--error)]/10 p-4 text-sm font-medium text-[var(--error)]">
            {error}
          </div>
        )}


        {/* ======================================
            STATS
        ======================================= */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <p className="text-sm text-[var(--text-secondary)]">
              Pending Bookings
            </p>

            <p className="mt-2 text-3xl font-bold text-[var(--warning)]">
              {pendingBookings}
            </p>
          </div>


          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <p className="text-sm text-[var(--text-secondary)]">
              Accepted Bookings
            </p>

            <p className="mt-2 text-3xl font-bold text-[var(--success)]">
              {acceptedBookings}
            </p>
          </div>


          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <p className="text-sm text-[var(--text-secondary)]">
              Completed Bookings
            </p>

            <p className="mt-2 text-3xl font-bold text-[var(--primary)]">
              {completedBookings}
            </p>
          </div>


          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <p className="text-sm text-[var(--text-secondary)]">
              Rejected Bookings
            </p>

            <p className="mt-2 text-3xl font-bold text-[var(--error)]">
              {rejectedBookings}
            </p>
          </div>

        </div>


        {/* ======================================
            PROFESSIONAL PROFILE
        ======================================= */}

        <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

            <img
              src={
                profile.owner?.avatar ||
                "https://via.placeholder.com/100"
              }
              alt={
                profile.owner?.fullName ||
                "Professional"
              }
              className="h-20 w-20 rounded-full border-2 border-[var(--primary)] object-cover"
            />

            <div>

              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                {profile.owner?.fullName ||
                  "Professional"}
              </h2>

              <p className="text-[var(--primary)]">
                {profile.profession}
              </p>

              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                📍{" "}
                {profile.owner?.city ||
                  "Location not available"}
              </p>

            </div>

            <div className="sm:ml-auto">

              <span
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  profile.availability
                    ? "bg-[var(--success)]/10 text-[var(--success)]"
                    : "bg-[var(--error)]/10 text-[var(--error)]"
                }`}
              >
                {profile.availability
                  ? "Available"
                  : "Unavailable"}
              </span>

            </div>

          </div>

        </div>


        {/* ======================================
            BOOKINGS
        ======================================= */}

        <section className="mt-10">

          <div className="mb-5">

            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              Incoming Bookings
            </h2>

            <p className="mt-1 text-[var(--text-secondary)]">
              Manage requests from customers.
            </p>

          </div>


          {bookings.length === 0 ? (

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center shadow-sm">

              <div className="text-4xl">
                📋
              </div>

              <h3 className="mt-4 text-xl font-bold text-[var(--text-primary)]">
                No bookings yet
              </h3>

              <p className="mt-2 text-[var(--text-secondary)]">
                New customer bookings will appear here.
              </p>

            </div>

          ) : (

            <div className="space-y-6">

              {bookings.map((booking) => (

                <div
                  key={booking._id}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm"
                >

                  {/* TOP */}

                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                    <div className="flex items-center gap-4">

                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary-light)] text-xl font-bold text-[var(--primary)]">
                        {booking.customer?.fullName
                          ?.charAt(0)
                          ?.toUpperCase() || "C"}
                      </div>

                      <div>

                        <h3 className="text-lg font-bold text-[var(--text-primary)]">
                          {booking.customer?.fullName ||
                            "Customer"}
                        </h3>

                        <p className="text-sm text-[var(--text-secondary)]">
                          {booking.customer?.email ||
                            "Email unavailable"}
                        </p>

                      </div>

                    </div>


                    {/* STATUS */}

                    <span
                      className={`w-fit rounded-full px-4 py-2 text-sm font-medium ${
                        booking.bookingStatus ===
                        "Accepted"
                          ? "bg-[var(--success)]/10 text-[var(--success)]"
                          : booking.bookingStatus ===
                            "Rejected"
                          ? "bg-[var(--error)]/10 text-[var(--error)]"
                          : booking.bookingStatus ===
                            "Completed"
                          ? "bg-[var(--primary-light)] text-[var(--primary)]"
                          : booking.bookingStatus ===
                            "Cancelled"
                          ? "bg-[var(--surface-secondary)] text-[var(--text-secondary)]"
                          : "bg-[var(--warning)]/10 text-[var(--warning)]"
                      }`}
                    >
                      {booking.bookingStatus}
                    </span>

                  </div>


                  {/* BOOKING INFO */}

                  <div className="mt-6 grid gap-5 border-t border-[var(--border)] pt-6 sm:grid-cols-2 lg:grid-cols-4">

                    <div>

                      <p className="text-sm text-[var(--text-secondary)]">
                        Service
                      </p>

                      <p className="mt-1 font-semibold text-[var(--text-primary)]">
                        {booking.service?.title ||
                          "Service"}
                      </p>

                    </div>


                    <div>

                      <p className="text-sm text-[var(--text-secondary)]">
                        Date & Time
                      </p>

                      <p className="mt-1 font-semibold text-[var(--text-primary)]">
                        {booking.bookingDate
                          ? new Date(
                              booking.bookingDate
                            ).toLocaleDateString()
                          : "Not available"}
                      </p>

                      {booking.bookingDate && (
                        <p className="text-sm text-[var(--text-secondary)]">
                          {new Date(
                            booking.bookingDate
                          ).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      )}

                    </div>


                    <div>

                      <p className="text-sm text-[var(--text-secondary)]">
                        Address
                      </p>

                      <p className="mt-1 font-semibold text-[var(--text-primary)]">
                        📍{" "}
                        {booking.address ||
                          "Not available"}
                      </p>

                    </div>


                    <div>

                      <p className="text-sm text-[var(--text-secondary)]">
                        Price
                      </p>

                      <p className="mt-1 text-xl font-bold text-[var(--text-primary)]">
                        ₹
                        {booking.service?.price ||
                          booking.price ||
                          0}
                      </p>

                    </div>

                  </div>


                  {/* NOTES */}

                  {booking.notes && (
                    <div className="mt-5 rounded-xl bg-[var(--surface-secondary)] p-4">

                      <p className="text-sm font-medium text-[var(--text-secondary)]">
                        Customer Notes
                      </p>

                      <p className="mt-1 text-[var(--text-primary)]">
                        {booking.notes}
                      </p>

                    </div>
                  )}


                  {/* ACCEPT / REJECT */}

                  {booking.bookingStatus ===
                    "Pending" && (

                    <div className="mt-6 flex flex-col gap-3 border-t border-[var(--border)] pt-5 sm:flex-row">

                      <button
                        onClick={() =>
                          handleStatusUpdate(
                            booking._id,
                            "Accepted"
                          )
                        }
                        disabled={
                          actionLoading ===
                          booking._id
                        }
                        className="flex-1 rounded-lg bg-[var(--success)] py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {actionLoading ===
                        booking._id
                          ? "Updating..."
                          : "Accept Booking"}
                      </button>


                      <button
                        onClick={() =>
                          handleStatusUpdate(
                            booking._id,
                            "Rejected"
                          )
                        }
                        disabled={
                          actionLoading ===
                          booking._id
                        }
                        className="flex-1 rounded-lg bg-[var(--error)] py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {actionLoading ===
                        booking._id
                          ? "Updating..."
                          : "Reject Booking"}
                      </button>

                    </div>
                  )}


                  {/* COMPLETE */}

                  {booking.bookingStatus ===
                    "Accepted" && (

                    <div className="mt-6 border-t border-[var(--border)] pt-5">

                      <button
                        onClick={() =>
                          handleStatusUpdate(
                            booking._id,
                            "Completed"
                          )
                        }
                        disabled={
                          actionLoading ===
                          booking._id
                        }
                        className="w-full rounded-lg bg-[var(--primary)] py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {actionLoading ===
                        booking._id
                          ? "Updating..."
                          : "✓ Mark Service as Completed"}
                      </button>

                    </div>
                  )}


                  {/* COMPLETED */}

                  {booking.bookingStatus ===
                    "Completed" && (

                    <div className="mt-6 border-t border-[var(--border)] pt-5">

                      <div className="rounded-xl bg-[var(--primary-light)] p-4 text-center">

                        <p className="font-semibold text-[var(--primary)]">
                          ✓ Service Completed
                        </p>

                        <p className="mt-1 text-sm text-[var(--text-secondary)]">
                          This booking has been successfully completed.
                        </p>

                      </div>

                    </div>
                  )}

                </div>

              ))}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}

export default ProfessionalDashboard;