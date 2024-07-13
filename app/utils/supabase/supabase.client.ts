import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

export function createClient(supabaseUrl: SupabaseClient['supabaseUrl'], supabaseKey: SupabaseClient['supabaseKey']) {
  return createBrowserClient(supabaseUrl, supabaseKey)
}
