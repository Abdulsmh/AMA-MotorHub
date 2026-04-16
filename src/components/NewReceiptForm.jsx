import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getMotorcyclesByVendor } from "../services/motorcycleService";
import { createReceipt } from "../services/receiptService";
import { updateMotorcycle } from "../services/motorcycleService";
import { FiX, FiSearch } from "react-icons/fi";

const NewReceiptForm = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [motorcycles, setMotorcycles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBike, setSelectedBike] = useState(null);
  const [formData, setFormData] = useState({
    quantity: 1,
    buyerName: "",
    buyerPhone: "",
    buyerAddress: "",
    paymentMethod: "cash",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadMotorcycles = () => {
    const bikes = getMotorcyclesByVendor(user.id);
    const availableBikes = bikes.filter(
      (b) => b.status === "available" && b.quantity > 0,
    );
    setMotorcycles(availableBikes);
  };

  useEffect(() => {
    loadMotorcycles();
  }, []);

  const filteredBikes = motorcycles.filter(
    (bike) =>
      bike.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bike.brand.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectBike = (bike) => {
    setSelectedBike(bike);
    setFormData((prev) => ({ ...prev, quantity: 1 }));
    setStep(2);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuantityChange = (e) => {
    if (!selectedBike) return;
    const qty = parseInt(e.target.value);
    if (qty <= selectedBike.quantity && qty > 0) {
      setFormData({ ...formData, quantity: qty });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedBike) {
      setMessage("Please select a motorcycle");
      return;
    }

    if (!formData.buyerName) {
      setMessage("Please enter buyer name");
      return;
    }

    setLoading(true);

    // Create receipt
    const receiptData = {
      vendorId: user.id,
      shopName: user.shopName,
      shopAddress: user.shopAddress,
      shopPhone: user.phone,
      motorcycleId: selectedBike.id,
      motorcycleName: selectedBike.name,
      motorcycleBrand: selectedBike.brand,
      quantity: formData.quantity,
      unitPrice: selectedBike.price,
      totalPrice: selectedBike.price * formData.quantity,
      buyerName: formData.buyerName,
      buyerPhone: formData.buyerPhone,
      buyerAddress: formData.buyerAddress,
      paymentMethod: formData.paymentMethod,
    };

    const receipt = createReceipt(receiptData);

    // Update motorcycle stock
    const newQuantity = selectedBike.quantity - formData.quantity;
    const newStatus = newQuantity === 0 ? "sold" : "available";
    updateMotorcycle(selectedBike.id, {
      quantity: newQuantity,
      status: newStatus,
    });

    setMessage("Receipt created successfully!");
    setTimeout(() => {
      onSuccess(receipt);
    }, 1000);
    setLoading(false);
  };

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
          <h2 className="text-lg font-semibold text-gray-800">
            {step === 1 ? "Select Motorcycle" : "Create Receipt"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {step === 1 ? (
            // Step 1: Select Motorcycle
            <div>
              <div className="relative mb-4">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or brand..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg"
                />
              </div>

              {filteredBikes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No available motorcycles. Add some first.
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredBikes.map((bike) => (
                    <button
                      key={bike.id}
                      onClick={() => selectBike(bike)}
                      className="w-full text-left p-3 border border-gray-100 rounded-lg hover:bg-emerald-50 transition flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {bike.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {bike.brand} | Stock: {bike.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">
                          ₦{new Intl.NumberFormat("en-NG").format(bike.price)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Step 2: Buyer Details & Receipt
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selected Bike Info */}
              <div className="bg-emerald-50 p-3 rounded-lg">
                <p className="text-sm font-semibold">{selectedBike?.name}</p>
                <p className="text-xs text-gray-600">
                  Brand: {selectedBike?.brand}
                </p>
                <div className="flex justify-between mt-1">
                  <p className="text-sm font-bold text-emerald-600">
                    ₦
                    {new Intl.NumberFormat("en-NG").format(
                      selectedBike?.price || 0,
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    Available: {selectedBike?.quantity || 0}
                  </p>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  max={selectedBike?.quantity || 1}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                />
              </div>

              {/* Buyer Name */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Buyer Name *
                </label>
                <input
                  type="text"
                  name="buyerName"
                  value={formData.buyerName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                  required
                />
              </div>

              {/* Buyer Phone */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Buyer Phone
                </label>
                <input
                  type="tel"
                  name="buyerPhone"
                  value={formData.buyerPhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                />
              </div>

              {/* Buyer Address */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Buyer Address
                </label>
                <textarea
                  name="buyerAddress"
                  value={formData.buyerAddress}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                >
                  <option value="cash">Cash</option>
                  <option value="transfer">Bank Transfer</option>
                  <option value="card">Card Payment</option>
                </select>
              </div>

              {/* Total */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="font-bold text-emerald-600">
                    ₦
                    {new Intl.NumberFormat("en-NG").format(
                      (selectedBike?.price || 0) * formData.quantity,
                    )}
                  </span>
                </div>
              </div>

              {message && (
                <div
                  className={`p-2 rounded-lg text-sm ${message.includes("success") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
                >
                  {message}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Generate Receipt"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewReceiptForm;
