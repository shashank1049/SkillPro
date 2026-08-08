import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-slate-950 text-gray-300">

      {/* MAIN FOOTER */}

      <div className="mx-auto max-w-7xl px-6 py-14">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* BRAND */}

          <div>
            <Link
              to="/"
              className="text-2xl font-bold text-white"
            >
              Skill<span className="text-blue-500">Pro</span>
            </Link>

            <p className="mt-4 max-w-sm leading-7 text-gray-400">
              Hire trusted professionals for your everyday needs.
              Find skilled and reliable people for the job, all in
              one place.
            </p>
          </div>


          {/* QUICK LINKS */}

          <div>
            <h3 className="text-lg font-semibold text-white">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/"
                  className="transition hover:text-blue-400"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/services"
                  className="transition hover:text-blue-400"
                >
                  Services
                </Link>
              </li>

              <li>
                <Link
                  to="/professionals"
                  className="transition hover:text-blue-400"
                >
                  Professionals
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="transition hover:text-blue-400"
                >
                  Become a Professional
                </Link>
              </li>
            </ul>
          </div>


          {/* SUPPORT */}

          <div>
            <h3 className="text-lg font-semibold text-white">
              Support
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/contact"
                  className="transition hover:text-blue-400"
                >
                  Contact Us
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="transition hover:text-blue-400"
                >
                  About SkillPro
                </Link>
              </li>

              <li>
                <Link
                  to="/privacy"
                  className="transition hover:text-blue-400"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/terms"
                  className="transition hover:text-blue-400"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>


          {/* CONTACT */}

          <div>
            <h3 className="text-lg font-semibold text-white">
              Get in Touch
            </h3>

            <div className="mt-5 space-y-3 text-gray-400">
              <p>📍 Noida, Uttar Pradesh</p>
              <p>📧 support@skillpro.com</p>
              <p>📞 +91 98765 43210</p>
            </div>
          </div>

        </div>


        {/* DIVIDER */}

        <div className="my-10 border-t border-slate-800"></div>


        {/* BOTTOM */}

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-500 md:flex-row">

          <p>
            © {new Date().getFullYear()} SkillPro. All rights reserved.
          </p>

          <div className="flex gap-5">
            <a
              href="https://github.com/shashank1049/SkillPro"
              className="transition hover:text-blue-400"
            >
              GitHub
            </a>

            <a
              href="https://www.linkedin.com/in/shashankmishra221"
              className="transition hover:text-blue-400"
            >
              LinkedIn
            </a>

            <a
              href="#"
              className="transition hover:text-blue-400"
            >
              Instagram
            </a>
          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;