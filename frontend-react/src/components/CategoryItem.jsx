import { Link } from "react-router-dom";

export default function CategoryItem({ data }) {
  return (
    <Link
      to={`/foods/category/${data.id}`}
      className="flex flex-col items-center min-w-[100px] cursor-pointer transform hover:scale-105 transition duration-200"
    >
      {/* Image */}
      <div className="w-24 h-24 rounded-full overflow-hidden bg-white shadow-md">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Label */}
      <p className="mt-2 text-sm font-medium text-gray-700 text-center">
        {data.name}
      </p>
    </Link>
  );
}
