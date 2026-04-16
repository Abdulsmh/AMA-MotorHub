import { supabase } from "../lib/supabase";

// Upload image to Supabase Storage
export const uploadImage = async (file, path) => {
  if (!file) return "";
  try {
    const fileName = `${path}_${Date.now()}.jpg`;
    const { data, error } = await supabase.storage
      .from("motorcycle-images")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });
    if (error) throw error;
    const { data: publicUrlData } = supabase.storage
      .from("motorcycle-images")
      .getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Upload error:", error);
    return "";
  }
};

// Get all motorcycles (for admin)
export const getAllMotorcycles = async () => {
  try {
    const { data, error } = await supabase
      .from("motorcycles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || []; // Always return array
  } catch (error) {
    console.error("Error in getAllMotorcycles:", error);
    return []; // Return empty array on error
  }
};

// Get motorcycles by vendor
export const getMotorcyclesByVendor = async (vendorId) => {
  try {
    const { data, error } = await supabase
      .from("motorcycles")
      .select("*")
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error in getMotorcyclesByVendor:", error);
    return [];
  }
};

// Get available motorcycles (for catalog)
export const getAvailableMotorcycles = async () => {
  try {
    const { data, error } = await supabase
      .from("motorcycles")
      .select("*, users(shop_name, whatsapp, priority)")
      .eq("status", "available")
      .gt("quantity", 0);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error in getAvailableMotorcycles:", error);
    return [];
  }
};

// Add motorcycle
export const addMotorcycle = async (
  motorcycle,
  vendorId,
  shopName,
  mainImageFile,
  colorImageFiles,
) => {
  try {
    // Upload main image
    let mainImageUrl = "";
    if (mainImageFile) {
      mainImageUrl = await uploadImage(
        mainImageFile,
        `motorcycles/${vendorId}/main`,
      );
    }

    // Upload color images
    const updatedColors = await Promise.all(
      (motorcycle.colors || []).map(async (color, index) => {
        const colorImageFile = colorImageFiles?.[index];
        let images = [];
        if (colorImageFile) {
          const url = await uploadImage(
            colorImageFile,
            `motorcycles/${vendorId}/color_${index}`,
          );
          if (url) images = [url];
        }
        return { ...color, images };
      }),
    );

    const { data, error } = await supabase
      .from("motorcycles")
      .insert([
        {
          vendor_id: vendorId,
          shop_name: shopName,
          name: motorcycle.name,
          brand: motorcycle.brand,
          price: parseInt(motorcycle.price),
          description_en: motorcycle.description_en || "",
          description_ha: motorcycle.description_ha || "",
          main_image_url: mainImageUrl,
          colors: updatedColors,
          quantity: parseInt(motorcycle.quantity),
          images: motorcycle.images || [],
          status: "available",
        },
      ])
      .select();
    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error("Add error:", error);
    throw error;
  }
};

// Update motorcycle
export const updateMotorcycle = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from("motorcycles")
      .update(updates)
      .eq("id", id)
      .select();
    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error("Error in updateMotorcycle:", error);
    return null;
  }
};

// Update price
export const updateMotorcyclePrice = async (id, newPrice) => {
  try {
    const { data, error } = await supabase
      .from("motorcycles")
      .update({ price: newPrice })
      .eq("id", id)
      .select();
    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error("Error in updateMotorcyclePrice:", error);
    return null;
  }
};

// Update colors
export const updateMotorcycleColors = async (id, newColors) => {
  try {
    const { data, error } = await supabase
      .from("motorcycles")
      .update({ colors: newColors })
      .eq("id", id)
      .select();
    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error("Error in updateMotorcycleColors:", error);
    return null;
  }
};

// Delete motorcycle
export const deleteMotorcycle = async (id) => {
  try {
    const { error } = await supabase.from("motorcycles").delete().eq("id", id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error in deleteMotorcycle:", error);
    return false;
  }
};
