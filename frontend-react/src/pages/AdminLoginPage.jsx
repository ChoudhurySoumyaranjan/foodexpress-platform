import React, { useState } from "react";
import logo from "../assets/foodexpresslogo.png";
import { loginUser } from "../api/service/authService";
import { loginSuccess } from "../redux/slice/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
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
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await loginUser(formData);

      if (response.status === 200) {
        const roles = response.data.user.roles || [];

        if (roles.includes("ADMIN")) {
          dispatch(loginSuccess(response.data));
          navigate("/admin");
          return;
        }

        alert("You are not authorized to access the admin panel.");
      }
    } catch (error) {
      alert(error?.response?.data?.message || "Invalid email or password");
    } finally {
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
          {/* Logo */}
          <div className="flex items-center gap-4 mb-8">
            <img
              src={logo}
              alt="FoodExpress Logo"
              className="w-16 h-16 object-contain"
            />

            <h1 className="text-4xl font-bold">
              <span className="text-gray-900">Food</span>
              <span className="text-orange-500">Express</span>
            </h1>
          </div>

          <h2 className="text-5xl font-bold text-gray-900 leading-tight">
            Admin Portal
          </h2>

          <p className="mt-5 text-xl text-gray-600 leading-8">
            Securely manage customers,foods, categories, orders and customer
            support from a centralized dashboard.
          </p>

          <div className="mt-10">
            <div className="w-32 h-2 bg-orange-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-bold text-gray-900">Admin Login</h2>

          <p className="mt-2 text-gray-500">
            Sign in to access the FoodExpress Admin Dashboard.
          </p>

          <form onSubmit={handleFormSubmit} className="mt-10 space-y-5">
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleValueChange}
                placeholder="Admin Email"
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
                <p className="text-red-500 text-sm mt-2">{errors.email}</p>
              )}
            </div>

            <div>
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
                <p className="text-red-500 text-sm mt-2">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
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
              "
            >
              Login to Admin Panel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
