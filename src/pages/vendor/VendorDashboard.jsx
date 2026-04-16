import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMotorcyclesByVendor } from "../../services/motorcycleService";
import { getReceiptsByVendor } from "../../services/receiptService";
import {
  FiPackage,
  FiAlertCircle,
  FiTrendingUp,
  FiDollarSign,
  FiPlus,
  FiPrinter,
  FiDownload,
  FiArrowRight,
  FiShoppingCart,
  FiBell,
} from "react-icons/fi";

const VendorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalMotorcycles: 0,
    lowStockItems: 0,
    soldThisMonth: 0,
    totalRevenue: 0,
  });
  const [recentSales, setRecentSales] = useState([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [lowStockBikes, setLowStockBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Get vendor's motorcycles
    const bikes = getMotorcyclesByVendor(user?.id);

    // Calculate stats
    const total = bikes.length;
    const lowStock = bikes.filter(
      (b) => b.status === "available" && b.quantity <= 3 && b.quantity > 0,
    ).length;
    const lowStockList = bikes.filter(
      (b) => b.status === "available" && b.quantity <= 3 && b.quantity > 0,
    );

    // Get sales
    const receipts = getReceiptsByVendor(user?.id);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlySales = receipts.filter((r) => {
      const saleDate = new Date(r.createdAt);
      return (
        saleDate.getMonth() === currentMonth &&
        saleDate.getFullYear() === currentYear
      );
    });

    const soldThisMonth = monthlySales.reduce(
      (sum, sale) => sum + sale.quantity,
      0,
    );
    const totalRevenue = receipts.reduce(
      (sum, sale) => sum + sale.totalPrice,
      0,
    );

    // Get recent sales (last 5)
    const recent = [...receipts]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    // Sample announcements
    const announcements = [
      {
        id: 1,
        title: "New Price List Available",
        message: "Latest prices updated",
        date: new Date().toISOString(),
        type: "price_update",
      },
      {
        id: 2,
        title: "Marketplace Update",
        message: "New features added",
        date: new Date(Date.now() - 86400000).toISOString(),
        type: "feature",
      },
    ];

    setStats({
      totalMotorcycles: total,
      lowStockItems: lowStock,
      soldThisMonth: soldThisMonth,
      totalRevenue: totalRevenue,
    });
    setRecentSales(recent);
    setRecentAnnouncements(announcements);
    setLowStockBikes(lowStockList);
    setLoading(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG").format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-NG");
  };

  const statCards = [
    {
      title: "Total Motorcycles",
      value: stats.totalMotorcycles,
      icon: <FiPackage className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "bg-emerald-100 text-emerald-600",
      link: "/vendor/motorcycles",
    },
    {
      title: "Low Stock Items",
      value: stats.lowStockItems,
      icon: <FiAlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "bg-yellow-100 text-yellow-600",
      link: "/vendor/motorcycles",
      warning: stats.lowStockItems > 0,
    },
    {
      title: "Sold This Month",
      value: stats.soldThisMonth,
      icon: <FiTrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "bg-blue-100 text-blue-600",
      link: "/vendor/sales",
    },
    {
      title: "Total Revenue",
      value: `₦${formatPrice(stats.totalRevenue)}`,
      icon: <FiDollarSign className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "bg-emerald-100 text-emerald-600",
      link: "/vendor/sales",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 text-sm">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-4 md:px-6">
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
          Welcome back, {user?.shopName || user?.name}!
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Here's what's happening with your shop today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {statCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm hover:shadow-md transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${card.color}`}>{card.icon}</div>
              {card.warning && (
                <span className="px-1.5 py-0.5 bg-red-500 text-white text-[9px] rounded-full animate-pulse">
                  !
                </span>
              )}
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

      {/* Low Stock Alert Banner */}
      {stats.lowStockItems > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 sm:p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FiAlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-yellow-800">
                Low Stock Alert
              </p>
              <p className="text-xs text-yellow-700">
                {stats.lowStockItems} motorcycle
                {stats.lowStockItems !== 1 ? "s are" : " is"} running low on
                stock.
              </p>
            </div>
          </div>
          <Link
            to="/vendor/motorcycles"
            className="text-xs text-yellow-700 hover:text-yellow-800 font-medium flex items-center gap-1"
          >
            View Inventory
            <FiArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Link
              to="/vendor/add-bike"
              className="flex flex-col items-center gap-2 p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition"
            >
              <FiPlus className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700">
                Add Bike
              </span>
            </Link>
            <Link
              to="/vendor/sales"
              className="flex flex-col items-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
            >
              <FiPrinter className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">
                New Receipt
              </span>
            </Link>
            <Link
              to="/vendor/marketplace"
              className="flex flex-col items-center gap-2 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
            >
              <FiShoppingCart className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-medium text-purple-700">
                Marketplace
              </span>
            </Link>
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800">
              Recent Updates
            </h2>
            <Link
              to="/vendor/announcements"
              className="text-xs text-emerald-600 hover:text-emerald-700"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentAnnouncements.slice(0, 3).map((announcement) => (
              <div
                key={announcement.id}
                className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0"
              >
                <div className="p-1.5 bg-emerald-50 rounded-lg">
                  <FiBell className="w-3 h-3 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800">
                    {announcement.title}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {announcement.message}
                  </p>
                  <p className="text-[9px] text-gray-400 mt-1">
                    {formatDate(announcement.date)}
                  </p>
                </div>
              </div>
            ))}
            {recentAnnouncements.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-4">
                No recent updates
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className="mt-5">
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h2 className="text-sm font-semibold text-gray-800">
              Recent Sales
            </h2>
            <Link
              to="/vendor/sales"
              className="text-xs text-emerald-600 hover:text-emerald-700"
            >
              View all sales →
            </Link>
          </div>

          {recentSales.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xs text-gray-500">No sales yet</p>
              <Link
                to="/vendor/add-bike"
                className="text-xs text-emerald-600 mt-2 inline-block"
              >
                Add your first motorcycle
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-4 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-500">
                      Item
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-500">
                      Buyer
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-right text-[10px] sm:text-xs font-medium text-gray-500">
                      Amount
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-right text-[10px] sm:text-xs font-medium text-gray-500">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-4 py-2">
                        <p className="text-xs font-medium text-gray-800 truncate max-w-[120px] sm:max-w-none">
                          {sale.motorcycleName}
                        </p>
                      </td>
                      <td className="px-3 sm:px-4 py-2">
                        <p className="text-xs text-gray-600 truncate max-w-[100px] sm:max-w-none">
                          {sale.buyerName}
                        </p>
                      </td>
                      <td className="px-3 sm:px-4 py-2 text-right">
                        <p className="text-xs font-semibold text-emerald-600">
                          ₦{formatPrice(sale.totalPrice)}
                        </p>
                      </td>
                      <td className="px-3 sm:px-4 py-2 text-right">
                        <p className="text-[10px] text-gray-500">
                          {formatDate(sale.createdAt)}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Export Button */}
      <div className="mt-5 flex justify-end">
        <button
          onClick={() => {
            alert("Export feature coming soon!");
          }}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          <FiDownload className="w-3 h-3" />
          Export Report
        </button>
      </div>
    </div>
  );
};

export default VendorDashboard;
