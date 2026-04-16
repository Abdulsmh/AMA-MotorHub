import React from "react";
import { Link } from "react-router-dom";
import {
  FiHeart,
  FiGithub,
  FiTwitter,
  FiFacebook,
  FiInstagram,
} from "react-icons/fi";
const logoImageUrl =
  "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=50&h=50&fit=crop";
const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <img
                  src={logoImageUrl}
                  alt="MotorHub"
                  className="w-8 h-8 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/32x32/10B981/white?text=M";
                  }}
                />
              </div>
              <span className="font-semibold text-gray-800">AMA MotorHub</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Your trusted marketplace for quality motorcycles in Northern
              Nigeria.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/catalog"
                  className="text-xs text-gray-500 hover:text-emerald-600 transition"
                >
                  Browse Bikes
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-xs text-gray-500 hover:text-emerald-600 transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-xs text-gray-500 hover:text-emerald-600 transition"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="text-xs text-gray-500 hover:text-emerald-600 transition"
                >
                  Become a Vendor
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Contact
            </h3>
            <ul className="space-y-2">
              <li className="text-xs text-gray-500">📍 Kano, Nigeria</li>
              <li className="text-xs text-gray-500">📞 +234 701 510 2718</li>
              <li className="text-xs text-gray-500">✉️ support@amamotorhub.com</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Follow Us
            </h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition"
              >
                <FiFacebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition"
              >
                <FiTwitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition"
              >
                <FiInstagram className="w-4 h-4" />
              </a>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              © 2026 AMA MotorHub. All rights reserved.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            Made with <FiHeart className="inline w-3 h-3 text-red-500" /> for
            Nigerian motorcycle sellers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
