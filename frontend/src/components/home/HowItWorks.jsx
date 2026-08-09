function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: "🔍",
      title: "Find a Service",
      description:
        "Browse different services and find the right professional for your needs.",
    },
    {
      number: "02",
      icon: "📅",
      title: "Book a Professional",
      description:
        "Choose a professional, select a suitable date and place your booking.",
    },
    {
      number: "03",
      icon: "✅",
      title: "Get the Job Done",
      description:
        "The professional completes the work and you can leave a rating and review.",
    },
  ];

  return (
    <section className="bg-[var(--surface)] py-20 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <h2 className="text-4xl font-bold text-[var(--text-primary)]">
            How It Works
          </h2>

          <p className="mt-4 text-lg text-[var(--text-secondary)]">
            Get the help you need in just three simple steps.
          </p>

        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-3">

          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface-secondary)] p-8 text-center text-[var(--text-primary)] shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >

              <div className="absolute right-5 top-5 text-sm font-bold text-[var(--primary)]">
                {step.number}
              </div>

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--primary-light)] text-4xl">
                {step.icon}
              </div>

              <h3 className="mt-6 text-2xl font-semibold">
                {step.title}
              </h3>

              <p className="mt-4 leading-7 text-[var(--text-secondary)]">
                {step.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default HowItWorks;