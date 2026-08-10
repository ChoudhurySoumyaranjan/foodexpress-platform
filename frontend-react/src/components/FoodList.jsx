import { useEffect, useState } from "react";
import FoodCard from "./FoodCard";
import { fetchAllFoods } from "../api/service/foodService";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setFoods } from "../redux/slice/foodSlice";

export default function FoodList() {
  const [loading, setLoading] = useState(true);
  const dispatch =useDispatch();
  const foods =useSelector((state)=>{ return state.foods.foodList})

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetchAllFoods();

        dispatch(setFoods(response.data));

      } catch (error) {
        toast.error("Failed to Fetch Foods");
        console.log(error);

      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  return (
    <div className="px-6 py-10 bg-gray-50 min-h-screen">
      
      {/* TITLE */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Popular Dishes
        </h2>

        <button className="text-orange-500 font-semibold hover:underline">
          View All
        </button>
      </div>

      {/* LOADING */}
      {loading ? (
        <p className="text-center text-lg text-gray-500">
          Loading Foods...
        </p>
      ) : foods.length === 0 ? (
        <p className="text-center text-red-500">
          No Foods Found
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {foods.map((fd) => (
            <FoodCard key={fd.id} data={fd} />
          ))}
        </div>
      )}
    </div>
  );
}