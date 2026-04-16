import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Helper to get users from localStorage
const getStoredUsers = () => {
  const stored = localStorage.getItem("motorcycle_users");
  return stored ? JSON.parse(stored) : [];
};

// Helper to save users
const saveUsers = (users) => {
  localStorage.setItem("motorcycle_users", JSON.stringify(users));
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem("motorcycle_current_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      setUserType(parsedUser.type);
    }
  }, []);

  // Login function
  const login = (identifier, password) => {
    // Check for admin login
    if (identifier === "admin" && password === "ama1234") {
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

    // Check for vendor login
    const users = getStoredUsers();
    const vendor = users.find(
      (u) =>
        u.phone === identifier &&
        u.password === password &&
        u.type === "vendor",
    );

    if (vendor) {
      const vendorUser = {
        id: vendor.id,
        name: vendor.fullName,
        phone: vendor.phone,
        shopName: vendor.shopName,
        shopNumber: vendor.shopNumber,
        shopAddress: vendor.shopAddress,
        whatsapp: vendor.whatsapp,
        email: vendor.email,
        profilePicture: vendor.profilePicture || null,
        type: "vendor",
        role: "vendor",
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

    return { success: false, error: "Invalid credentials" };
  };

  // Signup function for vendors
  const signup = (userData) => {
    const users = getStoredUsers();

    // Check if phone already exists
    if (users.some((u) => u.phone === userData.phone)) {
      return { success: false, error: "Phone number already registered" };
    }

    const newUser = {
      id: `vendor_${Date.now()}`,
      ...userData,
      type: "vendor",
      verified: false,
      profilePicture: null,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    // Auto login after signup
    const vendorUser = {
      id: newUser.id,
      name: newUser.fullName,
      phone: newUser.phone,
      shopName: newUser.shopName,
      shopNumber: newUser.shopNumber,
      shopAddress: newUser.shopAddress,
      whatsapp: newUser.whatsapp,
      email: newUser.email,
      profilePicture: null,
      type: "vendor",
      role: "vendor",
    };

    localStorage.setItem("motorcycle_current_user", JSON.stringify(vendorUser));
    setUser(vendorUser);
    setIsAuthenticated(true);
    setUserType("vendor");

    return { success: true, user: vendorUser };
  };

  // Update user function - FIXED to properly update state
  const updateUser = (updatedUserData) => {
    // Update current user in state
    const newUserData = { ...user, ...updatedUserData };
    setUser(newUserData);

    // Update in localStorage for current session
    localStorage.setItem(
      "motorcycle_current_user",
      JSON.stringify(newUserData),
    );

    // Update in users array (for persistence across logins)
    const users = getStoredUsers();
    const updatedUsers = users.map((u) =>
      u.phone === newUserData.phone ? { ...u, ...updatedUserData } : u,
    );
    saveUsers(updatedUsers);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("motorcycle_current_user");
    setUser(null);
    setIsAuthenticated(false);
    setUserType(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        userType,
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
