// SearchBar.jsx
import { Search, MapPin, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/search");
  };

  return (
    <div className="sticky top-20 z-40 bg-white px-4 py-4 border-b border-gray-100">
      {/* Location */}
      <div className="flex items-center gap-1 mb-3">
        <MapPin size={16} className="text-orange-500" />

        <span className="font-semibold text-sm text-gray-800">Odisha</span>

        {/* <ChevronDown size={16} className="text-gray-500" /> */}
      </div>

      {/* Search Box */}
      <div
        onClick={handleClick}
        className="
          flex items-center gap-3
          bg-gray-100
          hover:bg-gray-200
          active:scale-[0.99]
          transition-all duration-200
          px-4 py-4
          rounded-2xl
          shadow-sm
          cursor-pointer
          border border-gray-200
        "
      >
        {/* Search Icon */}
        <div className="bg-white p-2 rounded-full shadow-sm">
          <Search size={18} className="text-orange-500" />
        </div>

        {/* Placeholder */}
        <div className="flex flex-col">
          <span className="text-gray-800 font-medium text-sm">
            Search for food
          </span>

          <span className="text-gray-500 text-xs">
            Restaurants, dishes & more
          </span>
        </div>
      </div>
    </div>
  );
}
