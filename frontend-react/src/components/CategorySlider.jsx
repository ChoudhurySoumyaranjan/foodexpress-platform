import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import CategoryItem from "./CategoryItem";
import { getCategories } from "../api/service/categoryService";
import { setCategories } from "../redux/slice/categorySlice";

import { toast } from "react-toastify";

export default function CategorySlider() {
  const scrollRef = useRef();

  const dispatch = useDispatch();

  const categories = useSelector(
    (state) => state.categories.categoryList
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // Prevent unnecessary API calls
    if (categories.length > 0) {
      setLoading(false);
      return;
    }

    const fetchAllCategories = async () => {
      try {
        const response = await getCategories();

        dispatch(setCategories(response?.data || []));

      } catch (error) {

        toast.error(
          error?.response?.data || "Failed to load categories"
        );

      } finally {
        setLoading(false);
      }
    };

    fetchAllCategories();

  }, []);

  const scroll = (direction) => {
    const amount = direction === "left" ? -300 : 300;

    scrollRef.current?.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-gray-100 p-6 rounded-2xl">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        
        <h2 className="text-xl font-semibold text-gray-800">
          Order our best food options
        </h2>

        <div className="flex gap-2">
          
          <button
            onClick={() => scroll("left")}
            className="w-9 h-9 flex items-center justify-center bg-white rounded-full shadow hover:bg-gray-200 transition"
          >
            ←
          </button>

          <button
            onClick={() => scroll("right")}
            className="w-9 h-9 flex items-center justify-center bg-white rounded-full shadow hover:bg-gray-200 transition"
          >
            →
          </button>

        </div>
      </div>

      {/* Content */}
      {loading ? (

        <p className="text-gray-500">
          Loading categories...
        </p>

      ) : categories.length === 0 ? (

        <p className="text-gray-500 text-center">
          Category Not Found
        </p>

      ) : (

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide"
        >
          {categories.map((data) => (
            <CategoryItem
              key={data.id}
              data={data}
            />
          ))}
        </div>

      )}
    </div>
  );
}