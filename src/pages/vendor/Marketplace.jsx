import React, { useState, useEffect } from "react";
import { getAvailableMotorcycles } from "../../services/motorcycleService";
import { FiSearch, FiMessageCircle } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const Marketplace = () => {
  const [motorcycles, setMotorcycles] = useState([]);
  const [filteredBikes, setFilteredBikes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  useEffect(() => {
    loadMotorcycles();
  }, []);

  useEffect(() => {
    filterBikes();
  }, [searchTerm, motorcycles]);

  const loadMotorcycles = () => {
    const bikes = getAvailableMotorcycles();
    setMotorcycles(bikes);
    setFilteredBikes(bikes);
  };

  const filterBikes = () => {
    let filtered = [...motorcycles];
    if (searchTerm) {
      filtered = filtered.filter(
        (bike) =>
          bike.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bike.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bike.shopName?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    setFilteredBikes(filtered);
    setCurrentPage(1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG").format(price);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBikes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBikes.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="px-3 sm:px-4 md:px-6">
      <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-5">
        Marketplace
      </h1>

      {/* Search Bar */}
      <div className="relative mb-4">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <input
          type="text"
          placeholder="Search by name, brand, or shop..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      {/* Results Count */}
      <div className="text-xs text-gray-500 mb-3">
        {filteredBikes.length} motorcycle{filteredBikes.length !== 1 ? "s" : ""}{" "}
        available
      </div>

      {currentItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <FiSearch className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No motorcycles available</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {currentItems.map((bike) => (
              <div
                key={bike.id}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition"
              >
                {/* Image */}
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

                {/* Content */}
                <div className="p-2 sm:p-3">
                  <h3 className="font-semibold text-gray-800 text-xs sm:text-sm truncate">
                    {bike.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    {bike.brand}
                  </p>
                  <p className="text-[10px] sm:text-xs text-emerald-600 mt-1 truncate">
                    {bike.shopName}
                  </p>
                  <p className="text-sm sm:text-base md:text-lg font-bold text-emerald-600 mt-1">
                    ₦{formatPrice(bike.price)}
                  </p>

                  <a
                    href={`https://wa.me/${bike.vendorWhatsapp || "2347015102718"}?text=Hello%2C%20I'm%20interested%20in%20your%20${encodeURIComponent(bike.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 w-full mt-2 py-1.5 bg-green-500 text-white text-[10px] sm:text-xs rounded-lg hover:bg-green-600 transition"
                  >
                    <FiMessageCircle className="w-3 h-3" />
                    Contact Shop
                  </a>
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
    </div>
  );
};

export default Marketplace;
