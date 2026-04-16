import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  FiPackage,
  FiMapPin,
  FiPhone,
  FiMail,
  FiArrowLeft,
  FiCheckCircle,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const ShopPage = () => {
  const { vendorId } = useParams();
  const [shop, setShop] = useState(null);
  const [motorcycles, setMotorcycles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShopData();
  }, [vendorId]);

  const loadShopData = async () => {
    try {
      setLoading(true);

      // Get vendor info
      const { data: vendor, error: vendorError } = await supabase
        .from("users")
        .select("*")
        .eq("id", vendorId)
        .single();

      if (vendorError) throw vendorError;

      // Get vendor's motorcycles
      const { data: bikes, error: bikesError } = await supabase
        .from("motorcycles")
        .select("*")
        .eq("vendor_id", vendorId)
        .eq("status", "available")
        .gt("quantity", 0)
        .order("created_at", { ascending: false });

      if (bikesError) throw bikesError;

      setShop(vendor);
      setMotorcycles(bikes || []);
    } catch (error) {
      console.error("Error loading shop:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG").format(price);
  };

  if (loading) {
    return <div className="text-center py-10">Loading shop...</div>;
  }

  if (!shop) {
    return <div className="text-center py-10 text-red-500">Shop not found</div>;
  }

  return (
    <div className="px-3 sm:px-4 md:px-6">
      <Link
        to="/catalog"
        className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-4"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Catalog
      </Link>

      {/* Shop Header */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
            {shop.profile_picture ? (
              <img
                src={shop.profile_picture}
                alt={shop.shop_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl bg-emerald-100 text-emerald-600">
                {shop.shop_name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                {shop.shop_name}
              </h1>
              {shop.verified && (
                <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                  <FiCheckCircle className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm mt-1">{shop.shop_number}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-3">
              {shop.shop_address && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <FiMapPin className="w-3 h-3" /> {shop.shop_address}
                </span>
              )}
              {shop.phone && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <FiPhone className="w-3 h-3" /> {shop.phone}
                </span>
              )}
              {shop.whatsapp && (
                <a
                  href={`https://wa.me/${shop.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700"
                >
                  <FaWhatsapp className="w-3 h-3" /> WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Motorcycles List */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Motorcycles from {shop.shop_name}
      </h2>

      {motorcycles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <FiPackage className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No motorcycles listed yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {motorcycles.map((bike) => (
            <div
              key={bike.id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition"
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
                <p className="text-sm font-bold text-emerald-600 mt-1">
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
                        ? `Low Stock`
                        : "In Stock"
                      : "Sold"}
                  </span>
                  <a
                    href={`https://wa.me/${shop.whatsapp || shop.phone}?text=Hello%2C%20I'm%20interested%20in%20your%20${encodeURIComponent(bike.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopPage;
