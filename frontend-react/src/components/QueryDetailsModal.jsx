import { useEffect, useState } from "react";

import {
  getAllTicketStatus,
  updateContactUsMessageStatus,
} from "../api/service/contactUsService";

import { toast } from "react-toastify";

const QueryDetailsModal = ({
  selectedQuery,
  setSelectedQuery,
  fetchAllQueries,
}) => {
  const [statuses, setStatuses] = useState([]);

  const [selectedStatus, setSelectedStatus] = useState("");

  // --------------------------------------------------
  // FETCH STATUSES
  // --------------------------------------------------

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

  // --------------------------------------------------
  // UPDATE STATUS
  // --------------------------------------------------

  const handleTicketStatusUpdate = async () => {
    try {
      const response = await updateContactUsMessageStatus(
        selectedQuery.id,
        selectedStatus,
      );

      if (response.status === 200) {
        toast.success("Ticket status updated");

        // Update modal immediately

        setSelectedQuery({
          ...selectedQuery,
          status: selectedStatus,
        });

        // Refresh current pagination page

        await fetchAllQueries();
      }
    } catch (error) {
      console.log(error.response?.data);

      toast.error("Failed to update status");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Query Details</h2>

            <p className="mt-1 text-sm text-gray-500">
              Ticket ID #{selectedQuery.id}
            </p>
          </div>

          <button
            onClick={() => setSelectedQuery(null)}
            className="text-xl font-bold text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* BODY */}

        <div className="space-y-6 p-6">
          {/* USER INFORMATION */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* NAME */}

            <div>
              <p className="text-sm text-gray-500">Full Name</p>

              <h3 className="mt-1 font-semibold text-gray-800">
                {selectedQuery.fullName}
              </h3>
            </div>

            {/* EMAIL */}

            <div>
              <p className="text-sm text-gray-500">Email</p>

              <h3 className="mt-1 font-semibold text-gray-800">
                {selectedQuery.email}
              </h3>
            </div>

            {/* PHONE */}

            <div>
              <p className="text-sm text-gray-500">Phone Number</p>

              <h3 className="mt-1 font-semibold text-gray-800">
                {selectedQuery.phoneNumber}
              </h3>
            </div>

            {/* ORDER ID */}

            <div>
              <p className="text-sm text-gray-500">Order ID</p>

              <h3 className="mt-1 font-semibold text-gray-800">
                {selectedQuery.orderId || "N/A"}
              </h3>
            </div>

            {/* SUBJECT */}

            <div>
              <p className="text-sm text-gray-500">Subject</p>

              <h3 className="mt-1 font-semibold text-gray-800">
                {selectedQuery.subject}
              </h3>
            </div>

            {/* STATUS */}

            <div>
              <p className="mb-2 text-sm text-gray-500">Status</p>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* CUSTOMER MESSAGE */}

          <div>
            <p className="mb-2 text-sm text-gray-500">Customer Message</p>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="leading-relaxed text-gray-700">
                {selectedQuery.message}
              </p>
            </div>
          </div>

          {/* FOOTER */}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setSelectedQuery(null)}
              className="rounded-xl border border-gray-300 px-5 py-2.5 transition hover:bg-gray-100"
            >
              Close
            </button>

            <button
              onClick={handleTicketStatusUpdate}
              disabled={selectedStatus === selectedQuery.status}
              className="rounded-xl bg-orange-500 px-5 py-2.5 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
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
