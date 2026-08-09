import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

function ProfessionalDetails() {
  const { professionalId } = useParams();

  const [professional, setProfessional] = useState(null);
  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // =========================
        // FETCH PROFESSIONAL
        // =========================

        const professionalResponse = await api.get(
          `/professional/${professionalId}`
        );

        console.log(
          "Professional Details:",
          professionalResponse.data
        );

        setProfessional(
          professionalResponse.data?.data
        );


        // =========================
        // FETCH SERVICES
        // =========================

        const servicesResponse = await api.get(
          "/service"
        );

        console.log(
          "Services Response:",
          servicesResponse.data
        );

        const allServices =
          servicesResponse.data?.data?.services || [];

        // Only services belonging to this professional

        const professionalServices =
          allServices.filter(
            (service) =>
              service.professional?._id ===
              professionalId
          );

        setServices(professionalServices);

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


  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-lg text-gray-500">
          Loading professional...
        </p>
      </main>
    );
  }


  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="text-center">

          <h2 className="text-2xl font-bold text-red-600">
            Something went wrong
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


  // =========================
  // PROFESSIONAL NOT FOUND
  // =========================

  if (!professional) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-gray-500">
          Professional not found.
        </p>
      </main>
    );
  }


  return (
    <main className="min-h-screen bg-slate-50 py-16">

      <div className="mx-auto max-w-5xl px-6">

        {/* =========================
            PROFILE CARD
        ========================== */}

        <div className="rounded-2xl bg-white p-8 shadow-lg">


          {/* =========================
              TOP SECTION
          ========================== */}

          <div className="flex flex-col items-center gap-6 md:flex-row">

            <img
              src={
                professional.owner?.avatar ||
                "https://via.placeholder.com/150"
              }
              alt={professional.owner?.fullName}
              className="h-32 w-32 rounded-full border-4 border-blue-500 object-cover"
            />

            <div className="text-center md:text-left">

              <h1 className="text-3xl font-bold text-slate-900">
                {professional.owner?.fullName}
              </h1>

              <p className="mt-1 text-xl font-medium text-blue-600">
                {professional.profession}
              </p>

              <p className="mt-2 text-gray-500">
                📍 {professional.owner?.city}
              </p>

              <p className="mt-2 text-yellow-500">
                ⭐ {professional.rating || 0}
              </p>

            </div>

          </div>


          {/* =========================
              BIO
          ========================== */}

          <div className="mt-10">

            <h2 className="text-xl font-bold text-slate-900">
              About
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              {professional.bio ||
                "No biography available."}
            </p>

          </div>


          {/* =========================
              DETAILS
          ========================== */}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-xl bg-slate-50 p-5 text-center">

              <p className="text-sm text-gray-500">
                Experience
              </p>

              <p className="mt-2 text-xl font-bold">
                {professional.experience || 0} years
              </p>

            </div>


            <div className="rounded-xl bg-slate-50 p-5 text-center">

              <p className="text-sm text-gray-500">
                Pricing
              </p>

              <p className="mt-2 text-xl font-bold">
                ₹{professional.pricing}
              </p>

            </div>


            <div className="rounded-xl bg-slate-50 p-5 text-center">

              <p className="text-sm text-gray-500">
                Availability
              </p>

              <p className="mt-2 text-xl font-bold">
                {professional.availability
                  ? "Available"
                  : "Unavailable"}
              </p>

            </div>


            <div className="rounded-xl bg-slate-50 p-5 text-center">

              <p className="text-sm text-gray-500">
                Rating
              </p>

              <p className="mt-2 text-xl font-bold">
                ⭐ {professional.rating || 0}
              </p>

            </div>

          </div>


          {/* =========================
              SKILLS
          ========================== */}

          {professional.skills?.length > 0 && (

            <div className="mt-10">

              <h2 className="text-xl font-bold">
                Skills
              </h2>

              <div className="mt-4 flex flex-wrap gap-3">

                {professional.skills.map(
                  (skill, index) => (

                    <span
                      key={index}
                      className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700"
                    >
                      {skill}
                    </span>

                  )
                )}

              </div>

            </div>

          )}


          {/* =========================
              SERVICE AREAS
          ========================== */}

          {professional.serviceAreas?.length > 0 && (

            <div className="mt-10">

              <h2 className="text-xl font-bold">
                Service Areas
              </h2>

              <div className="mt-4 flex flex-wrap gap-3">

                {professional.serviceAreas.map(
                  (area, index) => (

                    <span
                      key={index}
                      className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700"
                    >
                      📍 {area}
                    </span>

                  )
                )}

              </div>

            </div>

          )}


          {/* =========================
              SERVICES OFFERED
          ========================== */}

          <div className="mt-12">

            <h2 className="text-2xl font-bold text-slate-900">
              Services Offered
            </h2>

            {services.length === 0 ? (

              <p className="mt-4 text-gray-500">
                This professional has no services available yet.
              </p>

            ) : (

              <div className="mt-6 grid gap-6 md:grid-cols-2">

                {services.map((service) => (

                  <div
                    key={service._id}
                    className="rounded-xl border bg-slate-50 p-6 transition hover:shadow-md"
                  >

                    <h3 className="text-xl font-bold text-slate-900">
                      {service.title}
                    </h3>

                    <p className="mt-2 text-gray-600">
                      {service.description}
                    </p>

                    <p className="mt-4 text-sm text-gray-500">
                      Category: {service.category}
                    </p>

                    <div className="mt-5 flex items-end justify-between">

                      <div>

                        <p className="text-xl font-bold text-slate-900">
                          ₹{service.price}
                        </p>

                        <p className="text-sm text-gray-500">
                          {service.duration} minutes
                        </p>

                      </div>


                      <Link
                        to={`/booking/${professionalId}/${service._id}`}
                        className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-700"
                      >
                        Book This Service
                      </Link>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>


          {/* =========================
              ACTIONS
          ========================== */}

          <div className="mt-10">

            <Link
              to="/services"
              className="block w-full rounded-lg border border-gray-300 py-3 text-center font-semibold text-gray-700 hover:bg-gray-50"
            >
              Back to Services
            </Link>

          </div>

        </div>

      </div>

    </main>
  );
}

export default ProfessionalDetails;