import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import PublicNavbar from "./PublicNavbar";
import Footer from "./Footer";
import { useAuth } from "../../context/AuthContext";

const MainLayout = ({ children }) => {
  const { isAuthenticated, userType } = useAuth();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const showSidebar = isAuthenticated;
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {showSidebar && <Sidebar />}
      {!showSidebar && !isAuthPage && <PublicNavbar />}

      <div className={`flex-1 flex flex-col ${showSidebar ? "md:ml-64" : ""}`}>
        <main className={`flex-1 ${isAuthPage ? "p-4" : "p-4 md:p-6"}`}>
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>

        {!isAuthPage && <Footer />}
      </div>
    </div>
  );
};

export default MainLayout;
