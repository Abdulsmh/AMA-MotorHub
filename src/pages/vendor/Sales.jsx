import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getReceiptsByVendor } from "../../services/receiptService";
import NewReceiptForm from "../../components/NewReceiptForm";
import ReceiptPrint from "../../components/ReceiptPrint";
import { FiSearch, FiPrinter, FiPlus, FiEye } from "react-icons/fi";

const Sales = () => {
  const { user } = useAuth();
  const [sales, setSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewReceipt, setShowNewReceipt] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState(null);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = () => {
    const receipts = getReceiptsByVendor(user.id);
    setSales(receipts);
  };

  const filteredSales = sales.filter(
    (s) =>
      s.motorcycleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG").format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-NG", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleReceiptSuccess = (receipt) => {
    setShowNewReceipt(false);
    loadSales();
    setViewingReceipt(receipt);
  };

  return (
    <div className="px-3 sm:px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
        <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
          Sales History
        </h1>
        <button
          onClick={() => setShowNewReceipt(true)}
          className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition"
        >
          <FiPlus className="w-4 h-4" />
          New Receipt
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <input
          type="text"
          placeholder="Search by bike, buyer, or receipt..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      {/* Results Count */}
      <div className="text-xs text-gray-500 mb-3">
        {filteredSales.length} sale{filteredSales.length !== 1 ? "s" : ""} found
      </div>

      {filteredSales.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <FiSearch className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No sales records found</p>
          <button
            onClick={() => setShowNewReceipt(true)}
            className="mt-3 text-emerald-600 hover:text-emerald-700 text-sm"
          >
            Create your first receipt
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredSales.map((sale) => (
            <div
              key={sale.id}
              className="bg-white rounded-lg border border-gray-100 p-3 sm:p-4"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                {/* Left - Sale Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                    {sale.motorcycleName}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="font-medium">Buyer:</span> {sale.buyerName}
                  </p>
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Phone:</span>{" "}
                    {sale.buyerPhone || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Receipt:</span>{" "}
                    {sale.receiptNumber}
                  </p>
                </div>

                {/* Right - Price & Actions */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-3">
                  <div className="text-right">
                    <p className="text-[10px] sm:text-xs text-gray-400">
                      Total Amount
                    </p>
                    <p className="text-base sm:text-lg font-bold text-emerald-600">
                      ₦{formatPrice(sale.totalPrice)}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Qty: {sale.quantity}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewingReceipt(sale)}
                      className="flex items-center gap-1 px-2 py-1.5 text-xs text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition"
                    >
                      <FiEye className="w-3 h-3" />
                      <span className="hidden sm:inline">View</span>
                    </button>
                    <button
                      onClick={() => setViewingReceipt(sale)}
                      className="flex items-center gap-1 px-2 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                      <FiPrinter className="w-3 h-3" />
                      <span className="hidden sm:inline">Print</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="mt-2 pt-2 border-t border-gray-100">
                <p className="text-[10px] text-gray-400">
                  Sold on: {formatDate(sale.createdAt)}
                </p>
                <p className="text-[10px] text-gray-400">
                  Payment: {sale.paymentMethod || "cash"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Receipt Modal */}
      {showNewReceipt && (
        <NewReceiptForm
          onClose={() => setShowNewReceipt(false)}
          onSuccess={handleReceiptSuccess}
        />
      )}

      {/* View Receipt Modal */}
      {viewingReceipt && (
        <ReceiptPrint
          receipt={viewingReceipt}
          onClose={() => setViewingReceipt(null)}
        />
      )}
    </div>
  );
};

export default Sales;
