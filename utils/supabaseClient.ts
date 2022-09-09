import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rvhpnxjvpgatvgaubbyt.supabase.co";
const supabaseKey = import.meta.env.SUPABASE_KEY;
const options = {
  schema: "public",
  headers: { "x-my-custom-header": "lensmo" },
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
};

const supabase = createClient(supabaseUrl, supabaseKey, options);

export default supabase;
