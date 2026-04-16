import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
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

  const loadMotorcycles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("motorcycles")
        .select("*")
        .eq("vendor_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMotorcycles(data || []);
      setFilteredBikes(data || []);
    } catch (error) {
      console.error("Error loading motorcycles:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterBikes = () => {
    let filtered = [...motorcycles];
    if (searchTerm) {
      filtered = filtered.filter(
        (bike) =>
          bike.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bike.brand?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    setFilteredBikes(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this motorcycle?")) {
      try {
        const { error } = await supabase
          .from("motorcycles")
          .delete()
          .eq("id", id);

        if (error) throw error;
        await loadMotorcycles();
        alert("Motorcycle deleted successfully!");
      } catch (error) {
        console.error("Error deleting motorcycle:", error);
        alert("Error deleting motorcycle");
      }
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

  const savePrice = async () => {
    if (!newPrice || newPrice <= 0) {
      alert("Please enter a valid price");
      return;
    }

    try {
      const { error } = await supabase
        .from("motorcycles")
        .update({ price: parseInt(newPrice) })
        .eq("id", editingBike.id);

      if (error) throw error;
      await loadMotorcycles();
      closeEditPrice();
      alert("Price updated successfully!");
    } catch (error) {
      console.error("Error updating price:", error);
      alert("Error updating price");
    }
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

  const processSale = async () => {
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

    try {
      const { error } = await supabase
        .from("motorcycles")
        .update({
          quantity: newQuantity,
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", sellingBike.id);

      if (error) throw error;
      await loadMotorcycles();
      closeSellModal();
      alert(
        `Sold ${sellQuantity} unit(s) to ${buyerName}. Remaining stock: ${newQuantity}`,
      );
    } catch (error) {
      console.error("Error processing sale:", error);
      alert("Error processing sale");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG").format(price);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBikes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBikes.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading...
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
          <p className="text-gray-500 mb-4">No motorcycles found</p>
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

                <div className="p-2 sm:p-3">
                  <h3 className="font-semibold text-gray-800 text-xs sm:text-sm truncate">
                    {bike.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-1">
                    {bike.brand}
                  </p>

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

                  <div className="flex justify-between items-center text-[10px] sm:text-xs text-gray-500 mt-1.5">
                    <span>📦 Stock: {bike.quantity}</span>
                    <span>{bike.colors?.length || 0} colors</span>
                  </div>

                  <div className="flex gap-2 mt-2">
                    {bike.status === "available" && bike.quantity > 0 ? (
                      <button
                        onClick={() => openSellModal(bike)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-emerald-50 text-emerald-700 text-xs rounded-lg hover:bg-emerald-100 transition"
                      >
                        <FiMinusCircle className="w-3 h-3" /> Sell
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-gray-50 text-gray-400 text-xs rounded-lg cursor-not-allowed"
                      >
                        <FiMinusCircle className="w-3 h-3" /> Sold
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(bike.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-red-50 text-red-600 text-xs rounded-lg hover:bg-red-100 transition"
                    >
                      <FiTrash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

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
            className="bg-white rounded-xl max-w-md w-full p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Edit Price</h2>
            <input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={savePrice}
                className="flex-1 py-2 bg-emerald-600 text-white rounded-lg"
              >
                Save
              </button>
              <button
                onClick={closeEditPrice}
                className="flex-1 py-2 border border-gray-200 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sell Modal */}
      {showSellModal && sellingBike && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeSellModal}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Sell Motorcycle</h2>
            <p className="text-sm mb-2">{sellingBike.name}</p>
            <p className="text-xs text-gray-500 mb-3">
              Available stock: {sellingBike.quantity}
            </p>
            <input
              type="number"
              value={sellQuantity}
              onChange={(e) =>
                setSellQuantity(
                  Math.min(parseInt(e.target.value) || 1, sellingBike.quantity),
                )
              }
              min="1"
              max={sellingBike.quantity}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg mb-3"
            />
            <input
              type="text"
              placeholder="Buyer Name"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg mb-3"
            />
            <input
              type="tel"
              placeholder="Buyer Phone"
              value={buyerPhone}
              onChange={(e) => setBuyerPhone(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={processSale}
                className="flex-1 py-2 bg-emerald-600 text-white rounded-lg"
              >
                Confirm Sale
              </button>
              <button
                onClick={closeSellModal}
                className="flex-1 py-2 border border-gray-200 rounded-lg"
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
