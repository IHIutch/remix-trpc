import { createCallerFactory } from './trpc'
import { appRouter } from './trpc/routers'

export const createCaller = createCallerFactory(appRouter)
