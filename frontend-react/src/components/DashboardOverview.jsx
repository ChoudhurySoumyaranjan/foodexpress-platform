import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import {
  getRevenueLast7Days,
  getOrderStatusChart,
  getRecentOrders,
  getTopSellingFoods,
  getRecentUsers,
  getRecentQueries,
} from "../api/service/analyticService";

const DashboardOverview = () => {
  const [revenueChart, setRevenueChart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderStatusChart, setOrderStatusChart] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topFoods, setTopFoods] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentQueries, setRecentQueries] = useState([]);

  const COLORS = [
    "#3B82F6",
    "#F59E0B",
    "#8B5CF6",
    "#06B6D4",
    "#22C55E",
    "#EF4444",
  ];

  const fetchRecentUsers = async () => {
    try {
      const response = await getRecentUsers();
      setRecentUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRecentQueries = async () => {
    try {
      const response = await getRecentQueries();
      setRecentQueries(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const response = await getRecentOrders();
      setRecentOrders(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTopSellingFoods = async () => {
    try {
      const response = await getTopSellingFoods();
      setTopFoods(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRevenueChart = async () => {
    try {
      const response = await getRevenueLast7Days();
      setRevenueChart(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderStatusChart = async () => {
    try {
      const response = await getOrderStatusChart();
      setOrderStatusChart(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRevenueChart();
    fetchOrderStatusChart();
    fetchRecentOrders();
    fetchTopSellingFoods();
    fetchRecentUsers();
    fetchRecentQueries();
  }, []);

  const formatLabel = (value) =>
    value
      ?.replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase()) || "—";

  const getStatusClass = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-200";
      case "PREPARING":
        return "bg-violet-50 text-violet-700 border-violet-200";
      case "OUT_FOR_DELIVERY":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "CONFIRMED":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "PLACED":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const formatSubject = (subject) => {
    if (!subject) return "General Inquiry";
    return subject
      .toLowerCase()
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const getSubjectClass = (subject) => {
    switch (subject) {
      case "ORDER_ISSUE":
        return "bg-orange-50 text-orange-700 border-orange-100";
      case "PAYMENT_PROBLEM":
        return "bg-red-50 text-red-700 border-red-100";
      case "REFUND_REQUEST":
        return "bg-violet-50 text-violet-700 border-violet-100";
      case "DELIVERY_DELAY":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "GENERAL_INQUIRY":
        return "bg-gray-50 text-gray-600 border-gray-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  const getQueryStatusClass = (status) => {
    switch (status) {
      case "OPEN":
        return "bg-red-50 text-red-700 border-red-100";
      case "IN_PROGRESS":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "RESOLVED":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "CLOSED":
        return "bg-gray-50 text-gray-600 border-gray-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  const formatDate = (dateArray) => {
    if (!dateArray) return "—";
    const [year, month, day] = dateArray;
    return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-[320px] flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  if (!loading && revenueChart.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-[320px] flex items-center justify-center">
        <p className="text-sm text-gray-400">No revenue data available</p>
      </div>
    );
  }

  const cardClass = "bg-white rounded-2xl border border-gray-100 shadow-sm";

  return (
    <div className="space-y-6">
      {/* ── Row 1: Charts ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Revenue */}
        <div className={`xl:col-span-2 ${cardClass} p-5 h-[360px]`}>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900">
              Revenue Overview
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Last 7 days</p>
          </div>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={revenueChart}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "#94a3b8" }}
              />
              <YAxis
                tickFormatter={(v) => `₹${v}`}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "#94a3b8" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  fontSize: "13px",
                }}
                formatter={(value) => [
                  `₹${Number(value).toLocaleString("en-IN")}`,
                  "Revenue",
                ]}
              />
              <Bar
                dataKey="revenue"
                fill="#f97316"
                radius={[6, 6, 0, 0]}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status */}
        <div className={`${cardClass} p-5 h-[360px]`}>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900">
              Order Status
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Current distribution</p>
          </div>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={orderStatusChart}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="45%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
              >
                {orderStatusChart.map((entry, index) => (
                  <Cell
                    key={entry.status}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "none",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  fontSize: "12px",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-xs text-gray-600">
                    {formatLabel(value)}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Row 2: Orders + Top Foods ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Recent Orders */}
        <div className={`${cardClass} p-5 h-[400px] flex flex-col`}>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900">
              Recent Orders
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Latest customer orders
            </p>
          </div>
          <div className="overflow-y-auto flex-1 -mx-1">
            {recentOrders.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-gray-400">No recent orders</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wider text-gray-400 border-b border-gray-50">
                    <th className="text-left py-2.5 font-semibold">Order</th>
                    <th className="text-left font-semibold">Customer</th>
                    <th className="text-left font-semibold">Amount</th>
                    <th className="text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((order) => (
                    <tr
                      key={order.orderId}
                      className="hover:bg-orange-50/30 transition-colors"
                    >
                      <td className="py-3 text-sm font-medium text-gray-800">
                        #{order.orderId}
                      </td>
                      <td className="text-sm text-gray-600">
                        {order.customerName}
                      </td>
                      <td className="text-sm font-medium text-gray-800">
                        ₹{Math.round(order.totalAmount).toLocaleString("en-IN")}
                      </td>
                      <td>
                        <span
                          className={`
                            inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border
                            ${getStatusClass(order.status)}
                          `}
                        >
                          {formatLabel(order.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Top Selling Foods */}
        <div className={`${cardClass} p-5 h-[400px] flex flex-col`}>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900">
              Top Selling Foods
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Best performing items
            </p>
          </div>
          <div className="space-y-4 overflow-y-auto flex-1">
            {topFoods.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-gray-400">No sales data yet</p>
              </div>
            ) : (
              topFoods.map((food, index) => {
                const maxSold = topFoods[0]?.totalSold || 1;
                return (
                  <div key={food.foodId}>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center text-xs font-bold shrink-0">
                          {index + 1}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-medium text-gray-800 truncate">
                            {food.foodName}
                          </h4>
                          <p className="text-[11px] text-gray-400">
                            {food.totalSold} sold
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-orange-600 shrink-0">
                        {food.totalSold}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-orange-500 transition-all duration-500"
                        style={{
                          width: `${(food.totalSold / maxSold) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── Row 3: Users + Queries ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Recent Users */}
        <div className={`${cardClass} p-5 h-[400px] flex flex-col`}>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900">
              Recent Users
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Newly registered customers
            </p>
          </div>
          <div className="space-y-3 overflow-y-auto flex-1">
            {recentUsers.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-gray-400">No users yet</p>
              </div>
            ) : (
              recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between gap-3 py-2.5 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-xs font-semibold shrink-0">
                      {user.fullName
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase() || "?"}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-medium text-gray-800 truncate">
                        {user.fullName}
                      </h3>
                      <p className="text-xs text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {formatDate(user.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Queries */}
        <div className={`${cardClass} p-5 h-[400px] flex flex-col`}>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900">
              Recent Queries
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Latest support requests
            </p>
          </div>
          <div className="space-y-3 overflow-y-auto flex-1">
            {recentQueries.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-gray-400">No recent queries</p>
              </div>
            ) : (
              recentQueries.map((query) => (
                <div
                  key={query.id}
                  className="flex items-start justify-between gap-3 py-2.5 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-xs font-semibold shrink-0">
                      {query.fullName
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase() || "?"}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-medium text-gray-800 truncate">
                        {query.fullName}
                      </h3>
                      <span
                        className={`
                          inline-block mt-1 px-2 py-0.5
                          rounded-full text-[11px] font-medium border
                          ${getSubjectClass(query.subject)}
                        `}
                      >
                        {formatSubject(query.subject)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className={`
                        px-2 py-0.5 rounded-full text-[11px] font-medium border
                        ${getQueryStatusClass(query.status)}
                      `}
                    >
                      {query.status === "IN_PROGRESS"
                        ? "In Progress"
                        : formatLabel(query.status)}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {formatDate(query.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
