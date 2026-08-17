import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getOrdersOfUser } from "../../api/service/orderService";
import { CircularProgress } from "@mui/material";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(4);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setLoading(true);

        const response = await getOrdersOfUser(currentPage, pageSize);

        const newTotalPages = response.data.totalPages;

        setTotalPages(newTotalPages);

        // If current page no longer exists after deletion,
        // move to the last available page.
        if (newTotalPages > 0 && currentPage >= newTotalPages) {
          setCurrentPage(newTotalPages - 1);
          return;
        }

        setOrders(response.data.content || []);
      } catch (error) {
        console.log(error.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [user?.id, currentPage, pageSize]);

  const handlePreviousPageRequest = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPageRequest = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "DELIVERED":
        return {
          text: "Delivered",
          bg: "bg-emerald-50",
          textColor: "text-emerald-700",
          dot: "bg-emerald-500",
        };

      case "CANCELLED":
        return {
          text: "Cancelled",
          bg: "bg-red-50",
          textColor: "text-red-700",
          dot: "bg-red-500",
        };

      case "PREPARING":
        return {
          text: "Preparing",
          bg: "bg-amber-50",
          textColor: "text-amber-700",
          dot: "bg-amber-500",
        };

      case "PLACED":
        return {
          text: "Order Placed",
          bg: "bg-blue-50",
          textColor: "text-blue-700",
          dot: "bg-blue-500",
        };

      default:
        return {
          text: status,
          bg: "bg-gray-100",
          textColor: "text-gray-700",
          dot: "bg-gray-500",
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            My Orders
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View and manage your recent orders
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <CircularProgress />
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-20 text-center shadow-sm ring-1 ring-gray-100">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
              <svg
                className="h-10 w-10 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 4h12M9 21h.01M18 21h.01"
                />
              </svg>
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              No orders yet
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
              You haven't placed any orders yet. Your orders will appear here
              once you make a purchase.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {orders.map((order) => {
                const status = getStatusConfig(order.status);

                return (
                  <div
                    key={order.orderId}
                    className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition duration-200 hover:shadow-md"
                  >
                    {/* ================= ORDER HEADER ================= */}

                    <div className="px-5 py-5 sm:px-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        {/* Order Information */}

                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h2 className="text-base font-bold text-gray-900">
                              Order #{order.orderId}
                            </h2>

                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.bg} ${status.textColor}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                              />

                              {status.text}
                            </span>
                          </div>

                          <p className="mt-1.5 text-xs text-gray-400">
                            {order.orderDate}
                          </p>
                        </div>

                        {/* Total */}

                        <div className="sm:text-right">
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Total
                          </p>

                          <p className="mt-0.5 text-lg font-bold text-gray-900">
                            ₹{order.totalAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Divider */}

                      <div className="my-5 h-px bg-gray-100" />

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center">
                          {/* Food Images */}

                          <div className="flex shrink-0 -space-x-3">
                            {order.items.slice(0, 3).map((item) => (
                              <img
                                key={item.foodId}
                                src={item.imageUrl}
                                alt={item.foodName}
                                className="h-12 w-12 rounded-xl border-2 border-white object-cover shadow-sm"
                              />
                            ))}

                            {order.items.length > 3 && (
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-white bg-gray-100 text-xs font-semibold text-gray-500">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>

                          {/* Food Names */}

                          <div className="ml-4 min-w-0">
                            <p className="text-sm font-semibold text-gray-800">
                              {order.items.length}{" "}
                              {order.items.length === 1 ? "item" : "items"}
                            </p>

                            <p className="mt-1 max-w-[300px] truncate text-xs text-gray-400">
                              {order.items
                                .map((item) => item.foodName)
                                .join(", ")}
                            </p>
                          </div>
                        </div>

                        {/* View Details */}

                        <button
                          onClick={() => handleViewDetails(order)}
                          className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-orange-500 transition hover:bg-orange-50"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 0 && (
              <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-gray-100 sm:flex-row sm:items-center sm:justify-between">
                {/* Page Information */}

                <p className="text-center text-sm text-gray-500 sm:text-left">
                  Page{" "}
                  <span className="font-semibold text-gray-800">
                    {currentPage + 1}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-800">
                    {totalPages}
                  </span>
                </p>

                {/* Pagination Controls */}

                <div className="flex items-center justify-center gap-1.5">
                  {/* Previous */}

                  <button
                    onClick={handlePreviousPageRequest}
                    disabled={currentPage === 0}
                    className="flex h-9 items-center justify-center rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ←<span className="ml-1 hidden sm:inline">Previous</span>
                  </button>

                  {/* Page Numbers */}

                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index)}
                        className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-semibold transition ${
                          currentPage === index
                            ? "bg-[#FC8019] text-white shadow-sm"
                            : "text-gray-600 hover:bg-orange-50 hover:text-[#FC8019]"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>

                  {/* Next */}

                  <button
                    onClick={handleNextPageRequest}
                    disabled={currentPage === totalPages - 1}
                    className="flex h-9 items-center justify-center rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span className="mr-1 hidden sm:inline">Next</span>→
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
          <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-gray-100 px-6 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-900">
                      Order #{selectedOrder.orderId}
                    </h2>

                    {(() => {
                      const status = getStatusConfig(selectedOrder.status);

                      return (
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.bg} ${status.textColor}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                          />

                          {status.text}
                        </span>
                      );
                    })()}
                  </div>

                  <p className="mt-1 text-xs text-gray-400">
                    {selectedOrder.orderDate}
                  </p>
                </div>

                {/* Close */}

                <button
                  onClick={() => setShowModal(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="overflow-y-auto px-6 py-6">
              {/* ORDER ITEMS */}

              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900">Items</h3>

                  <span className="text-xs text-gray-400">
                    {selectedOrder.items.length}{" "}
                    {selectedOrder.items.length === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedOrder.items.map((food) => (
                    <div
                      key={food.foodId}
                      className="flex items-center gap-3 rounded-xl bg-gray-50 p-3"
                    >
                      <img
                        src={food.imageUrl}
                        alt={food.foodName}
                        className="h-14 w-14 rounded-lg object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-800">
                          {food.foodName}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          ₹{food.price.toFixed(2)} × {food.quantity}
                        </p>
                      </div>

                      <p className="text-sm font-bold text-gray-900">
                        ₹{food.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* DELIVERY */}

              <section className="mt-7">
                <h3 className="mb-3 text-sm font-bold text-gray-900">
                  Delivery Address
                </h3>

                <div className="flex gap-3 rounded-xl border border-gray-100 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50">
                    <svg
                      className="h-5 w-5 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M12 21s7-4.35 7-10a7 7 0 10-14 0c0 5.65 7 10 7 10z"
                      />

                      <circle cx="12" cy="11" r="2.5" strokeWidth={1.8} />
                    </svg>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500">
                      Delivering to
                    </p>

                    <p className="mt-1 text-sm leading-5 text-gray-700">
                      {selectedOrder.deliveryAddress}
                    </p>
                  </div>
                </div>
              </section>

              {/* PAYMENT */}

              <section className="mt-7">
                <h3 className="mb-3 text-sm font-bold text-gray-900">
                  Payment
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-400">Method</p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {selectedOrder.paymentMethod === "CASH_ON_DELIVERY"
                        ? "Cash on Delivery"
                        : "Razorpay"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-400">Status</p>

                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                      <p className="text-sm font-semibold text-emerald-600">
                        {selectedOrder.paymentStatus}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* TOTAL */}

              <section className="mt-7 rounded-xl bg-gray-900 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Total Amount</p>

                    <p className="mt-1 text-2xl font-bold text-white">
                      ₹{selectedOrder.totalAmount.toFixed(2)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500">Order ID</p>

                    <p className="mt-1 text-sm font-semibold text-gray-300">
                      #{selectedOrder.orderId}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <div className="border-t border-gray-100 px-6 py-4">
              <button
                onClick={() => setShowModal(false)}
                className="w-full rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 active:scale-[0.99]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
