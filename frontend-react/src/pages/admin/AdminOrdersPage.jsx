import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import AdminOrderCard from "../../components/AdminOrderCard";
import {
  getAllOrders,
  getFilteredOrders,
} from "../../api/service/orderService";
import { Search } from "@mui/icons-material";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(4);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      let response;

      if (search.trim() === "") {
        response = await getAllOrders(currentPage, pageSize);
      } else {
        response = await getFilteredOrders(
          currentPage,
          pageSize,
          search.trim(),
        );
      }

      const newTotalPages = response.data.totalPages;

      // If current page no longer exists
      if (newTotalPages > 0 && currentPage >= newTotalPages) {
        setTotalPages(newTotalPages);
        setCurrentPage(newTotalPages - 1);
        return;
      }

      setOrders(response.data.content || []);
      setTotalPages(newTotalPages);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 500);

    return () => clearTimeout(timer);
  }, [search, currentPage]);

  const handleNextPageRequest = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((previous) => previous + 1);
    }
  };

  const handlePreviousPageRequest = () => {
    if (currentPage > 0) {
      setCurrentPage((previous) => previous - 1);
    }
  };

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
        {/* PAGINATION */}

        {!loading && totalPages > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
            {/* Page information */}
            <p className="text-sm text-gray-500">
              Page{" "}
              <span className="font-semibold text-gray-700">
                {currentPage + 1}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">{totalPages}</span>
            </p>

            {/* Pagination */}
            <div className="flex items-center gap-2">
              {/* Previous */}
              <button
                onClick={handlePreviousPageRequest}
                disabled={currentPage === 0}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium
                   text-gray-700 hover:bg-gray-50
                   disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium
            ${
              currentPage === index
                ? "bg-[#FC8019] text-white"
                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
                >
                  {index + 1}
                </button>
              ))}

              {/* Next */}
              <button
                onClick={handleNextPageRequest}
                disabled={currentPage === totalPages - 1}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium
                   text-gray-700 hover:bg-gray-50
                   disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
