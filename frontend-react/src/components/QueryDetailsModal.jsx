import { useEffect, useState } from "react";
import {
  getAllTicketStatus,
  updateContactUsMessageStatus,
} from "../api/service/contactUsService";
import { toast } from "react-toastify";

const QueryDetailsModal = ({ selectedQuery, setSelectedQuery,fetchAllQueries }) => {
  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    setSelectedStatus(selectedQuery.status);

    const fetchStatus = async () => {
      try {
        const response = await getAllTicketStatus();
        setStatuses(response.data || []);
      } catch (error) {
        console.log(error.response?.data);
        toast.error("Failed to fetch statuses");
      }
    };

    fetchStatus();
  }, [selectedQuery]);

  const handleTicketStatusUpdate = async (id, status) => {
    try {
      const response = await updateContactUsMessageStatus(id, status);

      if (response.status === 200) {
        fetchAllQueries();
        toast.success("Ticket status updated");

        setSelectedQuery({
          ...selectedQuery,
          status: status,
        });
      }
    } catch (error) {
      console.log(error.response?.data);
      toast.error("Failed to update status");
    }
  };

  return (
    <div
      className="
      fixed
      inset-0
      bg-black/40
      flex
      items-center
      justify-center
      z-50
      p-4
    "
    >
      <div
        className="
        bg-white
        w-full
        max-w-2xl
        rounded-2xl
        shadow-xl
        overflow-hidden
      "
      >
        {/* Header */}
        <div
          className="
          flex
          items-center
          justify-between
          px-6
          py-4
          border-b
          border-gray-200
        "
        >
          <div>
            <h2 className="text-xl font-bold text-gray-800">Query Details</h2>

            <p className="text-sm text-gray-500 mt-1">
              Ticket ID #{selectedQuery.id}
            </p>
          </div>

          <button
            onClick={() => setSelectedQuery(null)}
            className="
            text-gray-500
            hover:text-black
            text-xl
            font-bold
          "
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>

              <h3 className="font-semibold text-gray-800 mt-1">
                {selectedQuery.fullName}
              </h3>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>

              <h3 className="font-semibold text-gray-800 mt-1">
                {selectedQuery.email}
              </h3>
            </div>

            <div>
              <p className="text-sm text-gray-500">Phone Number</p>

              <h3 className="font-semibold text-gray-800 mt-1">
                {selectedQuery.phoneNumber}
              </h3>
            </div>

            <div>
              <p className="text-sm text-gray-500">Order ID</p>

              <h3 className="font-semibold text-gray-800 mt-1">
                {selectedQuery.orderId || "N/A"}
              </h3>
            </div>

            <div>
              <p className="text-sm text-gray-500">Subject</p>

              <h3 className="font-semibold text-gray-800 mt-1">
                {selectedQuery.subject}
              </h3>
            </div>

            {/* Status Select */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Status</p>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  px-4
                  py-2.5
                  focus:outline-none
                  focus:ring-2
                  focus:ring-orange-400
                  bg-white
                "
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Message */}
          <div>
            <p className="text-sm text-gray-500 mb-2">Customer Message</p>

            <div
              className="
              bg-gray-50
              border
              border-gray-200
              rounded-xl
              p-4
            "
            >
              <p className="text-gray-700 leading-relaxed">
                {selectedQuery.message}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setSelectedQuery(null)}
              className="
              border
              border-gray-300
              px-5
              py-2.5
              rounded-xl
              hover:bg-gray-100
              transition
            "
            >
              Close
            </button>

            <button
              className="
              bg-orange-500
              hover:bg-orange-600
              text-white
              px-5
              py-2.5
              rounded-xl
              transition
            "
              onClick={() => {
                handleTicketStatusUpdate(selectedQuery.id, selectedStatus);
              }}
            >
              Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryDetailsModal;
