import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr'
import { env } from '#/env'

export function createClient(request: Request) {
  const headers = new Headers()

  console.log({ env })

  const supabaseClient = createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return parseCookieHeader(request?.headers.get('Cookie') ?? '')
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          headers.append('Set-Cookie', serializeCookieHeader(name, value, options)),
        )
      },
    },
  })

  return { supabaseClient, headers }
}
