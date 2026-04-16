import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getMotorcyclesByVendor,
  deleteMotorcycle,
  updateMotorcycle,
} from "../../services/motorcycleService";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiMinusCircle,
  FiX,
} from "react-icons/fi";

const MyMotorcycles = () => {
  const { user } = useAuth();
  const [motorcycles, setMotorcycles] = useState([]);
  const [filteredBikes, setFilteredBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  const [editingBike, setEditingBike] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [sellingBike, setSellingBike] = useState(null);
  const [sellQuantity, setSellQuantity] = useState(1);
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [showSellModal, setShowSellModal] = useState(false);

  useEffect(() => {
    loadMotorcycles();
  }, []);

  useEffect(() => {
    filterBikes();
  }, [searchTerm, motorcycles]);

  const loadMotorcycles = () => {
    const bikes = getMotorcyclesByVendor(user.id);
    setMotorcycles(bikes);
    setFilteredBikes(bikes);
    setLoading(false);
  };

  const filterBikes = () => {
    let filtered = [...motorcycles];
    if (searchTerm) {
      filtered = filtered.filter(
        (bike) =>
          bike.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bike.brand.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    setFilteredBikes(filtered);
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this motorcycle?")) {
      deleteMotorcycle(id);
      loadMotorcycles();
    }
  };

  const openEditPrice = (bike) => {
    setEditingBike(bike);
    setNewPrice(bike.price);
  };

  const closeEditPrice = () => {
    setEditingBike(null);
    setNewPrice("");
  };

  const savePrice = () => {
    if (!newPrice || newPrice <= 0) {
      alert("Please enter a valid price");
      return;
    }

    const updatedBike = { ...editingBike, price: parseInt(newPrice) };
    updateMotorcycle(editingBike.id, updatedBike);
    loadMotorcycles();
    closeEditPrice();
    alert("Price updated successfully!");
  };

  const openSellModal = (bike) => {
    setSellingBike(bike);
    setSellQuantity(1);
    setBuyerName("");
    setBuyerPhone("");
    setShowSellModal(true);
  };

  const closeSellModal = () => {
    setSellingBike(null);
    setSellQuantity(1);
    setBuyerName("");
    setBuyerPhone("");
    setShowSellModal(false);
  };

  const processSale = () => {
    if (!buyerName) {
      alert("Please enter buyer name");
      return;
    }

    if (sellQuantity > sellingBike.quantity) {
      alert(`Only ${sellingBike.quantity} units available`);
      return;
    }

    const newQuantity = sellingBike.quantity - sellQuantity;
    const newStatus = newQuantity === 0 ? "sold" : "available";

    const updatedBike = {
      ...sellingBike,
      quantity: newQuantity,
      status: newStatus,
    };

    updateMotorcycle(sellingBike.id, updatedBike);
    loadMotorcycles();
    closeSellModal();
    alert(
      `Sold ${sellQuantity} unit(s) to ${buyerName}. Remaining stock: ${newQuantity}`,
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG").format(price);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBikes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBikes.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
        <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
          My Motorcycles
        </h1>
        <Link
          to="/vendor/add-bike"
          className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-emerald-600 text-white text-xs sm:text-sm rounded-lg hover:bg-emerald-700 transition w-full sm:w-auto"
        >
          <FiPlus className="w-3 h-3 sm:w-4 sm:h-4" />
          Add Motorcycle
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <input
          type="text"
          placeholder="Search by name or brand..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      {/* Results Count */}
      <div className="text-xs text-gray-500 mb-3">
        {filteredBikes.length} motorcycle{filteredBikes.length !== 1 ? "s" : ""}{" "}
        found
      </div>

      {currentItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <FiSearch className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500 mb-4">No motorcycles found</p>
          <Link
            to="/vendor/add-bike"
            className="text-emerald-600 hover:text-emerald-700 text-xs sm:text-sm"
          >
            Add your first motorcycle
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {currentItems.map((bike) => (
              <div
                key={bike.id}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition"
              >
                {/* Image Section */}
                <div className="aspect-square bg-gray-100 relative">
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
                  {/* Status Badge */}
                  <span
                    className={`absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium ${
                      bike.status === "available"
                        ? bike.quantity <= 3
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {bike.status === "available"
                      ? bike.quantity <= 3
                        ? `Low Stock`
                        : "In Stock"
                      : "Sold"}
                  </span>
                </div>

                {/* Content Section */}
                <div className="p-2 sm:p-3">
                  <h3 className="font-semibold text-gray-800 text-xs sm:text-sm truncate">
                    {bike.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-1">
                    {bike.brand}
                  </p>

                  {/* Price Row with Edit Icon */}
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm sm:text-base md:text-lg font-bold text-emerald-600">
                      ₦{formatPrice(bike.price)}
                    </p>
                    <button
                      onClick={() => openEditPrice(bike)}
                      className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                      title="Edit Price"
                    >
                      <FiEdit2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Stock Info */}
                  <div className="flex justify-between items-center text-[10px] sm:text-xs text-gray-500 mt-1.5">
                    <span
                      className={`flex items-center gap-1 ${bike.quantity <= 3 ? "text-yellow-600" : ""}`}
                    >
                      📦 Stock: {bike.quantity}
                    </span>
                    <span>{bike.colors?.length || 0} colors</span>
                  </div>

                  {/* Action Buttons - Only Sell and Delete (No WhatsApp for own bikes) */}
                  <div className="flex gap-2 mt-2">
                    {bike.status === "available" && bike.quantity > 0 ? (
                      <button
                        onClick={() => openSellModal(bike)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-emerald-50 text-emerald-700 text-xs rounded-lg hover:bg-emerald-100 transition"
                      >
                        <FiMinusCircle className="w-3 h-3" />
                        Sell
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-gray-50 text-gray-400 text-xs rounded-lg cursor-not-allowed"
                      >
                        <FiMinusCircle className="w-3 h-3" />
                        Sold
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(bike.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-red-50 text-red-600 text-xs rounded-lg hover:bg-red-100 transition"
                    >
                      <FiTrash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-1 sm:gap-2 mt-6 flex-wrap">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-200 rounded-lg disabled:opacity-50"
              >
                Prev
              </button>
              {[...Array(totalPages)].slice(0, 5).map((_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg ${currentPage === i + 1 ? "bg-emerald-600 text-white" : "border border-gray-200 hover:bg-gray-50"}`}
                >
                  {i + 1}
                </button>
              ))}
              {totalPages > 5 && <span className="px-1 py-1 text-xs">...</span>}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-200 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Edit Price Modal */}
      {editingBike && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeEditPrice}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full p-4 sm:p-5 mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                Edit Price
              </h2>
              <button
                onClick={closeEditPrice}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">{editingBike.name}</p>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                New Price (₦)
              </label>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
                placeholder="Enter new price"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={savePrice}
                className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
              >
                Save
              </button>
              <button
                onClick={closeEditPrice}
                className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sell Motorcycle Modal */}
      {showSellModal && sellingBike && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeSellModal}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full p-4 sm:p-5 mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                Sell Motorcycle
              </h2>
              <button
                onClick={closeSellModal}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-800">
                {sellingBike.name}
              </p>
              <p className="text-xs text-gray-500 mb-3">
                Available stock: {sellingBike.quantity}
              </p>

              <label className="block text-xs font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={sellQuantity}
                onChange={(e) =>
                  setSellQuantity(
                    Math.min(
                      parseInt(e.target.value) || 1,
                      sellingBike.quantity,
                    ),
                  )
                }
                min="1"
                max={sellingBike.quantity}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 mb-3"
              />

              <label className="block text-xs font-medium text-gray-700 mb-1">
                Buyer Name *
              </label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 mb-3"
                placeholder="Enter buyer name"
              />

              <label className="block text-xs font-medium text-gray-700 mb-1">
                Buyer Phone
              </label>
              <input
                type="tel"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
                placeholder="Enter phone number"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={processSale}
                className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
              >
                Confirm Sale
              </button>
              <button
                onClick={closeSellModal}
                className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMotorcycles;
