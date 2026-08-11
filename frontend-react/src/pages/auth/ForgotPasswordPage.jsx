import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { toast } from "react-toastify";
import { forgotPassword } from "../../api/service/authService";

const ForgotPasswordPage = () => {
  const [json, setJson] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await forgotPassword(json);

      toast.success(
        "If an account exists, a password reset link has been sent.",
      );
    } catch (error) {
      toast.error(error.response?.data || "Something went wrong.");
    } finally {
      setLoading(false);
      setJson({
        email: "",
      });
    }
  };

  const handleChange = (e) => {
    setJson({
      ...json,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Section */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-orange-50">
        <div className="max-w-md px-12">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Forgot Password?
          </h1>

          <p className="mt-5 text-xl text-gray-600 leading-8">
            Don't worry. We'll send a password reset link to your registered
            email address.
          </p>

          <div className="mt-10 w-32 h-2 bg-orange-500 rounded-full"></div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 mb-6">
              <Mail className="text-orange-500" size={30} />
            </div>

            <h2 className="text-4xl font-bold text-gray-900">Reset Password</h2>

            <p className="mt-3 text-gray-500 leading-6">
              Enter your registered email address and we'll send you a password
              reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                autoComplete="email"
                name="email"
                value={json.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
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
            </div>

            <button
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
              shadow-md
              transition
              disabled:opacity-60
            "
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="text-orange-500 font-semibold hover:text-orange-600"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
