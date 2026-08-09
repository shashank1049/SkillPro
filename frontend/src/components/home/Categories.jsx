const categories = [
  {
    id: 1,
    icon: "🚗",
    name: "Driver",
  },
  {
    id: 2,
    icon: "🔧",
    name: "Plumber",
  },
  {
    id: 3,
    icon: "⚡",
    name: "Electrician",
  },
  {
    id: 4,
    icon: "🎨",
    name: "Tutor",
  },
  {
    id: 5,
    icon: "💻",
    name: "Developer",
  },
  {
    id: 6,
    icon: "🧹",
    name: "Cleaner",
  },
];

function Categories() {
  return (
    <section className="bg-[var(--surface)] py-16 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6">

        <h2 className="mb-10 text-center text-4xl font-bold text-[var(--text-primary)]">
          Popular Categories
        </h2>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">

          {categories.map((category) => (
            <div
              key={category.id}
              className="cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center text-[var(--text-primary)] shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="text-5xl">
                {category.icon}
              </div>

              <h3 className="mt-4 font-semibold">
                {category.name}
              </h3>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Categories;