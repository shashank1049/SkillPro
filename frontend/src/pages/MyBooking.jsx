import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [payingBookingId, setPayingBookingId] =
    useState(null);

  const [reviewBooking, setReviewBooking] =
    useState(null);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] =
    useState(false);

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

  const handlePayment = async (booking) => {
    try {
      setPayingBookingId(booking._id);
      setError("");

      const razorpayLoaded =
        await loadRazorpay();

      if (!razorpayLoaded) {
        throw new Error(
          "Razorpay failed to load."
        );
      }

      const paymentResponse =
        await api.post(
          "/payment/create-order",
          {
            bookingId: booking._id,
          }
        );

      console.log(
        "Payment Order:",
        paymentResponse.data
      );

      const paymentData =
        paymentResponse.data?.data;

      const order = paymentData?.order;

      if (!order?.id) {
        throw new Error(
          "Payment order was not created."
        );
      }

      const options = {
        key:
          import.meta.env
            .VITE_RAZORPAY_KEY_ID,

        amount: order.amount,

        currency:
          order.currency || "INR",

        name: "SkillPro",

        description:
          booking.service?.title ||
          "SkillPro Service Booking",

        order_id: order.id,

        handler: async function (
          razorpayResponse
        ) {
          try {
            console.log(
              "Razorpay Response:",
              razorpayResponse
            );

            const verifyResponse =
              await api.post(
                "/payment/verify",
                {
                  razorpay_order_id:
                    razorpayResponse
                      .razorpay_order_id,

                  razorpay_payment_id:
                    razorpayResponse
                      .razorpay_payment_id,

                  razorpay_signature:
                    razorpayResponse
                      .razorpay_signature,
                }
              );

            console.log(
              "Payment Verified:",
              verifyResponse.data
            );

            setBookings((prev) =>
              prev.map((item) =>
                item._id === booking._id
                  ? {
                      ...item,
                      paymentStatus: "Paid",
                    }
                  : item
              )
            );

            alert(
              "Payment successful! Booking confirmed."
            );
          } catch (verifyError) {
            console.error(
              "Payment Verification Error:",
              verifyError
            );

            setError(
              verifyError.response?.data
                ?.message ||
                "Payment verification failed."
            );
          } finally {
            setPayingBookingId(null);
          }
        },

        theme: {
          color:
            getComputedStyle(
              document.documentElement
            )
              .getPropertyValue("--primary")
              .trim() || "#2563eb",
        },

        modal: {
          ondismiss: () => {
            setPayingBookingId(null);
          },
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        (response) => {
          console.error(
            "Payment Failed:",
            response.error
          );

          setError(
            response.error?.description ||
              "Payment failed. Please try again."
          );

          setPayingBookingId(null);
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "Payment Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to start payment."
      );

      setPayingBookingId(null);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewBooking) return;

    try {
      setReviewLoading(true);
      setError("");

      const response = await api.post(
        "/review/create",
        {
          bookingId: reviewBooking._id,
          rating,
          comment,
        }
      );

      console.log(
        "Review Created:",
        response.data
      );

      setReviewBooking(null);
      setRating(5);
      setComment("");

      alert(
        "Review submitted successfully!"
      );
    } catch (error) {
      console.error(
        "Review Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to submit review."
      );
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] transition-colors duration-300">
        <p className="text-lg text-[var(--text-secondary)]">
          Loading your bookings...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] py-12 transition-colors duration-300">

      <div className="mx-auto max-w-6xl px-6">

        {/* HEADER */}

        <div className="mb-10">

          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            My Bookings
          </h1>

          <p className="mt-2 text-[var(--text-secondary)]">
            Track and manage your service bookings.
          </p>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5 text-red-600 dark:border-red-900 dark:bg-red-950/30">
            {error}
          </div>
        )}

        {/* EMPTY */}

        {!error && bookings.length === 0 && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center shadow-sm">

            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              No bookings yet
            </h2>

            <p className="mt-3 text-[var(--text-secondary)]">
              You haven't booked any professional yet.
            </p>

            <Link
              to="/services"
              className="mt-6 inline-block rounded-lg bg-[var(--primary)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)]"
            >
              Find a Professional
            </Link>

          </div>
        )}

        {/* BOOKINGS */}

        {!error && bookings.length > 0 && (
          <div className="space-y-6">

            {bookings.map((booking) => {

              const isPaid =
                booking.paymentStatus ===
                "Paid";

              const isRejected =
                booking.bookingStatus ===
                "Rejected";

              const isCancelled =
                booking.bookingStatus ===
                "Cancelled";

              const canPay =
                booking.bookingStatus ===
                  "Accepted" &&
                !isPaid;

              return (
                <div
                  key={booking._id}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-[var(--text-primary)] shadow-sm transition-colors duration-300"
                >

                  <div className="grid gap-6 md:grid-cols-4">

                    {/* PROFESSIONAL */}

                    <div className="flex items-center gap-4">

                      <img
                        src={
                          booking.professional?.owner
                            ?.avatar ||
                          "https://via.placeholder.com/100"
                        }
                        alt={
                          booking.professional?.owner
                            ?.fullName ||
                          "Professional"
                        }
                        className="h-16 w-16 rounded-full border-2 border-[var(--primary)] object-cover"
                      />

                      <div>

                        <h2 className="font-bold text-[var(--text-primary)]">
                          {booking.professional?.owner
                            ?.fullName ||
                            "Professional"}
                        </h2>

                        <p className="text-sm text-[var(--primary)]">
                          {booking.professional
                            ?.profession}
                        </p>

                        <p className="text-sm text-[var(--text-secondary)]">
                          📍{" "}
                          {booking.professional?.owner
                            ?.city ||
                            "Location unavailable"}
                        </p>

                      </div>

                    </div>

                    {/* SERVICE */}

                    <div>

                      <p className="text-sm text-[var(--text-secondary)]">
                        Service
                      </p>

                      <h3 className="mt-1 font-semibold text-[var(--text-primary)]">
                        {booking.service?.title ||
                          "Service"}
                      </h3>

                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        {booking.service?.duration ||
                          0}{" "}
                        minutes
                      </p>

                    </div>

                    {/* DATE */}

                    <div>

                      <p className="text-sm text-[var(--text-secondary)]">
                        Booking Date
                      </p>

                      <p className="mt-1 font-semibold text-[var(--text-primary)]">
                        {new Date(
                          booking.bookingDate
                        ).toLocaleDateString()}
                      </p>

                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
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

                    </div>

                    {/* STATUS */}

                    <div>

                      <p className="text-sm text-[var(--text-secondary)]">
                        Status
                      </p>

                      <div className="mt-2">

                        {booking.bookingStatus ===
                        "Pending" ? (

                          <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400">
                            <span>🕐</span>
                            Waiting for professional to accept
                          </div>

                        ) : booking.bookingStatus ===
                          "Accepted" ? (

                          <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700 dark:bg-green-950/40 dark:text-green-400">
                            <span>✓</span>
                            Booking Accepted
                          </div>

                        ) : booking.bookingStatus ===
                          "Rejected" ? (

                          <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-700 dark:bg-red-950/40 dark:text-red-400">
                            <span>✕</span>
                            Booking Rejected
                          </div>

                        ) : booking.bookingStatus ===
                          "Completed" ? (

                          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
                            <span>✓</span>
                            Service Completed
                          </div>

                        ) : booking.bookingStatus ===
                          "Cancelled" ? (

                          <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                            <span>✕</span>
                            Booking Cancelled
                          </div>

                        ) : (

                          <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400">
                            <span>🕐</span>
                            {booking.bookingStatus ||
                              "Pending"}
                          </div>

                        )}

                      </div>

                      <p className="mt-3 text-sm text-[var(--text-secondary)]">

                        Payment:{" "}

                        <span
                          className={`font-semibold ${
                            isPaid
                              ? "text-green-600"
                              : "text-orange-600"
                          }`}
                        >
                          {booking.paymentStatus ||
                            "Pending"}
                        </span>

                      </p>

                    </div>

                  </div>

                  {/* BOTTOM */}

                  <div className="mt-6 flex flex-col gap-4 border-t border-[var(--border)] pt-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <p className="text-sm text-[var(--text-secondary)]">
                        Service Address
                      </p>

                      <p className="font-medium text-[var(--text-primary)]">
                        {booking.address ||
                          "Address unavailable"}
                      </p>

                    </div>

                    <div className="flex flex-wrap items-center gap-3">

                      <p className="mr-2 text-xl font-bold text-[var(--text-primary)]">
                        ₹
                        {booking.service?.price ||
                          0}
                      </p>

                      {/* PAY NOW */}

                      {canPay && (
                        <button
                          onClick={() =>
                            handlePayment(
                              booking
                            )
                          }
                          disabled={
                            payingBookingId ===
                            booking._id
                          }
                          className="rounded-lg bg-green-600 px-5 py-2 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {payingBookingId ===
                          booking._id
                            ? "Processing..."
                            : "Pay Now"}
                        </button>
                      )}

                      {/* PAID */}

                      {isPaid && (
                        <span className="rounded-lg bg-green-100 px-5 py-2 font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-400">
                          ✓ Paid
                        </span>
                      )}

                      {/* PENDING */}

                      {booking.bookingStatus ===
                        "Pending" && (
                        <span className="rounded-lg bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400">
                          Waiting for acceptance
                        </span>
                      )}

                      {/* REJECTED */}

                      {isRejected && (
                        <span className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 dark:bg-red-950/40 dark:text-red-400">
                          Professional rejected this request
                        </span>
                      )}

                      {/* CANCELLED */}

                      {isCancelled && (
                        <span className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                          Booking cancelled
                        </span>
                      )}

                      {/* RATE & REVIEW */}

                      {booking.bookingStatus ===
                        "Completed" && (
                        <button
                          onClick={() => {
                            setReviewBooking(
                              booking
                            );
                            setRating(5);
                            setComment("");
                          }}
                          className="rounded-lg bg-yellow-500 px-5 py-2 font-semibold text-white transition hover:bg-yellow-600"
                        >
                          ⭐ Rate & Review
                        </button>
                      )}

                      {/* DETAILS */}

                      <Link
                        to={`/booking-details/${booking._id}`}
                        className="rounded-lg bg-[var(--primary)] px-5 py-2 font-semibold text-white transition hover:bg-[var(--primary-hover)]"
                      >
                        View Details
                      </Link>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

      {/* REVIEW MODAL */}

      {reviewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-[var(--text-primary)] shadow-xl">

            <div className="flex items-center justify-between">

              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                Rate & Review
              </h2>

              <button
                onClick={() =>
                  setReviewBooking(null)
                }
                className="text-2xl text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
              >
                ×
              </button>

            </div>

            <p className="mt-2 text-[var(--text-secondary)]">

              How was your experience with{" "}

              <span className="font-semibold text-[var(--text-primary)]">
                {reviewBooking.professional?.owner
                  ?.fullName ||
                  "this professional"}
              </span>
              ?

            </p>

            {/* RATING */}

            <div className="mt-6">

              <p className="mb-3 font-medium text-[var(--text-primary)]">
                Your Rating
              </p>

              <div className="flex gap-2">

                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setRating(star)
                      }
                      className={`text-4xl transition ${
                        star <= rating
                          ? "text-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    >
                      ★
                    </button>
                  )
                )}

              </div>

              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                {rating} out of 5
              </p>

            </div>

            {/* COMMENT */}

            <div className="mt-6">

              <label className="mb-2 block font-medium text-[var(--text-primary)]">
                Your Review
              </label>

              <textarea
                value={comment}
                onChange={(e) =>
                  setComment(e.target.value)
                }
                maxLength={500}
                rows="5"
                placeholder="Share your experience..."
                className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
              />

              <p className="mt-1 text-right text-xs text-[var(--text-secondary)]">
                {comment.length}/500
              </p>

            </div>

            {/* BUTTONS */}

            <div className="mt-6 flex gap-3">

              <button
                onClick={() =>
                  setReviewBooking(null)
                }
                className="flex-1 rounded-lg border border-[var(--border)] px-5 py-3 font-semibold text-[var(--text-primary)] transition hover:bg-[var(--surface-secondary)]"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmitReview}
                disabled={reviewLoading}
                className="flex-1 rounded-lg bg-[var(--primary)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {reviewLoading
                  ? "Submitting..."
                  : "Submit Review"}
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}

export default MyBookings;