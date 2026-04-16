import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import {
  FiUser,
  FiBriefcase,
  FiMapPin,
  FiPhone,
  FiMail,
  FiSave,
  FiCamera,
  FiX,
} from "react-icons/fi";

const VendorSettings = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    shopName: user?.shopName || "",
    shopNumber: user?.shopNumber || "",
    shopAddress: user?.shopAddress || "",
    phone: user?.phone || "",
    whatsapp: user?.whatsapp || "",
    email: user?.email || "",
    fullName: user?.name || "",
  });
  const [profilePicture, setProfilePicture] = useState(
    user?.profilePicture || null,
  );
  const [profilePreview, setProfilePreview] = useState(
    user?.profilePicture || null,
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage("Image must be less than 2MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setMessage("Please upload an image file");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePicture = () => {
    setProfilePreview(null);
    setProfilePicture(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Update user in Supabase
      const { error } = await supabase
        .from("users")
        .update({
          full_name: formData.fullName,
          phone: formData.phone,
          whatsapp: formData.whatsapp,
          email: formData.email,
          shop_name: formData.shopName,
          shop_number: formData.shopNumber,
          shop_address: formData.shopAddress,
          profile_picture: profilePicture,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      // Update local user state
      const updatedUser = {
        ...user,
        ...formData,
        profilePicture,
        name: formData.fullName,
      };
      updateUser(updatedUser);

      setMessage("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage("Error saving settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6">
      <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-5">
        Shop Settings
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Profile Picture */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">
            Profile Picture
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser className="w-10 h-10 text-gray-400" />
                )}
              </div>
              {profilePreview && (
                <button
                  type="button"
                  onClick={removeProfilePicture}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <FiX className="w-3 h-3" />
                </button>
              )}
            </div>
            <div>
              <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition">
                <FiCamera className="w-4 h-4" /> Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 2MB</p>
            </div>
          </div>
        </div>

        {/* Shop Information */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">
            Shop Information
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Shop Name
              </label>
              <input
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Shop Number
              </label>
              <input
                type="text"
                name="shopNumber"
                value={formData.shopNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Shop Address
              </label>
              <textarea
                name="shopAddress"
                value={formData.shopAddress}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">
            Contact Information
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Owner Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                WhatsApp Number
              </label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
              />
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${message.includes("success") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-50"
        >
          <FiSave className="w-4 h-4" />
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
};

export default VendorSettings;
