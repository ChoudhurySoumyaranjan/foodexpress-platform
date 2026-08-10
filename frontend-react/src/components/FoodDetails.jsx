import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useCallback } from "react";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from "../redux/slice/cartSlice";
import {
  addToCartApi,
  increaseCartApi,
  decreaseCartApi,
} from "../api/service/cartService";
import { fetchCart } from "../redux/thunks/cartThunk";
import {
  ArrowLeft,
  Clock3,
  Flame,
  Heart,
  Star,
  Truck,
  Leaf,
  Users,
  ShieldCheck,
} from "lucide-react";

const FoodDetails = () => {
  const navigate = useNavigate();
  const { state: food } = useLocation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!food) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400 text-sm">
        Food Not Found
      </div>
    );
  }

  const cartItems = useSelector((state) => state.cart.items);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const cartItem = cartItems.find((item) => item.foodId === food.id);
  const isAdmin = user?.roles?.includes("ADMIN");

  const {
    imageUrl,
    foodName,
    description,
    discountedPrice,
    discount = 0,
    stock = 0,
    categoryName,
    price,
  } = food;

  // Extra static data (you can later replace with real API fields)
  const rating = 4.5;
  const reviews = 128;
  const deliveryTime = "25-30 mins";
  const serves = "1-2 people";
  const prepTime = "15 mins";
  const isVeg = categoryName?.toLowerCase().includes("veg") ?? false;

  const highlights = [
    "Freshly prepared",
    "Authentic spices",
    "No artificial colors",
    "Hygienically packed",
  ];

  // ========== CART HANDLERS ==========
  const handleCartAction = useCallback(
    async (actionFn) => {
      setIsLoading(true);
      try {
        await actionFn();
        if (isAuthenticated && user?.id) {
          await dispatch(fetchCart(user.id)).unwrap();
        }
      } catch {
        alert("Failed to update cart");
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, dispatch, user?.id],
  );

  const handleAdd = () => {
    if (stock <= 0) return alert("Out of stock");

    handleCartAction(async () => {
      if (!isAuthenticated) {
        dispatch(addToCart(food));
        return;
      }
      await addToCartApi({
        userId: user.id,
        productId: food.id,
        quantity: 1,
      });
    });
  };

  const handleIncrease = () => {
    if (cartItem?.quantity >= stock) {
      return alert(`Only ${stock} left`);
    }

    handleCartAction(async () => {
      if (!isAuthenticated) {
        dispatch(increaseQuantity(food.id));
        return;
      }
      await increaseCartApi(user.id, food.id);
    });
  };

  const handleDecrease = () => {
    handleCartAction(async () => {
      if (!isAuthenticated) {
        dispatch(decreaseQuantity(food.id));
        return;
      }
      await decreaseCartApi(user.id, food.id);
    });
  };

  return (
    <div className="bg-gradient-to-b from-orange-50/40 via-white to-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-3 sm:px-5 py-5">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft
            size={17}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          <span>Back</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100/80 overflow-hidden">
          <div className="grid md:grid-cols-[300px_1fr]">
            {/* Image */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent z-10 pointer-events-none" />
              <img
                src={imageUrl}
                alt={foodName}
                className="w-full h-56 md:h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                loading="lazy"
              />

              {/* Wishlist */}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-sm hover:bg-white hover:scale-105 active:scale-95 transition-all"
              >
                <Heart
                  size={17}
                  className={
                    isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"
                  }
                  strokeWidth={1.8}
                />
              </button>

              {/* Badges */}
              <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5">
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Flame size={11} strokeWidth={2.5} />
                  BESTSELLER
                </span>
                {categoryName && (
                  <span className="bg-white/90 backdrop-blur-md text-[11px] px-2.5 py-1 rounded-full font-medium text-gray-700 shadow-sm">
                    {categoryName}
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 flex flex-col">
              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug tracking-tight">
                {foodName}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2.5 text-[13px]">
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md">
                  <Star size={13} fill="#f59e0b" className="text-amber-500" />
                  <span className="font-semibold">{rating}</span>
                  <span className="text-amber-600/70">({reviews})</span>
                </div>

                <div className="flex items-center gap-1.5 text-gray-500">
                  <Clock3 size={14} strokeWidth={1.8} />
                  <span>{deliveryTime}</span>
                </div>

                <div className="flex items-center gap-1.5 text-emerald-600">
                  <Truck size={14} strokeWidth={1.8} />
                  <span className="font-medium">Free Delivery</span>
                </div>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-end gap-2.5">
                <span className="text-2xl font-bold text-orange-600 tracking-tight leading-none">
                  ₹{Number(discountedPrice).toFixed(2)}
                </span>
                {discount > 0 && (
                  <div className="flex items-center gap-2 pb-0.5">
                    <span className="text-sm text-gray-400 line-through">
                      ₹{price}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-md">
                      {discount}% OFF
                    </span>
                  </div>
                )}
              </div>

              {/* Stock */}
              <p
                className={`mt-1.5 text-[13px] font-medium ${
                  stock > 0 ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {stock > 0 ? `In Stock · ${stock} available` : "Out of Stock"}
              </p>

              {/* Extra Info Cards */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                  <Users size={16} className="mx-auto text-orange-500 mb-1" />
                  <p className="text-[11px] text-gray-500">Serves</p>
                  <p className="text-xs font-semibold text-gray-800">
                    {serves}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                  <Clock3 size={16} className="mx-auto text-orange-500 mb-1" />
                  <p className="text-[11px] text-gray-500">Prep Time</p>
                  <p className="text-xs font-semibold text-gray-800">
                    {prepTime}
                  </p>
                </div>
                {/* <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                  <Leaf size={16} className="mx-auto text-orange-500 mb-1" />
                  <p className="text-[11px] text-gray-500">Type</p>
                  <p className="text-xs font-semibold text-gray-800">
                    {isVeg ? "Veg" : "Non-Veg"}
                  </p>
                </div> */}
              </div>

              {/* Description */}
              <div className="mt-5">
                <h3 className="text-[12px] font-semibold text-gray-500 mb-1.5 tracking-wider uppercase">
                  About this dish
                </h3>
                <p className="text-[14px] text-gray-600 leading-relaxed">
                  {description ||
                    "Delicious and freshly prepared with the finest ingredients and authentic spices for a rich, satisfying taste."}
                </p>
              </div>

              {/* Highlights */}
              <div className="mt-4">
                <h3 className="text-[12px] font-semibold text-gray-500 mb-2 tracking-wider uppercase">
                  Highlights
                </h3>
                <div className="flex flex-wrap gap-2">
                  {highlights.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 text-[12px] font-medium px-2.5 py-1 rounded-lg"
                    >
                      <ShieldCheck size={12} />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              {!isAdmin && (
                <div className="mt-6">
                  {!cartItem ? (
                    <button
                      onClick={handleAdd}
                      disabled={stock <= 0 || isLoading}
                      className="w-full sm:w-auto min-w-[170px] h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-300 disabled:to-orange-400 text-white text-sm font-semibold rounded-xl shadow-sm shadow-orange-200/60 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      {isLoading ? "Adding..." : "Add to Cart"}
                    </button>
                  ) : (
                    <div className="inline-flex items-center bg-gray-50 border border-gray-200/80 rounded-xl p-1 shadow-sm">
                      <button
                        onClick={handleDecrease}
                        disabled={isLoading}
                        className="w-9 h-9 flex items-center justify-center text-lg text-gray-600 hover:bg-white hover:text-gray-900 rounded-lg transition-all disabled:opacity-50"
                      >
                        −
                      </button>
                      <span className="text-[15px] font-semibold w-9 text-center tabular-nums text-gray-900">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={handleIncrease}
                        disabled={cartItem.quantity >= stock || isLoading}
                        className="w-9 h-9 flex items-center justify-center text-lg text-orange-600 hover:bg-orange-50 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
