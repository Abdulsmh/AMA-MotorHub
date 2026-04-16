import { supabase } from "../lib/supabase";

// Get all announcements
export const getAnnouncements = async () => {
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

// Add announcement
export const addAnnouncement = async (
  title,
  message,
  type = "announcement",
) => {
  const { data, error } = await supabase
    .from("announcements")
    .insert([{ title, message, type }])
    .select();
  if (error) throw error;
  return data[0];
};

// Update announcement
export const updateAnnouncement = async (id, title, message, type) => {
  const { data, error } = await supabase
    .from("announcements")
    .update({ title, message, type, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
};

// Delete announcement
export const deleteAnnouncement = async (id) => {
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) throw error;
  return true;
};
