import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { getUserByPhone, createVendor } from "../services/userService";
import bcrypt from "bcryptjs";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "ama1234";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("motorcycle_current_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        setUserType(parsedUser.type);
      } catch (e) {
        console.error("Error parsing stored user:", e);
        localStorage.removeItem("motorcycle_current_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    console.log("Login attempt for:", identifier);

    // Admin login
    if (identifier === "admin" && password === ADMIN_PASSWORD) {
      console.log("Admin login successful");
      const adminUser = {
        id: "admin-1",
        name: "Administrator",
        type: "admin",
        role: "admin",
      };
      localStorage.setItem(
        "motorcycle_current_user",
        JSON.stringify(adminUser),
      );
      setUser(adminUser);
      setIsAuthenticated(true);
      setUserType("admin");
      return { success: true, user: adminUser };
    }

    // Vendor login
    if (supabase) {
      try {
        const vendor = await getUserByPhone(identifier);
        if (vendor && vendor.type === "vendor") {
          // Check if vendor is verified
          if (!vendor.verified) {
            return {
              success: false,
              error:
                "Your account is pending verification. Please wait for admin approval.",
            };
          }

          const isPasswordValid = bcrypt.compareSync(password, vendor.password);
          if (isPasswordValid) {
            const vendorUser = {
              id: vendor.id,
              name: vendor.full_name,
              phone: vendor.phone,
              shopName: vendor.shop_name,
              shopNumber: vendor.shop_number,
              shopAddress: vendor.shop_address,
              whatsapp: vendor.whatsapp,
              email: vendor.email,
              profilePicture: vendor.profile_picture,
              market: vendor.market,
              marketIdCard: vendor.market_id_card,
              type: "vendor",
              role: "vendor",
              verified: vendor.verified,
            };
            localStorage.setItem(
              "motorcycle_current_user",
              JSON.stringify(vendorUser),
            );
            setUser(vendorUser);
            setIsAuthenticated(true);
            setUserType("vendor");
            return { success: true, user: vendorUser };
          }
        }
      } catch (error) {
        console.error("Vendor login error:", error);
      }
    }

    return { success: false, error: "Invalid credentials" };
  };

  const signup = async (userData) => {
    if (!supabase) {
      return {
        success: false,
        error: "Supabase not configured. Please contact admin.",
      };
    }

    try {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(userData.password, salt);

      const newUser = await createVendor({
        ...userData,
        password: hashedPassword,
        verified: false, // Explicitly unverified
      });

      // Don't auto-login - return success without user
      return {
        success: true,
        user: null,
        message: "Registration successful! Please wait for admin verification.",
      };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("motorcycle_current_user");
    setUser(null);
    setIsAuthenticated(false);
    setUserType(null);
  };

  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    setUser(newUserData);
    localStorage.setItem(
      "motorcycle_current_user",
      JSON.stringify(newUserData),
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        userType,
        loading,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
