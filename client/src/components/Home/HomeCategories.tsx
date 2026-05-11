import { Link } from "react-router-dom";
import { categoriesData } from "../../assets/assets";

const HomeCategories = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto">
        <div>
          <h2 className="text-2xl font-semibold">Browse Categories</h2>
          <p className="text-sm text-app-text-light mt-1">
            Find exactly what you need using categories
          </p>
        </div>

        <div
  className="mt-8 overflow-x-auto"
  onWheel={(e) => {
    e.currentTarget.scrollLeft += e.deltaY;
  }}
>
  <div className="flex items-center gap-4 w-max">
    {categoriesData.map((cat) => (
      <Link
        key={cat.slug}
        to={`/products?category=${cat.slug}`}
        onClick={() => window.scrollTo(0, 0)}
        className="group flex-shrink-0 flex flex-col items-center gap-3 p-4"
      >
        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-orange-100 group-hover:ring-2 ring-orange-300/75 transition-all">
          <img
            src={cat.image}
            alt={cat.name}
            className="w-full h-full object-contain rounded-full"
          />
        </div>

        <span className="text-sm text-center">
          {cat.name}
        </span>
      </Link>
    ))}
  </div>
</div>
      </div>
    </section>
  );
};

export default HomeCategories;   