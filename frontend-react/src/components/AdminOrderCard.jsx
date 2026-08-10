import { useEffect, useState } from "react";
import { updateOrderStatus } from "../api/service/orderService";
import { toast } from "react-toastify";
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  CreditCard,
  Package,
} from "lucide-react";

const AdminOrderCard = ({ order, refreshOrders }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setStatus(order.status);
  }, [order.status]);

  const ORDER_STATUSES = [
    "PLACED",
    "CONFIRMED",
    "PREPARING",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
  ];

  const getStatusStyle = (s) => {
    switch (s) {
      case "PLACED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "CONFIRMED":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "PREPARING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "OUT_FOR_DELIVERY":
        return "bg-violet-50 text-violet-700 border-violet-200";
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getProgressWidth = (s) => {
    switch (s) {
      case "PLACED":
        return "20%";
      case "CONFIRMED":
        return "40%";
      case "PREPARING":
        return "60%";
      case "OUT_FOR_DELIVERY":
        return "80%";
      case "DELIVERED":
        return "100%";
      default:
        return "0%";
    }
  };

  const getProgressColor = (s) => {
    if (s === "CANCELLED") return "bg-red-400";
    if (s === "DELIVERED") return "bg-emerald-500";
    return "bg-orange-500";
  };

  const formatLabel = (value) =>
    value
      ?.replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase()) || "—";

  const formatPaymentMethod = (paymentMethod) => {
    const map = {
      CASH_ON_DELIVERY: "Cash on Delivery",
      NET_BANKING: "Net Banking",
      DEBIT_CARD: "Debit Card",
      CREDIT_CARD: "Credit Card",
      UPI: "UPI",
      RAZORPAY: "Razorpay",
    };
    return map[paymentMethod] || formatLabel(paymentMethod);
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    if (newStatus === status) return;
    setSelectedStatus(newStatus);
    setShowConfirmModal(true);
  };

  const confirmStatusUpdate = async () => {
    setUpdating(true);
    try {
      await updateOrderStatus(order.orderId, selectedStatus);
      setStatus(selectedStatus);
      setShowConfirmModal(false);
      setSelectedStatus("");
      await refreshOrders();
      toast.success("Order status updated");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update order status",
      );
    } finally {
      setUpdating(false);
    }
  };

  const cancelStatusUpdate = () => {
    setSelectedStatus("");
    setShowConfirmModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
        {/* ── Header ── */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            {/* Left */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-base font-semibold text-gray-900 tracking-tight">
                  #{order.orderId}
                </h2>
                <span
                  className={`
                    inline-flex items-center px-2.5 py-0.5
                    rounded-full text-[11px] font-semibold
                    border ${getStatusStyle(status)}
                  `}
                >
                  {formatLabel(status)}
                </span>
              </div>

              <p className="mt-1.5 text-sm font-medium text-gray-800">
                {order.customerName}
              </p>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <Phone size={12} className="shrink-0" />
                {order.phoneNumber}
              </p>
            </div>

            {/* Right – Amount */}
            <div className="text-right shrink-0">
              <p className="text-lg font-bold text-orange-600 tracking-tight">
                ₹
                {Number(order.totalAmount).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {order.items?.length || 0} item
                {(order.items?.length || 0) !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          {status !== "CANCELLED" && (
            <div className="mt-4">
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                    status,
                  )}`}
                  style={{ width: getProgressWidth(status) }}
                />
              </div>
              <div className="flex justify-between mt-1.5 text-[10px] text-gray-400 font-medium">
                <span>Placed</span>
                <span>Confirmed</span>
                <span>Preparing</span>
                <span>Out</span>
                <span>Delivered</span>
              </div>
            </div>
          )}

          {/* Actions row */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-50">
            <div className="relative">
              <select
                value={status}
                onChange={handleStatusChange}
                disabled={status === "DELIVERED" || status === "CANCELLED"}
                className={`
                  appearance-none
                  border border-gray-200 rounded-xl
                  pl-3 pr-8 py-2 text-sm font-medium text-gray-700
                  bg-white
                  focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300
                  disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
                  transition-all
                `}
              >
                {ORDER_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {formatLabel(item)}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="
                inline-flex items-center gap-1.5
                text-sm font-medium text-orange-600
                hover:text-orange-700 transition-colors
              "
            >
              {showDetails ? (
                <>
                  Hide Details <ChevronUp size={16} />
                </>
              ) : (
                <>
                  View Details <ChevronDown size={16} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Expanded Details ── */}
        {showDetails && (
          <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-5 space-y-5">
            {/* Info grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Payment */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <CreditCard size={14} />
                  Payment
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Method</span>
                    <span className="font-medium text-gray-800">
                      {formatPaymentMethod(order.paymentMethod)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span
                      className={`font-semibold ${
                        order.paymentStatus === "SUCCESS"
                          ? "text-emerald-600"
                          : order.paymentStatus === "FAILED"
                            ? "text-red-600"
                            : "text-amber-600"
                      }`}
                    >
                      {order.paymentStatus || "N/A"}
                    </span>
                  </div>
                </div>

                {order.paymentMethod === "RAZORPAY" && (
                  <div className="pt-2 border-t border-gray-50 space-y-1.5 text-xs text-gray-500">
                    <p className="break-all">
                      <span className="font-medium text-gray-600">
                        Order ID:
                      </span>{" "}
                      {order.razorpayOrderId || "—"}
                    </p>
                    <p className="break-all">
                      <span className="font-medium text-gray-600">
                        Payment ID:
                      </span>{" "}
                      {order.razorpayPaymentId || "—"}
                    </p>
                  </div>
                )}
              </div>

              {/* Delivery */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <MapPin size={14} />
                  Delivery
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-500 mb-0.5">Address</p>
                    <p className="font-medium text-gray-800 leading-snug">
                      {order.deliveryAddress || "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Phone size={13} />
                    <span>{order.phoneNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order items */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                <Package size={14} />
                Items ({order.items?.length || 0})
              </div>

              <div className="space-y-2">
                {order.items?.map((item) => (
                  <div
                    key={item.foodId}
                    className="
                      flex items-center gap-3
                      bg-white border border-gray-100
                      rounded-xl p-3
                    "
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.foodName}
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-800 truncate">
                        {item.foodName}
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 shrink-0">
                      ₹{Number(item.totalPrice).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Confirm Modal ── */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={cancelStatusUpdate}
          />

          {/* Dialog */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Update Order Status
            </h3>

            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              Change status from{" "}
              <span className="font-semibold text-gray-800">
                {formatLabel(status)}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-orange-600">
                {formatLabel(selectedStatus)}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={cancelStatusUpdate}
                disabled={updating}
                className="
                  px-4 py-2 rounded-xl text-sm font-medium
                  border border-gray-200 text-gray-600
                  hover:bg-gray-50 transition-colors
                  disabled:opacity-50
                "
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusUpdate}
                disabled={updating}
                className="
                  px-4 py-2 rounded-xl text-sm font-medium
                  bg-orange-500 text-white
                  hover:bg-orange-600
                  shadow-sm shadow-orange-200
                  transition-colors
                  disabled:opacity-50
                "
              >
                {updating ? "Updating..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminOrderCard;
