import { useDispatch, useSelector } from "react-redux";
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
import { useNavigate } from "react-router-dom";
import { Star, Clock3, Plus, Minus } from "lucide-react";

const FoodCard = ({ data }) => {
  const { imageUrl, foodName, discountedPrice, discount, stock, description } =
    data;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);
  const cartItem = cartItems.find((item) => item.foodId === data.id);

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const isAdmin = user?.roles?.includes("ADMIN");

  const handleIncrease = async () => {
    try {
      if (cartItem && cartItem.quantity >= stock) {
        alert(`Only ${stock} items available`);
        return;
      }

      if (!isAuthenticated) {
        dispatch(increaseQuantity(data.id));
        return;
      }

      await increaseCartApi(user.id, data.id);
      dispatch(fetchCart(user.id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDecrease = async () => {
    try {
      if (!isAuthenticated) {
        dispatch(decreaseQuantity(data.id));
        return;
      }

      await decreaseCartApi(user.id, data.id);
      dispatch(fetchCart(user.id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToCart = async () => {
    try {
      if (stock <= 0) {
        alert("Out of stock");
        return;
      }

      if (!isAuthenticated) {
        dispatch(addToCart(data));
        return;
      }

      await addToCartApi({
        userId: user.id,
        productId: data.id,
        quantity: 1,
      });

      dispatch(fetchCart(user.id));
    } catch (error) {
      console.error(error);
      alert(error?.response?.data || "Unable to add item to cart");
    }
  };

  const openFood = () => {
    navigate(`/food/${data.id}`, { state: data });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
      {/* IMAGE */}
      <div
        className="relative cursor-pointer overflow-hidden"
        onClick={openFood}
      >
        <img
          src={imageUrl}
          alt={foodName}
          className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-orange-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-3.5">
        {/* Name */}
        <h3
          onClick={openFood}
          className="font-semibold text-[15px] text-gray-900 truncate cursor-pointer hover:text-orange-600 transition-colors"
        >
          {foodName}
        </h3>

        {/* Rating + Time */}
        <div className="flex items-center gap-2 mt-1.5 text-[12px] text-gray-500">
          <div className="flex items-center gap-0.5 font-medium text-amber-600">
            <Star size={12} fill="#f59e0b" className="text-amber-500" />
            4.5
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock3 size={12} />
            20-30 mins
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-gray-500 text-[12px] mt-1.5 line-clamp-1">
            {description}
          </p>
        )}

        {/* Price + Cart */}
        <div className="flex items-center justify-between mt-3 gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-[15px] text-gray-900">
              ₹{Number(discountedPrice).toFixed(0)}
            </span>
            {discount > 0 && (
              <span className="text-gray-400 line-through text-[12px]">
                ₹{Number(data.price).toFixed(0)}
              </span>
            )}
          </div>

          {/* Cart Controls */}
          {!isAdmin && (
            <>
              {!cartItem ? (
                stock > 0 ? (
                  <button
                    onClick={handleAddToCart}
                    className="flex items-center gap-1 bg-white border border-orange-500 text-orange-600 hover:bg-orange-50 text-xs font-bold px-3 py-1.5 rounded-lg transition active:scale-95"
                  >
                    <Plus size={14} strokeWidth={2.5} />
                    ADD
                  </button>
                ) : (
                  <span className="text-[11px] font-medium text-red-500">
                    Out of Stock
                  </span>
                )
              ) : (
                <div className="flex items-center bg-orange-500 text-white rounded-lg overflow-hidden">
                  <button
                    onClick={handleDecrease}
                    className="w-8 h-8 flex items-center justify-center hover:bg-orange-600 transition"
                  >
                    <Minus size={14} strokeWidth={2.5} />
                  </button>
                  <span className="w-7 text-center text-sm font-bold tabular-nums">
                    {cartItem.quantity}
                  </span>
                  <button
                    onClick={handleIncrease}
                    disabled={stock === 0 || cartItem.quantity >= stock}
                    className="w-8 h-8 flex items-center justify-center hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={14} strokeWidth={2.5} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Low stock warning */}
        {stock > 0 && stock <= 5 && (
          <p className="text-[11px] text-orange-600 font-medium mt-1.5">
            Only {stock} left
          </p>
        )}
      </div>
    </div>
  );
};

export default FoodCard;
