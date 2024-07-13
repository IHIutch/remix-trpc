import { createServerSideHelpers } from '@trpc/react-query/server'
import { createCallerFactory } from './trpc'
import { appRouter } from './trpc/routers'
import { trpcClient } from './trpc-client'

export const createCaller = createCallerFactory(appRouter)

export const helpers = createServerSideHelpers({
  client: trpcClient(),
})
