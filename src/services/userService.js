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
    console.log("getUserByPhone called with:", phone);
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phone)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error("Supabase error in getUserByPhone:", error);
      throw error;
    }
    console.log("getUserByPhone result:", data);
    return data;
  } catch (error) {
    console.error("Error in getUserByPhone:", error);
    return null;
  }
};

// Get user by ID
export const getUserById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  } catch (error) {
    console.error("Error in getUserById:", error);
    return null;
  }
};

// Get pending vendors (unverified)
export const getPendingVendors = async () => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("type", "vendor")
      .eq("verified", false)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error in getPendingVendors:", error);
    return [];
  }
};

// Create new vendor
export const createVendor = async (vendorData) => {
  try {
    console.log("createVendor called with:", vendorData);

    // Check if phone already exists
    const { data: existing } = await supabase
      .from("users")
      .select("phone")
      .eq("phone", vendorData.phone)
      .maybeSingle();

    if (existing) {
      throw new Error("Phone number already registered");
    }

    const vendorId = `vendor_${Date.now()}`;
    console.log("Creating vendor with ID:", vendorId);

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          id: vendorId,
          full_name: vendorData.fullName,
          phone: vendorData.phone,
          whatsapp: vendorData.whatsapp,
          email: vendorData.email,
          shop_name: vendorData.shopName,
          shop_number: vendorData.shopNumber,
          shop_address: vendorData.shopAddress,
          shop_amount: vendorData.shopAmount || 0,
          market: vendorData.market || null,
          market_id_card: vendorData.marketIdCard || null,
          password: vendorData.password,
          type: "vendor",
          verified: false,
          priority: 0,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }
    console.log("Vendor created successfully:", data);
    return data?.[0] || null;
  } catch (error) {
    console.error("Error in createVendor:", error);
    throw error;
  }
};

// Update vendor
export const updateVendor = async (id, updates) => {
  try {
    console.log("Updating vendor:", id, updates);
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

// Verify vendor
export const verifyVendor = async (id) => {
  try {
    console.log("Verifying vendor:", id);
    const { data, error } = await supabase
      .from("users")
      .update({ verified: true })
      .eq("id", id)
      .select();
    if (error) throw error;
    console.log("Vendor verified:", data);
    return data?.[0] || null;
  } catch (error) {
    console.error("Error in verifyVendor:", error);
    return null;
  }
};

// Delete vendor
export const deleteVendor = async (id) => {
  try {
    console.log("Deleting vendor:", id);
    // First delete their motorcycles
    const { error: bikesError } = await supabase
      .from("motorcycles")
      .delete()
      .eq("vendor_id", id);

    if (bikesError)
      console.error("Error deleting vendor's motorcycles:", bikesError);

    // Then delete the vendor
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) throw error;
    console.log("Vendor deleted successfully");
    return true;
  } catch (error) {
    console.error("Error in deleteVendor:", error);
    return false;
  }
};
