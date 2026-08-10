import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchFoodsByCategory } from "../api/service/foodService";
import FoodCard from "../components/FoodCard"; // adjust path
import { SlidersHorizontal, SearchX } from "lucide-react";

export default function FoodByCategoryPage() {
  const { categoryId } = useParams();

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [sortBy, setSortBy] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [onlyInStock, setOnlyInStock] = useState(false);

  useEffect(() => {
    const getFoods = async () => {
      setLoading(true);
      try {
        const response = await fetchFoodsByCategory(categoryId);
        setFoods(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        if (error.response?.status === 204) {
          setFoods([]);
        } else {
          toast.error("Failed to load foods");
        }
      } finally {
        setLoading(false);
      }
    };
    getFoods();
  }, [categoryId]);

  // Filtering + Sorting
  let filteredFoods = [...foods];

  if (onlyInStock) {
    filteredFoods = filteredFoods.filter((f) => f.stock > 0);
  }

  if (priceRange === "0-100") {
    filteredFoods = filteredFoods.filter((f) => f.discountedPrice <= 100);
  } else if (priceRange === "100-500") {
    filteredFoods = filteredFoods.filter(
      (f) => f.discountedPrice >= 100 && f.discountedPrice <= 500,
    );
  } else if (priceRange === "500-1000") {
    filteredFoods = filteredFoods.filter(
      (f) => f.discountedPrice >= 500 && f.discountedPrice <= 1000,
    );
  } else if (priceRange === "1000+") {
    filteredFoods = filteredFoods.filter((f) => f.discountedPrice > 1000);
  }

  if (sortBy === "lowToHigh") {
    filteredFoods.sort((a, b) => a.discountedPrice - b.discountedPrice);
  } else if (sortBy === "highToLow") {
    filteredFoods.sort((a, b) => b.discountedPrice - a.discountedPrice);
  } else if (sortBy === "discount") {
    filteredFoods.sort((a, b) => b.discount - a.discount);
  }

  const resetFilters = () => {
    setOnlyInStock(false);
    setPriceRange("");
    setSortBy("");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (foods.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <SearchX size={48} className="text-gray-300" />
        <h2 className="text-xl font-semibold text-gray-500">No Foods Found</h2>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/60 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 py-6">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {foods[0]?.categoryName || "Foods"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredFoods.length} item{filteredFoods.length !== 1 ? "s" : ""}{" "}
            found
          </p>
        </div>

        {/* Filter Bar */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border border-gray-100 rounded-2xl shadow-sm px-4 py-3 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-gray-700">
              <SlidersHorizontal size={16} className="text-orange-500" />
              <span className="text-sm font-semibold hidden sm:inline">
                Filters
              </span>
            </div>

            <button
              onClick={() => setOnlyInStock(!onlyInStock)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                onlyInStock
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-700 border-gray-200 hover:border-orange-300"
              }`}
            >
              In Stock
            </button>

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl px-3.5 py-2 outline-none cursor-pointer hover:border-orange-300 focus:ring-2 focus:ring-orange-200"
            >
              <option value="">Price Range</option>
              <option value="0-100">₹0 – ₹100</option>
              <option value="100-500">₹100 – ₹500</option>
              <option value="500-1000">₹500 – ₹1000</option>
              <option value="1000+">₹1000+</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl px-3.5 py-2 outline-none cursor-pointer hover:border-orange-300 focus:ring-2 focus:ring-orange-200"
            >
              <option value="">Sort By</option>
              <option value="lowToHigh">Price: Low → High</option>
              <option value="highToLow">Price: High → Low</option>
              <option value="discount">Highest Discount</option>
            </select>

            {(onlyInStock || priceRange || sortBy) && (
              <button
                onClick={resetFilters}
                className="ml-auto text-xs font-semibold text-orange-600 hover:text-orange-700"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        {filteredFoods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredFoods.map((food) => (
              <FoodCard key={food.id} data={food} /> 
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <SearchX size={42} className="text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-500">
              No matching foods
            </h3>
            <button
              onClick={resetFilters}
              className="text-sm font-semibold text-orange-600 hover:text-orange-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
