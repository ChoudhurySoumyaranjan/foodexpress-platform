import { useState } from "react";
import { toast } from "react-toastify";
import { deleteFood } from "../api/service/foodService";
import { Eye, Pencil, Trash2, X } from "lucide-react";

const Food = ({ food, handleEdit, setActionLoading,fetchFoods }) => {
  const {
    id,
    imageUrl,
    foodName,
    categoryName,
    description,
    price,
    stock,
    discount,
    discountedPrice,
  } = food;

  const [showView, setShowView] = useState(false);

  const handleDeleteFood = async (id) => {
    setActionLoading(true);
    try {
      const response = await deleteFood(id);
      if (response.status === 204 || response.status === 200) {
        toast.success("Food deleted successfully");
        fetchFoods();
      }
    } catch (error) {
      toast.error(
        "Failed to delete: " +
          (error.response?.data?.message || "Something went wrong"),
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      {/* Food Row */}
      <div className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-orange-50/30 transition-colors">
        <div className="flex items-center gap-3.5 min-w-0">
          <img
            src={imageUrl || "/no-image.png"}
            onError={(e) => (e.target.src = "/no-image.png")}
            alt={foodName}
            className="w-12 h-12 rounded-xl object-cover border border-gray-100 bg-gray-50 shrink-0"
          />

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {foodName}
              </h3>
              {discount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-orange-50 text-orange-600 border border-orange-100">
                  {discount}% OFF
                </span>
              )}
            </div>

            <p className="text-xs text-gray-400 mt-0.5">{categoryName}</p>

            <div className="flex items-center gap-3 mt-1 text-xs">
              <span className="font-semibold text-emerald-600">
                ₹{discountedPrice}
              </span>
              {discount > 0 && (
                <span className="line-through text-gray-400">₹{price}</span>
              )}
              <span className={stock > 0 ? "text-emerald-600" : "text-red-500"}>
                Stock: {stock}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowView(true)}
            title="View"
            className="
              flex h-8 w-8 items-center justify-center rounded-lg
              border border-gray-200 text-gray-500
              hover:border-gray-300 hover:bg-gray-50 transition
            "
          >
            <Eye size={14} />
          </button>

          <button
            onClick={() => handleEdit(food)}
            title="Edit"
            className="
              flex h-8 w-8 items-center justify-center rounded-lg
              border border-blue-100 bg-blue-50 text-blue-600
              hover:bg-blue-100 transition
            "
          >
            <Pencil size={14} />
          </button>

          <button
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete this food?")
              ) {
                handleDeleteFood(id);
              }
            }}
            title="Delete"
            className="
              flex h-8 w-8 items-center justify-center rounded-lg
              border border-red-100 bg-red-50 text-red-600
              hover:bg-red-100 transition
            "
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* View Modal */}
      {showView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowView(false)}
          />
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="relative">
              <img
                src={imageUrl || "/no-image.png"}
                onError={(e) => (e.target.src = "/no-image.png")}
                alt={foodName}
                className="h-44 w-full object-cover"
              />
              {discount > 0 && (
                <span className="absolute top-3 left-3 rounded-full bg-orange-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                  {discount}% OFF
                </span>
              )}
              <button
                onClick={() => setShowView(false)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {foodName}
                  </h2>
                  <p className="mt-0.5 text-sm text-gray-400">{categoryName}</p>
                </div>
                <div className="text-right shrink-0">
                  {discount > 0 && (
                    <p className="text-xs text-gray-400 line-through">
                      ₹{price}
                    </p>
                  )}
                  <p className="text-lg font-bold text-orange-600">
                    ₹{discountedPrice}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-gray-50 p-3.5">
                <p className="text-sm leading-relaxed text-gray-600">
                  {description || "No description available."}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2.5 text-center">
                <div className="rounded-xl bg-gray-50 py-3">
                  <p className="text-[11px] text-gray-400 uppercase tracking-wide">
                    Stock
                  </p>
                  <p
                    className={`mt-1 text-sm font-semibold ${
                      stock > 0 ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {stock}
                  </p>
                </div>
                <div className="rounded-xl bg-gray-50 py-3">
                  <p className="text-[11px] text-gray-400 uppercase tracking-wide">
                    Discount
                  </p>
                  <p className="mt-1 text-sm font-semibold text-orange-600">
                    {discount}%
                  </p>
                </div>
                <div className="rounded-xl bg-gray-50 py-3">
                  <p className="text-[11px] text-gray-400 uppercase tracking-wide">
                    Price
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-700">
                    ₹{price}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowView(false)}
                className="mt-5 w-full rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition shadow-sm shadow-orange-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Food;
