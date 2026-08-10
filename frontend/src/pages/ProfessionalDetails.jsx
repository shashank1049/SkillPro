import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

function ProfessionalDetails() {
  const { professionalId } = useParams();

  const [professional, setProfessional] =
    useState(null);

  const [services, setServices] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // FETCH PROFESSIONAL + SERVICES
  // ==========================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // FETCH PROFESSIONAL

        const professionalResponse =
          await api.get(
            `/professional/${professionalId}`
          );

        console.log(
          "Professional Details:",
          professionalResponse.data
        );

        setProfessional(
          professionalResponse.data?.data
        );

        // FETCH SERVICES

        const servicesResponse =
          await api.get("/service");

        console.log(
          "Services Response:",
          servicesResponse.data
        );

        const allServices =
          servicesResponse.data?.data
            ?.services || [];

        // ONLY THIS PROFESSIONAL'S SERVICES

        const professionalServices =
          allServices.filter(
            (service) =>
              service.professional?._id ===
              professionalId
          );

        setServices(
          professionalServices
        );

      } catch (error) {
        console.error(
          "Error fetching professional details:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load professional profile."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [professionalId]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] transition-colors duration-300">

        <p className="text-lg text-[var(--text-secondary)]">
          Loading professional...
        </p>

      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 transition-colors duration-300">

        <div className="text-center">

          <h2 className="text-2xl font-bold text-red-600">
            Something went wrong
          </h2>

          <p className="mt-3 text-[var(--text-secondary)]">
            {error}
          </p>

          <Link
            to="/services"
            className="mt-6 inline-block rounded-lg bg-[var(--primary)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)]"
          >
            Back to Services
          </Link>

        </div>

      </main>
    );
  }

  // ==========================================
  // PROFESSIONAL NOT FOUND
  // ==========================================

  if (!professional) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] transition-colors duration-300">

        <p className="text-[var(--text-secondary)]">
          Professional not found.
        </p>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] py-12 transition-colors duration-300">

      <div className="mx-auto max-w-6xl px-6">

        {/* =====================================
            BACK BUTTON
        ====================================== */}

        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)] transition hover:opacity-80"
        >
          ← Back to Services
        </Link>

        {/* =====================================
            PROFESSIONAL PROFILE
        ====================================== */}

        <div className="mt-6 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">

          <div className="p-8 md:p-10">

            <div className="flex flex-col items-center gap-8 md:flex-row">

              {/* AVATAR */}

              <img
                src={
                  professional.owner?.avatar ||
                  "https://via.placeholder.com/200"
                }
                alt={
                  professional.owner?.fullName ||
                  "Professional"
                }
                className="h-36 w-36 rounded-full border-4 border-[var(--primary)] object-cover"
              />

              {/* INFO */}

              <div className="flex-1 text-center md:text-left">

                <h1 className="text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
                  {professional.owner
                    ?.fullName ||
                    "Professional"}
                </h1>

                <p className="mt-2 text-lg font-semibold text-[var(--primary)]">
                  {professional.profession}
                </p>

                <p className="mt-2 text-[var(--text-secondary)]">
                  📍{" "}
                  {professional.owner?.city ||
                    "Location not available"}
                </p>

                <div className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start">

                  <span className="rounded-full bg-[var(--surface-secondary)] px-4 py-2 text-sm font-medium text-[var(--text-primary)]">
                    ⭐{" "}
                    {professional.rating ||
                      0}{" "}
                    Rating
                  </span>

                  <span className="rounded-full bg-[var(--surface-secondary)] px-4 py-2 text-sm font-medium text-[var(--text-primary)]">
                    {professional.experience ||
                      0}{" "}
                    Years Experience
                  </span>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      professional.availability
                        ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                    }`}
                  >
                    {professional.availability
                      ? "● Available"
                      : "● Not Available"}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* =====================================
            ABOUT + SKILLS
        ====================================== */}

        <div className="mt-8 grid gap-8 md:grid-cols-2">

          {/* ABOUT */}

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-sm">

            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              About Professional
            </h2>

            <p className="mt-4 leading-7 text-[var(--text-secondary)]">
              {professional.bio ||
                "No bio available for this professional."}
            </p>

          </div>

          {/* SKILLS */}

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-sm">

            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Skills
            </h2>

            {professional.skills?.length >
            0 ? (

              <div className="mt-4 flex flex-wrap gap-2">

                {professional.skills.map(
                  (skill, index) => (

                    <span
                      key={index}
                      className="rounded-full bg-[var(--primary-light)] px-4 py-2 text-sm font-medium text-[var(--primary)]"
                    >
                      {skill}
                    </span>

                  )
                )}

              </div>

            ) : (

              <p className="mt-4 text-[var(--text-secondary)]">
                No skills added yet.
              </p>

            )}

          </div>

        </div>

        {/* =====================================
            SERVICE AREA
        ====================================== */}

        <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-sm">

          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Service Areas
          </h2>

          {professional.serviceAreas
            ?.length > 0 ? (

            <div className="mt-4 flex flex-wrap gap-3">

              {professional.serviceAreas.map(
                (area, index) => (

                  <span
                    key={index}
                    className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-secondary)]"
                  >
                    📍 {area}
                  </span>

                )
              )}

            </div>

          ) : (

            <p className="mt-4 text-[var(--text-secondary)]">
              Service area information not
              available.
            </p>

          )}

        </div>

        {/* =====================================
            SERVICES
        ====================================== */}

        <section className="mt-10">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                Services Offered
              </h2>

              <p className="mt-1 text-[var(--text-secondary)]">
                Choose a service and book this
                professional.
              </p>

            </div>

            <span className="rounded-full bg-[var(--surface-secondary)] px-4 py-2 text-sm font-medium text-[var(--text-primary)]">
              {services.length}{" "}
              {services.length === 1
                ? "Service"
                : "Services"}
            </span>

          </div>

          {/* NO SERVICES */}

          {services.length === 0 ? (

            <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-14 text-center shadow-sm">

              <div className="text-5xl">
                🛠️
              </div>

              <h3 className="mt-4 text-xl font-semibold text-[var(--text-primary)]">
                No services available
              </h3>

              <p className="mt-2 text-[var(--text-secondary)]">
                This professional hasn't added
                any services yet.
              </p>

            </div>

          ) : (

            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {services.map(
                (service) => (

                  <div
                    key={service._id}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >

                    {/* SERVICE TITLE */}

                    <h3 className="text-xl font-bold text-[var(--text-primary)]">
                      {service.title}
                    </h3>

                    {/* DESCRIPTION */}

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--text-secondary)]">
                      {service.description ||
                        "Professional service available on HirePro."}
                    </p>

                    {/* PRICE + DURATION */}

                    <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-5">

                      <div>

                        <p className="text-xs text-[var(--text-secondary)]">
                          Price
                        </p>

                        <p className="text-xl font-bold text-[var(--text-primary)]">
                          ₹{service.price}
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="text-xs text-[var(--text-secondary)]">
                          Duration
                        </p>

                        <p className="font-semibold text-[var(--text-primary)]">
                          {service.duration ||
                            0}{" "}
                          min
                        </p>

                      </div>

                    </div>

                    {/* BOOK BUTTON */}

                    <Link
                      to={`/booking/${professional._id}/${service._id}`}
                      className="mt-6 block w-full rounded-lg bg-[var(--primary)] py-3 text-center font-semibold text-white transition hover:bg-[var(--primary-hover)]"
                    >
                      Book This Service
                    </Link>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </div>

    </main>
  );
}

export default ProfessionalDetails;