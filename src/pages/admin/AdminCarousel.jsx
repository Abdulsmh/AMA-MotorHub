import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiX,
  FiUpload,
  FiImage,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const AdminCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    description: "",
    price: "",
    image: "",
    buttonText: "Shop Now",
    buttonLink: "/catalog",
    whatsappNumber: "",
    redirectToShop: false,
    shopId: "",
    bgColorFrom: "from-amber-600",
    bgColorTo: "to-orange-600",
    order: 0,
    active: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [message, setMessage] = useState("");
  const [vendors, setVendors] = useState([]);

  const colorOptions = [
    { from: "from-amber-600", to: "to-orange-600", name: "Amber/Orange" },
    { from: "from-emerald-600", to: "to-teal-600", name: "Emerald/Teal" },
    { from: "from-blue-600", to: "to-indigo-600", name: "Blue/Indigo" },
    { from: "from-purple-600", to: "to-pink-600", name: "Purple/Pink" },
    { from: "from-red-600", to: "to-rose-600", name: "Red/Rose" },
    { from: "from-cyan-600", to: "to-blue-600", name: "Cyan/Blue" },
  ];

  useEffect(() => {
    loadSlides();
    loadVendors();
  }, []);

  const loadSlides = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("carousel_slides")
        .select("*")
        .order("order_num", { ascending: true });

      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error("Error loading slides:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadVendors = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, shop_name, whatsapp")
        .eq("type", "vendor")
        .eq("verified", true);

      if (error) throw error;
      setVendors(data || []);
    } catch (error) {
      console.error("Error loading vendors:", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage("Image must be less than 2MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let imageUrl = formData.image;

      if (imageFile) {
        const fileName = `carousel_${Date.now()}.jpg`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("carousel-images")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("carousel-images")
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
      }

      // Determine button link based on redirect type
      let finalButtonLink = formData.buttonLink;
      if (formData.redirectToShop && formData.shopId) {
        finalButtonLink = `/shop/${formData.shopId}`;
      } else if (formData.whatsappNumber) {
        finalButtonLink = `https://wa.me/${formData.whatsappNumber}`;
      }

      const slideData = {
        title: formData.title,
        brand: formData.brand,
        description: formData.description,
        price: formData.price,
        image: imageUrl,
        button_text: formData.buttonText,
        button_link: finalButtonLink,
        whatsapp_number: formData.whatsappNumber,
        redirect_to_shop: formData.redirectToShop,
        shop_id: formData.shopId,
        bg_color_from: formData.bgColorFrom,
        bg_color_to: formData.bgColorTo,
        order_num: parseInt(formData.order) || slides.length,
        active: formData.active,
        updated_at: new Date().toISOString(),
      };

      if (editingSlide) {
        const { error } = await supabase
          .from("carousel_slides")
          .update(slideData)
          .eq("id", editingSlide.id);

        if (error) throw error;
        setMessage("Slide updated!");
      } else {
        const { error } = await supabase
          .from("carousel_slides")
          .insert([slideData]);

        if (error) throw error;
        setMessage("Slide added!");
      }

      setTimeout(() => setMessage(""), 3000);
      resetForm();
      loadSlides();
    } catch (error) {
      console.error("Error saving slide:", error);
      setMessage("Error saving slide: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this slide?")) {
      try {
        const { error } = await supabase
          .from("carousel_slides")
          .delete()
          .eq("id", id);

        if (error) throw error;
        loadSlides();
      } catch (error) {
        console.error("Error deleting slide:", error);
      }
    }
  };

  const toggleActive = async (id, currentActive) => {
    try {
      const { error } = await supabase
        .from("carousel_slides")
        .update({ active: !currentActive })
        .eq("id", id);

      if (error) throw error;
      loadSlides();
    } catch (error) {
      console.error("Error toggling slide:", error);
    }
  };

  const moveSlide = async (id, direction) => {
    const currentIndex = slides.findIndex((s) => s.id === id);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= slides.length) return;

    const newSlides = [...slides];
    [newSlides[currentIndex], newSlides[newIndex]] = [
      newSlides[newIndex],
      newSlides[currentIndex],
    ];

    const updates = newSlides.map((slide, idx) => ({
      id: slide.id,
      order_num: idx,
    }));

    try {
      for (const update of updates) {
        await supabase
          .from("carousel_slides")
          .update({ order_num: update.order_num })
          .eq("id", update.id);
      }
      loadSlides();
    } catch (error) {
      console.error("Error reordering slides:", error);
    }
  };

  const editSlide = (slide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      brand: slide.brand,
      description: slide.description || "",
      price: slide.price,
      image: slide.image,
      buttonText: slide.button_text,
      buttonLink: slide.button_link,
      whatsappNumber: slide.whatsapp_number || "",
      redirectToShop: slide.redirect_to_shop || false,
      shopId: slide.shop_id || "",
      bgColorFrom: slide.bg_color_from,
      bgColorTo: slide.bg_color_to,
      order: slide.order_num,
      active: slide.active,
    });
    setImagePreview(slide.image);
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingSlide(null);
    setFormData({
      title: "",
      brand: "",
      description: "",
      price: "",
      image: "",
      buttonText: "Shop Now",
      buttonLink: "/catalog",
      whatsappNumber: "",
      redirectToShop: false,
      shopId: "",
      bgColorFrom: "from-amber-600",
      bgColorTo: "to-orange-600",
      order: 0,
      active: true,
    });
    setImageFile(null);
    setImagePreview("");
  };

  if (loading && slides.length === 0) {
    return <div className="text-center py-10">Loading carousel slides...</div>;
  }

  return (
    <div className="px-3 sm:px-4 md:px-6">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
          Carousel Management
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition"
        >
          <FiPlus className="w-4 h-4" />
          Add Slide
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={resetForm}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingSlide ? "Edit Slide" : "New Carousel Slide"}
              </h2>
              <button
                onClick={resetForm}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Brand *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                  placeholder="₦850,000"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Motorcycle Image
                </label>
                <div className="flex items-center gap-3">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <label className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition">
                    <FiUpload className="w-4 h-4" />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Recommended size: 800x600px, max 2MB
                </p>
              </div>

              {/* Redirect Options */}
              <div className="border-t border-gray-200 pt-4">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Button Destination
                </label>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="redirectType"
                      checked={
                        !formData.redirectToShop && !formData.whatsappNumber
                      }
                      onChange={() => {
                        setFormData({
                          ...formData,
                          redirectToShop: false,
                          whatsappNumber: "",
                          buttonLink: "/catalog",
                        });
                      }}
                      className="w-4 h-4"
                    />
                    <label className="text-sm text-gray-700">
                      Catalog Page
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="redirectType"
                      checked={formData.redirectToShop}
                      onChange={() => {
                        setFormData({
                          ...formData,
                          redirectToShop: true,
                          whatsappNumber: "",
                          buttonLink: "",
                        });
                      }}
                      className="w-4 h-4"
                    />
                    <label className="text-sm text-gray-700">
                      Specific Shop
                    </label>
                  </div>

                  {formData.redirectToShop && (
                    <div className="ml-6">
                      <select
                        name="shopId"
                        value={formData.shopId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                        required={formData.redirectToShop}
                      >
                        <option value="">Select a shop...</option>
                        {vendors.map((vendor) => (
                          <option key={vendor.id} value={vendor.id}>
                            {vendor.shop_name} - {vendor.whatsapp}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="redirectType"
                      checked={
                        formData.whatsappNumber && !formData.redirectToShop
                      }
                      onChange={() => {
                        setFormData({
                          ...formData,
                          redirectToShop: false,
                          whatsappNumber: "",
                          buttonLink: "",
                        });
                      }}
                      className="w-4 h-4"
                    />
                    <label className="text-sm text-gray-700 flex items-center gap-1">
                      <FaWhatsapp className="w-4 h-4 text-green-600" />
                      WhatsApp Number
                    </label>
                  </div>

                  {formData.whatsappNumber && !formData.redirectToShop && (
                    <div className="ml-6">
                      <input
                        type="text"
                        name="whatsappNumber"
                        value={formData.whatsappNumber}
                        onChange={handleChange}
                        placeholder="e.g., 2347015102718"
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Enter WhatsApp number without spaces or special
                        characters
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  name="buttonText"
                  value={formData.buttonText}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Background Color
                </label>
                <select
                  name="bgColorFrom"
                  value={formData.bgColorFrom}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                >
                  {colorOptions.map((color) => (
                    <option key={color.from} value={color.from}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                  min="0"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <label className="text-sm text-gray-700">
                  Active (visible on homepage)
                </label>
              </div>

              {message && (
                <div
                  className={`p-2 rounded-lg text-sm ${message.includes("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
                >
                  {message}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium"
                >
                  {editingSlide ? "Update Slide" : "Add Slide"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Slides List */}
      <div className="space-y-3">
        {slides.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500">
              No carousel slides yet. Add your first slide!
            </p>
          </div>
        ) : (
          slides.map((slide, index) => (
            <div
              key={slide.id}
              className="bg-white rounded-xl border border-gray-100 p-4"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-800">
                      {slide.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${slide.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                    >
                      {slide.active ? "Active" : "Inactive"}
                    </span>
                    {slide.redirect_to_shop && slide.shop_id && (
                      <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                        🔗 Shop Redirect
                      </span>
                    )}
                    {slide.whatsapp_number && (
                      <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                        <FaWhatsapp className="w-3 h-3 inline mr-1" />
                        WhatsApp
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{slide.brand}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {slide.description?.substring(0, 100)}...
                  </p>
                  <p className="text-sm font-bold text-emerald-600 mt-1">
                    {slide.price}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveSlide(slide.id, "up")}
                    disabled={index === 0}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                  >
                    <FiArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveSlide(slide.id, "down")}
                    disabled={index === slides.length - 1}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                  >
                    <FiArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleActive(slide.id, slide.active)}
                    className={`p-2 rounded-lg transition ${slide.active ? "text-yellow-600 hover:bg-yellow-50" : "text-green-600 hover:bg-green-50"}`}
                  >
                    {slide.active ? (
                      <FiEyeOff className="w-4 h-4" />
                    ) : (
                      <FiEye className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => editSlide(slide)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminCarousel;
