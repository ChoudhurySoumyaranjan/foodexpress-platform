import { Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "../redux/slice/cartSlice";

import { fetchCart } from "../redux/thunks/cartThunk";

import {
  removeCartItemApi,
  increaseCartApi,
  decreaseCartApi,
} from "../api/service/cartService";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const originalPrice = Number(item.originalPrice || item.price || 0);

  const discountedPrice = Number(item.discountedPrice || item.price || 0);

  const stock = Number(item.stock || 0);

  const handleIncrease = async () => {
    try {
      // Guest User
      if (!isAuthenticated) {
        if (stock > 0 && item.quantity >= stock) {
          alert(`Only ${stock} items available`);
          return;
        }

        dispatch(increaseQuantity(item.foodId));
        return;
      }

      // Logged In User
      await increaseCartApi(user.id, item.foodId);

      await dispatch(fetchCart(user.id));
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Unable to increase quantity",
      );
    }
  };

  const handleDecrease = async () => {
    try {
      // Guest User
      if (!isAuthenticated) {
        dispatch(decreaseQuantity(item.foodId));
        return;
      }

      // Logged In User
      await decreaseCartApi(user.id, item.foodId);

      await dispatch(fetchCart(user.id));
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Unable to decrease quantity",
      );
    }
  };

  const handleRemoveItem = async () => {
    try {
      // Guest User
      if (!isAuthenticated) {
        dispatch(removeFromCart(item.foodId));
        return;
      }

      // Logged In User
      await removeCartItemApi(user.id, item.foodId);

      await dispatch(fetchCart(user.id));
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Unable to remove item",
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-4 mb-4">
      <div className="flex gap-4 items-center">
        <img
          src={item.imageUrl}
          alt={item.foodName}
          className="
            w-24
            h-24
            rounded-xl
            object-cover
          "
        />

        <div className="flex-1">
          <h3 className="font-semibold text-lg">{item.foodName}</h3>

          <p
            className={`text-sm mt-1 font-medium ${
              stock > 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {stock > 0 ? `In Stock (${stock})` : "Out of Stock"}
          </p>

          <div className="mt-2">
            <span className="text-gray-400 line-through mr-2">
              ₹{originalPrice.toFixed(2)}
            </span>

            <span className="text-orange-500 font-bold">
              ₹{discountedPrice.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleDecrease}
              className="
                w-8
                h-8
                rounded
                bg-gray-200
                hover:bg-gray-300
              "
            >
              -
            </button>

            <span className="font-semibold">{item.quantity}</span>

            <button
              onClick={handleIncrease}
              disabled={stock === 0 || (stock > 0 && item.quantity >= stock)}
              className="
                w-8
                h-8
                rounded
                bg-orange-500
                hover:bg-orange-600
                text-white
                disabled:bg-gray-300
                disabled:cursor-not-allowed
              "
            >
              +
            </button>
          </div>
        </div>

        <div className="flex flex-col items-end gap-4">
          <button
            onClick={handleRemoveItem}
            className="hover:scale-110 transition"
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </button>

          <span className="font-bold text-lg">
            ₹{(discountedPrice * item.quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
