import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiEdit2, FiSend } from "react-icons/fi";
import {
  getAnnouncements,
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../../services/announcementService";

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "announcement",
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await getAnnouncements();
      // Ensure data is an array
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading announcements:", error);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateAnnouncement(
          editingId,
          formData.title,
          formData.message,
          formData.type,
        );
        alert("Announcement updated!");
      } else {
        await addAnnouncement(formData.title, formData.message, formData.type);
        alert("Announcement posted!");
      }

      await loadAnnouncements();
      setShowForm(false);
      setEditingId(null);
      setFormData({ title: "", message: "", type: "announcement" });
    } catch (error) {
      console.error("Error saving announcement:", error);
      alert("Error saving announcement");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this announcement?")) {
      try {
        await deleteAnnouncement(id);
        await loadAnnouncements();
      } catch (error) {
        console.error("Error deleting announcement:", error);
        alert("Error deleting announcement");
      }
    }
  };

  const handleEdit = (announcement) => {
    setFormData({
      title: announcement.title,
      message: announcement.message,
      type: announcement.type,
    });
    setEditingId(announcement.id);
    setShowForm(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-NG", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading announcements...</div>
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-4 md:px-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
          Announcements
        </h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ title: "", message: "", type: "announcement" });
          }}
          className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition"
        >
          <FiPlus className="w-4 h-4" />
          New Announcement
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white rounded-xl max-w-lg w-full p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {editingId ? "Edit Announcement" : "New Announcement"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows="4"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                >
                  <option value="announcement">General Announcement</option>
                  <option value="price_update">Price Update</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="feature">New Feature</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium"
                >
                  <FiSend className="w-4 h-4 inline mr-1" />
                  {editingId ? "Update" : "Post"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Announcements List */}
      {announcements.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500">No announcements yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white rounded-xl border border-gray-100 p-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-800">
                      {announcement.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        announcement.type === "price_update"
                          ? "bg-emerald-100 text-emerald-700"
                          : announcement.type === "maintenance"
                            ? "bg-yellow-100 text-yellow-700"
                            : announcement.type === "feature"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {announcement.type === "price_update"
                        ? "💰 Price Update"
                        : announcement.type === "maintenance"
                          ? "🔧 Maintenance"
                          : announcement.type === "feature"
                            ? "✨ New Feature"
                            : "📢 Announcement"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {announcement.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDate(announcement.created_at || announcement.date)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(announcement)}
                    className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncements;
