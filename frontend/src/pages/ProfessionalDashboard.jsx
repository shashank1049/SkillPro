import { useEffect, useState } from "react";
import api from "../api/axios";

function ProfessionalDashboard() {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceActionLoading, setServiceActionLoading] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    duration: "",
    serviceImages: [],
  });

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError("");

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

      try {
        const servicesResponse = await api.get("/service/me");

        console.log(
          "Professional Services:",
          servicesResponse.data
        );

        setServices(
          servicesResponse.data?.data || []
        );
      } catch (serviceError) {
        console.error(
          "Professional Services Error:",
          serviceError
        );
        setServices([]);
      }

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

        setBookings([]);
      }

      setLoading(false);
    };

    fetchDashboard();
  }, []);

  const resetServiceForm = () => {
    setServiceForm({
      title: "",
      description: "",
      category: "",
      price: "",
      duration: "",
      serviceImages: [],
    });
    setEditingService(null);
  };

  const handleServiceChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "serviceImages") {
      setServiceForm((prev) => ({
        ...prev,
        serviceImages: Array.from(files || []).slice(0, 5),
      }));
      return;
    }

    setServiceForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !serviceForm.title.trim() ||
      !serviceForm.description.trim() ||
      !serviceForm.category.trim() ||
      serviceForm.price === "" ||
      serviceForm.duration === ""
    ) {
      setError("Please fill all required service fields.");
      return;
    }

    if (Number(serviceForm.price) < 0) {
      setError("Price cannot be negative.");
      return;
    }

    if (Number(serviceForm.duration) <= 0) {
      setError("Duration must be greater than zero.");
      return;
    }

    try {
      setServiceActionLoading(true);

      const formData = new FormData();
      formData.append("title", serviceForm.title.trim());
      formData.append("description", serviceForm.description.trim());
      formData.append("category", serviceForm.category.trim());
      formData.append("price", serviceForm.price);
      formData.append("duration", serviceForm.duration);

      serviceForm.serviceImages.forEach((file) => {
        formData.append("serviceImages", file);
      });

      const response = await api.post(
        "/service/create",
        formData
      );

      const createdService = response.data?.data;

      if (createdService) {
        setServices((prev) => [createdService, ...prev]);
      } else {
        const refreshed = await api.get("/service/me");
        setServices(refreshed.data?.data || []);
      }

      resetServiceForm();
      setShowServiceForm(false);
    } catch (serviceError) {
      console.error(
        "Create Service Error:",
        serviceError
      );

      setError(
        serviceError.response?.data?.message ||
          "Unable to create service."
      );
    } finally {
      setServiceActionLoading(false);
    }
  };

  const startEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      title: service.title || "",
      description: service.description || "",
      category: service.category || "",
      price: service.price ?? "",
      duration: service.duration ?? "",
      serviceImages: [],
    });
    setShowServiceForm(true);
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    setError("");

    if (!editingService) return;

    if (
      !serviceForm.title.trim() ||
      !serviceForm.description.trim() ||
      !serviceForm.category.trim() ||
      serviceForm.price === "" ||
      serviceForm.duration === ""
    ) {
      setError("Please fill all required service fields.");
      return;
    }

    if (Number(serviceForm.price) < 0) {
      setError("Price cannot be negative.");
      return;
    }

    if (Number(serviceForm.duration) <= 0) {
      setError("Duration must be greater than zero.");
      return;
    }

    try {
      setServiceActionLoading(true);

      const response = await api.patch(
        `/service/${editingService._id}`,
        {
          title: serviceForm.title.trim(),
          description: serviceForm.description.trim(),
          category: serviceForm.category.trim(),
          price: Number(serviceForm.price),
          duration: Number(serviceForm.duration),
        }
      );

      const updatedService = response.data?.data;

      if (updatedService) {
        setServices((prev) =>
          prev.map((service) =>
            service._id === editingService._id
              ? updatedService
              : service
          )
        );
      }

      resetServiceForm();
      setShowServiceForm(false);
    } catch (serviceError) {
      console.error(
        "Update Service Error:",
        serviceError
      );

      setError(
        serviceError.response?.data?.message ||
          "Unable to update service."
      );
    } finally {
      setServiceActionLoading(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmed) return;

    try {
      setServiceActionLoading(true);
      setError("");

      await api.delete(`/service/${serviceId}`);

      setServices((prev) =>
        prev.filter((service) => service._id !== serviceId)
      );
    } catch (serviceError) {
      console.error(
        "Delete Service Error:",
        serviceError
      );

      setError(
        serviceError.response?.data?.message ||
          "Unable to delete service."
      );
    } finally {
      setServiceActionLoading(false);
    }
  };

  const handleToggleService = async (service) => {
    try {
      setServiceActionLoading(true);
      setError("");

      const response = await api.patch(
        `/service/${service._id}`,
        {
          isActive: !service.isActive,
        }
      );

      const updatedService = response.data?.data;

      if (updatedService) {
        setServices((prev) =>
          prev.map((item) =>
            item._id === service._id
              ? updatedService
              : item
          )
        );
      }
    } catch (serviceError) {
      console.error(
        "Toggle Service Error:",
        serviceError
      );

      setError(
        serviceError.response?.data?.message ||
          "Unable to update service status."
      );
    } finally {
      setServiceActionLoading(false);
    }
  };

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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] transition-colors duration-300">
        <p className="text-lg text-[var(--text-secondary)]">
          Loading dashboard...
        </p>
      </main>
    );
  }

  if (error && !profile) {
    return (
      <main className="min-h-screen bg-[var(--background)] px-6 py-20 transition-colors duration-300">

        <div className="mx-auto max-w-3xl">

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center shadow-lg">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--primary-light)] text-4xl">
              💼
            </div>

            <h1 className="mt-6 text-3xl font-bold text-[var(--text-primary)]">
              Become a Professional
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-lg leading-7 text-[var(--text-secondary)]">
              Have a skill that you want to offer?
              Join HirePro as a professional and
              connect with customers looking for
              your services.
            </p>

            <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">

              <div className="rounded-xl bg-[var(--surface-secondary)] p-5">
                <div className="text-2xl">
                  👤
                </div>

                <h3 className="mt-3 font-semibold text-[var(--text-primary)]">
                  Create Profile
                </h3>

                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Showcase your skills and experience.
                </p>
              </div>

              <div className="rounded-xl bg-[var(--surface-secondary)] p-5">
                <div className="text-2xl">
                  📋
                </div>

                <h3 className="mt-3 font-semibold text-[var(--text-primary)]">
                  Get Bookings
                </h3>

                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Receive service requests from customers.
                </p>
              </div>

              <div className="rounded-xl bg-[var(--surface-secondary)] p-5">
                <div className="text-2xl">
                  💰
                </div>

                <h3 className="mt-3 font-semibold text-[var(--text-primary)]">
                  Earn Money
                </h3>

                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Turn your skills into a source of income.
                </p>
              </div>

            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">

              <a
                href="/login?role=professional"
                className="rounded-lg bg-[var(--primary)] px-8 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)]"
              >
                Login as Professional
              </a>

              <a
                href="/register?role=professional"
                className="rounded-lg border border-[var(--primary)] px-8 py-3 font-semibold text-[var(--primary)] transition hover:bg-[var(--primary-light)]"
              >
                Register as Professional
              </a>

            </div>

            <p className="mt-6 text-sm text-[var(--text-secondary)]">
              Already offering services on HirePro?
              Login to manage your professional account.
            </p>

          </div>

        </div>

      </main>
    );
  }

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

  return (
    <main className="min-h-screen bg-[var(--background)] py-12 transition-colors duration-300">

      <div className="mx-auto max-w-7xl px-6">

        {/* HEADER */}

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

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-900 dark:bg-red-950/30">
            {error}
          </div>
        )}

        {/* STATS */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <p className="text-sm text-[var(--text-secondary)]">
              Pending Bookings
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {pendingBookings}
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <p className="text-sm text-[var(--text-secondary)]">
              Accepted Bookings
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
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

            <p className="mt-2 text-3xl font-bold text-red-600">
              {rejectedBookings}
            </p>
          </div>

        </div>

        {/* PROFILE */}

        {profile && (
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
                      ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
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

        {/* SERVICES */}

        <section className="mt-10">

          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                My Services
              </h2>

              <p className="mt-1 text-[var(--text-secondary)]">
                Add and manage the services you offer to customers.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                resetServiceForm();
                setShowServiceForm(true);
              }}
              className="rounded-lg bg-[var(--primary)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)]"
            >
              + Add Service
            </button>
          </div>

          {showServiceForm && (
            <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">
                    {editingService ? "Edit Service" : "Add New Service"}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    {editingService
                      ? "Update the details of your service."
                      : "Add a service that customers can book."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    resetServiceForm();
                    setShowServiceForm(false);
                  }}
                  className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-secondary)]"
                >
                  Close
                </button>
              </div>

              <form
                onSubmit={
                  editingService
                    ? handleUpdateService
                    : handleCreateService
                }
                className="space-y-5"
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block font-medium text-[var(--text-primary)]">
                      Service Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={serviceForm.title}
                      onChange={handleServiceChange}
                      placeholder="e.g. Car General Service"
                      required
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-medium text-[var(--text-primary)]">
                      Category *
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={serviceForm.category}
                      onChange={handleServiceChange}
                      placeholder="e.g. Car Repair"
                      required
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-medium text-[var(--text-primary)]">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={serviceForm.description}
                    onChange={handleServiceChange}
                    placeholder="Describe what is included in this service..."
                    rows="4"
                    required
                    className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block font-medium text-[var(--text-primary)]">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={serviceForm.price}
                      onChange={handleServiceChange}
                      min="0"
                      placeholder="e.g. 800"
                      required
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-medium text-[var(--text-primary)]">
                      Duration (minutes) *
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={serviceForm.duration}
                      onChange={handleServiceChange}
                      min="1"
                      placeholder="e.g. 60"
                      required
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
                    />
                  </div>
                </div>

                {!editingService && (
                  <div>
                    <label className="mb-2 block font-medium text-[var(--text-primary)]">
                      Service Images
                    </label>
                    <input
                      type="file"
                      name="serviceImages"
                      accept="image/*"
                      multiple
                      onChange={handleServiceChange}
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-[var(--text-primary)] file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--primary-light)] file:px-4 file:py-2 file:font-medium file:text-[var(--primary)]"
                    />
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                      You can upload up to 5 images.
                    </p>
                    {serviceForm.serviceImages.length > 0 && (
                      <p className="mt-2 text-sm text-[var(--text-secondary)]">
                        {serviceForm.serviceImages.length} image(s) selected
                      </p>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      resetServiceForm();
                      setShowServiceForm(false);
                    }}
                    className="rounded-lg border border-[var(--border)] px-6 py-3 font-semibold text-[var(--text-primary)] transition hover:bg-[var(--surface-secondary)]"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={serviceActionLoading}
                    className="rounded-lg bg-[var(--primary)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {serviceActionLoading
                      ? editingService
                        ? "Updating..."
                        : "Creating..."
                      : editingService
                      ? "Update Service"
                      : "Create Service"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {services.length === 0 ? (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center shadow-sm">
              <div className="text-4xl">🛠️</div>
              <h3 className="mt-4 text-xl font-bold text-[var(--text-primary)]">
                No services added yet
              </h3>
              <p className="mt-2 text-[var(--text-secondary)]">
                Add your first service so customers can book you.
              </p>

              {!showServiceForm && (
                <button
                  type="button"
                  onClick={() => {
                    resetServiceForm();
                    setShowServiceForm(true);
                  }}
                  className="mt-6 rounded-lg bg-[var(--primary)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)]"
                >
                  + Add Your First Service
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm"
                >
                  {service.serviceImages?.length > 0 && (
                    <img
                      src={service.serviceImages[0]}
                      alt={service.title}
                      className="h-48 w-full object-cover"
                    />
                  )}

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-[var(--text-primary)]">
                          {service.title}
                        </h3>
                        <p className="mt-1 text-sm text-[var(--primary)]">
                          {service.category}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          service.isActive !== false
                            ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {service.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-[var(--text-secondary)]">
                      {service.description}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-[var(--surface-secondary)] p-4">
                      <div>
                        <p className="text-xs text-[var(--text-secondary)]">
                          Price
                        </p>
                        <p className="mt-1 text-lg font-bold text-[var(--text-primary)]">
                          ₹{service.price}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[var(--text-secondary)]">
                          Duration
                        </p>
                        <p className="mt-1 text-lg font-bold text-[var(--text-primary)]">
                          {service.duration} min
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <button
                        type="button"
                        onClick={() => startEditService(service)}
                        disabled={serviceActionLoading}
                        className="rounded-lg border border-[var(--primary)] px-4 py-2.5 font-semibold text-[var(--primary)] transition hover:bg-[var(--primary-light)] disabled:opacity-60"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleService(service)}
                        disabled={serviceActionLoading}
                        className="rounded-lg border border-[var(--border)] px-4 py-2.5 font-semibold text-[var(--text-primary)] transition hover:bg-[var(--surface-secondary)] disabled:opacity-60"
                      >
                        {service.isActive !== false ? "Disable" : "Enable"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteService(service._id)}
                        disabled={serviceActionLoading}
                        className="rounded-lg bg-red-600 px-4 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* BOOKINGS */}

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
                          ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                          : booking.bookingStatus ===
                            "Rejected"
                          ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                          : booking.bookingStatus ===
                            "Completed"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                          : booking.bookingStatus ===
                            "Cancelled"
                          ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400"
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
                        className="flex-1 rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
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
                        className="flex-1 rounded-lg bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
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