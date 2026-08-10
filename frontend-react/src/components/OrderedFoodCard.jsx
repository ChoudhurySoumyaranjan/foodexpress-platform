import React from "react";

const OrderedFoodCard = ({ orderedFood, setShowModal }) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <h2 className="font-semibold text-lg">Food Details</h2>

          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-red-500 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="flex gap-4">
            <img
              src={orderedFood.imageUrl}
              alt={orderedFood.foodName}
              className="w-24 h-24 rounded-xl object-cover border"
            />

            <div className="flex-1">
              <h3 className="font-semibold text-lg">{orderedFood.foodName}</h3>

              <p className="text-sm text-gray-500 mt-1">
                Quantity: {orderedFood.quantity}
              </p>

              <p className="text-sm text-gray-500">
                Price: ₹{orderedFood.price}
              </p>
            </div>
          </div>

          <div className="mt-5 border-t pt-4 flex justify-between items-center">
            <span className="text-gray-600 font-medium">Total Amount</span>

            <span className="text-xl font-bold text-orange-600">
              ₹{orderedFood.totalPrice}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 bg-gray-50 border-t">
          <button
            onClick={() => setShowModal(false)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderedFoodCard;
