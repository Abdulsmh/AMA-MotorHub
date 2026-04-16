import { supabase } from "../lib/supabase";

// Get all users (vendors)
export const getUsers = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

// Get vendors only
export const getVendors = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("type", "vendor")
    .order("priority", { ascending: false });
  if (error) throw error;
  return data;
};

// Get vendor by ID
export const getVendorById = async (id) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

// Get user by phone (for login)
export const getUserByPhone = async (phone) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("phone", phone)
    .maybeSingle(); // Use maybeSingle to avoid 406 error when no rows
  if (error && error.code !== "PGRST116") throw error;
  return data;
};

// Create new vendor (with hashed password)
export const createVendor = async (vendorData) => {
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
        password: vendorData.password, // Already hashed
        type: "vendor",
        verified: false,
        priority: 0,
        created_at: new Date().toISOString(),
      },
    ])
    .select();
  if (error) throw error;
  return data[0];
};

// Update vendor
export const updateVendor = async (id, updates) => {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
};

// Update vendor priority
export const updateVendorPriority = async (id, priority) => {
  const { data, error } = await supabase
    .from("users")
    .update({ priority })
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
};

// Delete vendor
export const deleteVendor = async (id) => {
  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) throw error;
  return true;
};
