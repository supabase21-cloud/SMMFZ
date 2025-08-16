
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rzzwuqpnimflfvtthexu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6end1cXBuaW1mbGZ2dHRoZXh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNDk0MDMsImV4cCI6MjA3MDgyNTQwM30.w_eJfIbJKCx63scIhXUCPgt8L0HtN8B1y1H-_xvk5P0";

let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn("Supabase URL or anonymous key is missing. Supabase client not initialized.");
  // Provide a dummy client to prevent the app from crashing
  supabase = {
    from: () => {
      console.error("Supabase client is not initialized. Check your environment variables.");
      // Return a dummy object that won't cause immediate errors
      return {
        select: async () => ({ data: [], error: { message: "Supabase not configured", details: "", hint: "", code: "" } }),
        insert: async () => ({ data: null, error: { message: "Supabase not configured", details: "", hint: "", code: "" } }),
        update: async () => ({ data: null, error: { message: "Supabase not configured", details: "", hint: "", code: "" } }),
        delete: async () => ({ data: null, error: { message: "Supabase not configured", details: "", hint: "", code: "" } }),
      } as any;
    },
    auth: {
        // Provide dummy auth methods
        signUp: async () => ({ data: { user: null, session: null }, error: { name: "AuthError", message: "Supabase not configured" } }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: { name: "AuthError", message: "Supabase not configured" } }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: async () => ({ error: null }),
    } as any,
  } as SupabaseClient;
}


export { supabase };
