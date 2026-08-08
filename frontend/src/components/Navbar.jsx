import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600"
        >
          SkillPro
        </Link>

        {/* NAVIGATION */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="text-gray-700 transition hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            to="/services"
            className="text-gray-700 transition hover:text-blue-600"
          >
            Services
          </Link>

          <Link
            to="/professionals"
            className="text-gray-700 transition hover:text-blue-600"
          >
            Professionals
          </Link>
        </div>

        {/* AUTH BUTTONS */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-lg px-4 py-2 text-gray-700 transition hover:bg-gray-100"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
          >
            Register
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;