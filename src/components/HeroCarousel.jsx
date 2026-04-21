import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";

const HeroCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSlides();
  }, []);

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [slides.length]);

  const loadSlides = async () => {
    try {
      const { data, error } = await supabase
        .from("carousel_slides")
        .select("*")
        .eq("active", true)
        .order("order_num", { ascending: true });

      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error("Error loading carousel slides:", error);
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-2xl shadow-xl mb-8 bg-gray-200 animate-pulse h-[350px] sm:h-[400px] md:h-[450px]">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500">Loading carousel...</p>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-xl mb-8">
      <div
        className={`relative bg-gradient-to-r ${currentSlide.bg_color_from} ${currentSlide.bg_color_to} overflow-hidden min-h-[350px] sm:min-h-[400px] md:min-h-[450px]`}
      >
        {/* Decorative circles */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-white rounded-full -mr-16 -mt-16 sm:-mr-24 sm:-mt-24"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-64 sm:h-64 bg-white rounded-full -ml-20 -mb-20 sm:-ml-32 sm:-mb-32"></div>
        </div>

        <div className="relative z-10 container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-10">
          <div className="flex flex-col md:flex-row items-center gap-3 sm:gap-4 md:gap-8">
            {/* Left Side - Text Content */}
            <div className="flex-1 text-center md:text-left px-2 sm:px-4 order-2 md:order-1">
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold text-white mb-2 sm:mb-3">
                🔥 Featured
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1 line-clamp-1">
                {currentSlide.title}
              </h2>
              <p className="text-emerald-100 text-xs sm:text-sm font-medium mb-1">
                {currentSlide.brand}
              </p>
              <p className="text-white/80 text-[11px] sm:text-xs md:text-sm mb-2 sm:mb-3 max-w-md mx-auto md:mx-0 line-clamp-2 sm:line-clamp-3">
                {currentSlide.description}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-1 sm:gap-2 mb-2 sm:mb-3">
                <span className="text-base sm:text-lg md:text-xl font-bold text-yellow-300">
                  {currentSlide.price}
                </span>
              </div>
              <Link
                to={currentSlide.button_link}
                className="inline-flex items-center gap-1 sm:gap-2 bg-white text-gray-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-xs md:text-sm font-medium hover:bg-gray-100 transition shadow-lg"
              >
                {currentSlide.button_text}
                <FiArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            </div>

            {/* Right Side - Motorcycle Image */}
            <div className="flex-1 flex justify-center order-1 md:order-2">
              <div className="relative w-full max-w-[180px] sm:max-w-[220px] md:max-w-[280px] lg:max-w-[320px]">
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="w-full h-auto rounded-xl sm:rounded-2xl shadow-2xl transform hover:scale-105 transition duration-500"
                  loading="eager"
                />
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-yellow-400 text-gray-800 rounded-full px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 text-[8px] sm:text-[10px] font-bold shadow-lg">
                  HOT DEAL
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Hide on smallest screens, show on tablet+ */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-1.5 sm:p-2 transition-all duration-200 z-20"
          >
            <FiChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-1.5 sm:p-2 transition-all duration-200 z-20"
          >
            <FiChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </button>
        </>
      )}

      {/* Dots Indicator - Responsive sizing */}
      {slides.length > 1 && (
        <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`transition-all duration-300 rounded-full ${
                currentIndex === idx
                  ? "w-3 sm:w-5 h-1 sm:h-1.5 bg-white"
                  : "w-1 sm:w-1.5 h-1 sm:h-1.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroCarousel;
