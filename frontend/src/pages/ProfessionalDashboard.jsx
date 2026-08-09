import { useEffect, useState } from "react";
import api from "../api/axios";

function ProfessionalDashboard() {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // FETCH PROFILE + BOOKINGS
  // ==========================================

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError("");

      // ========================================
      // FETCH PROFESSIONAL PROFILE
      // ========================================

      try {
        const profileResponse = await api.get(
          "/professional/me"
        );

        console.log(
          "Professional Profile:",
          profileResponse.data
        );

        setProfile(
          profileResponse.data?.data || null
        );

      } catch (profileError) {
        console.error(
          "Professional Profile Error:",
          profileError
        );

        setError(
          profileError.response?.data?.message ||
            "Unable to load professional profile."
        );
      }

      // ========================================
      // FETCH PROFESSIONAL BOOKINGS
      // ========================================

      try {
        const bookingsResponse = await api.get(
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

        // Don't break the whole dashboard
        setBookings([]);
      }

      setLoading(false);
    };

    fetchDashboard();
  }, []);

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

      const response = await api.patch(
        `/booking/${bookingId}/status`,
        {
          status,
        }
      );

      console.log(
        "Booking Status Updated:",
        response.data
      );

      // Update booking locally
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
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-lg text-gray-500">
          Loading dashboard...
        </p>
      </main>
    );
  }

  // ==========================================
  // PROFILE NOT FOUND
  // ==========================================

  if (error && !profile) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-20">

        <div className="mx-auto max-w-3xl">

          <div className="rounded-3xl bg-white p-10 text-center shadow-lg">

            {/* ICON */}

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-4xl">
              💼
            </div>

            {/* HEADING */}

            <h1 className="mt-6 text-3xl font-bold text-slate-900">
              Become a Professional
            </h1>

            {/* DESCRIPTION */}

            <p className="mx-auto mt-4 max-w-xl text-lg leading-7 text-gray-500">
              Have a skill that you want to offer?
              Join SkillPro as a professional and
              connect with customers looking for
              your services.
            </p>

            {/* BENEFITS */}

            <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">

              <div className="rounded-xl bg-slate-50 p-5">

                <div className="text-2xl">
                  👤
                </div>

                <h3 className="mt-3 font-semibold text-slate-900">
                  Create Profile
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Showcase your skills and experience.
                </p>

              </div>

              <div className="rounded-xl bg-slate-50 p-5">

                <div className="text-2xl">
                  📋
                </div>

                <h3 className="mt-3 font-semibold text-slate-900">
                  Get Bookings
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Receive service requests from customers.
                </p>

              </div>

              <div className="rounded-xl bg-slate-50 p-5">

                <div className="text-2xl">
                  💰
                </div>

                <h3 className="mt-3 font-semibold text-slate-900">
                  Earn Money
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Turn your skills into a source of income.
                </p>

              </div>

            </div>

            {/* BUTTONS */}

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">

              <a
                href="/login?role=professional"
                className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Login as Professional
              </a>

              <a
                href="/register?role=professional"
                className="rounded-lg border border-blue-600 px-8 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                Register as Professional
              </a>

            </div>

            <p className="mt-6 text-sm text-gray-400">
              Already offering services on SkillPro?
              Login to manage your professional account.
            </p>

          </div>

        </div>

      </main>
    );
  }

  // ==========================================
  // COUNTS
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

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <main className="min-h-screen bg-slate-50 py-12">

      <div className="mx-auto max-w-7xl px-6">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="mb-10">

          <p className="text-sm font-medium text-blue-600">
            Professional Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Welcome,{" "}
            {profile?.owner?.fullName ||
              "Professional"}{" "}
            👋
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your bookings and services from here.
          </p>

        </div>


        {/* =====================================
            ERROR
        ====================================== */}

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}


        {/* =====================================
            STATS
        ====================================== */}

        <div className="grid gap-5 md:grid-cols-3">

          {/* PENDING */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <p className="text-sm text-gray-500">
              Pending Bookings
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {pendingBookings}
            </p>

          </div>


          {/* ACCEPTED */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <p className="text-sm text-gray-500">
              Accepted Bookings
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {acceptedBookings}
            </p>

          </div>


          {/* COMPLETED */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <p className="text-sm text-gray-500">
              Completed Bookings
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {completedBookings}
            </p>

          </div>

        </div>


        {/* =====================================
            PROFILE SUMMARY
        ====================================== */}

        {profile && (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

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
                className="h-20 w-20 rounded-full object-cover"
              />

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  {profile.owner?.fullName ||
                    "Professional"}
                </h2>

                <p className="text-blue-600">
                  {profile.profession}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  📍 {profile.owner?.city ||
                    "Location not available"}
                </p>

              </div>

              <div className="sm:ml-auto">

                <span
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    profile.availability
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {profile.availability
                    ? "Available"
                    : "Unavailable"}
                </span>

              </div>

            </div>

          </div>
        )}


        {/* =====================================
            BOOKINGS
        ====================================== */}

        <section className="mt-10">

          <div className="mb-5">

            <h2 className="text-2xl font-bold text-slate-900">
              Incoming Bookings
            </h2>

            <p className="mt-1 text-gray-500">
              Manage requests from customers.
            </p>

          </div>


          {bookings.length === 0 ? (

            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">

              <div className="text-4xl">
                📋
              </div>

              <h3 className="mt-4 text-xl font-bold text-slate-900">
                No bookings yet
              </h3>

              <p className="mt-2 text-gray-500">
                New customer bookings will appear here.
              </p>

            </div>

          ) : (

            <div className="space-y-6">

              {bookings.map((booking) => (

                <div
                  key={booking._id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >

                  {/* TOP */}

                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                    <div className="flex items-center gap-4">

                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
                        {booking.customer?.fullName
                          ?.charAt(0)
                          ?.toUpperCase() || "C"}
                      </div>

                      <div>

                        <h3 className="text-lg font-bold text-slate-900">
                          {booking.customer?.fullName ||
                            "Customer"}
                        </h3>

                        <p className="text-sm text-gray-500">
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
                          ? "bg-green-100 text-green-700"
                          : booking.bookingStatus ===
                            "Rejected"
                          ? "bg-red-100 text-red-700"
                          : booking.bookingStatus ===
                            "Completed"
                          ? "bg-blue-100 text-blue-700"
                          : booking.bookingStatus ===
                            "Cancelled"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {booking.bookingStatus}
                    </span>

                  </div>


                  {/* BOOKING INFO */}

                  <div className="mt-6 grid gap-5 border-t pt-6 sm:grid-cols-2 lg:grid-cols-4">

                    {/* SERVICE */}

                    <div>

                      <p className="text-sm text-gray-500">
                        Service
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {booking.service?.title ||
                          "Service"}
                      </p>

                    </div>


                    {/* DATE */}

                    <div>

                      <p className="text-sm text-gray-500">
                        Date & Time
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {booking.bookingDate
                          ? new Date(
                              booking.bookingDate
                            ).toLocaleDateString()
                          : "Not available"}
                      </p>

                      {booking.bookingDate && (
                        <p className="text-sm text-gray-500">
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


                    {/* ADDRESS */}

                    <div>

                      <p className="text-sm text-gray-500">
                        Address
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        📍 {booking.address ||
                          "Not available"}
                      </p>

                    </div>


                    {/* PRICE */}

                    <div>

                      <p className="text-sm text-gray-500">
                        Price
                      </p>

                      <p className="mt-1 text-xl font-bold text-slate-900">
                        ₹
                        {booking.service?.price ||
                          booking.price ||
                          0}
                      </p>

                    </div>

                  </div>


                  {/* NOTES */}

                  {booking.notes && (
                    <div className="mt-5 rounded-xl bg-slate-50 p-4">

                      <p className="text-sm font-medium text-gray-500">
                        Customer Notes
                      </p>

                      <p className="mt-1 text-gray-700">
                        {booking.notes}
                      </p>

                    </div>
                  )}


                  {/* ACTIONS */}

                  {booking.bookingStatus ===
                    "Pending" && (

                    <div className="mt-6 flex flex-col gap-3 border-t pt-5 sm:flex-row">

                      {/* ACCEPT */}

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
                        className="flex-1 rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {actionLoading ===
                        booking._id
                          ? "Updating..."
                          : "Accept Booking"}
                      </button>


                      {/* REJECT */}

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
                        className="flex-1 rounded-lg bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {actionLoading ===
                        booking._id
                          ? "Updating..."
                          : "Reject Booking"}
                      </button>

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