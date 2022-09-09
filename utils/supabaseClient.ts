import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rvhpnxjvpgatvgaubbyt.supabase.co";

const options = {
  schema: "public",
  headers: { "x-my-custom-header": "lensmo" },
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
};

const supabase = createClient(
  supabaseUrl,
  import.meta.env.PUBLIC_SUPABASE_KEY,
  options
);

export default supabase;
