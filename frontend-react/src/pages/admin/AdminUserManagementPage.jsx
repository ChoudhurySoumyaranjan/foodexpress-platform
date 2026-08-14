import { Visibility, Search } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import UserCardDetails from "../../components/UserCardDetails";

import {
  getAllUsers,
  blockUser,
  unblockUser,
} from "../../api/service/userService";

const AdminUserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers(currentPage, pageSize);
      setUsers(response.data.content || null);
      setTotalPages(response.data.totalPages);
      setPageSize(response.data.size);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentPage, pageSize]);

  const handleBlockUser = async (id) => {
    try {
      const response = await blockUser(id);
      if (response.status === 200) {
        toast.success("User blocked successfully");
        setUsers((prev) =>
          prev.map((user) =>
            user.id === id ? { ...user, isEnabled: false } : user,
          ),
        );
        if (selectedUser?.id === id) {
          setSelectedUser({ ...selectedUser, isEnabled: false });
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to block user");
    }
  };

  const handleUnblockUser = async (id) => {
    try {
      const response = await unblockUser(id);
      if (response.status === 200) {
        toast.success("User unblocked successfully");
        setUsers((prev) =>
          prev.map((user) =>
            user.id === id ? { ...user, isEnabled: true } : user,
          ),
        );
        if (selectedUser?.id === id) {
          setSelectedUser({ ...selectedUser, isEnabled: true });
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to unblock user");
    }
  };

  const handlePreviousPageRequest = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPageRequest = () => {
    if (currentPage < totalPages-1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const filteredUsers = users.filter((user) => {
    const keyword = search.toLowerCase();
    return (
      user.name?.toLowerCase().includes(keyword) ||
      user.email?.toLowerCase().includes(keyword) ||
      user.phoneNumber?.includes(keyword)
    );
  });

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-6 py-5 border-b border-gray-100">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
            Customers
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {users.length} registered user{users.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            style={{ fontSize: 18 }}
          />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full rounded-xl border border-gray-200 bg-gray-50/80
              py-2.5 pl-10 pr-4 text-sm text-gray-800
              placeholder:text-gray-400
              outline-none
              focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100
              transition
            "
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-24">
          <CircularProgress size={32} sx={{ color: "#f97316" }} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  User
                </th>
                <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Email
                </th>
                <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Phone
                </th>
                <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Joined
                </th>
                <th className="px-6 py-3.5 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3.5 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-orange-50/30 transition-colors"
                  >
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-semibold text-white">
                          {user.name
                            ?.split(" ")
                            .map((w) => w[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase() || "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            #{user.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 truncate max-w-[200px]">
                        {user.email}
                      </p>
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.phoneNumber || "—"}
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(user.createAt)}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`
                          inline-flex items-center px-2.5 py-0.5
                          rounded-full text-xs font-medium border
                          ${
                            user.isEnabled
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }
                        `}
                      >
                        {user.isEnabled ? "Active" : "Blocked"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowModal(true);
                          }}
                          title="View details"
                          className="
                            flex h-9 w-9 items-center justify-center
                            rounded-xl border border-gray-200 bg-white
                            text-gray-500
                            hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600
                            transition
                          "
                        >
                          <Visibility style={{ fontSize: 18 }} />
                        </button>

                        {user.isEnabled ? (
                          <button
                            onClick={() => handleBlockUser(user.id)}
                            className="
                              rounded-xl px-3.5 py-1.5 text-xs font-medium
                              bg-red-50 text-red-600 border border-red-200
                              hover:bg-red-100 transition
                            "
                          >
                            Block
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnblockUser(user.id)}
                            className="
                              rounded-xl px-3.5 py-1.5 text-xs font-medium
                              bg-emerald-50 text-emerald-600 border border-emerald-200
                              hover:bg-emerald-100 transition
                            "
                          >
                            Unblock
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <p className="text-base font-medium text-gray-700">
                      No users found
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      Try a different search keyword
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
                <span className="font-semibold text-gray-700">
                  {totalPages}
                </span>
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
                    onClick={() => {
                      setCurrentPage(index);
                    }}
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
      )}

      {showModal && (
        <UserCardDetails data={selectedUser} setShowModal={setShowModal} />
      )}
    </div>
  );
};

export default AdminUserManagementPage;
