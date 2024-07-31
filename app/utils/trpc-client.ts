import { createTRPCReact, httpBatchLink, loggerLink } from '@trpc/react-query'
import SuperJSON from 'superjson'
import { isServer } from '@tanstack/react-query'
import type { AppRouter } from './trpc/routers'
import { env } from '#/env.server'

const baseUrl = env.VERCEL_URL ? `https://${env.VERCEL_URL}` : 'http://localhost:5173'

export const trpc = createTRPCReact<AppRouter>()
export const trpcClient = trpc.createClient({
  links: [
    loggerLink({
      enabled: () => !isServer,
      // enabled: () => true,
    }),
    httpBatchLink({
      transformer: SuperJSON,
      url: `${baseUrl}/trpc`,
      // You can pass any HTTP headers you wish here
      headers: () => {
        // console.log({ opts })
        return {}
      },
    }),
  ],
})
