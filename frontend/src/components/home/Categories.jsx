const categories = [
  {
    id: 1,
    image: "/images/driver.png",
    name: "Driver",
    description: "Reliable drivers for your daily travel.",
  },
  {
    id: 2,
    image: "/images/plumbing.png",
    name: "Plumber",
    description: "Quick plumbing repair and installation.",
  },
  {
    id: 3,
    image: "/images/electrician.png",
    name: "Electrician",
    description: "Professional electrical repair services.",
  },
  {
    id: 4,
    image: "/images/tutor.png",
    name: "Tutor",
    description: "Learn from skilled and experienced tutors.",
  },
  {
    id: 5,
    image: "/images/developer.png",
    name: "Developer",
    description: "Hire developers for your tech projects.",
  },
  // {
  //   id: 6,
  //   image: "/images/cleaner.png",
  //   name: "Cleaner",
  //   description: "Trusted cleaning services for your home.",
  // },
];

function Categories() {
  return (
    <section className="bg-[var(--background)] py-20 transition-colors duration-300">

      <div className="mx-auto max-w-7xl px-6">

        {/* HEADING */}

        <h2 className="mb-3 text-center text-4xl font-bold text-[var(--text-primary)]">
          Popular Categories
        </h2>

        <p className="mx-auto mb-10 max-w-2xl text-center text-[var(--text-secondary)]">
          Explore popular services and find the right professional for your needs.
        </p>

        {/* CATEGORIES */}

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">

          {categories.map((category) => (
            <div
              key={category.id}
              className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center text-[var(--text-primary)] shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >

              {/* IMAGE */}

              <div className="h-32 w-full overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />
              </div>

              {/* CONTENT */}

              <div className="p-5">

                <h3 className="text-lg font-semibold">
                  {category.name}
                </h3>

                <p className="mt-2 text-sm leading-5 text-[var(--text-secondary)]">
                  {category.description}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

export default Categories;