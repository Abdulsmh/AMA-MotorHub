import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiMapPin, FiCheckCircle } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { supabase } from "../../lib/supabase";

const Marketplace = () => {
  const [motorcycles, setMotorcycles] = useState([]);
  const [filteredBikes, setFilteredBikes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarketplaceData();
  }, []);

  useEffect(() => {
    filterBikes();
  }, [searchTerm, motorcycles]);

  const loadMarketplaceData = async () => {
    try {
      setLoading(true);

      console.log("Fetching marketplace motorcycles...");

      const { data: bikes, error } = await supabase
        .from("motorcycles")
        .select("*")
        .eq("status", "available")
        .gt("quantity", 0)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading bikes:", error);
        throw error;
      }

      console.log("Marketplace bikes found:", bikes?.length || 0);

      if (!bikes || bikes.length === 0) {
        setMotorcycles([]);
        setFilteredBikes([]);
        setLoading(false);
        return;
      }

      // Get vendor info
      const vendorIds = [
        ...new Set(bikes.map((b) => b.vendor_id).filter(Boolean)),
      ];

      let vendorMap = {};
      if (vendorIds.length > 0) {
        const { data: vendors } = await supabase
          .from("users")
          .select("id, shop_name, whatsapp, priority, verified")
          .in("id", vendorIds);

        vendors?.forEach((v) => {
          vendorMap[v.id] = {
            shopName: v.shop_name || "Unknown Shop",
            whatsapp: v.whatsapp || "",
            priority: v.priority || 0,
            verified: v.verified || false,
          };
        });
      }

      const bikesWithVendors = bikes.map((bike) => ({
        ...bike,
        shopName: vendorMap[bike.vendor_id]?.shopName || "Unknown Shop",
        shopWhatsapp: vendorMap[bike.vendor_id]?.whatsapp || "",
        shopPriority: vendorMap[bike.vendor_id]?.priority || 0,
        shopVerified: vendorMap[bike.vendor_id]?.verified || false,
      }));

      // Sort by priority
      bikesWithVendors.sort((a, b) => {
        if (a.shopPriority !== b.shopPriority)
          return b.shopPriority - a.shopPriority;
        return new Date(b.created_at) - new Date(a.created_at);
      });

      setMotorcycles(bikesWithVendors);
      setFilteredBikes(bikesWithVendors);
    } catch (error) {
      console.error("Error loading marketplace:", error);
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
          bike.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bike.shopName?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    setFilteredBikes(filtered);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG").format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading marketplace...</div>
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Marketplace</h1>
        <p className="text-gray-500 text-sm">
          Browse motorcycles from other vendors
        </p>
      </div>

      <div className="relative mb-6">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, brand, or shop..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      <div className="text-xs text-gray-500 mb-3">
        {filteredBikes.length} motorcycle{filteredBikes.length !== 1 ? "s" : ""}{" "}
        available
      </div>

      {filteredBikes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500">No motorcycles available</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredBikes.map((bike) => (
            <Link
              key={bike.id}
              to={`/shop/${bike.vendor_id}`}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition group"
            >
              <div className="aspect-square bg-gray-100">
                {bike.images && bike.images[0] ? (
                  <img
                    src={bike.images[0]}
                    alt={bike.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No image
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-start justify-between gap-1">
                  <h3 className="font-semibold text-gray-800 text-sm truncate flex-1">
                    {bike.name}
                  </h3>
                  {bike.shopVerified && (
                    <span className="inline-flex items-center gap-0.5 text-[9px] bg-blue-50 text-blue-600 px-1 py-0.5 rounded-full flex-shrink-0">
                      <FiCheckCircle className="w-2 h-2" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{bike.brand}</p>
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <FiMapPin className="w-3 h-3" />
                  <span className="truncate">{bike.shopName}</span>
                </p>
                <p className="text-sm font-bold text-emerald-600 mt-2">
                  ₦{formatPrice(bike.price)}
                </p>
                <div className="mt-2 flex justify-between items-center">
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      bike.status === "available"
                        ? bike.quantity <= 3
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {bike.status === "available"
                      ? bike.quantity <= 3
                        ? "Low Stock"
                        : "In Stock"
                      : "Sold"}
                  </span>
                  <a
                    href={`https://wa.me/${bike.shopWhatsapp}?text=Hello%2C%20I'm%20interested%20in%20your%20${encodeURIComponent(bike.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-green-600 hover:text-green-700"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
