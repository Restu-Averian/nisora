import { createClient } from "./client";

/** @type {import('@supabase/supabase-js').SupabaseClient} */
const supabase = createClient();

export default supabase;
