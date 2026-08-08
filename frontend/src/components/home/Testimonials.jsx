function Testimonials() {
  const testimonials = [
    {
      name: "Aman Sharma",
      role: "Customer",
      review:
        "SkillPro made it really easy to find a reliable professional. The booking process was simple and quick.",
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
        "SkillPro is a great platform for professionals to connect with customers and grow their work.",
      rating: 4,
    },
  ];

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6">

        {/* SECTION HEADING START */}

        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-900">
            What People Say
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            See what our customers and professionals think about SkillPro.
          </p>
        </div>

        {/* SECTION HEADING END */}


        {/* TESTIMONIAL CARDS START */}

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >

              {/* Rating */}

              <div className="text-lg text-yellow-500">
                {"⭐".repeat(testimonial.rating)}
              </div>


              {/* Review */}

              <p className="mt-5 leading-7 text-gray-600">
                "{testimonial.review}"
              </p>


              {/* User */}

              <div className="mt-6 border-t pt-5">
                <h3 className="font-semibold text-slate-900">
                  {testimonial.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {testimonial.role}
                </p>
              </div>

            </div>
          ))}

        </div>

        {/* TESTIMONIAL CARDS END */}

      </div>
    </section>
  );
}

export default Testimonials;