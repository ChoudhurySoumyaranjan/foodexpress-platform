import React, { useState } from "react";
import { registerUser } from "../../api/service/authService";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    address: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setApiError("");

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      await registerUser(formData);

      setShowModal(true);

      setFormData({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        address: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setApiError(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Section */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-orange-50">
        <div className="max-w-md px-12">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Join FoodExpress
          </h1>

          <p className="mt-5 text-xl text-gray-600 leading-8">
            Create your account and start ordering delicious meals from your
            favourite restaurants.
          </p>

          <div className="mt-10 w-32 h-2 bg-orange-500 rounded-full"></div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <h2 className="text-4xl font-bold text-gray-900">Sign up</h2>

          <p className="mt-2 text-gray-500">
            or{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-orange-500 font-semibold hover:text-orange-600"
            >
              login to your account
            </button>
          </p>

          {showModal && (
            <div className="mt-6 rounded border border-green-200 bg-green-50 px-4 py-3 text-green-700">
              Registration successful! Redirecting to login...
            </div>
          )}

          {apiError && (
            <div className="mt-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {apiError}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="mt-8 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full h-14 px-4 border border-gray-300 focus:border-orange-500 focus:ring-0 outline-none transition"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full h-14 px-4 border border-gray-300 focus:border-orange-500 focus:ring-0 outline-none transition"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                maxLength={10}
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full h-14 px-4 border border-gray-300 focus:border-orange-500 focus:ring-0 outline-none transition"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-14 px-4 border border-gray-300 focus:border-orange-500 focus:ring-0 outline-none transition"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <textarea
                name="address"
                rows="3"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 resize-none focus:border-orange-500 focus:ring-0 outline-none transition"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full h-14 px-4 border border-gray-300 focus:border-orange-500 focus:ring-0 outline-none transition"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white font-semibold uppercase tracking-wide shadow-md transition disabled:opacity-60"
            >
              {loading ? "Registering..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;
