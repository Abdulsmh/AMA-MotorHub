import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiMapPin, FiCheckCircle } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { getCatalogMotorcycles } from "../services/motorcycleService";

const CatalogPage = () => {
  const [motorcycles, setMotorcycles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [searchTimeout, setSearchTimeout] = useState(null);
  
  const observerRef = useRef();
  const loadingRef = useRef(false);

  // Load motorcycles with current search
  const loadMotorcycles = useCallback(async (reset = false) => {
    if (loadingRef.current) return;
    
    const currentPage = reset ? 1 : page;
    if (!reset && currentPage > 1 && !hasMore) return;
    
    loadingRef.current = true;
    setLoading(true);
    
    try {
      const result = await getCatalogMotorcycles(currentPage, 20, searchTerm);
      
      if (result.success) {
        if (reset) {
          setMotorcycles(result.data);
        } else {
          setMotorcycles(prev => [...prev, ...result.data]);
        }
        setHasMore(result.hasMore);
        setTotal(result.total);
        setPage(result.page + 1);
      }
    } catch (error) {
      console.error('Error loading:', error);
    } finally {
      setLoading(false);
      loadingRef.current = false;
      setInitialLoading(false);
    }
  }, [page, hasMore, searchTerm]);

  // Initial load and search changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setMotorcycles([]);
    loadMotorcycles(true);
  }, [searchTerm]);

  // Load more when page changes
  useEffect(() => {
    if (page > 1) {
      loadMotorcycles();
    }
  }, [page]);

  // Debounced search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (searchTimeout) clearTimeout(searchTimeout);
    
    setSearchTimeout(setTimeout(() => {
      setSearchTerm(value);
    }, 500));
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !initialLoading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    const sentinel = document.getElementById('catalog-sentinel');
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMore, loading, initialLoading]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG").format(price);
  };

  const shareOnWhatsApp = (bike) => {
    const message = `🏍️ *MOTORCYCLE INQUIRY* 🏍️\n\n🏍️ *Model:* ${bike.name}\n🏷️ *Brand:* ${bike.brand}\n💰 *Price:* ₦${formatPrice(bike.price)}\n🏪 *Shop:* ${bike.shopName}\n⭐ *Verified Shop*`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${bike.shopWhatsapp}?text=${encodedMessage}`, "_blank");
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-4 md:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Motorcycle Catalog</h1>
        <p className="text-gray-500 text-sm">
          Browse quality motorcycles from trusted vendors
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, brand, or shop..."
          onChange={handleSearchChange}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      {/* Results Count */}
      <div className="text-xs text-gray-500 mb-3">
        {total.toLocaleString()} motorcycle{total !== 1 ? "s" : ""} found
      </div>

      {/* Motorcycle Grid */}
      {motorcycles.length === 0 && !loading ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500">No motorcycles found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {motorcycles.map((bike, index) => (
            <MotorcycleCard key={bike.id} bike={bike} index={index} formatPrice={formatPrice} shareOnWhatsApp={shareOnWhatsApp} />
          ))}
        </div>
      )}

      {/* Loading More Indicator */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      )}

      {/* Intersection Observer Sentinel */}
      {!loading && hasMore && motorcycles.length > 0 && <div id="catalog-sentinel" className="h-4" />}
    </div>
  );
};

// Optimized Motorcycle Card Component
const MotorcycleCard = React.memo(({ bike, index, formatPrice, shareOnWhatsApp }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(bike.thumbnail);
  
  // Priority loading for first 8 images
  const priority = index < 8;
  
  useEffect(() => {
    if (priority && bike.thumbnail) {
      const img = new Image();
      img.src = bike.thumbnail;
      img.onload = () => setImageLoaded(true);
    }
  }, [priority, bike.thumbnail]);
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition group">
      <Link to={`/shop/${bike.vendor_id}`} className="block">
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          {!imageLoaded && priority && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
          )}
          <img
            src={bike.thumbnail}
            alt={bike.name}
            loading={priority ? 'eager' : 'lazy'}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
              imageLoaded || !priority ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = "https://placehold.co/400x300/e2e8f0/64748b?text=No+Image";
            }}
          />
        </div>
        <div className="p-3">
          <div className="flex items-start justify-between gap-1">
            <h3 className="font-semibold text-gray-800 text-sm truncate flex-1">
              {bike.name}
            </h3>
            {bike.shopVerified && (
              <FiCheckCircle className="w-3 h-3 text-blue-500 flex-shrink-0" />
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
          <div className="mt-2">
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              bike.quantity <= 3 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
            }`}>
              {bike.quantity <= 3 ? `Only ${bike.quantity} left` : "In Stock"}
            </span>
          </div>
        </div>
      </Link>
      
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
  );
});

export default CatalogPage;