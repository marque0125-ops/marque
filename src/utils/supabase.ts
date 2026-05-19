import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Safe checking to provide descriptive instructions during setup
const isConfigured = supabaseUrl && !supabaseUrl.includes("your-project-id");

if (!isConfigured) {
  console.warn(
    "⚠️ Supabase Connection Alert: Cloud database integration is ready, but your credentials are not set yet. Please paste your API credentials into the .env.local file in your root folder to connect."
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder-id.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);
