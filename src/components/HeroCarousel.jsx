import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const HeroCarousel = () => {
  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200",
      title: "Haojue HJ150",
      subtitle: "Reliable & Fuel Efficient",
      brand: "Haojue",
    },
    {
      id: 2,
      image: "/kpr_fi_green_product_image.jpg",
      title: "Lifan KPR 150",
      subtitle: "Sporty Design, Great Performance",
      brand: "Lifan",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200",
      title: "Lucky Plus 125",
      subtitle: "Affordable & Durable",
      brand: "Lucky Plus",
    },
    {
      id: 4,
      image:
        "/motobi-keeway.jfif",
      title: "Motobi 200",
      subtitle: "Powerful & Stylish",
      brand: "Motobi",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full flex-shrink-0 relative">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 sm:p-8 md:p-12">
              <p className="text-emerald-300 text-sm sm:text-base font-semibold">
                {slide.brand}
              </p>
              <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mt-1">
                {slide.title}
              </h2>
              <p className="text-gray-200 text-sm sm:text-base mt-1">
                {slide.subtitle}
              </p>
              <button className="mt-4 bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition w-fit">
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 backdrop-blur-sm transition"
      >
        <FiChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 backdrop-blur-sm transition"
      >
        <FiChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentIndex === idx ? "bg-emerald-500 w-4" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
