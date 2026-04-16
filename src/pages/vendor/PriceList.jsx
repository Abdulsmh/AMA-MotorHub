import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

// Sample price list - this would come from admin in production
const samplePrices = [
  {
    id: 1,
    name: "Haojue HJ150",
    brand: "Haojue",
    companyPrice: 750000,
    marketPrice: 850000,
  },
  {
    id: 2,
    name: "Honda CG 125",
    brand: "Honda",
    companyPrice: 850000,
    marketPrice: 950000,
  },
  {
    id: 3,
    name: "Lifan KPR 150",
    brand: "Lifan",
    companyPrice: 680000,
    marketPrice: 780000,
  },
  {
    id: 4,
    name: "Royal Enfield Classic 350",
    brand: "Royal Enfield",
    companyPrice: 2150000,
    marketPrice: 2450000,
  },
  {
    id: 5,
    name: "Yamaha MT-15",
    brand: "Yamaha",
    companyPrice: 1200000,
    marketPrice: 1350000,
  },
  {
    id: 6,
    name: "Suzuki GSX-S150",
    brand: "Suzuki",
    companyPrice: 1100000,
    marketPrice: 1250000,
  },
  {
    id: 7,
    name: "Winner 11",
    brand: "Car Go",
    companyPrice: 840000,
    marketPrice: 890000,
  }
];

const PriceList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [prices] = useState(samplePrices);

  const filteredPrices = prices.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG").format(price);
  };

  return (
    <div className="px-3 sm:px-4 md:px-6">
      <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-5">
        Latest Price List
      </h1>

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
        {filteredPrices.length} item{filteredPrices.length !== 1 ? "s" : ""}{" "}
        found
      </div>

      <div className="space-y-2">
        {filteredPrices.map((price) => (
          <div
            key={price.id}
            className="bg-white rounded-lg border border-gray-100 p-3 sm:p-4"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
              {/* Left - Product Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                  {price.name}
                </h3>
                <p className="text-xs text-gray-500">{price.brand}</p>
              </div>

              {/* Right - Prices */}
              <div className="flex flex-row sm:flex-col gap-3 sm:gap-1 justify-between sm:text-right">
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-400">
                    Company Price
                  </p>
                  <p className="text-sm sm:text-base font-bold text-emerald-600">
                    ₦{formatPrice(price.companyPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-400">
                    Market Price
                  </p>
                  <p className="text-sm sm:text-base font-bold text-gray-800">
                    ₦{formatPrice(price.marketPrice)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceList;