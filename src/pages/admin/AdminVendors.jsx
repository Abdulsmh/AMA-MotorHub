import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiCheckCircle,
  FiXCircle,
  FiTrash2,
  FiEye,
  FiStar,
} from "react-icons/fi";

const AdminVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [editingPriority, setEditingPriority] = useState(null);
  const [priorityValue, setPriorityValue] = useState(0);

  useEffect(() => {
    loadVendors();
  }, []);

  useEffect(() => {
    filterVendors();
  }, [searchTerm, filter, vendors]);

  const loadVendors = () => {
    const users = JSON.parse(localStorage.getItem("motorcycle_users") || "[]");
    const vendorList = users.filter((u) => u.type === "vendor");
    // Sort by priority (higher first)
    vendorList.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    setVendors(vendorList);
    setFilteredVendors(vendorList);
    setLoading(false);
  };

  const filterVendors = () => {
    let filtered = [...vendors];
    if (filter === "pending") {
      filtered = filtered.filter((v) => !v.verified);
    } else if (filter === "verified") {
      filtered = filtered.filter((v) => v.verified);
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (v) =>
          v.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.phone?.includes(searchTerm) ||
          v.fullName?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    setFilteredVendors(filtered);
  };

  const verifyVendor = (id) => {
    const updatedVendors = vendors.map((v) =>
      v.id === id ? { ...v, verified: true } : v,
    );
    setVendors(updatedVendors);
    localStorage.setItem("motorcycle_users", JSON.stringify(updatedVendors));
    alert("Vendor verified successfully!");
  };

  const deleteVendor = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this vendor? All their motorcycles will also be deleted.",
      )
    ) {
      const updatedVendors = vendors.filter((v) => v.id !== id);
      setVendors(updatedVendors);
      localStorage.setItem("motorcycle_users", JSON.stringify(updatedVendors));
      const motorcycles = JSON.parse(
        localStorage.getItem("motorcycle_marketplace") || "[]",
      );
      const updatedMotorcycles = motorcycles.filter((m) => m.vendorId !== id);
      localStorage.setItem(
        "motorcycle_marketplace",
        JSON.stringify(updatedMotorcycles),
      );
      alert("Vendor deleted successfully!");
    }
  };

  const updatePriority = (id, newPriority) => {
    const updatedVendors = vendors.map((v) =>
      v.id === id ? { ...v, priority: newPriority } : v,
    );
    updatedVendors.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    setVendors(updatedVendors);
    localStorage.setItem("motorcycle_users", JSON.stringify(updatedVendors));
    setEditingPriority(null);
    alert(`Priority updated to ${newPriority}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-NG");
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  return (
    <div className="px-3 sm:px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
        <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
          Manage Vendors
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
          >
            <option value="all">All Vendors</option>
            <option value="pending">Pending Verification</option>
            <option value="verified">Verified</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
          <p className="text-xl font-bold text-gray-800">{vendors.length}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3 text-center border border-yellow-100">
          <p className="text-xl font-bold text-yellow-700">
            {vendors.filter((v) => !v.verified).length}
          </p>
          <p className="text-xs text-yellow-600">Pending</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
          <p className="text-xl font-bold text-green-700">
            {vendors.filter((v) => v.verified).length}
          </p>
          <p className="text-xs text-green-600">Verified</p>
        </div>
      </div>

      {/* Vendors List */}
      {filteredVendors.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500">No vendors found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white rounded-xl border border-gray-100 p-4"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-800">
                      {vendor.shopName}
                    </h3>
                    {vendor.verified ? (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                        <FiCheckCircle className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-1">
                        <FiXCircle className="w-3 h-3" /> Pending
                      </span>
                    )}
                    {/* Priority Badge */}
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full flex items-center gap-1">
                      <FiStar className="w-3 h-3" /> Priority:{" "}
                      {vendor.priority || 0}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {vendor.fullName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    📞 {vendor.phone}
                  </p>
                  <p className="text-xs text-gray-500">
                    📧 {vendor.email || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500">
                    📍 {vendor.shopAddress}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Joined: {formatDate(vendor.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {/* Priority Control */}
                  {editingPriority === vendor.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={priorityValue}
                        onChange={(e) =>
                          setPriorityValue(parseInt(e.target.value) || 0)
                        }
                        className="w-16 px-2 py-1 text-sm border border-gray-200 rounded-lg"
                        min="0"
                        max="100"
                      />
                      <button
                        onClick={() => updatePriority(vendor.id, priorityValue)}
                        className="px-2 py-1 bg-emerald-600 text-white text-xs rounded-lg"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingPriority(null)}
                        className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingPriority(vendor.id);
                        setPriorityValue(vendor.priority || 0);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-600 text-xs rounded-lg hover:bg-purple-100 transition"
                    >
                      <FiStar className="w-3 h-3" />
                      Set Priority
                    </button>
                  )}
                  {!vendor.verified && (
                    <button
                      onClick={() => verifyVendor(vendor.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 transition"
                    >
                      <FiCheckCircle className="w-3 h-3" />
                      Verify
                    </button>
                  )}
                  <button
                    onClick={() => deleteVendor(vendor.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 text-xs rounded-lg hover:bg-red-100 transition"
                  >
                    <FiTrash2 className="w-3 h-3" />
                    Delete
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

export default AdminVendors;
