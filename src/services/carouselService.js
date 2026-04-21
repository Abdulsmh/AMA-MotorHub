import { supabase } from "../lib/supabase";

const TABLE_NAME = "carousel_slides";

// Get all carousel slides
export const getCarouselSlides = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("active", true)
      .order("order", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error loading carousel slides:", error);
    return [];
  }
};

// Get all slides for admin (including inactive)
export const getAllSlides = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .order("order", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error loading all slides:", error);
    return [];
  }
};

// Add new slide
export const addCarouselSlide = async (slideData, imageFile) => {
  try {
    let imageUrl = slideData.image;

    // Upload image if provided
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

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([
        {
          title: slideData.title,
          brand: slideData.brand,
          description: slideData.description,
          price: slideData.price,
          image: imageUrl,
          button_text: slideData.buttonText,
          button_link: slideData.buttonLink,
          bg_color_from: slideData.bgColorFrom,
          bg_color_to: slideData.bgColorTo,
          order: slideData.order,
          active: true,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error("Error adding slide:", error);
    throw error;
  }
};

// Update slide
export const updateCarouselSlide = async (id, slideData, imageFile) => {
  try {
    let imageUrl = slideData.image;

    // Upload new image if provided
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

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({
        title: slideData.title,
        brand: slideData.brand,
        description: slideData.description,
        price: slideData.price,
        image: imageUrl,
        button_text: slideData.buttonText,
        button_link: slideData.buttonLink,
        bg_color_from: slideData.bgColorFrom,
        bg_color_to: slideData.bgColorTo,
        order: slideData.order,
        active: slideData.active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error("Error updating slide:", error);
    throw error;
  }
};

// Delete slide
export const deleteCarouselSlide = async (id) => {
  try {
    const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting slide:", error);
    throw error;
  }
};

// Toggle slide active status
export const toggleSlideActive = async (id, active) => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({ active, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error("Error toggling slide:", error);
    throw error;
  }
};

// Reorder slides
export const reorderSlides = async (slides) => {
  try {
    const updates = slides.map((slide) => ({
      id: slide.id,
      order: slide.order,
    }));

    const { error } = await supabase.from(TABLE_NAME).upsert(updates);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error reordering slides:", error);
    throw error;
  }
};
