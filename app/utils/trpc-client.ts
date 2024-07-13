import process from 'node:process'

import { createTRPCClient, httpBatchLink } from '@trpc/client'
import superjson from 'superjson'
import type { AppRouter } from './trpc/routers'

const devUrl = `http://localhost:${process.env.PORT}/trpc`
const prodUrl = 'http://localhost:3000/trpc' // change to your real domain when deploy to prod

export function trpcClient(request?: Request) {
  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        transformer: superjson,
        url: process.env.NODE_ENV === 'development' ? devUrl : prodUrl,
        // fetch(url, options) {
        //   return fetch(url, {
        //     ...options,
        //     credentials: 'include',
        //   })
        // },
        headers: () => {
          const cookie = request?.headers.get('Cookie') || ''
          return { cookie }
        },
      }),
    ],
  })
}
