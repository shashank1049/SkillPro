import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

function FeaturedProfessionals() {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const response = await api.get("/professional");

        setProfessionals(
          response.data.data.professionals
        );
      } catch (error) {
        console.error(
          "Error fetching professionals:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  return (
    <section className="bg-[var(--background)] py-20 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6">

        <h2 className="mb-12 text-center text-4xl font-bold text-[var(--text-primary)]">
          Featured Professionals
        </h2>

        {loading ? (
          <p className="text-center text-[var(--text-secondary)]">
            Loading professionals...
          </p>
        ) : professionals.length === 0 ? (
          <p className="text-center text-[var(--text-secondary)]">
            No professionals available.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">

            {professionals.map((professional) => (
              <div
                key={professional._id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-[var(--text-primary)] shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >

                <img
                  src={
                    professional.owner?.avatar ||
                    "https://via.placeholder.com/100"
                  }
                  alt={
                    professional.owner?.fullName ||
                    "Professional"
                  }
                  className="mx-auto h-24 w-24 rounded-full border-2 border-[var(--primary)] object-cover"
                />

                <h3 className="mt-4 text-center text-2xl font-semibold">
                  {professional.owner?.fullName ||
                    "Professional"}
                </h3>

                <p className="text-center font-medium text-[var(--primary)]">
                  {professional.profession}
                </p>

                <p className="mt-2 text-center text-[var(--text-secondary)]">
                  📍{" "}
                  {professional.owner?.city ||
                    "Location unavailable"}
                </p>

                <p className="mt-2 text-center text-yellow-500">
                  ⭐ {professional.rating || 0}
                </p>

                <p className="mt-2 text-center font-semibold text-[var(--text-primary)]">
                  ₹{professional.pricing}
                </p>

                <Link
                  to={`/professional/${professional._id}`}
                  className="mt-6 block rounded-lg bg-[var(--primary)] py-2 text-center text-white transition hover:bg-[var(--primary-hover)]"
                >
                  View Profile
                </Link>

              </div>
            ))}

          </div>
        )}

      </div>
    </section>
  );
}

export default FeaturedProfessionals;