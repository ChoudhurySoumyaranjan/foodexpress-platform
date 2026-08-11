import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { getCategories } from "../../api/service/categoryService";
import { fetchFoodsByCategory, fetchFoodsByKeyword } from "../../api/service/foodService";
import FoodCard from "../../components/FoodCard";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [categories, setCategories] = useState([]);

  const [foods, setFoods] = useState([]);

  const [loadingCategories, setLoadingCategories] = useState(true);

  const [loadingFoods, setLoadingFoods] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch Categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCategories();

        setCategories(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchData();
  }, []);

  // Search Foods with Debounce
  useEffect(() => {
    // Prevent empty search
    if (!searchTerm.trim()) {
      setFoods([]);
      setSelectedCategory(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoadingFoods(true);

        // Remove selected category while searching
        setSelectedCategory("Search Results");

        //Search API
        const response = await fetchFoodsByKeyword(searchTerm);

        setFoods(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingFoods(false);
      }
    }, 400);

    // Cleanup previous timer
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle Category Click
  const handlePopularDishClick = async (categoryId, categoryName) => {
    try {
      setSelectedCategory(categoryName);

      setLoadingFoods(true);

      const response = await fetchFoodsByCategory(categoryId);

      setFoods(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingFoods(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 pb-10">
      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        {/* Search Bar */}
        <div className="relative">
          <div
            className="
            bg-white
            rounded-2xl
            border border-gray-200
            shadow-sm
            focus-within:border-orange-500
            transition-all
          "
          >
            <div className="flex items-center px-5 py-4">
              <Search className="w-5 h-5 text-gray-400 mr-3" />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for restaurants and food"
                className="
                  flex-1
                  bg-transparent
                  outline-none
                  text-lg
                  placeholder:text-gray-400
                "
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="
                    ml-2
                    text-gray-400
                    hover:text-gray-600
                  "
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Popular Dishes */}
        {!searchTerm && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Popular Dishes
            </h2>

            <div
              className="
              flex gap-6
              overflow-x-auto
              scrollbar-hide
              pb-4
            "
            >
              {loadingCategories ? (
                <p className="text-gray-500">Loading categories...</p>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="
                      flex flex-col items-center
                      min-w-[90px]
                      cursor-pointer
                      group
                    "
                    onClick={() =>
                      handlePopularDishClick(category.id, category.name)
                    }
                  >
                    {/* Category Image */}
                    <div
                      className="
                      w-24 h-24
                      rounded-full
                      overflow-hidden
                      border border-gray-200
                      shadow-sm
                      group-hover:scale-105
                      transition-all duration-300
                    "
                    >
                      <img
                        src={category.image}
                        alt={category.name}
                        className="
                          w-full
                          h-full
                          object-cover
                        "
                      />
                    </div>

                    {/* Category Name */}
                    <p
                      className="
                      mt-3
                      text-sm
                      font-medium
                      text-gray-700
                      text-center
                    "
                    >
                      {category.name}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Foods Section */}
        {selectedCategory && (
          <div className="mt-12">
            {/* Heading */}
            <div
              className="
              flex items-center
              justify-between
              mb-6
            "
            >
              <h2
                className="
                text-2xl
                font-bold
                text-gray-800
              "
              >
                {selectedCategory}
              </h2>

              {foods.length > 0 && (
                <span
                  className="
                  text-sm
                  text-gray-500
                "
                >
                  {foods.length} items found
                </span>
              )}
            </div>

            {/* Loading */}
            {loadingFoods ? (
              <div className="text-gray-500">Loading foods...</div>
            ) : foods.length > 0 ? (
              <div
                className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                gap-6
              "
              >
                {foods.map((data) => (
                  <FoodCard key={data.id} data={data} />
                ))}
              </div>
            ) : (
              <div
                className="
                bg-white
                rounded-2xl
                p-10
                text-center
                border border-dashed border-gray-300
              "
              >
                <p
                  className="
                  text-gray-500
                  text-lg
                "
                >
                  No foods found
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
