import { ShoppingCart } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import { DELIVERY_FEE, PLATFORM_FEE } from "../utils/constants";

const CartPage = () => {
  const navigate = useNavigate();

  const { items } = useSelector((state) => state.cart);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <ShoppingCart className="w-20 h-20 text-gray-300" />

        <h2 className="mt-4 text-2xl font-bold text-gray-700">
          Your Cart is Empty
        </h2>

        <p className="text-gray-500 mt-2">Add some delicious food 🍔</p>

        <button
          onClick={() => navigate("/search")}
          className="
            mt-6
            bg-orange-500
            hover:bg-orange-600
            text-white
            px-6
            py-3
            rounded-xl
          "
        >
          Browse Foods
        </button>
      </div>
    );
  }

  const itemTotal = items.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0,
  );

  const discountedTotal = items.reduce(
    (sum, item) => sum + item.discountedPrice * item.quantity,
    0,
  );

  const itemDiscount = itemTotal - discountedTotal;

  const deliveryFee =DELIVERY_FEE;

  const platformFee = PLATFORM_FEE;

  const gst = discountedTotal * 0.05;

  const grandTotal = discountedTotal + deliveryFee + platformFee + gst;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2">
          {items.map((item) => (
            <CartItem key={item.foodId} item={item} />
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white rounded-2xl shadow p-6 h-fit">
          <h2 className="text-xl font-semibold mb-5">Bill Details</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Item Total</span>
              <span>₹{itemTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Fee</span>

              <span>
                {deliveryFee === 0 ? "FREE" : `₹${deliveryFee.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Platform Fee</span>
              <span>₹{platformFee.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-green-600">
              <span>Item Discount</span>
              <span>- ₹{itemDiscount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>GST & Other Charges</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>

            <hr />

            <div className="flex justify-between font-bold text-lg">
              <span>TO PAY</span>

              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            className="
              w-full
              mt-6
              bg-orange-500
              hover:bg-orange-600
              text-white
              py-3
              rounded-xl
              font-semibold
            "
            onClick={()=>{
              navigate("/checkout")
            }}
          >
            Proceed To Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
