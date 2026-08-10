import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slice/cartSlice";
import { getAllPaymentTypes, placeOrderApi } from "../api/service/orderService";
import loadRazorpay from "../utils/loadRazorpay";

import {
  createPaymentOrderApi,
  verifyPaymentApi,
} from "../api/service/paymentService";
import { DELIVERY_FEE, PLATFORM_FEE } from "../utils/constants";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { items, totalItems } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phoneNumber || "",
    address: user?.address || "",
    city: "",
    pincode: "",
    paymentMethod: "",
  });

  const [errors, setErrors] = useState({});
  const [paymentTypes, setPaymentTypes] = useState([]);
  // useEffect(() => {
  //   if (!user) {
  //     alert("Please login to continue");

  //     navigate("/login");
  //   }
  // }, [user, navigate]);
  useEffect(() => {
    const fetchPaymentType = async () => {
      try {
        const response = await getAllPaymentTypes();

        setPaymentTypes(response.data);

        if (response.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            paymentMethod: response.data[0],
          }));
        }
      } catch (error) {
        console.error("Failed to load payment types", error);
      }
    };

    fetchPaymentType();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrors((previous) => {
      return {
        ...previous,
        [e.target.name]: "",
      };
    });
  };

  const itemTotal = items.reduce(
    (sum, item) =>
      sum + Number(item.originalPrice || item.price) * item.quantity,
    0,
  );

  const discountedTotal = items.reduce(
    (sum, item) =>
      sum +
      Number(item.discountedPrice || item.price || item.originalPrice) *
        item.quantity,
    0,
  );

  const discount = itemTotal - discountedTotal;

  const deliveryFee = DELIVERY_FEE;
  const platformFee = PLATFORM_FEE;

  const gst = Number((discountedTotal * 0.05).toFixed(2));

  const finalAmount = discountedTotal + deliveryFee + platformFee + gst;
  const openRazorpayCheckout = async (orderRequest) => {
    try {
      const loaded = await loadRazorpay();

      if (!loaded) {
        setLoading(false);
        alert("Failed to load Razorpay.");
        return;
      }

      if (finalAmount <= 0) {
        setLoading(false);
        alert("Invalid order amount.");
        return;
      }

      const { data } = await createPaymentOrderApi(finalAmount);

      if (!window.Razorpay) {
        setLoading(false);
        alert("Razorpay SDK not loaded.");
        return;
      }

      const options = {
        key: data.key,

        amount: data.amount,

        currency: data.currency,

        name: "Food Ordering App",

        description: "Food Order Payment",

        order_id: data.orderId,

        prefill: {
          name: formData.name,
          email: user?.email,
          contact: formData.phone,
        },

        theme: {
          color: "#f97316",
        },

        retry: {
          enabled: true,
          max_count: 3,
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
            alert("Payment cancelled.");
          },
        },

        handler: async function (response) {
          try {
            const verifyRequest = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderRequest,
            };

            const { data } = await verifyPaymentApi(verifyRequest);

            if (data.success) {
              dispatch(clearCart());

              setLoading(false);

              alert(data.message);

              navigate("/my-orders");
            } else {
              setLoading(false);

              alert(data.message);
            }
          } catch (error) {
            console.error(error);

            setLoading(false);

            alert(
              error?.response?.data?.message || "Payment Verification Failed",
            );
          }
        },
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.on("payment.failed", function (response) {
        console.error(response.error);

        setLoading(false);

        alert(response.error.description || "Payment Failed.");
      });

      paymentObject.open();
    } catch (error) {
      console.error(error);

      setLoading(false);

      alert("Unable to initiate payment.");
    }
  };

  const handlePlaceOrder = async () => {
    if (loading) return;

    if (!user) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    if (items.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!/^\d{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = "Enter a valid 6-digit pincode";
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Please select a payment method";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const orderRequest = {
        userId: user.id,
        customerName: formData.name,
        phoneNumber: formData.phone,
        paymentMethod: formData.paymentMethod,
        deliveryAddress: `${formData.address}, ${formData.city} - ${formData.pincode}`,
      };

      if (formData.paymentMethod === "CASH_ON_DELIVERY") {
        await placeOrderApi(orderRequest);

        dispatch(clearCart());

        alert("Order placed successfully");

        navigate("/my-orders");
      } else {
        await openRazorpayCheckout(orderRequest);
      }
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message || "Failed to place order");

      setLoading(false);
    }
  };
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-gray-700">Your Cart is Empty</h2>

        <p className="text-gray-500 mt-2">Add food before checkout</p>

        <button
          onClick={() => navigate("/")}
          className="mt-5 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl"
        >
          Browse Foods
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* DELIVERY DETAILS */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-5">Delivery Details</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                disabled={loading}
                value={formData.name}
                onChange={handleChange}
                className={`border rounded-xl p-3 outline-none ${
                  errors.name ? "border-red-500" : ""
                }`}
              />

              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}

              <input
                type="text"
                name="phone"
                disabled={loading}
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className={`border rounded-xl p-3 outline-none ${
                  errors.phone ? "border-red-500" : ""
                }`}
              />

              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}

              <input
                type="text"
                name="city"
                placeholder="City"
                disabled={loading}
                value={formData.city}
                onChange={handleChange}
                className={`border rounded-xl p-3 outline-none ${
                  errors.city ? "border-red-500" : ""
                }`}
                required
              />

              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}

              <input
                type="text"
                name="pincode"
                disabled={loading}
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleChange}
                className={`border rounded-xl p-3 outline-none ${
                  errors.pincode ? "border-red-500" : ""
                }`}
                required
              />
              {errors.pincode && (
                <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
              )}
            </div>

            <textarea
              name="address"
              disabled={loading}
              rows="4"
              placeholder="Full Address"
              value={formData.address}
              onChange={handleChange}
              className="mt-4 w-full border rounded-xl p-3 outline-none"
              required
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          {/* PAYMENT */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-5">Payment Method</h2>

            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              disabled={loading}
              className="w-full border rounded-xl p-3 disabled:bg-gray-100"
            >
              <option value="">Select Payment Method</option>

              {paymentTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "CASH_ON_DELIVERY"
                    ? "Cash On Delivery"
                    : type === "RAZORPAY"
                      ? "Online Payment (Razorpay)"
                      : type}
                </option>
              ))}
            </select>
            {errors.paymentMethod && (
              <p className="text-red-500 text-sm mt-1">
                {errors.paymentMethod}
              </p>
            )}
          </div>

          {/* ORDER ITEMS */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-5">Order Items</h2>

            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.foodId}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div>
                    <h3 className="font-medium">{item.foodName}</h3>

                    <p className="text-sm text-gray-500">
                      Qty : {item.quantity}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="line-through text-gray-400 text-sm">
                      ₹
                      {(
                        Number(item.originalPrice || item.price) * item.quantity
                      ).toFixed(2)}
                    </p>

                    <p className="font-semibold text-orange-500">
                      ₹
                      {(
                        Number(
                          item.discountedPrice ||
                            item.price ||
                            item.originalPrice,
                        ) * item.quantity
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-5">Bill Details</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Items ({totalItems})</span>
                <span>₹{itemTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Item Discount</span>
                <span className="text-green-600">- ₹{discount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span>₹{platformFee.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>GST & Other Charges</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>

              <hr />

              <div className="flex justify-between text-xl font-bold">
                <span>TO PAY</span>

                <span className="text-orange-500">
                  ₹{finalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {user === null ? (
              <button
                onClick={() => {
                  navigate("/login");
                }}
                className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold"
              >
                Login
              </button>
            ) : (
              <button
                disabled={loading}
                onClick={handlePlaceOrder}
                className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex justify-center items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Processing...
                  </span>
                ) : (
                  "Place Order"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
