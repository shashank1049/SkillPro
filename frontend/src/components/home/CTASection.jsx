import { Link } from "react-router-dom";

function CTASection() {
  return (
    <section className="bg-[var(--primary)] py-20 transition-colors duration-300">
      <div className="mx-auto max-w-5xl px-6 text-center">

        <h2 className="text-4xl font-bold text-white md:text-5xl">
          Ready to Find the Right Professional?
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-7 text-white/80">
          Whether you need a driver, plumber, electrician, mechanic or
          any other skilled professional, HirePro helps you find the
          right person for the job.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

          <Link
            to="/services"
            className="rounded-lg bg-white px-8 py-3 font-semibold text-[var(--primary)] transition hover:opacity-90"
          >
            Find a Professional
          </Link>

          <Link
            to="/register"
            className="rounded-lg border border-white px-8 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Become a Professional
          </Link>

        </div>

      </div>
    </section>
  );
}

export default CTASection;