import { createClient } from "@supabase/supabase-js";

export type Database = {
  // Add your Supabase types here
  Tables: Record<string, never>;
  Views: Record<string, never>;
  Functions: Record<string, never>;
  Enums: Record<string, never>;
};

export function createSupabaseClient(url: string, key: string) {
  return createClient<Database>(url, key);
}

export { createClient };
