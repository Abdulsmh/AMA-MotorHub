import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";

// Customer Pages
import ShopPage from "./pages/ShopPage";
import CatalogPage from "./pages/CatalogPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminVendors from "./pages/admin/AdminVendors";
import AdminMotorcycles from "./pages/admin/AdminMotorcycles";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminReceipts from "./pages/admin/AdminReceipts";
import AdminSettings from "./pages/admin/AdminSettings";

// Vendor Pages
import MyMotorcycles from "./pages/vendor/MyMotorcycles";
import AddMotorcycle from "./pages/vendor/AddMotorcycle";
import Marketplace from "./pages/vendor/Marketplace";
import PriceList from "./pages/vendor/PriceList";
import Sales from "./pages/vendor/Sales";
import Announcements from "./pages/vendor/Announcements";
import VendorSettings from "./pages/vendor/VendorSettings";
import VendorDashboard from "./pages/vendor/VendorDashboard";

import TestDb from "./pages/TestDb";
import DebugDb from "./pages/DebugDb";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <MainLayout>
          <Routes>
            // Add route
            <Route path="/test-db" element={<TestDb />} />;
            <Route path="/debug" element={<DebugDb />} />;
            
            
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
            {/* Customer Routes */}
            <Route path="/shop/:vendorId" element={<ShopPage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/motorcycles" element={<AdminMotorcycles />} />
            <Route path="/admin/vendors" element={<AdminVendors />} />
            <Route
              path="/admin/announcements"
              element={<AdminAnnouncements />}
            />
            <Route path="/admin/receipts" element={<AdminReceipts />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            {/* Vendor Routes */}
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            <Route path="/vendor/motorcycles" element={<MyMotorcycles />} />
            <Route path="/vendor/add-bike" element={<AddMotorcycle />} />
            <Route path="/vendor/marketplace" element={<Marketplace />} />
            <Route path="/vendor/prices" element={<PriceList />} />
            <Route path="/vendor/sales" element={<Sales />} />
            <Route path="/vendor/announcements" element={<Announcements />} />
            <Route path="/vendor/settings" element={<VendorSettings />} />
            {/* Fallback Route */}
            <Route
              path="*"
              element={
                <div className="text-center py-20 text-gray-500">
                  Page Not Found
                </div>
              }
            />
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
