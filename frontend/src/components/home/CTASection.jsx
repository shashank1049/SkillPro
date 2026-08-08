import { Link } from "react-router-dom";

function CTASection() {
  return (
    <section className="bg-blue-600 py-20">
      <div className="mx-auto max-w-5xl px-6 text-center">

        {/* CTA HEADING START */}

        <h2 className="text-4xl font-bold text-white md:text-5xl">
          Ready to Find the Right Professional?
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-7 text-blue-100">
          Whether you need a driver, plumber, electrician, mechanic or
          any other skilled professional, SkillPro helps you find the
          right person for the job.
        </p>

        {/* CTA BUTTONS START */}

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

          <Link
            to="/services"
            className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Find a Professional
          </Link>

          <Link
            to="/register"
            className="rounded-lg border border-white px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Become a Professional
          </Link>

        </div>

        {/* CTA BUTTONS END */}

      </div>
    </section>
  );
}

export default CTASection;