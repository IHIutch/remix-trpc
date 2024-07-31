import process from 'node:process'
import { createEnv } from '@t3-oss/env-core'
import type { ZodError } from 'zod'
import { z } from 'zod'
import { vercel } from '@t3-oss/env-core/presets'

export const env = createEnv({
  emptyStringAsUndefined: true,
  isServer: typeof window === 'undefined',
  clientPrefix: 'PUBLIC_',
  //
  server: {
    POSTGRES_PRISMA_URL: z.string().url(),
    POSTGRES_URL_NON_POOLING: z.string().url(),
    // # Supabase
    SUPABASE_ANON_KEY: z.string().min(1),
    SUPABASE_URL: z.string().min(1).url(),
  },
  client: {
    // # Misc
    // PUBLIC_ROOT_DOMAIN: z.string().min(1),
    // # Sentry
    // PUBLIC_SENTRY_DSN: z.string().min(1),
  },
  extends: [vercel()],
  runtimeEnv: process.env,
  onValidationError: (error: ZodError) => {
    console.error(
      '❌ Invalid environment variables:',
      error.flatten().fieldErrors,
    )
    throw new Error('Invalid environment variables')
  },
  // Called when server variables are accessed on the client.
  onInvalidAccess: () => {
    throw new Error(
      '❌ Attempted to access a server-side environment variable on the client',
    )
  },
})
