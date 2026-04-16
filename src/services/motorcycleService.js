//i'm using localStorage for Motorcycle data management

const STORAGE_KEY = "motorcycle_marketplace";

// to get all motorcycles
export const getAllMotorcycles = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

// to save all motorcycles
const saveMotorcycles = (motorcycles) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(motorcycles));
};

// to get motorcycles by vendor
export const getMotorcyclesByVendor = (vendorId) => {
  const all = getAllMotorcycles();
  return all.filter((m) => m.vendorId === vendorId);
};

// to get all available motorcycles (for marketplace)
export const getAvailableMotorcycles = () => {
  const all = getAllMotorcycles();
  return all.filter((m) => m.status === "available" && m.quantity > 0);
};

//to Add motorcycle
export const addMotorcycle = (motorcycle, vendorId, shopName) => {
  const motorcycles = getAllMotorcycles();
  const newMotorcycle = {
    id: `moto_${Date.now()}`,
    vendorId,
    shopName,
    ...motorcycle,
    status: "available",
    createdAt: new Date().toISOString(),
    soldAt: null,
    buyer: null,
  };
  motorcycles.push(newMotorcycle);
  saveMotorcycles(motorcycles);
  return newMotorcycle;
};

//to Update motorcycle
export const updateMotorcycle = (id, updates) => {
  const motorcycles = getAllMotorcycles();
  const index = motorcycles.findIndex((m) => m.id === id);
  if (index !== -1) {
    motorcycles[index] = { ...motorcycles[index], ...updates };
    saveMotorcycles(motorcycles);
    return motorcycles[index];
  }
  return null;
};

//to Delete motorcycle
export const deleteMotorcycle = (id) => {
  const motorcycles = getAllMotorcycles();
  const filtered = motorcycles.filter((m) => m.id !== id);
  saveMotorcycles(filtered);
};

//to Mark as sold
export const markAsSold = (id, buyerDetails) => {
  const motorcycles = getAllMotorcycles();
  const index = motorcycles.findIndex((m) => m.id === id);
  if (index !== -1) {
    motorcycles[index].quantity -= 1;
    if (motorcycles[index].quantity === 0) {
      motorcycles[index].status = "sold";
      motorcycles[index].soldAt = new Date().toISOString();
      motorcycles[index].buyer = buyerDetails;
    }
    saveMotorcycles(motorcycles);
    return motorcycles[index];
  }
  return null;
};
