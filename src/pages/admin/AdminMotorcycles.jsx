import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiTrash2, FiEye, FiFilter } from "react-icons/fi";

const AdminMotorcycles = () => {
  const [motorcycles, setMotorcycles] = useState([]);
  const [filteredBikes, setFilteredBikes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMotorcycles();
  }, []);

  useEffect(() => {
    filterMotorcycles();
  }, [searchTerm, statusFilter, motorcycles]);

  const loadMotorcycles = () => {
    const bikes = JSON.parse(
      localStorage.getItem("motorcycle_marketplace") || "[]",
    );
    setMotorcycles(bikes);
    setFilteredBikes(bikes);
    setLoading(false);
  };

  const filterMotorcycles = () => {
    let filtered = [...motorcycles];

    if (statusFilter !== "all") {
      filtered = filtered.filter((b) => b.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (b) =>
          b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.shopName?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredBikes(filtered);
  };

  const deleteMotorcycle = (id) => {
    if (window.confirm("Are you sure you want to delete this motorcycle?")) {
      const updatedBikes = motorcycles.filter((b) => b.id !== id);
      setMotorcycles(updatedBikes);
      localStorage.setItem(
        "motorcycle_marketplace",
        JSON.stringify(updatedBikes),
      );
      alert("Motorcycle deleted successfully!");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG").format(price);
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  return (
    <div className="px-3 sm:px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
        <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
          Manage Motorcycles
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
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
              className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
            >
              <div className="aspect-square bg-gray-100">
                {bike.images && bike.images[0] ? (
                  <img
                    src={bike.images[0]}
                    alt={bike.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No image
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-gray-800 text-sm truncate">
                  {bike.name}
                </h3>
                <p className="text-xs text-gray-500">{bike.brand}</p>
                <p className="text-xs text-emerald-600 mt-1 truncate">
                  {bike.shopName}
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
                    onClick={() => deleteMotorcycle(bike.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition"
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

export default AdminMotorcycles;
