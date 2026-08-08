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
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">

        {/* SECTION HEADING START */}

        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-900">
            How It Works
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Get the help you need in just three simple steps.
          </p>
        </div>

        {/* SECTION HEADING END */}


        {/* STEPS START */}

        <div className="relative mt-16 grid gap-10 md:grid-cols-3">

          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-2xl border bg-slate-50 p-8 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >

              {/* Step Number */}

              <div className="absolute right-5 top-5 text-sm font-bold text-blue-600">
                {step.number}
              </div>


              {/* Icon */}

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-4xl">
                {step.icon}
              </div>


              {/* Title */}

              <h3 className="mt-6 text-2xl font-semibold text-slate-900">
                {step.title}
              </h3>


              {/* Description */}

              <p className="mt-4 leading-7 text-gray-600">
                {step.description}
              </p>

            </div>
          ))}

        </div>

        {/* STEPS END */}

      </div>
    </section>
  );
}

export default HowItWorks;