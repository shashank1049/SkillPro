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
        setProfessionals(response.data.data.professionals);
      } catch (error) {
        console.error("Error fetching professionals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-12 text-center text-4xl font-bold">
          Featured Professionals
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">
            Loading professionals...
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {professionals.map((professional) => (
              <div
                key={professional._id}
                className="rounded-2xl border bg-white p-6 shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <img
                  src={professional.owner.avatar}
                  alt={professional.owner.fullName}
                  className="mx-auto h-24 w-24 rounded-full object-cover border-2 border-blue-500"
                />

                <h3 className="mt-4 text-center text-2xl font-semibold">
                  {professional.owner.fullName}
                </h3>

                <p className="text-center text-blue-600 font-medium">
                  {professional.profession}
                </p>

                <p className="mt-2 text-center text-gray-500">
                  📍 {professional.owner.city}
                </p>

                <p className="mt-2 text-center text-yellow-500">
                  ⭐ {professional.rating}
                </p>

                <p className="mt-2 text-center text-gray-700 font-semibold">
                  ₹{professional.pricing}
                </p>

                <Link
                  to={`/professional/${professional._id}`}
                  className="mt-6 block rounded-lg bg-blue-600 py-2 text-center text-white transition hover:bg-blue-700"
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