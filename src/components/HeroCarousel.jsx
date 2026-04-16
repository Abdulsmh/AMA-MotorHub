import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Haojue HJ150",
      brand: "Haojue",
      description:
        "Reliable and fuel-efficient motorcycle perfect for Nigerian roads. Features powerful engine and comfortable seat.",
      price: "₦850,000",
      image:
        "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600",
      buttonText: "Shop Now",
      buttonLink: "/catalog",
      bgColor: "from-amber-600 to-orange-600",
    },
    {
      id: 2,
      title: "Honda CG 125",
      brand: "Honda",
      description:
        "Legendary durability and fuel economy. Perfect for daily commuting and commercial use.",
      price: "₦950,000",
      image:
        "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600",
      buttonText: "Shop Now",
      buttonLink: "/catalog",
      bgColor: "from-emerald-600 to-teal-600",
    },
    {
      id: 3,
      title: "Lifan KPR 150",
      brand: "Lifan",
      description:
        "Sporty design with excellent performance. Great value for money with modern features.",
      price: "₦780,000",
      image:
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600",
      buttonText: "Shop Now",
      buttonLink: "/catalog",
      bgColor: "from-blue-600 to-indigo-600",
    },
    {
      id: 4,
      title: "Royal Enfield Classic 350",
      brand: "Royal Enfield",
      description:
        "Premium classic motorcycle with timeless design. Powerful engine and exceptional build quality.",
      price: "₦2,450,000",
      image:
        "https://images.unsplash.com/photo-1627413009835-ef1c41b0d847?w=600",
      buttonText: "Shop Now",
      buttonLink: "/catalog",
      bgColor: "from-purple-600 to-pink-600",
    },
    {
      id: 5,
      title: "Yamaha MT-15",
      brand: "Yamaha",
      description:
        "Aggressive streetfighter design with liquid-cooled engine. Perfect for city riding.",
      price: "₦1,350,000",
      image:
        "https://images.unsplash.com/photo-1616425708412-1187e86f7c9c?w=600",
      buttonText: "Shop Now",
      buttonLink: "/catalog",
      bgColor: "from-red-600 to-rose-600",
    },
    {
      id: 6,
      title: "Suzuki GSX-S150",
      brand: "Suzuki",
      description:
        "Sporty naked bike with excellent handling and modern features.",
      price: "₦1,250,000",
      image:
        "https://images.unsplash.com/photo-1616425708412-1187e86f7c9c?w=600",
      buttonText: "Shop Now",
      buttonLink: "/catalog",
      bgColor: "from-cyan-600 to-blue-600",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-xl mb-8">
      {/* Main Carousel Container */}
      <div
        className={`relative bg-gradient-to-r ${currentSlide.bgColor} min-h-[400px] md:min-h-[450px] overflow-hidden`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full -ml-48 -mb-48"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Left Side - Text Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-white mb-4">
                🔥 Featured Motorcycle
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                {currentSlide.title}
              </h2>
              <p className="text-emerald-100 text-sm md:text-base font-medium mb-2">
                {currentSlide.brand}
              </p>
              <p className="text-white/80 text-sm md:text-base mb-4 max-w-md mx-auto md:mx-0">
                {currentSlide.description}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
                <span className="text-2xl md:text-3xl font-bold text-yellow-300">
                  {currentSlide.price}
                </span>
                <span className="text-white/60 text-sm">(excl. delivery)</span>
              </div>
              <Link
                to={currentSlide.buttonLink}
                className="inline-flex items-center gap-2 bg-white text-gray-800 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-100 transition shadow-lg"
              >
                {currentSlide.buttonText}
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right Side - Image */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="w-full max-w-sm md:max-w-md lg:max-w-lg rounded-2xl shadow-2xl transform hover:scale-105 transition duration-500"
                />
                {/* Badge */}
                <div className="absolute -top-3 -right-3 bg-yellow-400 text-gray-800 rounded-full px-3 py-1 text-xs font-bold shadow-lg">
                  HOT DEAL
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-2 transition-all duration-200 z-20"
      >
        <FiChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-2 transition-all duration-200 z-20"
      >
        <FiChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`transition-all duration-300 rounded-full ${
              currentIndex === idx
                ? "w-6 h-2 bg-white"
                : "w-2 h-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
