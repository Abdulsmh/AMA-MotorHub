import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiTrash2,
  FiEye,
  FiFilter,
  FiRefreshCw,
} from "react-icons/fi";
import {
  getAllMotorcycles,
  deleteMotorcycle,
  getOptimizedImageUrl,
} from "../../services/motorcycleService";

const AdminMotorcycles = () => {
  const [motorcycles, setMotorcycles] = useState([]);
  const [filteredBikes, setFilteredBikes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const loadMotorcycles = useCallback(async () => {
    try {
      setLoading(true);
      const bikes = await getAllMotorcycles();
      setMotorcycles(bikes);
      setFilteredBikes(bikes);
    } catch (error) {
      console.error("Error loading:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMotorcycles();
  }, [loadMotorcycles]);

  useEffect(() => {
    let filtered = [...motorcycles];

    if (statusFilter !== "all") {
      filtered = filtered.filter((b) => b.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (b) =>
          b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.shop_name?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredBikes(filtered);
  }, [searchTerm, statusFilter, motorcycles]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this motorcycle?"))
      return;

    setDeleting(id);
    try {
      const success = await deleteMotorcycle(id);
      if (success) {
        await loadMotorcycles();
        alert("Motorcycle deleted successfully!");
      } else {
        alert("Failed to delete motorcycle");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Error deleting motorcycle");
    } finally {
      setDeleting(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG").format(price);
  };

  const getImageUrl = (bike) => {
    const url = bike.main_image_url || bike.images?.[0];
    if (url) {
      return getOptimizedImageUrl(url, {
        width: 200,
        height: 150,
        quality: 60,
      });
    }
    return "https://placehold.co/400x300/e2e8f0/64748b?text=No+Image";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
        <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
          Manage Motorcycles
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={loadMotorcycles}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <FiRefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <div className="relative flex-1 sm:flex-none">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, brand, or shop..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="sold">Sold Out</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
          <p className="text-xl font-bold text-gray-800">
            {motorcycles.length}
          </p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
          <p className="text-xl font-bold text-green-700">
            {motorcycles.filter((b) => b.status === "available").length}
          </p>
          <p className="text-xs text-green-600">Available</p>
        </div>
        <div className="bg-red-50 rounded-lg p-3 text-center border border-red-100">
          <p className="text-xl font-bold text-red-700">
            {motorcycles.filter((b) => b.status === "sold").length}
          </p>
          <p className="text-xs text-red-600">Sold Out</p>
        </div>
      </div>

      {/* Motorcycles List */}
      {filteredBikes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500">No motorcycles found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredBikes.map((bike) => (
            <div
              key={bike.id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="aspect-square bg-gray-100">
                <img
                  src={getImageUrl(bike)}
                  alt={bike.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/400x300/e2e8f0/64748b?text=No+Image";
                  }}
                />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-gray-800 text-sm truncate">
                  {bike.name}
                </h3>
                <p className="text-xs text-gray-500">{bike.brand}</p>
                <p className="text-xs text-emerald-600 mt-1 truncate">
                  {bike.shop_name || "Unknown Shop"}
                </p>
                <p className="text-sm font-bold text-emerald-600 mt-1">
                  ₦{formatPrice(bike.price)}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                      bike.status === "available"
                        ? bike.quantity <= 3
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {bike.status === "available"
                      ? bike.quantity <= 3
                        ? `Low Stock (${bike.quantity})`
                        : "In Stock"
                      : "Sold"}
                  </span>
                  <button
                    onClick={() => handleDelete(bike.id)}
                    disabled={deleting === bike.id}
                    className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                  >
                    {deleting === bike.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                    ) : (
                      <FiTrash2 className="w-4 h-4" />
                    )}
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

export default AdminMotorcycles;
