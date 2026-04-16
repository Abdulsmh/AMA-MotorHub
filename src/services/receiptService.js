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
  try {
    console.log("Creating receipt:", receiptData);

    const { data, error } = await supabase
      .from("receipts")
      .insert([
        {
          receipt_number: generateReceiptNumber(),
          vendor_id: receiptData.vendorId,
          shop_name: receiptData.shopName,
          shop_address: receiptData.shopAddress,
          shop_phone: receiptData.shopPhone,
          motorcycle_id: receiptData.motorcycleId,
          motorcycle_name: receiptData.motorcycleName,
          motorcycle_brand: receiptData.motorcycleBrand,
          quantity: receiptData.quantity,
          unit_price: receiptData.unitPrice,
          total_price: receiptData.totalPrice,
          buyer_name: receiptData.buyerName,
          buyer_phone: receiptData.buyerPhone,
          buyer_address: receiptData.buyerAddress,
          payment_method: receiptData.paymentMethod,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }

    console.log("Receipt created:", data);
    return data?.[0] || null;
  } catch (error) {
    console.error("Error in createReceipt:", error);
    throw error;
  }
};

// Get receipts by vendor
export const getReceiptsByVendor = async (vendorId) => {
  try {
    const { data, error } = await supabase
      .from("receipts")
      .select("*")
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error in getReceiptsByVendor:", error);
    return [];
  }
};

// Get all receipts (admin)
export const getAllReceipts = async () => {
  try {
    const { data, error } = await supabase
      .from("receipts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error in getAllReceipts:", error);
    return [];
  }
};

// Get receipt by ID
export const getReceiptById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("receipts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in getReceiptById:", error);
    return null;
  }
};
