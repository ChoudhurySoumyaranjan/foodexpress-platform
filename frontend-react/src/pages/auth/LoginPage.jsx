import React, { useState } from "react";
import { loginUser } from "../../api/service/authService";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { addToCartApi } from "../../api/service/cartService";
import { loginSuccess } from "../../redux/slice/authSlice";
import { fetchCart } from "../../redux/thunks/cartThunk";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleValueChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 3) {
      newErrors.password = "Password must contain at least 3 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await loginUser(formData);

      if (response.status === 200) {
        const roles = response.data.user.roles || [];

        if (!roles.includes("USER")) {
          alert("You are not authorized to access the customer panel.");
          return;
        }

        dispatch(loginSuccess(response.data));

        const userId = response.data.user.id;

        const localCart = JSON.parse(localStorage.getItem("cart")) || [];

        for (const item of localCart) {
          try {
            await addToCartApi({
              userId,
              productId: item.foodId,
              quantity: item.quantity,
            });
          } catch (error) {
            alert(
              `${item.foodName}: ${
                error.response?.data?.message ||
                error.response?.data ||
                "Stock not available"
              }`,
            );
          }
        }

        localStorage.removeItem("cart");

        await dispatch(fetchCart(userId));

        navigate("/");
      }
    } catch (error) {
      alert(error?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
      setFormData({
        email: "",
        password: "",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-orange-50">
        <div className="max-w-md px-12">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Hungry?
          </h1>

          <p className="mt-5 text-xl text-gray-600 leading-8">
            Order food from your favourite restaurants and get it delivered
            fresh at your doorstep.
          </p>

          <div className="mt-10">
            <div className="w-32 h-2 bg-orange-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-bold text-gray-900">Login</h2>

          <p className="mt-2 text-gray-500">
            or{" "}
            <Link
              to="/register"
              className="text-orange-500 font-semibold hover:text-orange-600"
            >
              create an account
            </Link>
          </p>

          <form onSubmit={handleFormSubmit} className="mt-10 space-y-5">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleValueChange}
              placeholder="Email"
              className="
              w-full
              h-14
              px-4
              border
              border-gray-300
              focus:border-orange-500
              focus:ring-0
              outline-none
              transition
            "
            />

            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleValueChange}
              placeholder="Password"
              className="
              w-full
              h-14
              px-4
              border
              border-gray-300
              focus:border-orange-500
              focus:ring-0
              outline-none
              transition
            "
            />

            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="
              w-full
              h-14
              bg-orange-500
              hover:bg-orange-600
              text-white
              font-semibold
              uppercase
              tracking-wide
              shadow-lg
              transition
              disabled:opacity-60
            "
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="text-center pt-2">
              <Link
                to="/forgot-password"
                className="text-sm text-gray-500 hover:text-orange-500"
              >
                Forgot Password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
