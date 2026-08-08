import { Link } from "react-router-dom";
import Categories from "../components/home/Categories";
import FeaturedProfessionals from "../components/home/FeaturedProfessionals";
import WhyChooseUs from "../components/home/WhyChooseUs";
import HowItWorks from "../components/home/HowItWorks";
import Testimonials from "../components/home/Testimonials";



function Home() {
  return (
    <>
                        {/* HERO SECTION START*/}

             

      <section className="bg-slate-50">
        <div className="mx-auto flex min-h-[90vh] max-w-7xl flex-col items-center justify-center px-6 text-center">

          {/* Hero Heading */}
          <h1 className="text-5xl font-bold leading-tight text-slate-900 md:text-7xl">
            Hire Trusted <span className="text-blue-600">Professionals</span>
          </h1>

          {/* Hero Description */}
          <p className="mt-6 max-w-2xl text-lg text-gray-600">
            Find verified drivers, plumbers, electricians,
            mechanics, tutors and many more skilled professionals
            near you.
          </p>

          {/* Hero Buttons */}
          <div className="mt-10 flex gap-5">

            <Link
              to="/services"
              className="rounded-lg bg-blue-600 px-8 py-3 text-white transition hover:bg-blue-700"
            >
              Find Services
            </Link>

            <Link
              to="/register"
              className="rounded-lg border border-blue-600 px-8 py-3 text-blue-600 transition hover:bg-blue-50"
            >
              Become a Professional
            </Link>

          </div>

        </div>
      </section>

                        {/*HERO SECTION END*/}



    {/*POPULAR CATEGORIES START*/}

      <Categories />

      

    {/*FEATURED PROFESSIONALS START*/}

    <FeaturedProfessionals />


    <WhyChooseUs />



      {/*  HOW IT WORKS START */}
    <HowItWorks />
    

      {/*TESTIMONIAL SECTION START*/}

    <Testimonials />

      {/*CTA SECTION START */}

    </>
  );
}

export default Home;