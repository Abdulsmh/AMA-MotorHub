import { supabase } from "../lib/supabase";

// Get all users (vendors)
export const getUsers = async () => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error in getUsers:", error);
    return [];
  }
};

// Get vendors only
export const getVendors = async () => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("type", "vendor")
      .order("priority", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error in getVendors:", error);
    return [];
  }
};

// Get user by phone (for login)
export const getUserByPhone = async (phone) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phone)
      .maybeSingle();
    if (error && error.code !== "PGRST116") throw error;
    return data;
  } catch (error) {
    console.error("Error in getUserByPhone:", error);
    return null;
  }
};

// Create new vendor
export const createVendor = async (vendorData) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          id: `vendor_${Date.now()}`,
          full_name: vendorData.fullName,
          phone: vendorData.phone,
          whatsapp: vendorData.whatsapp,
          email: vendorData.email,
          shop_name: vendorData.shopName,
          shop_number: vendorData.shopNumber,
          shop_address: vendorData.shopAddress,
          shop_amount: vendorData.shopAmount,
          password: vendorData.password,
          type: "vendor",
          verified: false,
          priority: 0,
          created_at: new Date().toISOString(),
        },
      ])
      .select();
    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error("Error in createVendor:", error);
    throw error;
  }
};

// Update vendor
export const updateVendor = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select();
    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error("Error in updateVendor:", error);
    return null;
  }
};

// Update vendor priority
export const updateVendorPriority = async (id, priority) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({ priority })
      .eq("id", id)
      .select();
    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error("Error in updateVendorPriority:", error);
    return null;
  }
};

// Delete vendor
export const deleteVendor = async (id) => {
  try {
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error in deleteVendor:", error);
    return false;
  }
};
