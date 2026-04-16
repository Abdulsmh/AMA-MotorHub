import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiLock,
  FiUser,
  FiPhone,
  FiMail,
  FiBriefcase,
  FiMapPin,
  FiMessageCircle,
  FiUpload,
  FiFile,
} from "react-icons/fi";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    fullName: "",
    phone: "",
    whatsapp: "",
    shopName: "",
    shopNumber: "",
    shopAddress: "",
    email: "",
    market: "fagge", // fagge, wapa, sabongari, france_road
    marketIdCard: null,
    confirmPassword: "",
  });
  const [idCardPreview, setIdCardPreview] = useState(null);
  const [error, setError] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const markets = [
    { value: "fagge", label: "Fagge Market" },
    { value: "wapa", label: "Wapa Market" },
    { value: "sabongari", label: "Sabongari Market" },
    { value: "france_road", label: "France Road Market" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setVerificationMessage("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("File must be less than 2MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdCardPreview(reader.result);
        setFormData({ ...formData, marketIdCard: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setVerificationMessage("");

    if (isLogin) {
      const result = await login(formData.identifier, formData.password);
      if (result.success) {
        navigate("/");
      } else {
        setError(result.error || "Invalid credentials");
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }
      if (!formData.marketIdCard) {
        setError("Please upload your market ID card");
        setLoading(false);
        return;
      }

      const result = await signup({
        fullName: formData.fullName,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        shopName: formData.shopName,
        shopNumber: formData.shopNumber,
        shopAddress: formData.shopAddress,
        email: formData.email,
        market: formData.market,
        marketIdCard: formData.marketIdCard,
        password: formData.password,
      });

      if (result.success) {
        setVerificationMessage(
          "Registration successful! Please wait for admin verification before you can login.",
        );
        // Clear form
        setFormData({
          ...formData,
          fullName: "",
          phone: "",
          whatsapp: "",
          shopName: "",
          shopNumber: "",
          shopAddress: "",
          email: "",
          market: "fagge",
          marketIdCard: null,
          password: "",
          confirmPassword: "",
        });
        setIdCardPreview(null);
      } else {
        setError(result.error || "Signup failed");
      }
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <div className="text-center mb-5 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {isLogin ? "Login to your account" : "Join as a vendor"}
          </p>
        </div>

        <div className="flex gap-2 mb-5 sm:mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${isLogin ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600"}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${!isLogin ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600"}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {isLogin ? (
            <>
              <input
                type="text"
                name="identifier"
                placeholder="Phone number or 'admin'"
                value={formData.identifier}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
              />
            </>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto px-1">
              <input
                name="fullName"
                placeholder="Full name *"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg"
                required
              />
              <input
                name="phone"
                placeholder="Phone number *"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg"
                required
              />
              <input
                name="whatsapp"
                placeholder="WhatsApp number *"
                value={formData.whatsapp}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg"
                required
              />
              <input
                name="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg"
                required
              />
              <input
                name="shopName"
                placeholder="Shop name *"
                value={formData.shopName}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg"
                required
              />
              <input
                name="shopNumber"
                placeholder="Shop number *"
                value={formData.shopNumber}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg"
                required
              />
              <textarea
                name="shopAddress"
                placeholder="Shop address *"
                value={formData.shopAddress}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg"
                required
              />

              {/* Market Selection */}
              <select
                name="market"
                value={formData.market}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg"
                required
              >
                {markets.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>

              {/* Market ID Card Upload */}
              <div className="border border-gray-200 rounded-lg p-3">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Market ID Card / Document *
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition">
                    <FiUpload className="w-4 h-4" />
                    Upload Document
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {idCardPreview && (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <FiFile className="w-3 h-3" /> Document uploaded
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Upload your market ID card or shop registration document (max
                  2MB)
                </p>
              </div>

              <input
                type="password"
                name="password"
                placeholder="Password *"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password *"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg"
                required
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-xs">
              {error}
            </div>
          )}

          {verificationMessage && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-2 rounded-lg text-xs">
              {verificationMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        {!isLogin && (
          <p className="text-xs text-gray-400 text-center mt-4">
            Your application will be reviewed by admin. You'll receive a
            verification email once approved.
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
