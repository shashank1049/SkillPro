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


  // ==========================================
  // CANCEL BOOKING
  // ==========================================

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


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-gray-500">
          Loading booking details...
        </p>
      </main>
    );
  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error && !booking) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16">

        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-10 text-center shadow-sm">

          <h1 className="text-2xl font-bold text-red-600">
            Unable to load booking
          </h1>

          <p className="mt-3 text-gray-500">
            {error}
          </p>

          <Link
            to="/my-bookings"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
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


  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusClass = () => {
    switch (booking.bookingStatus) {
      case "Accepted":
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Completed":
        return "bg-blue-100 text-blue-700";

      case "Cancelled":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };


  return (
    <main className="min-h-screen bg-slate-50 py-12">

      <div className="mx-auto max-w-5xl px-6">


        {/* HEADER */}

        <div className="mb-8">

          <Link
            to="/my-bookings"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to My Bookings
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-slate-900">
            Booking Details
          </h1>

          <p className="mt-2 text-gray-500">
            View all information about your booking.
          </p>

        </div>


        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}


        <div className="grid gap-8 lg:grid-cols-3">


          {/* =================================
              PROFESSIONAL
          ================================== */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-slate-900">
              Professional
            </h2>

            <img
              src={
                booking.professional?.owner?.avatar ||
                "https://via.placeholder.com/150"
              }
              alt={
                booking.professional?.owner?.fullName
              }
              className="mx-auto mt-6 h-28 w-28 rounded-full object-cover"
            />

            <h3 className="mt-5 text-center text-xl font-bold">
              {booking.professional?.owner?.fullName}
            </h3>

            <p className="mt-1 text-center text-blue-600">
              {booking.professional?.profession}
            </p>

            <p className="mt-3 text-center text-gray-500">
              📍 {booking.professional?.owner?.city}
            </p>

          </div>


          {/* =================================
              BOOKING INFORMATION
          ================================== */}

          <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">

            <h2 className="text-xl font-bold text-slate-900">
              Booking Information
            </h2>


            {/* SERVICE */}

            <div className="mt-6 rounded-xl bg-slate-50 p-5">

              <p className="text-sm text-gray-500">
                Service
              </p>

              <h3 className="mt-1 text-xl font-bold text-slate-900">
                {booking.service?.title}
              </h3>

              <div className="mt-3 flex flex-wrap gap-5 text-sm text-gray-600">

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

                <p className="text-sm text-gray-500">
                  Booking Date
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {new Date(
                    booking.bookingDate
                  ).toLocaleDateString()}
                </p>

              </div>


              <div>

                <p className="text-sm text-gray-500">
                  Booking Time
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {new Date(
                    booking.bookingDate
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

              </div>


              <div>

                <p className="text-sm text-gray-500">
                  Booking Status
                </p>

                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-medium ${getStatusClass()}`}
                >
                  {booking.bookingStatus}
                </span>

              </div>


              <div>

                <p className="text-sm text-gray-500">
                  Payment Status
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {booking.paymentStatus}
                </p>

              </div>

            </div>


            {/* ADDRESS */}

            <div className="mt-6">

              <p className="text-sm text-gray-500">
                Service Address
              </p>

              <p className="mt-1 font-medium text-slate-900">
                📍 {booking.address}
              </p>

            </div>


            {/* NOTES */}

            {booking.notes && (
              <div className="mt-6">

                <p className="text-sm text-gray-500">
                  Additional Notes
                </p>

                <p className="mt-1 leading-6 text-gray-700">
                  {booking.notes}
                </p>

              </div>
            )}


            {/* ACTIONS */}

            <div className="mt-8 flex flex-col gap-4 border-t pt-6 sm:flex-row">

              <Link
                to="/my-bookings"
                className="flex-1 rounded-lg border border-gray-300 py-3 text-center font-semibold text-gray-700 hover:bg-gray-50"
              >
                Back to My Bookings
              </Link>


              {booking.bookingStatus === "Pending" && (
                <button
                  onClick={handleCancelBooking}
                  disabled={cancelling}
                  className="flex-1 rounded-lg bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
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