import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import HeroCarousel from "../components/HeroCarousel";
import {
  FiMapPin,
  FiCheckCircle,
  FiArrowRight,
  FiSearch,
  FiShare2,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const HomePage = () => {
  const { isAuthenticated, userType, user } = useAuth();
  const [featuredBikes, setFeaturedBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedBikes();
  }, []);

  const loadFeaturedBikes = async () => {
    try {
      setLoading(true);

      const { data: bikes, error } = await supabase
        .from("motorcycles")
        .select(
          "id, vendor_id, name, brand, price, quantity, images, status, created_at, description_en",
        )
        .eq("status", "available")
        .gt("quantity", 0)
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) throw error;

      if (!bikes || bikes.length === 0) {
        setFeaturedBikes([]);
        return;
      }

      const vendorIds = [
        ...new Set(bikes.map((b) => b.vendor_id).filter(Boolean)),
      ];

      let vendorMap = {};
      if (vendorIds.length > 0) {
        const { data: vendors } = await supabase
          .from("users")
          .select("id, shop_name, whatsapp, verified, phone, shop_address")
          .in("id", vendorIds);

        vendors?.forEach((v) => {
          vendorMap[v.id] = {
            shopName: v.shop_name || "Unknown Shop",
            whatsapp: v.whatsapp || v.phone || "",
            verified: v.verified || false,
            shopAddress: v.shop_address || "",
          };
        });
      }

      const bikesWithVendors = bikes.map((bike) => ({
        ...bike,
        shopName: vendorMap[bike.vendor_id]?.shopName || "Unknown Shop",
        shopWhatsapp: vendorMap[bike.vendor_id]?.whatsapp || "",
        shopVerified: vendorMap[bike.vendor_id]?.verified || false,
        shopAddress: vendorMap[bike.vendor_id]?.shopAddress || "",
      }));

      setFeaturedBikes(bikesWithVendors);
    } catch (error) {
      console.error("Error loading featured bikes:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG").format(price);
  };

  const getImageUrl = (image) => {
    if (image && image[0]) return image[0];
    return "https://placehold.co/400x300/e2e8f0/64748b?text=No+Image";
  };

  // Enhanced WhatsApp share function with all motorcycle details
  const shareOnWhatsApp = (bike) => {
    const imageUrl = getImageUrl(bike.images);
    const currentDate = new Date().toLocaleString("en-NG", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const message = `🏍️ *NEW MOTORCYCLE INQUIRY* 🏍️
━━━━━━━━━━━━━━━━━━━━━
📸 *Image:* ${imageUrl}
━━━━━━━━━━━━━━━━━━━━━
🏍️ *Model:* ${bike.name}
🏷️ *Brand:* ${bike.brand}
💰 *Price:* ₦${formatPrice(bike.price)}
📦 *Stock:* ${bike.quantity} unit(s) available
🏪 *Shop:* ${bike.shopName}
📍 *Location:* ${bike.shopAddress || "Kano, Nigeria"}
⭐ *Verified:* ${bike.shopVerified ? "✓ Verified Shop" : "Standard Shop"}
━━━━━━━━━━━━━━━━━━━━━
📝 *Description:*
${bike.description_en ? bike.description_en.substring(0, 200) : "No description available"}${bike.description_en?.length > 200 ? "..." : ""}
━━━━━━━━━━━━━━━━━━━━━
🔗 *View Details:* ${window.location.origin}/shop/${bike.vendor_id}
⏰ *Inquiry Time:* ${currentDate}
━━━━━━━━━━━━━━━━━━━━━
💬 Reply to this message to inquire about this motorcycle.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${bike.shopWhatsapp}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const getWelcomeMessage = () => {
    if (!isAuthenticated) return null;
    if (userType === "admin") {
      return {
        title: `Welcome back, Admin`,
        subtitle: "Manage your platform",
        buttonLink: "/admin/dashboard",
      };
    }
    if (userType === "vendor") {
      return {
        title: `Welcome back, ${user?.shopName || user?.name}`,
        subtitle: "Manage your shop inventory and sales",
        buttonLink: "/vendor/dashboard",
      };
    }
    return null;
  };

  const welcome = getWelcomeMessage();

  if (loading) {
    return (
      <div className="w-full">
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 rounded-2xl h-[400px] animate-pulse mb-6"></div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-xl h-64 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Carousel */}
      {!isAuthenticated && <HeroCarousel />}

      {/* Welcome Banner for logged-in users */}
      {isAuthenticated && welcome && (
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 rounded-2xl text-white overflow-hidden mb-6">
          <div className="px-4 py-8 sm:px-6 sm:py-10 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              {welcome.title}
            </h1>
            <p className="text-emerald-100 text-sm mb-5">{welcome.subtitle}</p>
            <Link
              to={welcome.buttonLink}
              className="inline-flex items-center gap-2 bg-white text-emerald-700 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-100 transition shadow-lg"
            >
              Go to Dashboard
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Featured Motorcycles Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            🔥 Latest Arrivals
          </h2>
          <Link
            to="/catalog"
            className="text-xs text-emerald-600 hover:text-emerald-700"
          >
            View All →
          </Link>
        </div>

        {featuredBikes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500">No motorcycles available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {featuredBikes.map((bike) => (
              <div
                key={bike.id}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition group"
              >
                {/* Clickable area for navigation (excluding WhatsApp button) */}
                <Link to={`/shop/${bike.vendor_id}`} className="block">
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={getImageUrl(bike.images)}
                      alt={bike.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/400x300/e2e8f0/64748b?text=No+Image";
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="font-semibold text-gray-800 text-sm truncate flex-1">
                        {bike.name}
                      </h3>
                      {bike.shopVerified && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] bg-blue-50 text-blue-600 px-1 py-0.5 rounded-full">
                          <FiCheckCircle className="w-2 h-2" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{bike.brand}</p>
                    <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 truncate">
                      <FiMapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{bike.shopName}</span>
                    </p>
                    <p className="text-sm font-bold text-emerald-600 mt-2">
                      ₦{formatPrice(bike.price)}
                    </p>
                    <div className="mt-2 flex justify-between items-center">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          bike.quantity <= 3
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {bike.quantity <= 3
                          ? `Only ${bike.quantity} left`
                          : "In Stock"}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* WhatsApp Button - Enhanced with full details */}
                <div className="px-3 pb-3">
                  <button
                    onClick={() => shareOnWhatsApp(bike)}
                    className="flex items-center justify-center gap-1 w-full py-1.5 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition"
                  >
                    <FaWhatsapp className="w-3 h-3" />
                    WhatsApp Inquiry
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
          <div className="text-emerald-600 text-lg font-bold">500+</div>
          <div className="text-[10px] text-gray-500">Motorcycles Sold</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
          <div className="text-emerald-600 text-lg font-bold">50+</div>
          <div className="text-[10px] text-gray-500">Trusted Vendors</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
          <div className="text-emerald-600 text-lg font-bold">1000+</div>
          <div className="text-[10px] text-gray-500">Happy Customers</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
          <div className="text-emerald-600 text-lg font-bold">4.9</div>
          <div className="text-[10px] text-gray-500">Rating</div>
        </div>
      </div>

      {/* Call to Action for Vendors */}
      {!isAuthenticated && (
        <div className="bg-gray-50 rounded-xl p-5 text-center border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">
            Sell your motorcycles?
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            Join as a vendor and reach more customers
          </p>
          <Link
            to="/signup"
            className="inline-block bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
          >
            Become a Vendor
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;
