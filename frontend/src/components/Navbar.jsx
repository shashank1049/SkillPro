import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}

        <Link
          to="/"
          className="text-3xl font-bold text-blue-600"
        >
          SkillPro
        </Link>

        {/* Navigation */}

        <div className="flex items-center gap-8">

          <Link
            to="/"
            className="font-medium hover:text-blue-600 transition"
          >
            Home
          </Link>

          <Link
            to="/services"
            className="font-medium hover:text-blue-600 transition"
          >
            Services
          </Link>

          <Link
            to="/professionals"
            className="font-medium hover:text-blue-600 transition"
          >
            Professionals
          </Link>

        </div>

        {/* Buttons */}

        <div className="flex gap-3">

          <Link
            to="/login"
            className="rounded-lg border border-blue-600 px-5 py-2 text-blue-600 hover:bg-blue-50"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Register
          </Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;