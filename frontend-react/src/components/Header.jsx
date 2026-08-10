import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import logo from "../assets/foodexpresslogo.png";
import {
  Menu,
  Search,
  ShoppingCart,
  MapPin,
  ChevronDown,
  User,
  LogOut,
  Package,
  X,
  ChefHat,
  LayoutDashboard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/service/authService";
import { logout } from "../redux/slice/authSlice";
import { clearCart } from "../redux/slice/cartSlice";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const dropdownRef = useRef();

  const cartItems = useSelector((state) => state.cart.items);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const isAdmin = user?.roles?.includes("ADMIN");

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if (!confirmLogout) {
      return;
    }
    try {
      await logoutUser();
      dispatch(logout());
      dispatch(clearCart());
      setProfileOpen(false);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-orange-50/95 via-[#fffdf9]/95 to-white/95 border-b border-orange-100 shadow-xl shadow-orange-200/25">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 h-20 flex items-center justify-between">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-8">
          <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* LOGO */}
          <div
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={() => navigate("/")}
          >
            <img
              src={logo}
              alt="FoodExpress Logo"
              className="w-12 h-12 lg:w-14 lg:h-14 object-contain transition-transform duration-300 group-hover:scale-105"
            />

            <div className="hidden sm:block leading-tight">
              <h1 className="text-[22px] font-bold tracking-tight leading-none">
                <span className="text-gray-900">Food</span>
                <span className="text-orange-500">Express</span>
              </h1>

              <div className="mt-0.5 flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-1 text-orange-500" />
                <span>Serving Odisha</span>
              </div>
            </div>
          </div>

          {/* NAV LINKS */}
          <nav className="hidden lg:flex items-center gap-9 text-sm">
            <button
              onClick={() => navigate("/")}
              className="relative font-medium text-gray-700 transition-all duration-300 hover:text-orange-600 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-orange-500 after:transition-all after:duration-300 hover:after:w-full"
            >
              Home
            </button>

            {!isAdmin && (
              <button
                onClick={() => navigate("/contactUs")}
                className="relative font-medium text-gray-700 transition-all duration-300 hover:text-orange-600 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-orange-500 after:transition-all after:duration-300 hover:after:w-full"
              >
                Contact
              </button>
            )}
          </nav>
        </div>

        {/* SEARCH BAR */}
        {!isAdmin && (
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div
              onClick={() => navigate("/search")}
              className="w-full flex items-center gap-3 px-5 py-3 bg-white/70 backdrop-blur-md border border-orange-100 rounded-3xl shadow-md shadow-orange-100/20 hover:bg-white hover:border-orange-300 hover:shadow-xl hover:shadow-orange-200/30 cursor-pointer transition-all duration-300"
            >
              <Search className="w-5 h-5 text-gray-400" />
              <span className="text-gray-500 text-sm flex-1">
                Search for food, restaurants...
              </span>
            </div>
          </div>
        )}

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4">
          {isAdmin ? (
            <button
              onClick={() => navigate("/admin")}
              title="Admin Dashboard"
              className="rounded-2xl p-3 hover:bg-orange-100 hover:text-orange-600 transition-all duration-300 hover:shadow-md"
            >
              <LayoutDashboard className="w-6 h-6" />
            </button>
          ) : (
            <button
              onClick={() => navigate("/cart")}
              className="relative flex items-center gap-2 rounded-2xl px-4 py-3 hover:bg-orange-100 hover:text-orange-600 transition-all duration-300 hover:shadow-md"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-medium w-5 h-5 rounded-full flex items-center justify-center shadow">
                    {cartCount}
                  </span>
                )}
              </div>

              <span className="hidden sm:block font-medium">Cart</span>
            </button>
          )}

          {/* PROFILE DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 rounded-2xl px-3 py-2 hover:bg-orange-100 transition-all duration-300"
            >
              <div
                className="
    w-11
    h-11
    rounded-full
    bg-gradient-to-br
    from-orange-500
    via-orange-600
    to-orange-700
    text-white
    text-sm
    font-bold
    flex
    items-center
    justify-center
    shadow-md
    ring-2
    ring-white
    uppercase
    select-none
  "
              >
                {isAuthenticated
                  ? user?.name
                      ?.trim()
                      .split(/\s+/)
                      .map((word) => word[0])
                      .slice(0, 2)
                      .join("")
                  : "G"}
              </div>

              <div className="hidden lg:block text-left">
                <p className="font-semibold text-gray-800 text-sm">
                  {isAuthenticated ? user?.name?.split(" ")[0] : "Guest"}
                </p>
                <p className="text-xs text-gray-500 -mt-0.5">
                  {isAuthenticated
                    ? isAdmin
                      ? "Administrator"
                      : "Online"
                    : "Sign in"}
                </p>
              </div>

              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-4 w-72 rounded-3xl bg-white/90 backdrop-blur-2xl border border-orange-100 shadow-2xl shadow-orange-200/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-5 bg-gradient-to-r from-orange-50 to-white border-b border-orange-100">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-lg text-gray-900">
                      {user?.name || "Guest User"}
                    </p>

                    {isAdmin && (
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
                        ADMIN
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 truncate mt-1">
                    {user?.email}
                  </p>
                </div>

                <div className="py-2">
                  {isAuthenticated ? (
                    <>
                      {isAdmin ? (
                        <>
                          <button
                            onClick={() => {
                              navigate("/admin");
                              setProfileOpen(false);
                            }}
                            className="w-full flex items-center gap-4 px-6 py-3 hover:bg-orange-50 transition"
                          >
                            <Package className="w-5 h-5 text-orange-500" />
                            Admin Dashboard
                          </button>

                          <div className="mx-4 my-2 border-t border-orange-100"></div>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              navigate("/profile");
                              setProfileOpen(false);
                            }}
                            className="w-full flex items-center gap-4 px-6 py-3 hover:bg-orange-50 transition"
                          >
                            <User className="w-5 h-5 text-orange-500" />
                            My Profile
                          </button>

                          <button
                            onClick={() => {
                              navigate("/my-orders");
                              setProfileOpen(false);
                            }}
                            className="w-full flex items-center gap-4 px-6 py-3 hover:bg-orange-50 transition"
                          >
                            <Package className="w-5 h-5 text-orange-500" />
                            My Orders
                          </button>

                          <div className="mx-4 my-2 border-t border-orange-100"></div>
                        </>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-6 py-3 hover:bg-red-50 text-red-600 transition"
                      >
                        <LogOut className="w-5 h-5" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          navigate("/login");
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-4 px-6 py-3 hover:bg-orange-50 transition"
                      >
                        <User className="w-5 h-5 text-orange-500" />
                        Login
                      </button>

                      <button
                        onClick={() => {
                          navigate("/register");
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-4 px-6 py-3 hover:bg-orange-50 transition"
                      >
                        <User className="w-5 h-5 text-orange-500" />
                        Create Account
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE SEARCH */}
      {!isAdmin && (
        <div className="md:hidden px-4 pb-4">
          <div
            onClick={() => navigate("/search")}
            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/80 backdrop-blur-md border border-orange-100 shadow-md shadow-orange-100/20"
          >
            <Search className="w-5 h-5 text-orange-400" />
            <span className="text-gray-500">Search for food...</span>
          </div>
        </div>
      )}

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="lg:hidden border-t border-orange-100 bg-gradient-to-b from-orange-50 via-white to-white shadow-xl">
          <div className="px-6 py-6 space-y-1">
            <button
              onClick={() => {
                navigate("/");
                setMenuOpen(false);
              }}
              className="w-full text-left rounded-xl px-4 py-3 hover:bg-orange-100 transition"
            >
              Home
            </button>

            {!isAdmin && (
              <>
                <button
                  onClick={() => {
                    navigate("/contactUs");
                    setMenuOpen(false);
                  }}
                  className="w-full text-left rounded-xl px-4 py-3 hover:bg-orange-100 transition"
                >
                  Contact Us
                </button>

                {isAuthenticated && (
                  <button
                    onClick={() => {
                      navigate("/my-orders");
                      setMenuOpen(false);
                    }}
                    className="w-full text-left rounded-xl px-4 py-3 hover:bg-orange-100 transition"
                  >
                    My Orders
                  </button>
                )}
              </>
            )}

            {isAdmin && (
              <button
                onClick={() => {
                  navigate("/admin");
                  setMenuOpen(false);
                }}
                className="w-full text-left rounded-xl px-4 py-3 hover:bg-orange-100 transition"
              >
                Admin Dashboard
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
