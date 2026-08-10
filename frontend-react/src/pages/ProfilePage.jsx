import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getUserInformation,
  updateUserDetails,
} from "../api/service/userService";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Package,
  SquarePen,
  Lock,
} from "lucide-react";
import { toast } from "react-toastify";
import ChangePasswordModal from "../components/ChangePasswordModal";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getUserInformation();

      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-xl font-semibold">
        Loading...
      </div>
    );
  }

  const handleEditDetailsAction = (user) => {
    const [firstName = "", ...rest] = user.name.split(" ");
    setSelectedUser({
      firstName,
      lastName: rest.join(" "),
      address: user.address,
      phoneNumber: user.phoneNumber,
    });
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(selectedUser);

      const response = await updateUserDetails(selectedUser);

      if (response.status === 200) {
        toast.success("Details Updated Successfully");
      }
      loadProfile();
      setSelectedUser(null);
      setShowModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditChange = (e) => {
    setSelectedUser({
      ...selectedUser,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Sidebar */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-orange-100 flex items-center justify-center">
              <User size={70} className="text-orange-500" />
            </div>

            <h2 className="text-2xl font-bold mt-5">{user.name}</h2>

            <p className="text-gray-500 mt-2">{user.roles?.join(", ")}</p>

            <span
              className={`mt-4 px-4 py-1 rounded-full text-sm font-medium ${
                user.isEnabled
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {user.isEnabled ? "Active Account" : "Disabled Account"}
            </span>
          </div>

          <hr className="my-8" />

          <div className="space-y-2">
            <Link
              to="/my-orders"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 transition"
            >
              <Package size={20} className="text-orange-500" />
              <span>My Orders</span>
            </Link>

            <button
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 transition"
              onClick={() => {
                handleEditDetailsAction(user);
              }}
            >
              <SquarePen size={20} className="text-orange-500" />
              Edit Profile
            </button>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 transition"
            >
              <Lock size={20}  className="text-orange-500" />
              Change Password
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-8">Personal Information</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <InfoCard
              icon={<Mail className="text-orange-500" />}
              title="Email"
              value={user.email}
            />

            <InfoCard
              icon={<Phone className="text-orange-500" />}
              title="Phone Number"
              value={user.phoneNumber}
            />

            <InfoCard
              icon={<MapPin className="text-orange-500" />}
              title="Address"
              value={user.address}
            />

            <InfoCard
              icon={<Shield className="text-orange-500" />}
              title="Status"
              value={user.isEnabled ? "Active" : "Disabled"}
            />

            <InfoCard
              icon={<Calendar className="text-orange-500" />}
              title="Member Since"
              value={new Date(user.createAt).toLocaleDateString()}
            />

            <InfoCard
              icon={<Calendar className="text-orange-500" />}
              title="Last Updated"
              value={new Date(user.updateAt).toLocaleDateString()}
            />
          </div>
        </div>

        {showPasswordModal && (
          <ChangePasswordModal
            open={showPasswordModal}
            userEmail={user.email}
            onClose={() => setShowPasswordModal(false)}
          />
        )}
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowModal(false)}
          >
            <div
              className="w-full max-w-md rounded-2xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Edit Profile
                </h2>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleFormSubmit} className="space-y-5 p-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    value={selectedUser.firstName || ""}
                    onChange={handleEditChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    value={selectedUser.lastName || ""}
                    onChange={handleEditChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    placeholder="Enter last name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={selectedUser.phoneNumber || ""}
                    onChange={handleEditChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    rows={3}
                    name="address"
                    value={selectedUser.address || ""}
                    onChange={handleEditChange}
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    placeholder="Enter delivery address"
                  />
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-lg bg-orange-500 px-5 py-2.5 font-medium text-white transition hover:bg-orange-600"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoCard = ({ icon, title, value }) => {
  return (
    <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <span className="text-sm text-gray-500">{title}</span>
      </div>

      <p className="text-lg font-semibold text-gray-800 break-words">
        {value || "-"}
      </p>
    </div>
  );
};

export default ProfilePage;
