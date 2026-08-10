import { useEffect, useState } from "react";
import logo from "../assets/foodexpresslogo.png";
import {
  Menu,
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  Tags,
  ShoppingBag,
  MessageSquare,
  LogOut,
  IndianRupee,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { totalUsersCount } from "../api/service/userService";
import {
  getTotalOrderCount,
  getTotalOrderdAmount,
} from "../api/service/orderService";
import {
  getTotalPendingQueryCount,
  getTotalQueryCount,
} from "../api/service/contactUsService";
import { logoutUser } from "../api/service/authService";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slice/authSlice";
import { clearCart } from "../redux/slice/cartSlice";

export default function Dashboard() {
  const [open, setOpen] = useState(true);
  const [userCount, setUserCount] = useState(null);
  const [orderedAmount, setOrderedAmount] = useState(null);
  const [orderCount, setOrderCount] = useState(null);
  const [queryCount, setQueryCount] = useState(null);
  const [pendingQueryCount, setPendingQueryCount] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchCustomerCount = async () => {
    try {
      const response = await totalUsersCount();
      setUserCount(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTotalOrderAmount = async () => {
    try {
      const response = await getTotalOrderdAmount();
      setOrderedAmount(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTotalOrdersCount = async () => {
    try {
      const response = await getTotalOrderCount();
      setOrderCount(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTotalQueryCount = async () => {
    try {
      const response = await getTotalQueryCount();
      setQueryCount(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTotalPendingQueryCount = async () => {
    try {
      const response = await getTotalPendingQueryCount();
      setPendingQueryCount(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCustomerCount();
    fetchTotalOrderAmount();
    fetchTotalOrdersCount();
    fetchTotalQueryCount();
    fetchTotalPendingQueryCount();
  }, []);

  const menus = [
    { name: "Dashboard", icon: LayoutDashboard, path: "" },
    { name: "Customers", icon: Users, path: "users" },
    { name: "Foods", icon: UtensilsCrossed, path: "food" },
    { name: "Categories", icon: Tags, path: "category" },
    { name: "Orders", icon: ShoppingBag, path: "all/orders" },
    { name: "Queries", icon: MessageSquare, path: "query" },
  ];

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    try {
      await logoutUser();
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(logout());
      dispatch(clearCart());
      navigate("/", { replace: true });
    }
  };

  // Format currency in Indian style
  const formatCurrency = (value) => {
    if (value == null) return "—";
    if (value === 0) return "₹0";
    return `₹${Number(value).toLocaleString("en-IN")}`;
  };

  // Page title based on route
  const getPageTitle = () => {
    const path = location.pathname.split("/").filter(Boolean).pop() || "";
    const map = {
      "": "Dashboard",
      users: "Customers",
      food: "Foods",
      category: "Categories",
      orders: "Orders",
      query: "Queries",
    };
    return map[path] || "Dashboard";
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FC]">
      {/* ───────────────── Sidebar ───────────────── */}
      <aside
        className={`
          ${open ? "w-64" : "w-[72px]"}
          sticky top-0 h-screen
          bg-white
          border-r border-gray-200/80
          transition-all duration-300 ease-in-out
          flex flex-col
          shrink-0
          z-30
        `}
      >
        {/* Brand */}
        <div className="h-[72px] px-4 border-b border-gray-100 flex items-center gap-3">
          <img
            src={logo}
            alt="FoodExpress"
            className="w-10 h-10 object-contain shrink-0"
          />
          {open && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold tracking-tight text-gray-900 leading-tight">
                Food<span className="text-orange-500">Express</span>
              </h1>
              <p className="text-[11px] text-gray-400 font-medium tracking-wide uppercase">
                Admin Panel
              </p>
            </div>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="ml-auto p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <Menu size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {menus.map((menu) => {
            const Icon = menu.icon;
            return (
              <NavLink
                key={menu.name}
                to={menu.path}
                end={menu.path === ""}
                className={({ isActive }) =>
                  `
                  group flex items-center gap-3 h-11 px-3 rounded-xl
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-orange-500 text-white shadow-md shadow-orange-200/60"
                      : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                  }
                  `
                }
              >
                <Icon size={20} className="shrink-0" strokeWidth={1.75} />
                {open && (
                  <span className="font-medium text-[14px] truncate">
                    {menu.name}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        {open && (
          <div className="px-4 py-4 border-t border-gray-100">
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                AD
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  Administrator
                </p>
                <p className="text-xs text-gray-400 truncate">Food Express</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* ───────────────── Main Content ───────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-20 h-[72px] bg-white/80 backdrop-blur-md border-b border-gray-200/80 px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
              {getPageTitle()}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Monitor performance & manage your platform
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-800">
                Administrator
              </p>
              <p className="text-xs text-gray-400">Food Express</p>
            </div>

            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white text-sm font-bold flex items-center justify-center shadow-md shadow-orange-200/50">
              AD
            </div>

            {user && (
              <button
                onClick={handleLogout}
                title="Logout"
                className="
                  flex items-center justify-center
                  w-10 h-10 rounded-xl
                  border border-gray-200 bg-white
                  text-gray-500
                  hover:bg-red-50 hover:text-red-600 hover:border-red-200
                  transition-all duration-200
                "
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto p-5 lg:p-8">
            {/* ───── Stats Cards ───── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
              {/* Total Users */}
              <Link to="users" className="group">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-orange-100 transition-all duration-300 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Total Users
                      </p>
                      <h2 className="text-2xl font-bold text-gray-900 mt-1.5 tracking-tight">
                        {userCount == null
                          ? "—"
                          : userCount === 0
                            ? "0"
                            : userCount.toLocaleString("en-IN")}
                      </h2>
                      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                        Registered customers
                      </p>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                      <Users size={22} strokeWidth={1.75} />
                    </div>
                  </div>
                </div>
              </Link>

              {/* Revenue */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-green-100 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Revenue</p>
                    <h2 className="text-2xl font-bold text-gray-900 mt-1.5 tracking-tight">
                      {orderedAmount == null
                        ? "—"
                        : formatCurrency(Math.round(orderedAmount))}
                    </h2>
                    <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1 font-medium">
                      <TrendingUp size={12} />
                      Total revenue
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <IndianRupee size={22} strokeWidth={1.75} />
                  </div>
                </div>
              </div>

              {/* Orders */}
              <Link to="all/orders" className="group">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Orders
                      </p>
                      <h2 className="text-2xl font-bold text-gray-900 mt-1.5 tracking-tight">
                        {orderCount == null
                          ? "—"
                          : orderCount === 0
                            ? "0"
                            : orderCount.toLocaleString("en-IN")}
                      </h2>
                      <p className="text-xs text-gray-400 mt-2">
                        All time orders
                      </p>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <ShoppingBag size={22} strokeWidth={1.75} />
                    </div>
                  </div>
                </div>
              </Link>

              {/* Queries */}
              <Link to="query" className="group">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-red-100 transition-all duration-300 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Queries
                      </p>
                      <h2 className="text-2xl font-bold text-gray-900 mt-1.5 tracking-tight">
                        {queryCount == null
                          ? "—"
                          : queryCount === 0
                            ? "0"
                            : queryCount.toLocaleString("en-IN")}
                      </h2>
                      <p className="text-xs text-red-500 mt-2 font-medium">
                        {pendingQueryCount == null
                          ? "—"
                          : pendingQueryCount === 0
                            ? "No pending"
                            : `${pendingQueryCount} pending`}
                      </p>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-red-50 text-red-500 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                      <MessageSquare size={22} strokeWidth={1.75} />
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* ───── Nested Page Content ───── */}
            <div className="min-h-[500px]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
