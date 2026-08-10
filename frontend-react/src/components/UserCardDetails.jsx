import {
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  Update,
  Close,
  Badge,
} from "@mui/icons-material";
import { useEffect } from "react";

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const UserCardDetails = ({ data, setShowModal }) => {
  if (!data) return null;

  const {
    id,
    name,
    email,
    phoneNumber,
    createAt,
    updateAt,
    address,
    roles,
    isEnabled,
  } = data;

  const initials =
    name
      ?.split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setShowModal]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={() => setShowModal(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl bg-white shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-5 border-b border-gray-100">
          <button
            onClick={() => setShowModal(false)}
            className="
              absolute right-4 top-4
              flex h-8 w-8 items-center justify-center
              rounded-full bg-gray-100 text-gray-500
              hover:bg-gray-200 hover:text-gray-700 transition
            "
          >
            <Close style={{ fontSize: 18 }} />
          </button>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-500 text-lg font-bold text-white shadow-sm">
              {initials}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-400">#{id}</span>
                <span
                  className={`
                    inline-flex items-center px-2 py-0.5
                    rounded-full text-[11px] font-medium border
                    ${
                      isEnabled
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }
                  `}
                >
                  {isEnabled ? "Active" : "Blocked"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-3">
          {/* Contact row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Email style={{ fontSize: 14 }} className="text-orange-500" />
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                  Email
                </span>
              </div>
              <p className="text-sm font-medium text-gray-800 break-all">
                {email || "—"}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Phone style={{ fontSize: 14 }} className="text-orange-500" />
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                  Phone
                </span>
              </div>
              <p className="text-sm font-medium text-gray-800">
                {phoneNumber || "—"}
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <LocationOn
                style={{ fontSize: 14 }}
                className="text-orange-500"
              />
              <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                Address
              </span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {address || "No address available"}
            </p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <CalendarToday
                  style={{ fontSize: 14 }}
                  className="text-orange-500"
                />
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                  Joined
                </span>
              </div>
              <p className="text-sm font-medium text-gray-800">
                {formatDate(createAt)}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Update style={{ fontSize: 14 }} className="text-orange-500" />
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                  Updated
                </span>
              </div>
              <p className="text-sm font-medium text-gray-800">
                {formatDate(updateAt)}
              </p>
            </div>
          </div>

          {/* Roles */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3.5">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Badge style={{ fontSize: 14 }} className="text-orange-500" />
              <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                Roles
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {roles?.length ? (
                roles.map((role) => (
                  <span
                    key={role}
                    className="
                      rounded-full bg-orange-50 border border-orange-100
                      px-2.5 py-0.5 text-xs font-medium text-orange-600
                    "
                  >
                    {role.replace("ROLE_", "")}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-400">No roles assigned</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-100 bg-gray-50/30">
          <button
            onClick={() => setShowModal(false)}
            className="
              rounded-xl border border-gray-200 bg-white
              px-5 py-2 text-sm font-medium text-gray-600
              hover:bg-gray-50 transition
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCardDetails;
