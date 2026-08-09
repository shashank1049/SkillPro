import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function Booking() {
  const { professionalId, serviceId } = useParams();
  const navigate = useNavigate();

  const [professional, setProfessional] = useState(null);
  const [service, setService] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const professionalResponse = await api.get(
          `/professional/${professionalId}`
        );

        console.log(
          "Booking Professional:",
          professionalResponse.data
        );

        setProfessional(
          professionalResponse.data?.data
        );

        const servicesResponse = await api.get(
          "/service"
        );

        console.log(
          "Booking Services:",
          servicesResponse.data
        );

        const allServices =
          servicesResponse.data?.data?.services || [];

        const selectedService = allServices.find(
          (item) =>
            String(item._id) === String(serviceId)
        );

        console.log(
          "Selected Service:",
          selectedService
        );

        if (!selectedService) {
          setError("Selected service not found.");
          return;
        }

        if (
          String(
            selectedService.professional?._id
          ) !== String(professionalId)
        ) {
          setError(
            "This service does not belong to this professional."
          );
          return;
        }

        setService(selectedService);
      } catch (error) {
        console.error(
          "Error fetching booking details:",
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

    fetchBookingDetails();
  }, [professionalId, serviceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      if (!bookingData.date) {
        setError("Please select a service date.");
        return;
      }

      if (!bookingData.time) {
        setError("Please select a preferred time.");
        return;
      }

      if (!bookingData.address.trim()) {
        setError("Please enter the service address.");
        return;
      }

      const bookingDate =
        `${bookingData.date}T${bookingData.time}`;

      const bookingPayload = {
        serviceId,
        bookingDate,
        address: bookingData.address.trim(),
        notes: bookingData.notes.trim(),
      };

      console.log(
        "Sending Booking:",
        bookingPayload
      );

      const bookingResponse = await api.post(
        "/booking/create",
        bookingPayload
      );

      console.log(
        "Booking Created:",
        bookingResponse.data
      );

      const booking =
        bookingResponse.data?.data;

      if (!booking?._id) {
        throw new Error(
          "Booking was not created."
        );
      }

      setSuccess(
        "Booking request sent successfully! Waiting for professional approval."
      );

      setTimeout(() => {
        navigate("/my-bookings");
      }, 1200);
    } catch (error) {
      console.error(
        "Booking Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to create booking."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <p className="text-lg text-[var(--text-secondary)]">
          Loading booking details...
        </p>
      </main>
    );
  }

  if (
    error &&
    (!professional || !service)
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6">
        <div className="text-center">

          <h2 className="text-2xl font-bold text-red-600">
            Unable to load booking
          </h2>

          <p className="mt-3 text-[var(--text-secondary)]">
            {error}
          </p>

          <Link
            to="/services"
            className="mt-6 inline-block rounded-lg bg-[var(--primary)] px-6 py-3 text-white transition hover:bg-[var(--primary-hover)]"
          >
            Back to Services
          </Link>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] py-12 transition-colors duration-300">

      <div className="mx-auto max-w-5xl px-6">

        <div className="grid gap-8 lg:grid-cols-3">

          {/* PROFESSIONAL */}

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">

            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Professional
            </h2>

            <img
              src={
                professional.owner?.avatar ||
                "https://via.placeholder.com/150"
              }
              alt={professional.owner?.fullName}
              className="mx-auto mt-6 h-28 w-28 rounded-full border-4 border-[var(--primary)] object-cover"
            />

            <h3 className="mt-5 text-center text-2xl font-bold text-[var(--text-primary)]">
              {professional.owner?.fullName}
            </h3>

            <p className="mt-1 text-center font-medium text-[var(--primary)]">
              {professional.profession}
            </p>

            <p className="mt-3 text-center text-[var(--text-secondary)]">
              📍 {professional.owner?.city}
            </p>

            <div className="mt-6 border-t border-[var(--border)] pt-5">

              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">
                  Rating
                </span>

                <span className="text-[var(--text-primary)]">
                  ⭐ {professional.rating || 0}
                </span>
              </div>

              <div className="mt-3 flex justify-between">
                <span className="text-[var(--text-secondary)]">
                  Experience
                </span>

                <span className="text-[var(--text-primary)]">
                  {professional.experience || 0} years
                </span>
              </div>

              <div className="mt-3 flex justify-between">
                <span className="text-[var(--text-secondary)]">
                  Service Price
                </span>

                <span className="font-bold text-[var(--text-primary)]">
                  ₹
                  {service?.price ||
                    professional.pricing}
                </span>
              </div>

            </div>

          </div>

          {/* BOOKING FORM */}

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm lg:col-span-2">

            <h1 className="text-3xl font-bold text-[var(--text-primary)]">
              Book a Professional
            </h1>

            <p className="mt-2 text-[var(--text-secondary)]">
              Send a booking request and wait for the professional to accept it.
            </p>

            {/* SERVICE */}

            {service && (
              <div className="mt-6 rounded-xl bg-[var(--primary-light)] p-5">

                <p className="text-sm font-medium text-[var(--primary)]">
                  Selected Service
                </p>

                <h2 className="mt-1 text-xl font-bold text-[var(--text-primary)]">
                  {service.title}
                </h2>

                <p className="mt-1 text-[var(--text-secondary)]">
                  {service.description}
                </p>

                <div className="mt-3 flex gap-6 text-sm text-[var(--text-primary)]">

                  <span>
                    💰 ₹{service.price}
                  </span>

                  <span>
                    ⏱ {service.duration} minutes
                  </span>

                </div>

              </div>
            )}

            {/* ERROR */}

            {error && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-900 dark:bg-red-950/30">
                {error}
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 font-medium text-green-700 dark:border-green-900 dark:bg-green-950/30">
                {success}
              </div>
            )}

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-6"
            >

              {/* DATE */}

              <div>

                <label className="mb-2 block font-medium text-[var(--text-primary)]">
                  Service Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={bookingData.date}
                  onChange={handleChange}
                  min={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  required
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                />

              </div>

              {/* TIME */}

              <div>

                <label className="mb-2 block font-medium text-[var(--text-primary)]">
                  Preferred Time
                </label>

                <input
                  type="time"
                  name="time"
                  value={bookingData.time}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                />

              </div>

              {/* ADDRESS */}

              <div>

                <label className="mb-2 block font-medium text-[var(--text-primary)]">
                  Service Address
                </label>

                <textarea
                  name="address"
                  value={bookingData.address}
                  onChange={handleChange}
                  placeholder="Enter the address where service is required"
                  rows="3"
                  required
                  className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                />

              </div>

              {/* NOTES */}

              <div>

                <label className="mb-2 block font-medium text-[var(--text-primary)]">
                  Additional Notes
                </label>

                <textarea
                  name="notes"
                  value={bookingData.notes}
                  onChange={handleChange}
                  placeholder="Any additional information for the professional..."
                  rows="4"
                  className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                />

              </div>

              {/* PRICE */}

              <div className="rounded-xl bg-[var(--surface-secondary)] p-5">

                <div className="flex items-center justify-between">

                  <span className="text-[var(--text-secondary)]">
                    Service Price
                  </span>

                  <span className="text-xl font-bold text-[var(--text-primary)]">
                    ₹
                    {service?.price ||
                      professional.pricing}
                  </span>

                </div>

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-[var(--primary)] py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Sending Request..."
                  : "Send Booking Request"}
              </button>

              <p className="text-center text-sm text-[var(--text-secondary)]">
                You will be able to pay after the professional accepts your booking.
              </p>

            </form>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Booking;