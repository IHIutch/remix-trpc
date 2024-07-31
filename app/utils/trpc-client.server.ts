import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client'
import superjson from 'superjson'
import { createCallerFactory } from './trpc'
import { type AppRouter, appRouter } from './trpc/routers'
import { env } from '#/env.server'

const baseUrl = env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:5173'

export function trpcServerClient() {
  return createTRPCClient<AppRouter>({
    links: [
      loggerLink({
        enabled: () => false,
      }),
      httpBatchLink({
        transformer: superjson,
        url: `${baseUrl}/trpc`,
        // headers: () => {
        //     return {}
        // },
      }),
    ],
  })
}

export const createCaller = createCallerFactory(appRouter)
