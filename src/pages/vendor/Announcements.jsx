import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FiBell, FiCalendar, FiCheckCircle, FiCircle } from "react-icons/fi";

// Sample announcements - in production, these would come from admin
const sampleAnnouncements = [
  {
    id: 1,
    title: "New Price List Available",
    message:
      "Latest price list for all motorcycle brands has been updated. Check the Price List page for details.",
    date: "2024-01-15T10:30:00Z",
    isRead: false,
    type: "price_update",
  },
  {
    id: 2,
    title: "Marketplace Maintenance",
    message:
      "The marketplace will be under maintenance on Sunday, Jan 20th from 2AM to 4AM. Please plan accordingly.",
    date: "2024-01-14T09:00:00Z",
    isRead: true,
    type: "maintenance",
  },
  {
    id: 3,
    title: "New Feature: Digital Receipts",
    message:
      "You can now generate digital receipts for your customers. Go to Sales section to try it out!",
    date: "2024-01-10T14:15:00Z",
    isRead: false,
    type: "feature",
  },
  {
    id: 4,
    title: "Holiday Schedule",
    message:
      "Our platform will have limited support during the upcoming holidays. Please expect delayed responses.",
    date: "2024-01-05T08:00:00Z",
    isRead: true,
    type: "announcement",
  },
];

const Announcements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [filter, setFilter] = useState("all"); // all, unread, read

  useEffect(() => {
    // Load announcements (in production, fetch from API)
    setAnnouncements(sampleAnnouncements);
  }, []);

  const markAsRead = (id) => {
    setAnnouncements((prev) =>
      prev.map((ann) => (ann.id === id ? { ...ann, isRead: true } : ann)),
    );
  };

  const markAllAsRead = () => {
    setAnnouncements((prev) => prev.map((ann) => ({ ...ann, isRead: true })));
  };

  const filteredAnnouncements = announcements.filter((ann) => {
    if (filter === "unread") return !ann.isRead;
    if (filter === "read") return ann.isRead;
    return true;
  });

  const unreadCount = announcements.filter((a) => !a.isRead).length;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-NG");
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "price_update":
        return <span className="text-emerald-600">💰</span>;
      case "maintenance":
        return <span className="text-yellow-600">🔧</span>;
      case "feature":
        return <span className="text-blue-600">✨</span>;
      default:
        return <span className="text-purple-600">📢</span>;
    }
  };

  return (
    <div className="px-3 sm:px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
            Announcements
          </h1>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-emerald-600 hover:text-emerald-700"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 border-b border-gray-100">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-2 text-sm transition ${
            filter === "all"
              ? "text-emerald-600 border-b-2 border-emerald-600 font-medium"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-3 py-2 text-sm transition ${
            filter === "unread"
              ? "text-emerald-600 border-b-2 border-emerald-600 font-medium"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Unread
        </button>
        <button
          onClick={() => setFilter("read")}
          className={`px-3 py-2 text-sm transition ${
            filter === "read"
              ? "text-emerald-600 border-b-2 border-emerald-600 font-medium"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Read
        </button>
      </div>

      {/* Announcements List */}
      {filteredAnnouncements.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <FiBell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No announcements found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className={`bg-white rounded-lg border p-4 transition ${
                !announcement.isRead
                  ? "border-l-4 border-l-emerald-500 bg-emerald-50/30"
                  : "border-gray-100"
              }`}
              onClick={() =>
                !announcement.isRead && markAsRead(announcement.id)
              }
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {!announcement.isRead ? (
                    <FiCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <FiCheckCircle className="w-4 h-4 text-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-lg">
                      {getTypeIcon(announcement.type)}
                    </span>
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                      {announcement.title}
                    </h3>
                    {!announcement.isRead && (
                      <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    {announcement.message}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <FiCalendar className="w-3 h-3" />
                      {formatDate(announcement.date)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;
