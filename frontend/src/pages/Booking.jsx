import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

function Booking() {
  const { professionalId, serviceId } = useParams();

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

  // ==========================================
  // FETCH PROFESSIONAL + SERVICE
  // ==========================================

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch Professional
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

        // Fetch Services
        const servicesResponse = await api.get(
          "/service"
        );

        console.log(
          "Booking Services:",
          servicesResponse.data
        );

        const allServices =
          servicesResponse.data?.data?.services || [];

        // Find selected service
        const selectedService = allServices.find(
          (item) => item._id === serviceId
        );

        console.log(
          "Selected Service:",
          selectedService
        );

        if (!selectedService) {
          setError("Selected service not found.");
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

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // CREATE BOOKING
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      // Combine date + time
      const bookingDate = `${bookingData.date}T${bookingData.time}`;

      console.log("Sending Booking:", {
        serviceId,
        bookingDate,
        address: bookingData.address,
        notes: bookingData.notes,
      });

      // POST REQUEST TO BACKEND
      const response = await api.post(
        "/booking/create",
        {
          serviceId,
          bookingDate,
          address: bookingData.address,
          notes: bookingData.notes,
        }
      );

      console.log(
        "Booking Created:",
        response.data
      );

      setSuccess(
        "Booking created successfully!"
      );

      // Clear form
      setBookingData({
        date: "",
        time: "",
        address: "",
        notes: "",
      });

    } catch (error) {
      console.error(
        "Booking Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to create booking."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-lg text-gray-500">
          Loading booking details...
        </p>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error && (!professional || !service)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="text-center">

          <h2 className="text-2xl font-bold text-red-600">
            Unable to load booking
          </h2>

          <p className="mt-3 text-gray-500">
            {error}
          </p>

          <Link
            to="/services"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Back to Services
          </Link>

        </div>
      </main>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <main className="min-h-screen bg-slate-50 py-12">

      <div className="mx-auto max-w-5xl px-6">

        <div className="grid gap-8 lg:grid-cols-3">

          {/* =================================
              PROFESSIONAL SUMMARY
          ================================== */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-slate-900">
              Professional
            </h2>

            <img
              src={
                professional.owner?.avatar ||
                "https://via.placeholder.com/150"
              }
              alt={professional.owner?.fullName}
              className="mx-auto mt-6 h-28 w-28 rounded-full border-4 border-blue-500 object-cover"
            />

            <h3 className="mt-5 text-center text-2xl font-bold">
              {professional.owner?.fullName}
            </h3>

            <p className="mt-1 text-center font-medium text-blue-600">
              {professional.profession}
            </p>

            <p className="mt-3 text-center text-gray-500">
              📍 {professional.owner?.city}
            </p>

            <div className="mt-6 border-t pt-5">

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Rating
                </span>

                <span>
                  ⭐ {professional.rating || 0}
                </span>
              </div>

              <div className="mt-3 flex justify-between">
                <span className="text-gray-500">
                  Experience
                </span>

                <span>
                  {professional.experience || 0} years
                </span>
              </div>

              <div className="mt-3 flex justify-between">
                <span className="text-gray-500">
                  Price
                </span>

                <span className="font-bold">
                  ₹{service?.price || professional.pricing}
                </span>
              </div>

            </div>

          </div>


          {/* =================================
              BOOKING FORM
          ================================== */}

          <div className="rounded-2xl bg-white p-8 shadow-sm lg:col-span-2">

            <h1 className="text-3xl font-bold text-slate-900">
              Book a Professional
            </h1>

            <p className="mt-2 text-gray-500">
              Choose your preferred date and time.
            </p>


            {/* SELECTED SERVICE */}

            {service && (
              <div className="mt-6 rounded-xl bg-blue-50 p-5">

                <p className="text-sm font-medium text-blue-600">
                  Selected Service
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {service.title}
                </h2>

                <p className="mt-1 text-gray-600">
                  {service.description}
                </p>

                <div className="mt-3 flex gap-6 text-sm">

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
              <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-600">
                {error}
              </div>
            )}


            {/* SUCCESS */}

            {success && (
              <div className="mt-6 rounded-lg bg-green-50 p-4 font-medium text-green-700">
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

                <label className="mb-2 block font-medium text-gray-700">
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* TIME */}

              <div>

                <label className="mb-2 block font-medium text-gray-700">
                  Preferred Time
                </label>

                <input
                  type="time"
                  name="time"
                  value={bookingData.time}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* ADDRESS */}

              <div>

                <label className="mb-2 block font-medium text-gray-700">
                  Service Address
                </label>

                <textarea
                  name="address"
                  value={bookingData.address}
                  onChange={handleChange}
                  placeholder="Enter the address where service is required"
                  rows="3"
                  required
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* NOTES */}

              <div>

                <label className="mb-2 block font-medium text-gray-700">
                  Additional Notes
                </label>

                <textarea
                  name="notes"
                  value={bookingData.notes}
                  onChange={handleChange}
                  placeholder="Any additional information for the professional..."
                  rows="4"
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* PRICE SUMMARY */}

              <div className="rounded-xl bg-slate-50 p-5">

                <div className="flex items-center justify-between">

                  <span className="text-gray-600">
                    Service Price
                  </span>

                  <span className="text-xl font-bold text-slate-900">
                    ₹{service?.price || professional.pricing}
                  </span>

                </div>

              </div>


              {/* SUBMIT */}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Creating Booking..."
                  : "Continue to Booking"}
              </button>

            </form>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Booking;