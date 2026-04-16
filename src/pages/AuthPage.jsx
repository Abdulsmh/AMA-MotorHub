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
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (isLogin) {
      // FIXED: Added await here
      const result = await login(formData.identifier, formData.password);
      console.log("Login result:", result);

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
      const result = await signup({
        fullName: formData.fullName,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        shopName: formData.shopName,
        shopNumber: formData.shopNumber,
        shopAddress: formData.shopAddress,
        email: formData.email,
        password: formData.password,
      });
      if (result.success) {
        navigate("/");
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
            <div className="space-y-2 max-h-[400px] overflow-y-auto px-1">
              <input
                name="fullName"
                placeholder="Full name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg"
              />
              <input
                name="phone"
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg"
              />
              <input
                name="whatsapp"
                placeholder="WhatsApp number"
                value={formData.whatsapp}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg"
              />
              <input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg"
              />
              <input
                name="shopName"
                placeholder="Shop name"
                value={formData.shopName}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg"
              />
              <input
                name="shopNumber"
                placeholder="Shop number"
                value={formData.shopNumber}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg"
              />
              <textarea
                name="shopAddress"
                placeholder="Shop address"
                value={formData.shopAddress}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg"
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-xs">
              {error}
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
            Your shop will be verified by admin
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
