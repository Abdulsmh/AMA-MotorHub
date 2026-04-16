import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import HeroCarousel from "../components/HeroCarousel";
import {
  FiPackage,
  FiUsers,
  FiStar,
  FiArrowRight,
  FiMessageCircle,
  FiShield,
  FiTruck,
} from "react-icons/fi";

const HomePage = () => {
  const { isAuthenticated, userType, user } = useAuth();

  const stats = [
    {
      number: "500+",
      label: "Sold",
      icon: <FiPackage className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      number: "50+",
      label: "Vendors",
      icon: <FiUsers className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      number: "1000+",
      label: "Customers",
      icon: <FiUsers className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      number: "4.9",
      label: "Rating",
      icon: <FiStar className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
  ];

  const features = [
    {
      icon: <FiShield className="w-5 h-5 text-emerald-600" />,
      title: "Trusted Vendors",
      description: "Verified shop owners",
      link: "/vendor/marketplace",
      buttonText: "Browse Vendors",
      bgColor: "bg-emerald-50",
      hoverBg: "hover:bg-emerald-100",
    },
    {
      icon: <FiTruck className="w-5 h-5 text-emerald-600" />,
      title: "Quality Bikes",
      description: "Top brands available",
      link: "/catalog",
      buttonText: "View Bikes",
      bgColor: "bg-emerald-50",
      hoverBg: "hover:bg-emerald-100",
    },
    {
      icon: <FiMessageCircle className="w-5 h-5 text-emerald-600" />,
      title: "Direct Chat",
      description: "Contact via WhatsApp",
      link: "https://wa.me/2347015102718",
      buttonText: "Chat Now",
      bgColor: "bg-green-50",
      hoverBg: "hover:bg-green-100",
      external: true,
    },
  ];

  const getWelcomeMessage = () => {
    if (!isAuthenticated) return null;
    if (userType === "admin") {
      return {
        title: `Welcome back, Admin`,
        subtitle: "Manage your platform",
        buttonText: "Go to Dashboard",
        buttonLink: "/admin/dashboard",
      };
    }
    if (userType === "vendor") {
      return {
        title: `Welcome back, ${user?.shopName || user?.name}`,
        subtitle: "Manage your shop inventory and sales",
        buttonText: "Go to Dashboard",
        buttonLink: "/vendor/dashboard",
      };
    }
    return null;
  };

  const welcome = getWelcomeMessage();

  return (
    <div className="w-full">
      {/* Hero Carousel - only for unauthenticated */}
      {!isAuthenticated && <HeroCarousel />}

      {/* Welcome Banner for logged-in users */}
      {isAuthenticated && welcome && (
        <div className="bg-emerald-600 rounded-xl text-white overflow-hidden mb-6">
          <div className="px-4 py-8 sm:px-6 sm:py-10 text-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
              {welcome.title}
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm mb-5">
              {welcome.subtitle}
            </p>
            <Link
              to={welcome.buttonLink}
              className="inline-flex items-center gap-2 bg-white text-emerald-700 px-4 py-1.5 sm:px-5 sm:py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              {welcome.buttonText}
              <FiArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mt-6 sm:mt-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-gray-100 shadow-sm"
          >
            <div className="text-emerald-600 flex justify-center mb-1">
              {stat.icon}
            </div>
            <div className="text-base sm:text-xl font-bold text-gray-800">
              {stat.number}
            </div>
            <div className="text-[10px] sm:text-xs text-gray-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Features Section - Clickable Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8">
        {features.map((feature, index) => (
          <Link
            key={index}
            to={feature.link}
            target={feature.external ? "_blank" : "_self"}
            rel={feature.external ? "noopener noreferrer" : ""}
            className={`${feature.bgColor} rounded-lg sm:rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md ${feature.hoverBg} group`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                {feature.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {feature.description}
                </p>
                <div className="flex items-center gap-1 mt-2 text-emerald-600 text-xs font-medium group-hover:gap-2 transition-all">
                  {feature.buttonText}
                  <FiArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA Section for Unauthenticated Users */}
      {!isAuthenticated && (
        <div className="mt-6 sm:mt-8 bg-gray-50 rounded-lg sm:rounded-xl p-5 sm:p-6 text-center border border-gray-100">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1">
            Start your business
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
            Join as a vendor today
          </p>
          <Link
            to="/signup"
            className="inline-block bg-emerald-600 text-white px-4 py-1.5 sm:px-5 sm:py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
          >
            Sign Up Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;
