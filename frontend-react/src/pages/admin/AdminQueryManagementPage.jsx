import React, { useEffect, useState } from "react";
import { Search, Inbox } from "lucide-react";
import QueryDetailsModal from "../../components/QueryDetailsModal";

import {
  getAllContactUsMessage,
  getFilteredContactUsMessage,
} from "../../api/service/contactUsService";

import { toast } from "react-toastify";

export default function AdminQueryManagementPage() {
  const [selectedQuery, setSelectedQuery] = useState(null);

  const [queries, setQueries] = useState([]);

  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const [loading, setLoading] = useState(true);

  const [searchKeyword, setSearchKeyword] = useState("");

  // Spring Boot pagination is 0-based
  const [currentPage, setCurrentPage] = useState(0);

  const [pageSize, setPageSize] = useState(0);

  // Total number of pages returned by backend
  const [totalPages, setTotalPages] = useState(0);

  const fetchQueries = async () => {
    try {
      setLoading(true);

      let response;

      // No search keyword
      if (searchKeyword.trim() === "") {
        response = await getAllContactUsMessage(currentPage, pageSize);
      }

      // Search keyword exists
      else {
        response = await getFilteredContactUsMessage(
          searchKeyword.trim(),
          currentPage,
          pageSize,
        );
      }

      const pageData = response.data;

      // Page.content contains the actual tickets
      setQueries(pageData.content || []);

      // Total number of pages
      setTotalPages(pageData.totalPages || 0);
      setPageSize(pageData.size);
    } catch (error) {
      console.log(error.response?.data);

      toast.error("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQueries();
    }, 400);

    return () => clearTimeout(timer);
  }, [currentPage, searchKeyword]);

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearchKeyword(value);
    setCurrentPage(0);
  };

  const filteredQueries =
    selectedStatus === "ALL"
      ? queries
      : queries.filter((query) => query.status === selectedStatus);

  const getStatusStyle = (status) => {
    switch (status) {
      case "OPEN":
        return "bg-red-100 text-red-600";

      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-700";

      case "RESOLVED":
        return "bg-blue-100 text-blue-600";

      case "CLOSED":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleClickViewDetails = (data) => {
    setSelectedQuery(data);
  };

  // const handlePrevious = () => {
  //   if (currentPage > 0) {
  //     setCurrentPage((prev) => {
  //       return prev - 1;
  //     });
  //   }
  // };

  // const handleNext = () => {
  //   if (currentPage < totalPages - 1) {
  //     setCurrentPage((prev) => {
  //       return prev + 1;
  //     });
  //   }
  // };

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="rounded-3xl border border-gray-200 bg-white px-8 py-7 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Customer Support
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              View, manage and respond to customer support requests.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-orange-50 px-4 py-2">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>

            <span className="text-sm font-medium text-gray-700">
              {filteredQueries.length} Tickets
            </span>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTER */}

      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* SEARCH */}

          <div className="relative w-full lg:w-96">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search customer, email or subject..."
              value={searchKeyword}
              onChange={handleSearchChange}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-11 pr-4 text-sm transition focus:border-[#FC8019] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-100"
            />
          </div>

          {/* STATUS */}

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#FC8019] focus:ring-4 focus:ring-orange-100"
          >
            <option value="ALL">All Status</option>

            <option value="OPEN">Open</option>

            <option value="IN_PROGRESS">In Progress</option>

            <option value="RESOLVED">Resolved</option>

            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* TABLE */}

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            {/* TABLE HEAD */}

            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                <th className="px-6 py-4 text-left">ID</th>

                <th className="px-6 py-4 text-left">Customer</th>

                <th className="px-6 py-4 text-left">Subject</th>

                <th className="px-6 py-4 text-center">Status</th>

                <th className="px-6 py-4 text-left">Created</th>

                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>

            {/* TABLE BODY */}

            <tbody>
              {/* LOADING */}

              {loading && (
                <tr>
                  <td colSpan={6}>
                    <div className="flex justify-center py-20">
                      Loading support tickets...
                    </div>
                  </td>
                </tr>
              )}

              {/* EMPTY */}

              {!loading && filteredQueries.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-24">
                      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
                        <Inbox size={34} className="text-[#FC8019]" />
                      </div>

                      <h3 className="text-xl font-semibold text-gray-800">
                        No Support Tickets
                      </h3>

                      <p className="mt-2 text-sm text-gray-500">
                        Customer support requests will appear here.
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {/* DATA */}

              {!loading &&
                filteredQueries.map((query) => (
                  <tr
                    key={query.id}
                    className="border-b border-gray-100 transition hover:bg-orange-50/40"
                  >
                    {/* ID */}

                    <td className="px-6 py-5">
                      <span className="font-semibold text-gray-700">
                        #{query.id}
                      </span>
                    </td>

                    {/* CUSTOMER */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FC8019] font-semibold text-white">
                          {query.fullName
                            ?.split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900">
                            {query.fullName}
                          </p>

                          <p className="max-w-xs truncate text-xs text-gray-500">
                            {query.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* SUBJECT */}

                    <td className="px-6 py-5">
                      <p className="max-w-xs font-medium text-gray-700">
                        {query.subject
                          ?.replace(/_/g, " ")
                          .toLowerCase()
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                      </p>
                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-5 text-center">
                      <span
                        className={`inline-flex min-w-[120px] justify-center rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                          query.status,
                        )}`}
                      >
                        {query.status?.replace(/_/g, " ")}
                      </span>
                    </td>

                    {/* DATE */}

                    <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-600">
                      {query.createdAt}
                    </td>

                    {/* ACTION */}

                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleClickViewDetails(query)}
                          className="rounded-xl bg-[#FC8019] px-5 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
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
                onClick={() => setCurrentPage((prev) => prev - 1)}
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
                onClick={() => setCurrentPage((prev) => prev + 1)}
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

      {/* MODAL */}

      {selectedQuery && (
        <QueryDetailsModal
          selectedQuery={selectedQuery}
          setSelectedQuery={setSelectedQuery}
          fetchAllQueries={fetchQueries}
        />
      )}
    </div>
  );
}
