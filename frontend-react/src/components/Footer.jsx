import { Link } from "react-router-dom";
import { MapPin, Mail, Phone } from "lucide-react";
import logo from "../assets/foodexpresslogo.png";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaGooglePlay,
  FaApple,
} from "react-icons/fa6";
import { useSelector } from "react-redux";

export default function Footer() {
  const { user } = useSelector((state) => state.auth);
  return (
    <footer className="bg-gradient-to-b from-orange-50 via-[#fffdf9] to-white border-t border-orange-100">
      {/* Top Accent */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-orange-300 to-orange-500"></div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            {/* Brand */}
            <div className="flex items-center gap-3 mb-6">
              <img
                src={logo}
                alt="FoodExpress Logo"
                className="w-12 h-12 object-contain"
              />

              <div className="leading-tight">
                <h2 className="text-[22px] font-extrabold">
                  <span className="text-gray-900">Food</span>
                  <span className="text-orange-500">Express</span>
                </h2>

                <p className="text-sm text-gray-500 mt-0.5">
                  Delivering happiness, one meal at a time.
                </p>
              </div>
            </div>
            <p className="text-gray-600 leading-7 max-w-md">
              Order delicious food from your favourite restaurants with
              lightning-fast delivery, secure payments and exclusive offers.
            </p>

            <div className="mt-8 space-y-4 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-orange-500" />
                Bhubaneswar, Odisha, India
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} className="text-orange-500" />
                +91 XXXXX XXXXX
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} className="text-orange-500" />
                support@foodexpress.com
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-5">Company</h3>

            <ul className="space-y-3 text-gray-600">
              <li>
                <Link
                  to="/"
                  className="hover:text-orange-600 transition-colors duration-200"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/"
                  className="hover:text-orange-600 transition-colors duration-200"
                >
                  Restaurants
                </Link>
              </li>

              <li>
                <Link
                  to="/contactUs"
                  className="hover:text-orange-600 transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </li>

              {!user && (
                <li>
                  <Link
                    to="/admin/login"
                    className="hover:text-orange-600 transition-colors duration-200"
                  >
                    Admin
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-5">Support</h3>

            <ul className="space-y-3 text-gray-600">
              <li>
                <Link
                  to="/contactUs"
                  className="hover:text-orange-600 transition-colors duration-200"
                >
                  Help Centre
                </Link>
              </li>

              <li>
                <Link
                  to="/"
                  className="hover:text-orange-600 transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/"
                  className="hover:text-orange-600 transition-colors duration-200"
                >
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link
                  to="/"
                  className="hover:text-orange-600 transition-colors duration-200"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Apps */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-5">Follow Us</h3>

            <div className="flex gap-3 mb-8">
              <a
                href="#"
                className="w-11 h-11 rounded-full bg-white border border-orange-100 shadow-sm flex items-center justify-center text-gray-600 hover:bg-orange-500 hover:text-white hover:shadow-lg hover:shadow-orange-200 transition-all duration-300"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                className="w-11 h-11 rounded-full bg-white border border-orange-100 shadow-sm flex items-center justify-center text-gray-600 hover:bg-orange-500 hover:text-white hover:shadow-lg hover:shadow-orange-200 transition-all duration-300"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                className="w-11 h-11 rounded-full bg-white border border-orange-100 shadow-sm flex items-center justify-center text-gray-600 hover:bg-orange-500 hover:text-white hover:shadow-lg hover:shadow-orange-200 transition-all duration-300"
              >
                <FaXTwitter />
              </a>

              <a
                href="#"
                className="w-11 h-11 rounded-full bg-white border border-orange-100 shadow-sm flex items-center justify-center text-gray-600 hover:bg-orange-500 hover:text-white hover:shadow-lg hover:shadow-orange-200 transition-all duration-300"
              >
                <FaLinkedinIn />
              </a>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Download App
            </h3>

            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-3 rounded-xl bg-gray-900 text-white py-3 shadow-md hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-200 transition-all duration-300">
                <FaGooglePlay size={20} />
                <span>Google Play</span>
              </button>

              <button className="w-full flex items-center justify-center gap-3 rounded-xl bg-gray-900 text-white py-3 shadow-md hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-200 transition-all duration-300">
                <FaApple size={20} />
                <span>App Store</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-orange-100 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} FoodExpress. All rights reserved.
          </p>

          <p className="text-sm text-gray-500 mt-3 md:mt-0">
            Made with ❤️ in India
          </p>
        </div>
      </div>
    </footer>
  );
}
