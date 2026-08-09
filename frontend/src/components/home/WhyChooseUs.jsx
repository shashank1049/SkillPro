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
    <section className="bg-[var(--surface-secondary)] py-20 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <h2 className="text-4xl font-bold text-[var(--text-primary)]">
            Why Choose SkillPro?
          </h2>

          <p className="mt-4 text-lg text-[var(--text-secondary)]">
            Everything you need to hire trusted professionals with confidence.
          </p>

        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-[var(--text-primary)] shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >

              <div className="text-5xl">
                {feature.icon}
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                {feature.title}
              </h3>

              <p className="mt-3 text-[var(--text-secondary)]">
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