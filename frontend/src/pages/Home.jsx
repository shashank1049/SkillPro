import { Link } from "react-router-dom";
import Categories from "../components/home/Categories";
import FeaturedProfessionals from "../components/home/FeaturedProfessionals";
import WhyChooseUs from "../components/home/WhyChooseUs";
import HowItWorks from "../components/home/HowItWorks";
import Testimonials from "../components/home/Testimonials";
import CTASection from "../components/home/CTASection";

function Home() {
  return (
    <>
      {/* HERO SECTION */}

      <section className="bg-[var(--background)] text-[var(--text-primary)] transition-colors duration-300">
        <div className="mx-auto flex min-h-[90vh] max-w-7xl flex-col items-center justify-center px-6 text-center">

          <h1 className="text-5xl font-bold leading-tight text-[var(--text-primary)] md:text-7xl">
            Hire Trusted{" "}
            <span className="text-[var(--primary)]">
              Professionals
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-[var(--text-secondary)]">
            Find verified drivers, plumbers, electricians,
            mechanics, tutors and many more skilled professionals
            near you.
          </p>

          <div className="mt-10 flex gap-5">

            <Link
              to="/services"
              className="rounded-lg bg-[var(--primary)] px-8 py-3 text-white transition hover:bg-[var(--primary-hover)]"
            >
              Find Services
            </Link>

            <Link
              to="/register"
              className="rounded-lg border border-[var(--primary)] px-8 py-3 text-[var(--primary)] transition hover:bg-[var(--primary-light)]"
            >
              Become a Professional
            </Link>

          </div>

        </div>
      </section>

      <Categories />

      <FeaturedProfessionals />

      <WhyChooseUs />

      <HowItWorks />

      <Testimonials />

      <CTASection />
    </>
  );
}

export default Home;