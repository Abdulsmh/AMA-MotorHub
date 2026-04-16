import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiPackage,
  FiDollarSign,
  FiTrendingUp,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiArrowRight,
} from "react-icons/fi";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalVendors: 0,
    totalMotorcycles: 0,
    totalSales: 0,
    totalRevenue: 0,
    pendingVendors: 0,
    lowStockItems: 0,
  });
  const [recentVendors, setRecentVendors] = useState([]);
  const [recentMotorcycles, setRecentMotorcycles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Get vendors from localStorage
    const users = JSON.parse(localStorage.getItem("motorcycle_users") || "[]");
    const vendors = users.filter((u) => u.type === "vendor");
    const pendingVendors = vendors.filter((v) => !v.verified);

    // Get motorcycles from localStorage
    const motorcycles = JSON.parse(
      localStorage.getItem("motorcycle_marketplace") || "[]",
    );
    const lowStock = motorcycles.filter(
      (m) => m.status === "available" && m.quantity <= 3,
    );

    // Get receipts
    const receipts = JSON.parse(
      localStorage.getItem("motorcycle_receipts") || "[]",
    );
    const totalRevenue = receipts.reduce((sum, r) => sum + r.totalPrice, 0);

    // Recent vendors (last 5)
    const recentVendorsList = [...vendors]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    // Recent motorcycles (last 5)
    const recentMotorcyclesList = [...motorcycles]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    setStats({
      totalVendors: vendors.length,
      totalMotorcycles: motorcycles.length,
      totalSales: receipts.length,
      totalRevenue: totalRevenue,
      pendingVendors: pendingVendors.length,
      lowStockItems: lowStock.length,
    });
    setRecentVendors(recentVendorsList);
    setRecentMotorcycles(recentMotorcyclesList);
    setLoading(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG").format(price);
  };

  const statCards = [
    {
      title: "Total Vendors",
      value: stats.totalVendors,
      icon: <FiUsers className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "bg-blue-100 text-blue-600",
      link: "/admin/vendors",
    },
    {
      title: "Motorcycles",
      value: stats.totalMotorcycles,
      icon: <FiPackage className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "bg-emerald-100 text-emerald-600",
      link: "/admin/motorcycles",
    },
    {
      title: "Total Sales",
      value: stats.totalSales,
      icon: <FiTrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "bg-purple-100 text-purple-600",
      link: "/admin/receipts",
    },
    {
      title: "Revenue",
      value: `NGN ${formatPrice(stats.totalRevenue)}`,
      icon: <span className="text-xs font-semibold">NGN</span>,
      color: "bg-yellow-100 text-yellow-600",
      link: "/admin/receipts",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-4 md:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Overview of your marketplace
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {statCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm hover:shadow-md transition"
          >
            <div className={`p-2 rounded-lg ${card.color} w-fit mb-2`}>
              {card.icon}
            </div>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
              {card.value}
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
              {card.title}
            </p>
          </Link>
        ))}
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
        {stats.pendingVendors > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 sm:p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FiClock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-yellow-800">
                  Pending Vendors
                </p>
                <p className="text-xs text-yellow-700">
                  {stats.pendingVendors} vendors need verification
                </p>
              </div>
            </div>
            <Link
              to="/admin/vendors"
              className="text-xs text-yellow-700 hover:text-yellow-800"
            >
              Review →
            </Link>
          </div>
        )}

        {stats.lowStockItems > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <FiAlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-red-800">
                  Low Stock Alert
                </p>
                <p className="text-xs text-red-700">
                  {stats.lowStockItems} items running low
                </p>
              </div>
            </div>
            <Link
              to="/admin/motorcycles"
              className="text-xs text-red-700 hover:text-red-800"
            >
              View →
            </Link>
          </div>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Vendors */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-gray-800">
              Recent Vendors
            </h2>
            <Link
              to="/admin/vendors"
              className="text-xs text-emerald-600 hover:text-emerald-700"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentVendors.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No vendors yet
              </div>
            ) : (
              recentVendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="px-4 py-3 flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {vendor.shopName}
                    </p>
                    <p className="text-xs text-gray-500">{vendor.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!vendor.verified && (
                      <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] rounded-full">
                        Pending
                      </span>
                    )}
                    <Link
                      to={`/admin/vendors?view=${vendor.id}`}
                      className="text-xs text-emerald-600"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Motorcycles */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-gray-800">
              Recent Motorcycles
            </h2>
            <Link
              to="/admin/motorcycles"
              className="text-xs text-emerald-600 hover:text-emerald-700"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentMotorcycles.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No motorcycles yet
              </div>
            ) : (
              recentMotorcycles.map((bike) => (
                <div
                  key={bike.id}
                  className="px-4 py-3 flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {bike.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {bike.shopName} • ₦{formatPrice(bike.price)}
                    </p>
                  </div>
                  <Link
                    to={`/admin/motorcycles?view=${bike.id}`}
                    className="text-xs text-emerald-600"
                  >
                    View
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-5 bg-white rounded-xl border border-gray-100 p-4">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/admin/announcements/new"
            className="flex flex-col items-center gap-2 p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition"
          >
            <span className="text-lg">📢</span>
            <span className="text-xs font-medium text-emerald-700">
              Post Announcement
            </span>
          </Link>
          <Link
            to="/admin/vendors"
            className="flex flex-col items-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
          >
            <span className="text-lg">👥</span>
            <span className="text-xs font-medium text-blue-700">
              Verify Vendors
            </span>
          </Link>
          <Link
            to="/admin/motorcycles"
            className="flex flex-col items-center gap-2 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
          >
            <span className="text-lg">🏍️</span>
            <span className="text-xs font-medium text-purple-700">
              Manage Bikes
            </span>
          </Link>
          <Link
            to="/admin/settings"
            className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <span className="text-lg">⚙️</span>
            <span className="text-xs font-medium text-gray-700">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
