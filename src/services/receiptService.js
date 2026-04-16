import { supabase } from "../lib/supabase";

// Generate receipt number
export const generateReceiptNumber = () => {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, "0");
  const day = String(new Date().getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `RCP-${year}${month}${day}-${random}`;
};

// Create receipt
export const createReceipt = async (receiptData) => {
  const { data, error } = await supabase
    .from("receipts")
    .insert([
      {
        receipt_number: generateReceiptNumber(),
        ...receiptData,
      },
    ])
    .select();
  if (error) throw error;
  return data[0];
};

// Get receipts by vendor
export const getReceiptsByVendor = async (vendorId) => {
  const { data, error } = await supabase
    .from("receipts")
    .select("*")
    .eq("vendor_id", vendorId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

// Get all receipts (admin)
export const getAllReceipts = async () => {
  const { data, error } = await supabase
    .from("receipts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

// Get receipt by ID
export const getReceiptById = async (id) => {
  const { data, error } = await supabase
    .from("receipts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};
