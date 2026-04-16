import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiHome,
  FiPackage,
  FiInfo,
  FiPhone,
  FiLogIn,
  FiUserPlus,
} from "react-icons/fi";

const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: <FiHome className="w-4 h-4" /> },
    {
      path: "/catalog",
      label: "Catalog",
      icon: <FiPackage className="w-4 h-4" />,
    },
    { path: "/about", label: "About", icon: <FiInfo className="w-4 h-4" /> },
    {
      path: "/contact",
      label: "Contact",
      icon: <FiPhone className="w-4 h-4" />,
    },
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=40&h=40&fit=crop"
              alt="AMA MotorHub"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="font-bold text-gray-800 text-lg">AMA MotorHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-300
                  ${
                    isActive(item.path)
                      ? "text-emerald-600"
                      : "text-gray-600 hover:text-emerald-600"
                  }
                  group
                `}
              >
                {item.icon}
                <span>{item.label}</span>
                {/* Underline effect on hover */}
                <span
                  className={`
                  absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 transition-transform duration-300 scale-x-0 group-hover:scale-x-100
                  ${isActive(item.path) ? "scale-x-100" : ""}
                `}
                />
              </Link>
            ))}
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
              <Link
                to="/login"
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition"
              >
                <FiLogIn className="w-4 h-4" />
                Login
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                <FiUserPlus className="w-4 h-4" />
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {isOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
                  ${
                    isActive(item.path)
                      ? "bg-emerald-50 text-emerald-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-3 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
              >
                <FiLogIn className="w-4 h-4" />
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                <FiUserPlus className="w-4 h-4" />
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default PublicNavbar;
