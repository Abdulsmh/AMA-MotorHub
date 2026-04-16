import React, { useRef } from "react";
import { FiPrinter, FiX } from "react-icons/fi";

const ReceiptPrint = ({ receipt, onClose }) => {
  const printRef = useRef();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG").format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-NG", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  if (!receipt) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Receipt</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition"
            >
              <FiPrinter className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition"
            >
              Close
            </button>
          </div>
        </div>

        {/* Receipt Content */}
        <div ref={printRef} className="p-6">
          {/* Shop Header */}
          <div className="text-center border-b border-gray-200 pb-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {receipt.shop_name || "MotorHub"}
            </h1>
            <p className="text-sm text-gray-500">
              {receipt.shop_address || "Kano, Nigeria"}
            </p>
            <p className="text-sm text-gray-500">
              Tel: {receipt.shop_phone || "N/A"}
            </p>
          </div>

          {/* Receipt Info */}
          <div className="flex justify-between mb-4 text-sm">
            <div>
              <p>
                <span className="font-semibold">Receipt No:</span>{" "}
                {receipt.receipt_number}
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {formatDate(receipt.created_at)}
              </p>
            </div>
            <div>
              <p>
                <span className="font-semibold">Sold by:</span>{" "}
                {receipt.shop_name}
              </p>
            </div>
          </div>

          {/* Buyer Info */}
          <div className="bg-gray-50 p-3 rounded-lg mb-4 text-sm">
            <p>
              <span className="font-semibold">Buyer Name:</span>{" "}
              {receipt.buyer_name}
            </p>
            <p>
              <span className="font-semibold">Buyer Phone:</span>{" "}
              {receipt.buyer_phone || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Buyer Address:</span>{" "}
              {receipt.buyer_address || "N/A"}
            </p>
          </div>

          {/* Item Details */}
          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">Item</th>
                <th className="text-center py-2">Qty</th>
                <th className="text-right py-2">Unit Price</th>
                <th className="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2">
                  {receipt.motorcycle_name}
                  <br />
                  <span className="text-xs text-gray-500">
                    {receipt.motorcycle_brand}
                  </span>
                </td>
                <td className="text-center py-2">{receipt.quantity}</td>
                <td className="text-right py-2">
                  ₦{formatPrice(receipt.unit_price)}
                </td>
                <td className="text-right py-2 font-semibold">
                  ₦{formatPrice(receipt.total_price)}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-right py-2 font-semibold">
                  Total:
                </td>
                <td className="text-right py-2 font-bold text-emerald-600">
                  ₦{formatPrice(receipt.total_price)}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Footer */}
          <div className="text-center text-xs text-gray-400 border-t border-gray-200 pt-4 mt-4">
            <p>Thank you for your purchase!</p>
            <p>This is a computer-generated receipt. No signature required.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPrint;
