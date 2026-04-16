import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiHome,
  FiPackage,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiUser,
  FiPlusCircle,
  FiBell,
  FiCreditCard,
} from "react-icons/fi";

const Sidebar = () => {
  const { user, userType, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  const getNavItems = () => {
    if (userType === "admin") {
      return [
        {
          path: "/admin/dashboard",
          label: "Dashboard",
          icon: <FiHome className="w-4 h-4" />,
        },
        {
          path: "/admin/motorcycles",
          label: "Motorcycles",
          icon: <FiPackage className="w-4 h-4" />,
        },
        {
          path: "/admin/vendors",
          label: "Vendors",
          icon: <FiUsers className="w-4 h-4" />,
        },
        {
          path: "/admin/announcements",
          label: "Announcements",
          icon: <FiBell className="w-4 h-4" />,
        },
        {
          path: "/admin/receipts",
          label: "Receipts",
          icon: <FiCreditCard className="w-4 h-4" />,
        },
        {
          path: "/admin/settings",
          label: "Settings",
          icon: <FiSettings className="w-4 h-4" />,
        },
      ];
    }

    if (userType === "vendor") {
      return [
        {
          path: "/vendor/dashboard",
          label: "Dashboard",
          icon: <FiHome className="w-4 h-4" />,
        },
        {
          path: "/vendor/motorcycles",
          label: "My Bikes",
          icon: <FiPackage className="w-4 h-4" />,
        },
        {
          path: "/vendor/marketplace",
          label: "Marketplace",
          icon: <FiUsers className="w-4 h-4" />,
        },
        {
          path: "/vendor/prices",
          label: "Price List",
          icon: <FiCreditCard className="w-4 h-4" />,
        },
        {
          path: "/vendor/sales",
          label: "Sales",
          icon: <FiCreditCard className="w-4 h-4" />,
        },
        {
          path: "/vendor/announcements",
          label: "Updates",
          icon: <FiBell className="w-4 h-4" />,
        },
        {
          path: "/vendor/settings",
          label: "Settings",
          icon: <FiSettings className="w-4 h-4" />,
        },
      ];
    }

    return [
      {
        path: "/catalog",
        label: "Browse",
        icon: <FiPackage className="w-4 h-4" />,
      },
      { path: "/about", label: "About", icon: <FiUsers className="w-4 h-4" /> },
      {
        path: "/contact",
        label: "Contact",
        icon: <FiSettings className="w-4 h-4" />,
      },
    ];
  };

  const navItems = getNavItems();
  const isCustomer = !userType && location.pathname !== "/";
  const logoImageUrl =
    "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=50&h=50&fit=crop";

  if (!userType && location.pathname === "/") return null;

  return (
    <>
      {!isOpen && (
        <div className="md:hidden fixed top-4 left-4 z-50">
          <Link to="/" onClick={() => setIsOpen(false)}>
            <img
              src={logoImageUrl}
              alt="MotorHub"
              className="w-10 h-10 rounded-lg object-cover shadow-md border border-gray-100"
              onError={(e) => {
                e.target.src = "https://placehold.co/40x40/10B981/white?text=M";
              }}
            />
          </Link>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-white shadow-md border border-gray-100 text-gray-600"
      >
        {isOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white z-40 shadow-lg
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          <div className="px-5 py-6 border-b border-gray-100">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2"
            >
              <img
                src={logoImageUrl}
                alt="MotorHub"
                className="w-8 h-8 rounded-lg object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/32x32/10B981/white?text=M";
                }}
              />
              <span className="font-semibold text-gray-800">AMA MotorHub</span>
            </Link>
          </div>

          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all
                  ${
                    location.pathname === item.path
                      ? "bg-emerald-50 text-emerald-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {userType && (
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-2 px-2 mb-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <FiUser
                    className={`w-4 h-4 text-gray-500 ${user?.profilePicture ? "hidden" : "block"}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {userType === "admin"
                      ? "Admin"
                      : user?.shopName || user?.name}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">{userType}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}

          {/* {isCustomer && (
            <div className="p-4 border-t border-gray-100">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm text-center font-medium hover:bg-emerald-700 transition-colors"
              >
                Login / Sign Up
              </Link>
            </div>
          )} */}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
