import { useEffect, useState } from "react";
import api from "../../api/axios";

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await api.get("/review/home");

        console.log("Testimonials:", response.data);

        setTestimonials(response.data?.data || []);
      } catch (error) {
        console.error("Testimonials Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="bg-[var(--surface-secondary)] py-20 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6">

        {/* HEADER */}

        <div className="mx-auto max-w-2xl text-center">

          <span className="inline-block rounded-full bg-[var(--primary-light)] px-4 py-2 text-sm font-semibold text-[var(--primary)]">
            Customer Stories
          </span>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text-primary)] md:text-5xl">
            What People Say
          </h2>

          <p className="mt-4 text-lg leading-7 text-[var(--text-secondary)]">
            See what our customers think about their experience with HirePro.
          </p>

        </div>


        {/* LOADING */}

        {loading && (
          <div className="mt-14 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--primary)]"></div>
          </div>
        )}


        {/* NO REVIEWS */}

        {!loading && testimonials.length === 0 && (
          <div className="mx-auto mt-14 max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center shadow-sm">

            <div className="text-4xl">
              ⭐
            </div>

            <h3 className="mt-4 text-xl font-bold text-[var(--text-primary)]">
              No reviews yet
            </h3>

            <p className="mt-2 text-[var(--text-secondary)]">
              Be one of the first customers to share your HirePro experience.
            </p>

          </div>
        )}


        {/* TESTIMONIALS */}

        {!loading && testimonials.length > 0 && (
          <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">

            {testimonials.map((testimonial) => {

              const customer = testimonial.customer;

              const customerName =
                customer?.fullName || "HirePro User";

              return (
                <div
                  key={testimonial._id}
                  className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >

                  {/* TOP */}

                  <div className="flex items-start justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary-light)] text-2xl text-[var(--primary)]">
                      "
                    </div>

                    {/* RATING */}

                    <div className="rounded-full bg-yellow-50 px-3 py-1 text-sm dark:bg-yellow-900/20">
                      {"⭐".repeat(testimonial.rating)}
                    </div>

                  </div>


                  {/* REVIEW */}

                  <p className="mt-6 text-[15px] leading-7 text-[var(--text-secondary)]">
                    "{testimonial.comment}"
                  </p>


                  {/* CUSTOMER */}

                  <div className="mt-7 flex items-center gap-3 border-t border-[var(--border)] pt-5">

                    {customer?.avatar ? (
                      <img
                        src={customer.avatar}
                        alt={customerName}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--primary)] font-semibold text-white">
                        {customerName
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div>

                      <h3 className="font-semibold text-[var(--text-primary)]">
                        {customerName}
                      </h3>

                      <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
                        Verified Customer
                      </p>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </section>
  );
}

export default Testimonials;