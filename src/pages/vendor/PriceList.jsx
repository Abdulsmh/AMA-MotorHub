import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { supabase } from "../../lib/supabase";

const PriceList = () => {
  const [prices, setPrices] = useState([]);
  const [filteredPrices, setFilteredPrices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPriceList();
  }, []);

  useEffect(() => {
    filterPrices();
  }, [searchTerm, prices]);

  const loadPriceList = async () => {
    try {
      setLoading(true);
      // Get all available motorcycles for price list
      const { data, error } = await supabase
        .from("motorcycles")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPrices(data || []);
      setFilteredPrices(data || []);
    } catch (error) {
      console.error("Error loading price list:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterPrices = () => {
    let filtered = [...prices];
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.brand?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    setFilteredPrices(filtered);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG").format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading price list...</div>
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-4 md:px-6">
      <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-5">
        Price List
      </h1>

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

      <div className="text-xs text-gray-500 mb-3">
        {filteredPrices.length} item{filteredPrices.length !== 1 ? "s" : ""}{" "}
        found
      </div>

      {filteredPrices.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500">No price list items found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredPrices.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-gray-100 p-3 sm:p-4"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500">{item.brand}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Market Price</p>
                  <p className="text-sm font-bold text-emerald-600">
                    ₦{formatPrice(item.price)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PriceList;
