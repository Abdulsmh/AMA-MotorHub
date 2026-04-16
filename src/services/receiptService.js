// Receipt management service
const RECEIPTS_STORAGE_KEY = "motorcycle_receipts";

// Get all receipts
export const getAllReceipts = () => {
  const stored = localStorage.getItem(RECEIPTS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Save receipt
const saveReceipts = (receipts) => {
  localStorage.setItem(RECEIPTS_STORAGE_KEY, JSON.stringify(receipts));
};

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

// Create new receipt
export const createReceipt = (receiptData) => {
  const receipts = getAllReceipts();
  const newReceipt = {
    id: `receipt_${Date.now()}`,
    receiptNumber: generateReceiptNumber(),
    ...receiptData,
    createdAt: new Date().toISOString(),
  };
  receipts.push(newReceipt);
  saveReceipts(receipts);
  return newReceipt;
};

// Get receipts by vendor
export const getReceiptsByVendor = (vendorId) => {
  const receipts = getAllReceipts();
  return receipts.filter((r) => r.vendorId === vendorId);
};

// Get receipt by ID
export const getReceiptById = (id) => {
  const receipts = getAllReceipts();
  return receipts.find((r) => r.id === id);
};
