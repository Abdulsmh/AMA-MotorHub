import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl ? "Set" : "Missing");
console.log("Supabase Key:", supabaseAnonKey ? "Set" : "Missing");

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection
const testConnection = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("count", { count: "exact", head: true });
  if (error) {
    console.error("Supabase connection error:", error);
  } else {
    console.log("Supabase connected successfully!");
  }
};

testConnection();
