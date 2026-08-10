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
      
      
      //HERO SECTION

      <section className="bg-[var(--background)] text-[var(--text-primary)] transition-colors duration-300">

        <div className="mx-auto flex min-h-[85vh] max-w-7xl items-center px-6 py-16">

          <div className="grid w-full items-center gap-12 lg:grid-cols-2">

            
           {/* LEFT CONTENT */}
           

            <div className="text-center lg:text-left">

              <div className="mb-5 inline-flex rounded-full bg-[var(--primary-light)] px-4 py-2 text-sm font-semibold text-[var(--primary)]">
                Trusted professionals, one platform
              </div>


              <h1 className="text-5xl font-bold leading-tight text-[var(--text-primary)] md:text-6xl lg:text-7xl">

                Hire Trusted{" "}

                <span className="text-[var(--primary)]">
                  Professionals
                </span>

                <br />

                For Every Job

              </h1>


              <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--text-secondary)]">

                From plumbers and electricians to drivers,
                mechanics, tutors and developers — find
                skilled professionals you can trust, right
                when you need them.

              </p>


              {/* BUTTONS */}

              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">

                <Link
                  to="/services"
                  className="rounded-lg bg-[var(--primary)] px-8 py-3.5 text-center font-semibold text-white transition hover:bg-[var(--primary-hover)]"
                >
                  Find Services
                </Link>


                <Link
                  to="/register"
                  className="rounded-lg border border-[var(--primary)] px-8 py-3.5 text-center font-semibold text-[var(--primary)] transition hover:bg-[var(--primary-light)]"
                >
                  Become a Professional
                </Link>

              </div>


              {/* TRUST INFO */}

              <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-[var(--text-secondary)] lg:justify-start">

                <div className="flex items-center gap-2">
                  <span className="text-lg text-[var(--primary)]">
                    ✓
                  </span>
                  Verified Professionals
                </div>


                <div className="flex items-center gap-2">
                  <span className="text-lg text-[var(--primary)]">
                    ✓
                  </span>
                  Secure Payments
                </div>


                <div className="flex items-center gap-2">
                  <span className="text-lg text-[var(--primary)]">
                    ✓
                  </span>
                  Easy Booking
                </div>

              </div>

            </div>


            {/* RIGHT IMAGE */}

            <div className="relative">

              {/* Decorative Background */}

              <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-[var(--primary-light)] opacity-60 blur-2xl" />

              <div className="absolute -bottom-6 -left-6 h-40 w-40 rounded-full bg-[var(--primary-light)] opacity-40 blur-3xl" />


              {/* IMAGE CARD */}

              <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-xl">

                <img
                  src="/images/hero.png"
                  alt="HirePro professionals"
                  className="w-full rounded-2xl object-cover"
                />

              </div>


              {/* FLOATING INFO CARD */}

              <div className="absolute -bottom-6 -right-5 hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg sm:block">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-light)] text-xl font-bold text-[var(--primary)]">
                    ⌕
                  </div>


                  <div>

                    <p className="font-semibold text-[var(--text-primary)]">
                      Find the Right Professional
                    </p>

                    {/* <p className="text-sm text-[var(--text-secondary)]">
                      Simple, fast and reliable
                    </p> */}

                  </div>

                </div>

              </div>


              {/* SMALL TOP INFO

              <div className="absolute -left-5 top-8 hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-lg md:block">

                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  One Platform
                </p>

                <p className="text-xs text-[var(--text-secondary)]">
                  Multiple Services
                </p>

              </div> */}

            </div>

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