import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import AdminOrderCard from "../../components/AdminOrderCard";
import { getAllOrders, getFilteredOrders } from "../../api/service/orderService";
import { Search } from "@mui/icons-material";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const searchOrders = async (keyword) => {
    try {
      setLoading(true);

      if (keyword.trim() === "") {
        const response = await getAllOrders();
        setOrders(response.data || []);
      } else {
        const response = await getFilteredOrders(keyword);
        setOrders(response.data || []);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await getAllOrders();

      setOrders(response?.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchOrders(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-3">📦</div>
          <h2 className="text-xl font-semibold text-slate-700">
            No Orders Found
          </h2>
          <p className="text-slate-500 mt-2">
            Orders will appear here once customers start placing them.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Order Management
              </h1>

              <p className="text-slate-500 mt-1">
                Track and manage customer orders
              </p>
            </div>
            <div className="relative w-full md:w-96">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                fontSize="small"
              />

              <input
                type="text"
                placeholder="Search by payment id, order id, name or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="bg-orange-50 border border-orange-200 px-5 py-3 rounded-xl">
              <p className="text-sm text-slate-500">Total Orders</p>

              <h2 className="text-2xl font-bold text-orange-500">
                {orders.length}
              </h2>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {orders.map((order) => (
            <AdminOrderCard
              key={order.orderId}
              order={order}
              refreshOrders={fetchOrders}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
