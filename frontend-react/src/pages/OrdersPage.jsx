import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getOrdersOfUser } from "../api/service/orderService";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await getOrdersOfUser();
        setOrders(response.data);
      } catch (error) {
        console.log(error.response?.data);
      }
    };

    fetchUserOrders();
  }, [user?.id]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border p-10 text-center">
          <h2 className="text-lg font-semibold">No Orders Found</h2>
          <p className="text-gray-500 mt-2">
            Looks like you haven't placed any orders yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <div>
                  <h2 className="font-semibold">Order #{order.orderId}</h2>

                  <p className="text-xs text-gray-500">{order.orderDate}</p>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    order.status === "DELIVERED"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Summary */}
              <div className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    {order.items.length} item(s)
                  </p>

                  <p className="text-lg font-bold text-orange-600">
                    ₹{order.totalAmount}
                  </p>
                </div>

                <button
                  onClick={() => handleViewDetails(order)}
                  className="text-orange-500 font-medium hover:text-orange-600"
                >
                  View Items
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b p-4">
              <div>
                <h2 className="font-bold">Order #{selectedOrder.orderId}</h2>

                <p className="text-sm text-gray-500">
                  {selectedOrder.items.length} item(s)
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="text-xl text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            {/* Items */}
            <div className="p-4 space-y-3 max-h-[450px] overflow-y-auto">
              {selectedOrder.items.map((food) => (
                <div
                  key={food.foodId}
                  className="flex items-center gap-3 border rounded-lg p-3"
                >
                  <img
                    src={food.imageUrl}
                    alt={food.foodName}
                    className="w-16 h-16 rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="font-medium">{food.foodName}</h3>

                    <p className="text-sm text-gray-500">
                      Qty: {food.quantity}
                    </p>

                    <p className="text-sm text-gray-500">₹{food.price} each</p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">₹{food.totalPrice}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t p-4 flex justify-between items-center">
              <span className="font-medium">Total Amount</span>

              <span className="text-lg font-bold text-orange-600">
                ₹{selectedOrder.totalAmount}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
