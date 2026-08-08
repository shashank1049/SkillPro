import { useEffect, useState } from "react";
import api from "../api/axios";
import {Link} from "react-router-dom"



function Services() {
  // ================================
  // PROFESSIONAL DATA
  // ================================

  const [professionals, setProfessionals] = useState([]);

  // ================================
  // UI STATES
  // ================================

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================================
  // FILTER STATES
  // ================================

  const [profession, setProfession] = useState("");
  const [city, setCity] = useState("");
  const [availability, setAvailability] = useState("");

  // ================================
  // FILTER OPTIONS
  // ================================

  const [professionOptions, setProfessionOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  // ================================
  // PAGINATION
  // ================================

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 6;

  // ==================================================
  // FETCH PROFESSIONALS
  // ==================================================

  const fetchProfessionals = async (selectedPage = page) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/professional", {
        params: {
          page: selectedPage,
          limit,
          profession: profession || undefined,
          city: city || undefined,
          availability:
            availability !== ""
              ? availability
              : undefined,
        },
      });

      console.log(
        "Services API Response:",
        response.data
      );

      const data = response.data?.data;

      setProfessionals(data?.professionals || []);

      setTotalPages(data?.totalPages || 1);

      // ------------------------------------------
      // Create profession & city options
      // ------------------------------------------

      const currentProfessionals =
        data?.professionals || [];

      const professions = [
        ...new Set(
          currentProfessionals
            .map(
              (professional) =>
                professional.profession
            )
            .filter(Boolean)
        ),
      ];

      const cities = [
        ...new Set(
          currentProfessionals
            .map(
              (professional) =>
                professional.owner?.city
            )
            .filter(Boolean)
        ),
      ];

      setProfessionOptions(professions);
      setCityOptions(cities);

    } catch (error) {
      console.error(
        "Error fetching professionals:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to fetch professionals. Please try again."
      );

      setProfessionals([]);
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // INITIAL FETCH
  // ==================================================

  useEffect(() => {
    fetchProfessionals(1);
  }, []);

  // ==================================================
  // SEARCH
  // ==================================================

  const handleSearch = () => {
    setPage(1);
    fetchProfessionals(1);
  };

  // ==================================================
  // CLEAR FILTERS
  // ==================================================

  const handleClearFilters = () => {
    setProfession("");
    setCity("");
    setAvailability("");
    setPage(1);

    // Fetch all professionals after clearing
    setTimeout(() => {
      fetchProfessionals(1);
    }, 0);
  };

  // ==================================================
  // PAGINATION
  // ==================================================

  const handlePageChange = (newPage) => {
    if (
      newPage < 1 ||
      newPage > totalPages ||
      loading
    ) {
      return;
    }

    setPage(newPage);
    fetchProfessionals(newPage);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-16">

      <div className="mx-auto max-w-7xl px-6">

        {/* ==================================================
            PAGE HEADER START
        ================================================== */}

        <div className="text-center">

          <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">
            Find the Right Professional
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Search for trusted professionals and skilled
            workers near you.
          </p>

        </div>

        {/* PAGE HEADER END */}


        {/* ==================================================
            FILTER SECTION START
        ================================================== */}

        <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm">

          <div className="grid gap-4 md:grid-cols-4">

            {/* PROFESSION */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Profession
              </label>

              <select
                value={profession}
                onChange={(e) =>
                  setProfession(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >

                <option value="">
                  All Professions
                </option>

                {professionOptions.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}

              </select>

            </div>


            {/* CITY */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                City
              </label>

              <select
                value={city}
                onChange={(e) =>
                  setCity(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >

                <option value="">
                  All Cities
                </option>

                {cityOptions.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}

              </select>

            </div>


            {/* AVAILABILITY */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Availability
              </label>

              <select
                value={availability}
                onChange={(e) =>
                  setAvailability(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >

                <option value="">
                  Any Availability
                </option>

                <option value="true">
                  Available Now
                </option>

                <option value="false">
                  Currently Unavailable
                </option>

              </select>

            </div>


            {/* BUTTONS */}

            <div className="flex items-end gap-3">

              <button
                onClick={handleSearch}
                disabled={loading}
                className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Searching..."
                  : "Search"}
              </button>

              <button
                onClick={handleClearFilters}
                disabled={loading}
                className="rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
              >
                Clear
              </button>

            </div>

          </div>

        </div>

        {/* FILTER SECTION END */}


        {/* ==================================================
            ERROR MESSAGE
        ================================================== */}

        {error && (

          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-600">
            {error}
          </div>

        )}


        {/* ==================================================
            PROFESSIONALS SECTION START
        ================================================== */}

        <section className="mt-12">

          {/* SECTION HEADER */}

          <div className="flex items-center justify-between">

            <h2 className="text-2xl font-bold text-slate-900">
              Available Professionals
            </h2>

            {!loading &&
              professionals.length > 0 && (
                <span className="text-sm text-gray-500">
                  {professionals.length} found
                </span>
              )}

          </div>


          {/* ==================================================
              LOADING
          ================================================== */}

          {loading ? (

            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">

              {[1, 2, 3].map(
                (item) => (

                  <div
                    key={item}
                    className="animate-pulse rounded-2xl bg-white p-6 shadow-sm"
                  >

                    <div className="mx-auto h-24 w-24 rounded-full bg-gray-200" />

                    <div className="mx-auto mt-5 h-5 w-32 rounded bg-gray-200" />

                    <div className="mx-auto mt-3 h-4 w-20 rounded bg-gray-200" />

                    <div className="mx-auto mt-3 h-4 w-24 rounded bg-gray-200" />

                    <div className="mt-6 h-10 rounded-lg bg-gray-200" />

                  </div>

                )
              )}

            </div>

          ) : professionals.length === 0 ? (

            /* ==================================================
                EMPTY STATE
            ================================================== */

            <div className="mt-8 rounded-2xl bg-white px-6 py-16 text-center shadow-sm">

              <div className="text-5xl">
                🔍
              </div>

              <h3 className="mt-5 text-xl font-semibold text-slate-900">
                No professionals found
              </h3>

              <p className="mt-2 text-gray-500">
                Try changing your filters and search again.
              </p>

            </div>

          ) : (

            /* ==================================================
                PROFESSIONAL CARDS
            ================================================== */

            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">

              {professionals.map(
                (professional) => (

                  <div
                    key={professional._id}
                    className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >

                    {/* PROFILE IMAGE */}

                    <img
                      src={
                        professional.owner?.avatar ||
                        "https://via.placeholder.com/100"
                      }
                      alt={
                        professional.owner?.fullName ||
                        "Professional"
                      }
                      className="mx-auto h-24 w-24 rounded-full border-2 border-blue-500 object-cover"
                    />


                    {/* NAME */}

                    <h3 className="mt-5 text-center text-xl font-bold text-slate-900">
                      {professional.owner?.fullName ||
                        "Professional"}
                    </h3>


                    {/* PROFESSION */}

                    <p className="mt-1 text-center font-medium text-blue-600">
                      {professional.profession}
                    </p>


                    {/* CITY */}

                    <p className="mt-3 text-center text-gray-500">
                      📍{" "}
                      {professional.owner?.city ||
                        "Location not available"}
                    </p>


                    {/* RATING */}

                    <p className="mt-2 text-center text-yellow-500">
                      ⭐{" "}
                      {professional.rating || 0}
                    </p>


                    {/* EXPERIENCE */}

                    <p className="mt-2 text-center text-sm text-gray-500">
                      {professional.experience ||
                        0}{" "}
                      years experience
                    </p>


                    {/* PRICE */}

                    <p className="mt-3 text-center text-lg font-bold text-slate-900">
                      ₹{professional.pricing}
                    </p>


                    {/* AVAILABILITY */}

                    <div className="mt-3 flex justify-center">

                      {professional.availability ? (

                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                          ● Available
                        </span>

                      ) : (

                        <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                          ● Not Available
                        </span>

                      )}

                    </div>


                    {/* VIEW PROFILE */}

                    <Link
                      to={`/professional/${professional._id}`}
                      className="mt-6 block w-full rounded-lg bg-blue-600 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
                    >
                      View Profile
                    </Link>

                  </div>

                )
              )}

            </div>

          )}


          {/* ==================================================
              PAGINATION
          ================================================== */}

          {!loading &&
            professionals.length > 0 &&
            totalPages > 1 && (

              <div className="mt-12 flex items-center justify-center gap-2">

                {/* PREVIOUS */}

                <button
                  onClick={() =>
                    handlePageChange(page - 1)
                  }
                  disabled={page === 1}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>


                {/* PAGE NUMBERS */}

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map(
                  (pageNumber) => (

                    <button
                      key={pageNumber}
                      onClick={() =>
                        handlePageChange(
                          pageNumber
                        )
                      }
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                        page === pageNumber
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pageNumber}
                    </button>

                  )
                )}


                {/* NEXT */}

                <button
                  onClick={() =>
                    handlePageChange(page + 1)
                  }
                  disabled={
                    page === totalPages
                  }
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>

              </div>

            )}

        </section>

        {/* PROFESSIONALS SECTION END */}

      </div>

    </main>
  );
}

export default Services;