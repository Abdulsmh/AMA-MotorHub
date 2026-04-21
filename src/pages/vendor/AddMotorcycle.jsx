import React, { useState, useCallback, useMemo } from "react";
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
  FiUpload,
} from "react-icons/fi";

const AddMotorcycle = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    quantity: 1,
    colors: [{ name: "", quantity: 1 }],
    description: "",
    images: [], // Will store File objects, not base64!
  });
  const [imagePreviews, setImagePreviews] = useState([]);

  // Track upload status per image
  const [imageUploadStatus, setImageUploadStatus] = useState({});

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

  // OPTIMIZED: Compress image before preview
  const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            file.type,
            quality,
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    // Limit to 5 images
    if (formData.images.length + files.length > 5) {
      setMessage("Maximum 5 images allowed");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      for (const file of files) {
        // Check file size (5MB max for original, will be compressed)
        if (file.size > 5 * 1024 * 1024) {
          setMessage(`Image ${file.name} is larger than 5MB`);
          continue;
        }

        // Compress image
        const compressedFile = await compressImage(file, 1200, 0.7);

        // Create preview (still uses base64 for preview only, not storage!)
        const preview = URL.createObjectURL(compressedFile);

        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, compressedFile],
        }));
        setImagePreviews((prev) => [...prev, preview]);
      }
    } catch (error) {
      setMessage("Error processing images: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    setUploadProgress(10);

    try {
      setUploadProgress(30);

      // Pass the actual File objects - your service should handle Supabase upload
      const result = await addMotorcycle(
        finalData,
        user.id,
        user.shopName || "Unknown Shop",
        formData.images[0], // Main image file
        formData.images, // All image files
      );

      setUploadProgress(100);

      if (result && result.success) {
        setMessage("Motorcycle added successfully!");

        // Clean up object URLs
        imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));

        setTimeout(() => navigate("/vendor/motorcycles"), 1500);
      } else {
        throw new Error(result?.error || "Failed to add motorcycle");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  // Cleanup object URLs on unmount
  React.useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4">
      <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-5">
        Add New Motorcycle
      </h1>

      {/* Progress Bar */}
      {loading && uploadProgress > 0 && (
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium text-emerald-700">
              {uploadProgress === 100
                ? "Finalizing..."
                : "Uploading to Market..."}
            </span>
            <span className="text-xs font-medium text-emerald-700">
              {uploadProgress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

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
                <div key={index} className="relative aspect-square group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border border-gray-200"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 text-xs bg-black bg-opacity-50 text-white px-1 rounded">
                      Main
                    </span>
                  )}
                </div>
              ))}
              {formData.images.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 transition group">
                  <FiUpload className="w-6 h-6 text-gray-400 group-hover:text-emerald-500" />
                  <span className="text-xs text-gray-400 mt-1">Upload</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-400">
              {formData.images.length}/5 images • Max 5MB each • JPG, PNG, WebP
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
            className={`p-3 rounded-lg text-sm ${
              message.includes("success")
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            }`}
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
              disabled={loading}
              className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
            >
              <FiChevronLeft className="w-4 h-4 inline mr-1" />
              Back
            </button>
          )}
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={loading}
              className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-50"
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
              {loading ? "Processing..." : "Confirm & Post to Hub"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddMotorcycle;
