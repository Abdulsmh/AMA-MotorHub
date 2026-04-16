import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { addMotorcycle } from "../../services/motorcycleService";
import {
  FiPlus,
  FiTrash2,
  FiImage,
  FiX,
  FiChevronRight,
  FiChevronLeft,
} from "react-icons/fi";

const AddMotorcycle = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    quantity: 1,
    colors: [{ name: "", quantity: 1 }],
    description: "",
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Color management functions
  const handleColorNameChange = (index, value) => {
    const newColors = [...formData.colors];
    newColors[index].name = value;
    setFormData({ ...formData, colors: newColors });
  };

  const handleColorQuantityChange = (index, value) => {
    const newColors = [...formData.colors];
    newColors[index].quantity = parseInt(value) || 1;
    setFormData({ ...formData, colors: newColors });
  };

  const addColor = () => {
    setFormData({
      ...formData,
      colors: [...formData.colors, { name: "", quantity: 1 }],
    });
  };

  const removeColor = (index) => {
    if (formData.colors.length === 1) {
      setMessage("You need at least one color");
      return;
    }
    const newColors = formData.colors.filter((_, i) => i !== index);
    setFormData({ ...formData, colors: newColors });
    setMessage("");
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...formData.images];
    const newPreviews = [...imagePreviews];

    for (const file of files) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage("Image must be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result);
        newPreviews.push(reader.result);
        setFormData({ ...formData, images: newImages });
        setImagePreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    setImagePreviews(newPreviews);
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.name || !formData.brand || !formData.price) {
        setMessage("Please fill in all required fields");
        return false;
      }
      if (parseInt(formData.price) <= 0) {
        setMessage("Price must be greater than 0");
        return false;
      }
    }
    if (currentStep === 2) {
      if (formData.images.length === 0) {
        setMessage("Please add at least one image");
        return false;
      }
    }
    if (currentStep === 3) {
      const validColors = formData.colors.filter((c) => c.name.trim() !== "");
      if (validColors.length === 0) {
        setMessage("Please add at least one color with a name");
        return false;
      }
    }
    setMessage("");
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setMessage("");
  };
const handleSubmit = (e) => {
  e.preventDefault();
  if (!validateStep()) return;

  // Debug: Check user data
  console.log("Current user from AuthContext:", user);
  console.log("User ID being used for motorcycle:", user?.id);
  
  if (!user || !user.id) {
    setMessage("Error: You must be logged in to add a motorcycle");
    setLoading(false);
    return;
  }

  // Filter out empty color names
  const validColors = formData.colors.filter((c) => c.name.trim() !== "");
  if (validColors.length === 0) {
    setMessage("Please add at least one color with a name");
    return;
  }

  const finalData = {
    ...formData,
    colors: validColors,
    price: parseInt(formData.price),
    quantity: parseInt(formData.quantity),
  };

  setLoading(true);
  setMessage("");

  addMotorcycle(finalData, user.id, user.shopName);
    setMessage("Motorcycle added successfully!");
    setTimeout(() => {
      navigate("/vendor/motorcycles");
    }, 1500);
    setLoading(false);
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat("en-NG").format(value);
  };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4">
      <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-5">
        Add New Motorcycle
      </h1>

      {/* Step Indicator */}
      <div className="flex mb-6">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex-1 text-center">
            <div
              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step}
            </div>
            <p className="text-xs text-gray-500 mt-1 hidden sm:block">
              {step === 1
                ? "Basic Info"
                : step === 2
                  ? "Images"
                  : "Colors & Details"}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Motorcycle Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
                placeholder="e.g., Haojue HJ150"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Brand *
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                placeholder="e.g., Haojue, Honda, Lifan"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Price (₦) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                  placeholder="850000"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Total Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                  placeholder="5"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Images */}
        {currentStep === 2 && (
          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-3">
              Motorcycle Images
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 transition">
                <FiImage className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-400 mt-1">Add</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-gray-400">
              Upload up to 5 images (max 2MB each)
            </p>
          </div>
        )}

        {/* Step 3: Colors & Description */}
        {currentStep === 3 && (
          <div className="space-y-5">
            {/* Colors Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-semibold text-gray-800">
                  Available Colors
                </h2>
                <button
                  type="button"
                  onClick={addColor}
                  className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700"
                >
                  <FiPlus className="w-3 h-3" />
                  Add Color
                </button>
              </div>

              <div className="space-y-3">
                {formData.colors.map((color, index) => (
                  <div
                    key={index}
                    className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg"
                  >
                    <input
                      type="text"
                      placeholder="Color name"
                      value={color.name}
                      onChange={(e) =>
                        handleColorNameChange(index, e.target.value)
                      }
                      className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={color.quantity}
                      onChange={(e) =>
                        handleColorQuantityChange(index, e.target.value)
                      }
                      className="w-20 px-2 py-2 text-sm border border-gray-200 rounded-lg"
                      min="0"
                    />
                    {formData.colors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeColor(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Remove color"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Each color will have its own stock quantity
              </p>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6">
              <h2 className="text-sm font-semibold text-gray-800 mb-3">
                Description
              </h2>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
                placeholder="Describe the motorcycle condition, features, mileage, etc."
              />
            </div>
          </div>
        )}

        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${message.includes("success") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
          >
            {message}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              <FiChevronLeft className="w-4 h-4 inline mr-1" />
              Back
            </button>
          )}
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
            >
              Next
              <FiChevronRight className="w-4 h-4 inline ml-1" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Motorcycle"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddMotorcycle;
