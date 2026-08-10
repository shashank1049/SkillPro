import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] transition-colors duration-300">

      {/* MAIN FOOTER */}

      <div className="mx-auto max-w-7xl px-6 py-14">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* BRAND */}

          <div>

            <Link
              to="/"
              className="text-2xl font-bold text-[var(--text-primary)]"
            >
              Hire
              <span className="text-[var(--primary)]">
                Pro
              </span>
            </Link>

            <p className="mt-4 max-w-sm leading-7 text-[var(--text-secondary)]">
              Hire trusted professionals for your everyday needs.
              Find skilled and reliable people for the job, all in
              one place.
            </p>

          </div>

          {/* QUICK LINKS */}

          <div>

            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3">

              <li>
                <Link
                  to="/"
                  className="transition hover:text-[var(--primary)]"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/services"
                  className="transition hover:text-[var(--primary)]"
                >
                  Services
                </Link>
              </li>

              <li>
                <Link
                  to="/professional-dashboard"
                  className="transition hover:text-[var(--primary)]"
                >
                  Professionals
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="transition hover:text-[var(--primary)]"
                >
                  Become a Professional
                </Link>
              </li>

            </ul>

          </div>

          {/* SUPPORT */}

          <div>

            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Support
            </h3>

            <ul className="mt-5 space-y-3">

              <li>
                <Link
                  to="/contact"
                  className="transition hover:text-[var(--primary)]"
                >
                  Contact Us
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="transition hover:text-[var(--primary)]"
                >
                  About HirePro
                </Link>
              </li>

              <li>
                <Link
                  to="/privacy"
                  className="transition hover:text-[var(--primary)]"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/terms"
                  className="transition hover:text-[var(--primary)]"
                >
                  Terms & Conditions
                </Link>
              </li>

            </ul>

          </div>

          {/* CONTACT */}

          <div>

            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Get in Touch
            </h3>

            <div className="mt-5 space-y-3 text-[var(--text-secondary)]">

              <p>📍 Noida, Uttar Pradesh</p>

              <p>
                📧 hirePro@hirepro.com
              </p>

              <p>
                📞 +91 98765 43210
              </p>

            </div>

          </div>

        </div>

        {/* DIVIDER */}

        <div className="my-10 border-t border-[var(--border)]" />

        {/* BOTTOM */}

        <div className="flex flex-col items-center justify-between gap-4 text-sm md:flex-row">

          <p className="text-[var(--text-secondary)]">
            © {new Date().getFullYear()} HirePro.
            All rights reserved.
          </p>

          <div className="flex gap-5">

            <a
              href="https://github.com/shashank1049/HirePro"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-[var(--primary)]"
            >
              GitHub
            </a>

            <a
              href="https://www.linkedin.com/in/shashankmishra221"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-[var(--primary)]"
            >
              LinkedIn
            </a>

            <a
              href="#"
              className="transition hover:text-[var(--primary)]"
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