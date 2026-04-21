import { supabase } from "../lib/supabase";

// ========== IMAGE OPTIMIZATION FUNCTIONS ==========

// Get optimized image URL with Supabase transformations
export const getOptimizedImageUrl = (url, options = {}) => {
  if (!url) return null;

  const { width = 400, height, quality = 80, format = "webp" } = options;

  // Check if it's a Supabase URL
  if (url.includes("supabase.co")) {
    const params = new URLSearchParams();
    if (width) params.append("width", width);
    if (height) params.append("height", height);
    if (quality) params.append("quality", quality);
    if (format) params.append("format", format);

    const baseUrl = url.split("?")[0];
    return `${baseUrl}?${params.toString()}`;
  }

  return url;
};

// Compress image before upload
export const compressImage = async (file, maxWidth = 1200, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/jpeg",
          quality,
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

// Upload image to Supabase Storage
export const uploadImage = async (file, path) => {
  if (!file) return "";
  try {
    const compressedFile = await compressImage(file);

    const fileName = `${path}_${Date.now()}.jpg`;
    const { data, error } = await supabase.storage
      .from("motorcycle-images")
      .upload(fileName, compressedFile, {
        cacheControl: "31536000",
        upsert: false,
        contentType: "image/jpeg",
      });

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

// ========== OPTIMIZED CATALOG QUERY ==========

// Get motorcycles for catalog with pagination
export const getCatalogMotorcycles = async (
  page = 1,
  limit = 20,
  searchTerm = "",
) => {
  try {
    let query = supabase
      .from("motorcycles")
      .select(
        `
        *,
        users!inner(
          id,
          shop_name,
          whatsapp,
          priority,
          verified,
          phone,
          shop_address
        )
      `,
        { count: "exact" },
      )
      .eq("status", "available")
      .gt("quantity", 0)
      .eq("users.verified", true)
      .range((page - 1) * limit, page * limit - 1);

    // Add search filter
    if (searchTerm) {
      query = query.or(
        `name.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%,users.shop_name.ilike.%${searchTerm}%`,
      );
    }

    // Order by priority and newest first
    query = query
      .order("users(priority)", { ascending: false })
      .order("created_at", { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;

    // Optimize images for catalog display
    const optimizedData = (data || []).map((item) => ({
      ...item,
      thumbnail: getOptimizedImageUrl(item.main_image_url || item.images?.[0], {
        width: 300,
        height: 200,
        quality: 60,
      }),
      catalog_image: getOptimizedImageUrl(
        item.main_image_url || item.images?.[0],
        { width: 500, quality: 75 },
      ),
      shopName: item.users?.shop_name || "Unknown Shop",
      shopWhatsapp: item.users?.whatsapp || item.users?.phone || "",
      shopPriority: item.users?.priority || 0,
      shopVerified: item.users?.verified || false,
      shopAddress: item.users?.shop_address || "",
    }));

    return {
      success: true,
      data: optimizedData,
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
      hasMore: page < Math.ceil((count || 0) / limit),
    };
  } catch (error) {
    console.error("Error in getCatalogMotorcycles:", error);
    return {
      success: false,
      data: [],
      total: 0,
      page: 1,
      totalPages: 0,
      hasMore: false,
    };
  }
};

// Get single motorcycle details
export const getMotorcycleDetails = async (vendorId) => {
  try {
    const { data, error } = await supabase
      .from("motorcycles")
      .select(
        `
        *,
        users(
          shop_name,
          whatsapp,
          shop_address,
          shop_number,
          verified,
          priority
        )
      `,
      )
      .eq("vendor_id", vendorId)
      .eq("status", "available")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((item) => ({
      ...item,
      main_image_optimized: getOptimizedImageUrl(
        item.main_image_url || item.images?.[0],
        { width: 800, quality: 85 },
      ),
      thumbnail: getOptimizedImageUrl(item.main_image_url || item.images?.[0], {
        width: 200,
        height: 150,
        quality: 60,
      }),
    }));
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

// Keep existing functions...
export const addMotorcycle = async (
  motorcycle,
  vendorId,
  shopName,
  mainImageFile,
  colorImageFiles,
) => {
  try {
    let mainImageUrl = "";
    if (mainImageFile) {
      mainImageUrl = await uploadImage(
        mainImageFile,
        `motorcycles/${vendorId}/main`,
      );
    }

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

    const motorcycleData = {
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
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("motorcycles")
      .insert([motorcycleData])
      .select();

    if (error) throw error;
    return { success: true, data: data?.[0] || null };
  } catch (error) {
    console.error("Add error:", error);
    return { success: false, error: error.message };
  }
};

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
    console.error("Error:", error);
    return null;
  }
};

export const deleteMotorcycle = async (id) => {
  try {
    const { error } = await supabase.from("motorcycles").delete().eq("id", id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
};

export const getAllMotorcycles = async () => {
  try {
    const { data, error } = await supabase
      .from("motorcycles")
      .select("*, users(shop_name)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};
