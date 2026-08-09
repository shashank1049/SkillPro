import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function BookingDetails() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/booking/${bookingId}`
        );

        console.log(
          "Booking Details:",
          response.data
        );

        setBooking(response.data?.data);
      } catch (error) {
        console.error(
          "Error fetching booking:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load booking details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleCancelBooking = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      setCancelling(true);
      setError("");

      const response = await api.patch(
        `/booking/cancel/${bookingId}`
      );

      console.log(
        "Booking Cancelled:",
        response.data
      );

      setBooking((prev) => ({
        ...prev,
        bookingStatus: "Cancelled",
      }));
    } catch (error) {
      console.error(
        "Cancel Booking Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to cancel booking."
      );
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <p className="text-[var(--text-secondary)]">
          Loading booking details...
        </p>
      </main>
    );
  }

  if (error && !booking) {
    return (
      <main className="min-h-screen bg-[var(--background)] px-6 py-16">

        <div className="mx-auto max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center shadow-sm">

          <h1 className="text-2xl font-bold text-red-600">
            Unable to load booking
          </h1>

          <p className="mt-3 text-[var(--text-secondary)]">
            {error}
          </p>

          <Link
            to="/my-bookings"
            className="mt-6 inline-block rounded-lg bg-[var(--primary)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)]"
          >
            Back to My Bookings
          </Link>

        </div>

      </main>
    );
  }

  if (!booking) {
    return null;
  }

  const getStatusClass = () => {
    switch (booking.bookingStatus) {
      case "Accepted":
        return "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400";

      case "Rejected":
        return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400";

      case "Completed":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400";

      case "Cancelled":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

      default:
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400";
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] py-12 transition-colors duration-300">

      <div className="mx-auto max-w-5xl px-6">

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-900 dark:bg-red-950/30">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">

          {/* PROFESSIONAL */}

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">

            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Professional
            </h2>

            <img
              src={
                booking.professional?.owner?.avatar ||
                "https://via.placeholder.com/150"
              }
              alt={
                booking.professional?.owner?.fullName ||
                "Professional"
              }
              className="mx-auto mt-6 h-28 w-28 rounded-full border-4 border-[var(--primary)] object-cover"
            />

            <h3 className="mt-5 text-center text-2xl font-bold text-[var(--text-primary)]">
              {booking.professional?.owner?.fullName}
            </h3>

            <p className="mt-1 text-center font-medium text-[var(--primary)]">
              {booking.professional?.profession}
            </p>

            <p className="mt-3 text-center text-[var(--text-secondary)]">
              📍 {booking.professional?.owner?.city}
            </p>

          </div>

          {/* BOOKING INFORMATION */}

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm lg:col-span-2">

            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Booking Information
            </h2>

            {/* SERVICE */}

            <div className="mt-6 rounded-xl bg-[var(--surface-secondary)] p-5">

              <p className="text-sm text-[var(--text-secondary)]">
                Service
              </p>

              <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">
                {booking.service?.title}
              </h3>

              <div className="mt-3 flex flex-wrap gap-5 text-sm text-[var(--text-secondary)]">

                <span>
                  💰 ₹{booking.service?.price}
                </span>

                <span>
                  ⏱ {booking.service?.duration} minutes
                </span>

              </div>

            </div>

            {/* DETAILS */}

            <div className="mt-6 grid gap-5 sm:grid-cols-2">

              <div>
                <p className="text-sm text-[var(--text-secondary)]">
                  Booking Date
                </p>

                <p className="mt-1 font-semibold text-[var(--text-primary)]">
                  {new Date(
                    booking.bookingDate
                  ).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-[var(--text-secondary)]">
                  Booking Time
                </p>

                <p className="mt-1 font-semibold text-[var(--text-primary)]">
                  {new Date(
                    booking.bookingDate
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-[var(--text-secondary)]">
                  Booking Status
                </p>

                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-medium ${getStatusClass()}`}
                >
                  {booking.bookingStatus}
                </span>
              </div>

              <div>
                <p className="text-sm text-[var(--text-secondary)]">
                  Payment Status
                </p>

                <p className="mt-1 font-semibold text-[var(--text-primary)]">
                  {booking.paymentStatus}
                </p>
              </div>

            </div>

            {/* ADDRESS */}

            <div className="mt-6">

              <p className="text-sm text-[var(--text-secondary)]">
                Service Address
              </p>

              <p className="mt-1 font-medium text-[var(--text-primary)]">
                📍 {booking.address}
              </p>

            </div>

            {/* NOTES */}

            {booking.notes && (
              <div className="mt-6">

                <p className="text-sm text-[var(--text-secondary)]">
                  Additional Notes
                </p>

                <p className="mt-1 leading-6 text-[var(--text-primary)]">
                  {booking.notes}
                </p>

              </div>
            )}

            {/* ACTIONS */}

            <div className="mt-8 flex flex-col gap-4 border-t border-[var(--border)] pt-6 sm:flex-row">

              <Link
                to="/my-bookings"
                className="flex-1 rounded-lg border border-[var(--border)] py-3 text-center font-semibold text-[var(--text-primary)] transition hover:bg-[var(--surface-secondary)]"
              >
                Back to My Bookings
              </Link>

              {booking.bookingStatus === "Pending" && (
                <button
                  onClick={handleCancelBooking}
                  disabled={cancelling}
                  className="flex-1 rounded-lg bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {cancelling
                    ? "Cancelling..."
                    : "Cancel Booking"}
                </button>
              )}

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

export default BookingDetails;