function WhyChooseUs() {
  const features = [
    {
      icon: "✅",
      title: "Verified Professionals",
      description:
        "Every professional is verified to ensure quality and trust.",
    },
    {
      icon: "⚡",
      title: "Instant Booking",
      description:
        "Book skilled professionals in just a few clicks anytime.",
    },
    {
      icon: "⭐",
      title: "Trusted Reviews",
      description:
        "Read genuine ratings and reviews before hiring.",
    },
    {
      icon: "💳",
      title: "Secure Payments",
      description:
        "Safe and secure online payment with Razorpay integration.",
    },
  ];

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6">

        {/* Section Heading */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-900">
            Why Choose SkillPro?
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Everything you need to hire trusted professionals with confidence.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white p-8 text-center shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="text-5xl">
                {feature.icon}
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                {feature.title}
              </h3>

              <p className="mt-3 text-gray-600">
                {feature.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default WhyChooseUs;