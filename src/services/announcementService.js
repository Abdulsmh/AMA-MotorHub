import { supabase } from "../lib/supabase";

// Get all announcements
export const getAnnouncements = async () => {
  try {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error in getAnnouncements:", error);
    return [];
  }
};

// Add announcement
export const addAnnouncement = async (
  title,
  message,
  type = "announcement",
) => {
  try {
    const { data, error } = await supabase
      .from("announcements")
      .insert([{ title, message, type }])
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error("Error in addAnnouncement:", error);
    throw error;
  }
};

// Update announcement
export const updateAnnouncement = async (id, title, message, type) => {
  try {
    const { data, error } = await supabase
      .from("announcements")
      .update({ title, message, type, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error("Error in updateAnnouncement:", error);
    throw error;
  }
};

// Delete announcement
export const deleteAnnouncement = async (id) => {
  try {
    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error in deleteAnnouncement:", error);
    throw error;
  }
};
