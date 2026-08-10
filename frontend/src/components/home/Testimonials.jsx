function Testimonials() {
  const testimonials = [
    {
      name: "Aman Sharma",
      role: "Customer",
      review:
        "HirePro made it really easy to find a reliable professional. The booking process was simple and quick.",
      rating: 5,
    },
    {
      name: "Priya Singh",
      role: "Customer",
      review:
        "I found a professional near me within minutes. The service was excellent and the whole experience was smooth.",
      rating: 5,
    },
    {
      name: "Rahul Verma",
      role: "Professional",
      review:
        "HirePro is a great platform for professionals to connect with customers and grow their work.",
      rating: 4,
    },
  ];

  return (
    <section className="bg-[var(--surface-secondary)] py-20 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <h2 className="text-4xl font-bold text-[var(--text-primary)]">
            What People Say
          </h2>

          <p className="mt-4 text-lg text-[var(--text-secondary)]">
            See what our customers and professionals think about HirePro.
          </p>

        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-[var(--text-primary)] shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >

              <div className="text-lg text-yellow-500">
                {"⭐".repeat(testimonial.rating)}
              </div>

              <p className="mt-5 leading-7 text-[var(--text-secondary)]">
                "{testimonial.review}"
              </p>

              <div className="mt-6 border-t border-[var(--border)] pt-5">

                <h3 className="font-semibold text-[var(--text-primary)]">
                  {testimonial.name}
                </h3>

                <p className="text-sm text-[var(--text-secondary)]">
                  {testimonial.role}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Testimonials;