import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/booking/my-bookings"
        );

        console.log(
          "My Bookings:",
          response.data
        );

        setBookings(
          response.data?.data || []
        );

      } catch (error) {
        console.error(
          "Error fetching bookings:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load bookings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 py-20">
        <div className="text-center">
          <p className="text-gray-500">
            Loading your bookings...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12">

      <div className="mx-auto max-w-6xl px-6">

        {/* HEADER */}

        <div className="mb-10">

          <h1 className="text-3xl font-bold text-slate-900">
            My Bookings
          </h1>

          <p className="mt-2 text-gray-500">
            Track and manage your service bookings.
          </p>

        </div>


        {/* ERROR */}

        {error && (
          <div className="rounded-xl bg-red-50 p-5 text-red-600">
            {error}
          </div>
        )}


        {/* EMPTY */}

        {!error && bookings.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">

            <h2 className="text-2xl font-bold text-slate-900">
              No bookings yet
            </h2>

            <p className="mt-3 text-gray-500">
              You haven't booked any professional yet.
            </p>

            <Link
              to="/services"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Find a Professional
            </Link>

          </div>
        )}


        {/* BOOKINGS */}

        {!error && bookings.length > 0 && (
          <div className="space-y-6">

            {bookings.map((booking) => (

              <div
                key={booking._id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >

                <div className="grid gap-6 md:grid-cols-4">


                  {/* PROFESSIONAL */}

                  <div className="flex items-center gap-4">

                    <img
                      src={
                        booking.professional?.owner?.avatar ||
                        "https://via.placeholder.com/100"
                      }
                      alt={
                        booking.professional?.owner?.fullName
                      }
                      className="h-16 w-16 rounded-full object-cover"
                    />

                    <div>

                      <h2 className="font-bold text-slate-900">
                        {booking.professional?.owner?.fullName}
                      </h2>

                      <p className="text-sm text-blue-600">
                        {booking.professional?.profession}
                      </p>

                      <p className="text-sm text-gray-500">
                        📍 {booking.professional?.owner?.city}
                      </p>

                    </div>

                  </div>


                  {/* SERVICE */}

                  <div>

                    <p className="text-sm text-gray-500">
                      Service
                    </p>

                    <h3 className="mt-1 font-semibold text-slate-900">
                      {booking.service?.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {booking.service?.duration} minutes
                    </p>

                  </div>


                  {/* DATE */}

                  <div>

                    <p className="text-sm text-gray-500">
                      Booking Date
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {new Date(
                        booking.bookingDate
                      ).toLocaleDateString()}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(
                        booking.bookingDate
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                  </div>


                  {/* STATUS */}

                  <div>

                    <p className="text-sm text-gray-500">
                      Status
                    </p>

                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-medium ${
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


                    <p className="mt-3 text-sm text-gray-500">
                      Payment:{" "}
                      <span className="font-medium text-slate-900">
                        {booking.paymentStatus}
                      </span>
                    </p>

                  </div>

                </div>


                {/* BOTTOM */}

                <div className="mt-6 flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <p className="text-sm text-gray-500">
                      Service Address
                    </p>

                    <p className="font-medium text-slate-900">
                      {booking.address}
                    </p>

                  </div>


                  <div className="flex items-center gap-4">

                    <p className="text-xl font-bold text-slate-900">
                      ₹{booking.service?.price}
                    </p>

                    <Link
                      to={`/booking-details/${booking._id}`}
                      className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
                    >
                      View Details
                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </main>
  );
}

export default MyBookings;